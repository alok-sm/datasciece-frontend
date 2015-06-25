app.controller('termsController', function($scope, $location, $localStorage, Api, Logger) {
    $scope.taskPage = false;
    $scope.prev = function() {
        $location.path('user/quick-questions');
    }

    $scope.startChallenge = function(e) {
        $(e.target).button("loading");
        var user = {};
        user.gender = $localStorage.user.gender;
        user.age = $localStorage.user.age;
        user.education = $localStorage.user.education;
        user.country = $localStorage.user.country;
        Api.register(user, function(success){
            $localStorage.token = success['token'];
            $location.path('challenge/start');
        }, function(error){
            alert(error);
        });

    }
});