var Twit = require('twit');
var io = require('./app').io;
var nbOpenSockets = 0;
var isFirstConnectionToTwitter = true;

module.exports = function Twitter(config) {
  var T = new Twit(config);

  var stream = T.stream('statuses/filter', { track: 'picture' });
  var tweetsBuffer = [];
  var oldTweetsBuffer = [];

  //Handle Socket.IO events
  var discardClient = function() {
    console.log('Client disconnected !');
    nbOpenSockets--;

    if (nbOpenSockets <= 0) {
      nbOpenSockets = 0;
      console.log("No active client. Stop streaming from Twitter");
      stream.stop();
    }
  };

  var handleClient = function(socket) {
      console.log('Client connected !');

      if (nbOpenSockets <= 0) {
        nbOpenSockets = 0;
        console.log('First active client. Start streaming from Twitter');
        stream.start();
      }

      nbOpenSockets++;
  };

  io.sockets.on('connection', function(socket) {
    handleClient(socket);

    socket.on('disconnect', discardClient);

    socket.on('moderated-tweet-io:tweet', function(data) {
      io.sockets.emit('moderated-tweet-io:tweet', data);
    })

    socket.on('moderated-tweet-io:remove', function(data) {
      io.sockets.emit('moderated-tweet-io:remove', data);
    })

    socket.on('moderated-tweet-io:highlight', function(data) {
      io.sockets.emit('moderated-tweet-io:highlight', data);
    })

    socket.on('moderated-tweet-io:unhighlight', function(data) {
      io.sockets.emit('moderated-tweet-io:unhighlight', data);
    })
  });


  //Handle Twitter events
  stream.on('connect', function(request) {
    console.log('Connected to Twitter API');

    if (isFirstConnectionToTwitter) {
      isFirstConnectionToTwitter = false;
      stream.stop();
    }
  });

  stream.on('disconnect', function(message) {
    console.log('Disconnected from Twitter API. Message: ' + message);
  });

  stream.on('reconnect', function (request, response, connectInterval) {
    console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
  });

  stream.on('tweet', function(tweet) {
    if (tweet.place == null) {
      return;
    }

    //Create message containing tweet + location + username + profile pic
    var msg = {};
    msg.id   = tweet.id_str
    msg.text = tweet.text;

    if (tweet.entities.media) {
      msg.media = tweet.entities.media[0];
    }

    msg.user = {
      name: tweet.user.name,
      image: tweet.user.profile_image_url.replace('_normal.', '_bigger.')
    };

    io.sockets.emit('tweet-io:tweet', msg);
  });
}
