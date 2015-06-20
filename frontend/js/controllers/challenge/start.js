app.controller('challengeStartController', function($http, $scope, $location, $localStorage, Api, Logger) {
    $scope.user = {};
    $http.get("http://crowds.5harad.com/api/tasks?token=" + $localStorage.token)
    .success(function(response){
        $scope.domainInfo = response.domain.name;
        $localStorage.domainId = response.domain.id;
        $localStorage.totalQuestions = response.remaining;
        Logger.log(response);
        console.log(response);
        // $scope.domainInfo = "fuck you!";
        $scope.prev = function() {
            $location.path('user/terms-and-conditions');
        }
        $scope.validInput = function() {
            if(validRank($scope.user.rank)) {
                return true;
            }
            return false;
        }

        $scope.startChallenge = function(e) {
            $(e.target).button('loading');
            if(!$scope.validInput()) {
                return;
            }
            var data = {};
            data.token = $localStorage.token;
            data.rank = $scope.user.rank;
            data.domain_id = $localStorage.domainId;
            Api.submitExpectedRank(data, function(success){
                $location.path('challenge/task');
            }, function(error){
                alert(error);
            });
        }

        function validRank(rank) {
            // Logger.log(rank);
            rank = parseInt(rank);
            // if(!isInt(rank)) {
            //     return false;
            // }
            // if(rank < 1 || rank > 100) {
            //     return false;
            // }
            // return true;
            return(rank > 0 && rank <=100 && isInt(rank)) 
        }
    })
    .error(function(error){
        alert(error);
    });
});