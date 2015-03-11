appControllers.controller('TweetCtrl', ['$scope', 'socket',
	function TweetCtrl ($scope, socket) {
		$scope.tweets = [];

		var highlighted = null;

		$scope.findTweets = function findTweets() {
			socket.on('moderated-tweet-io:tweet', function (data) {
			  $scope.tweets = $scope.tweets.concat([data]);
			});

			socket.on('moderated-tweet-io:remove', function (data) {
				var tweet = $.grep($scope.tweets, function(tweet) {
					return tweet.id == data.id
				});

				var index = $scope.tweets.indexOf(tweet[0]);

				if (index >= 0) {
					$scope.tweets.splice(index, 1);
				}
			});

			socket.on('moderated-tweet-io:highlight', function (tweet) {
				$scope.highlight(tweet);
			});

			socket.on('moderated-tweet-io:unhighlight', function (tweet) {
				$scope.unhighlight(tweet);
			});
		}

		$scope.highlight = function highlight(tweet) {
			if (highlighted) {
				$scope.unhighlight(highlighted);
			}

			highlighted = tweet;

			var elem = $('#tweet-' + tweet.id);

			var placeholder = $('<div></div>')
				.prop({ id: 'placeholder-' + tweet.id })
				.addClass('placeholder');

			placeholder.css({
				height: elem.outerHeight()
			});
			placeholder.insertAfter(elem);

			elem.css({
				position: 'absolute',
				top:   elem.offset().top - 52,
				width: elem.outerWidth()
			});

			setTimeout(function () {
				$('.lowlight').addClass('active');
				elem.addClass('transition');
				elem.addClass('highlight');
				elem.css({ top: '' });
			}, 200);

		}

		$scope.unhighlight = function unhighlight(tweet) {
			highlighted = null;
			$('.lowlight').removeClass('active');

			var elem = $('#tweet-' + tweet.id);
			var placeholder = $('#placeholder-' + tweet.id);

			if (placeholder.length > 0) {
				elem.css({
					position: 'absolute',
					top: placeholder.offset().top - 52
				});
			}

			elem.removeClass('highlight');

			elem.one("webkitTransitionEnd", function(){
				if (placeholder.length > 0) {
					placeholder.remove();
				}

				elem.removeClass('transition');
				elem.css({ position: '', top: '', left: '', width: '' });
			});
		}

		$scope.findTweets()
	}
]);
