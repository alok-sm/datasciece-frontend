app.controller('challengeDoneController', function($scope, $location, $localStorage) {
    var beeLevelStages = [
        {roundsNeeded: 0, name: "Worker Bee"},
        {roundsNeeded: 1, name: "Buzzer"},
        {roundsNeeded: 2, name: "Stinger"},
        {roundsNeeded: 4, name: "Forager"},
        {roundsNeeded: 7, name: "Waggle Dancer"},
        {roundsNeeded: 11, name: "Hive Builder"},
        {roundsNeeded: 16, name: "Hive Fanner"},
        {roundsNeeded: 23, name: "Honey Extractor"},
        {roundsNeeded: 31, name: "Pollinator"},
        {roundsNeeded: 40, name: "Babysitter"},
        {roundsNeeded: 50, name: "Queen Bee"}]

    updateBeeLevelProgress();

	$scope.numCorrect = 16;
    $scope.numQuestions = 20;
    $scope.rank = 40;
    $scope.crowdRank = 320;
    $scope.numBees = 3942;

    $scope.startNewChallenge = function() {
        $location.path('challenge/start');
    }

    function updateBeeLevelProgress() {
        var roundsCompleted = $localStorage.roundsCompleted;
        var beeRank = 0;
        for(var i = 0; i < beeLevelStages.length - 1; i++) {
            if(beeLevelStages[i+1].roundsNeeded > roundsCompleted) {
                beeRank = i;
                $localStorage.beeName = beeLevelStages[i].name;
                break;
            }
        }
        if(roundsCompleted === 50) {
            beeRank = 10;
            $localStorage.beeName = "Queen Bee";
        }
        $localStorage.beeRank = beeRank;
        $scope.roundsToUnlockNextBee = 0;
        $scope.beeWasUnlocked = false;
        $scope.hasNextBeeToUnlock = true;
        if(roundsCompleted === 50) {
            $scope.hasNextBeeToUnlock = false;
        }
        if(beeLevelStages[beeRank].roundsNeeded === roundsCompleted) {
            $scope.beeWasUnlocked = true;
            return;
        }
        if(roundsCompleted < 50) {
            $scope.roundsToUnlockNextBee = beeLevelStages[beeRank+1].roundsNeeded - roundsCompleted;
        }
    }

    $scope.setRoundsCompleted = function(rounds) {
        $localStorage.roundsCompleted = rounds;
        updateBeeLevelProgress();
    }
});