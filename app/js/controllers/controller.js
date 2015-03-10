appControllers.controller('TweetCtrl', ['$scope', 'socket',
	function TweetCtrl ($scope, socket) {

		$scope.tweets = [];
		$scope.findTweets = function findTweets() {
			socket.on('moderated-tweet-io:tweet', function (data) {
			    $scope.tweets = $scope.tweets.concat([data]);
			});
		}

		$scope.findTweets()
	}
]);
