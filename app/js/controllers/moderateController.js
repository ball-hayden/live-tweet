appControllers.controller('TwitterCtrl', ['$scope', 'socket',
	function TwitterCtrl ($scope, socket) {
		$scope.tweets = [];

		$scope.findTweets = function findTweets() {
			socket.on('tweet-io:tweet', function (data) {
			    $scope.tweets = $scope.tweets.concat([data]);
			});
		}

		$scope.findTweets()
	}
]);

appControllers.controller('TweetCtrl', ['$scope', 'socket',
	function TweetCtrl ($scope, socket) {
		var highlighted = false;

		$scope.highlightDisabled = true;
		$scope.highlightText = 'Highlight';

		$scope.allowDisabled = false;
		$scope.allowText = 'Allow'

		$scope.allowTweet = function allowTweet () {
			$scope.allowDisabled = true;
			$scope.allowText = 'Allowed'

			socket.emit('moderated-tweet-io:tweet', $scope.tweet)
			$scope.highlightDisabled = false;
		}

		$scope.removeTweet = function removeTweet() {
		  var index = $scope.tweets.indexOf($scope.tweet);
  	  $scope.tweets.splice(index, 1);
			socket.emit('moderated-tweet-io:remove', $scope.tweet);
		}

		$scope.highlight = function highlight() {
			if (highlighted) {
				socket.emit('moderated-tweet-io:unhighlight', $scope.tweet)
				$scope.highlightText = 'Highlight';
				highlighted = false;
			} else {
				socket.emit('moderated-tweet-io:highlight', $scope.tweet)
				$scope.highlightText = 'Unhighlight';
				highlighted = true;
			}
		}
	}
]);
