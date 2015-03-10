appDirectives.directive('tweet', function() {
	return {
		templateUrl: 'partials/tweet.html',
		restrict: 'E',
	}
});

appDirectives.directive('tweetmoderate', function() {
	return {
		templateUrl: 'partials/tweetModerate.html',
		restrict: 'E',
	}
});
