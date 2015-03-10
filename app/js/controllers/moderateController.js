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
		$scope.btnIsDisabled = false;
		$scope.btnText = 'Allow'

		$scope.allowTweet = function allowTweet () {
			$scope.btnIsDisabled = true;
			$scope.btnText = 'Allowed'

			socket.emit('moderated-tweet-io:tweet', $scope.tweet)
		}

		$scope.removeTweet = function removeTweet(item) {
		  var index = $scope.tweets.indexOf(item);
  	  $scope.tweets.splice(index, 1);
		}
	}
]);
