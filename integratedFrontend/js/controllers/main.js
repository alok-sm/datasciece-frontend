app.controller('mainController', function($scope, SITE_NAME, $localStorage) {
	$scope.SITE_NAME = SITE_NAME;
    $scope.localStorage = $localStorage;

    if($localStorage.roundsCompleted === undefined) {
        $localStorage.roundsCompleted = 1;
    }
    if($localStorage.beeRank === undefined) {
        $localStorage.beeRank = 0;
    }
    if($localStorage.beeName === undefined) {
        $localStorage.beeName = "Worker Bee";
    }

    $scope.animatedBeePath = function() {
        return "img/bee-animations/" + $localStorage.beeRank + ".gif";
    }
    $scope.beePath = function() {
        return "img/bees/" + $localStorage.beeRank + ".png";
    }
    $scope.rankBarBeePath = function() {
        return "img/bees-for-rank-bar/" + $localStorage.beeRank + ".png";
    }
    $scope.achievementImagePath = function() {
        return "img/achievements/" + $localStorage.beeRank + ".png";
    }
});