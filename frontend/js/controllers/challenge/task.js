app.controller('challengeTaskController', function($sce,$http, $localStorage, $scope, $interval, $timeout, $location, Logger) {
    $scope.currentSlide = 1;

    $scope.selectedAnswer = undefined;
    $scope.selectedCL = undefined;

    $scope.confidenceLevels = numberArray(0, 4);
    $scope.answers = [];

    var timerSize = 50;
    var timerLineWidth = 6;

    // custom size styling for large devices (large desktops, 1280px and up)
    if($(document).height() > 960) {
        timerLineWidth = 8;
        timerSize = 80;
    }
    var timeAvailable = 30;

    $scope.questions = numberArray(0, 19);
    var questionArr = getQuestionArr();
    setCurrQuestion(0);
    initTimer();
    resetTimer();
    startTimer();

    $scope.validInput = function(answer, selectedCL) {
        if($scope.timeLeft === 0) {
            return true;
        }
        if(!isValidCL(selectedCL)) {
            return false;
        }
        if(!isValidAnswer(answer)) {
            return false;
        }
        return true;
    }

    $scope.setCL = function(cl) {
        $scope.selectedCL = cl;
    }

    $scope.selectAnswer = function(answer) {
        console.log($scope.selectedAnswer);
        $scope.selectedAnswer = answer;
    }

    $scope.next = function() {
        next();
    }

    $scope.setCurrQuestion = function(index) {
        setCurrQuestion(index);
    }

    function isValidCL(cl) {
        var minCL = $scope.confidenceLevels[0];
        var maxCL = $scope.confidenceLevels[$scope.confidenceLevels.length-1];
        if(cl === undefined || !isInt(cl) || cl < minCL || cl > maxCL) {
            return false;
        }
        return true;
    }

    function isValidAnswer(answer) {
        if($scope.question.type === 'text'||$scope.question.type==='int') {
            return true;
        }

        for(var i = 0; i < $scope.answers.length; i++) {
            if($scope.answers[i] === answer) {
                return true;
            }
        }
        return false;
    }

    function next() {
        if($scope.question.type === 'text' || $scope.question.type ==='int'){
            $scope.selectedAnswer = $scope.answers.selectedAnswer;
        }
        var req_params = {
            "token"      : $localStorage.token,
            "time_taken" : $scope.timeLeft,
            "confidence" : ""+(parseInt($scope.selectedCL) + 1),
            "data"       : $scope.selectedAnswer,
            "task_id"    : $scope.question.taskId
        }

        console.log($scope.selectedAnswer);
        console.log(req_params);
        $http.post("http://crowds.5harad.com/api/answers", req_params)
        .success(function(response){
            console.log("Successful submission");

            setCurrQuestion($scope.currQuestion + 1);
        })
        .error(function(response) {
        console.log("error in submission");
        });
    }

    function setCurrQuestion(index) {
        if(index === 20) {
            $location.path("challenge/done");
            return;
        }
        $scope.currQuestion = index;
         $http.get("http://crowds.5harad.com/api/tasks?token=" + $localStorage.token).
         success(function(response){
            Logger.log(response);
            $scope.question = {};
            $scope.question.questionType = response.task.type;
            $scope.question.taskId = response.task.id;
            $scope.question.text = response.task.title;
            $scope.question.type = response.task.answer_type;
            $scope.question.data = response.task.data;
            $scope.answers = response.task.answer_data.split(",");
            if($scope.question.questionType == "audio"){
                    $scope.question.data = $sce.trustAsResourceUrl('https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'+$scope.question.data+'&amp;auto_play=true&amp;show_artwork=false&amp;hide_related=false&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=true');
            }
            if($scope.question.questionType == "video"){
                    $scope.question.data = $sce.trustAsResourceUrl('ytplayer.html?'+$scope.question.data);
            }
            Logger.log($scope.answers);
            // $scope.question = response;

            $scope.previousResponses = $scope.question.previousResponses;
            updatePreviousResponseCount();

            $scope.selectedAnswer = undefined;
            $scope.selectedCL = undefined;

            switchSlides();
            resetTimer();
         });
    }

    function updatePreviousResponseCount() {
        $scope.previousResponseCount = 0;
        if($scope.previousResponses === undefined) {
            return;
        }
        if($scope.question.type === "text") {
            $scope.previousResponseCount = $scope.previousResponses.length;
            return;
        }
        for(var i = 0; i < $scope.previousResponses.length; i++) {
            var response = $scope.previousResponses[i];
            $scope.previousResponseCount += response.count;
        }
    }

    function switchSlides() {
        if($scope.currentSlide === 1) {
            $scope.currentSlide = 2;
        } else {
            $scope.currentSlide = 1;
        }
    }

    function initTimer() {
        $scope.timerOptions = {
            animate:{
                duration:300,
                enabled:true
            },
            barColor: "#feeed9",
            scaleColor:false,
            trackColor: "#f7a32b",
            lineWidth:timerLineWidth,
            lineCap:"circle",
            size: timerSize
        };
    }

    function startTimer() {

        $interval(function(){
            if($scope.timeLeft === 0) {
                return;
            }
            $scope.timeLeft--;
            $scope.timerPercent += 100/timeAvailable;
        }, 1000);
    }

    function resetTimer() {
        $scope.timeLeft = timeAvailable;
        $scope.timerPercent = 0;
    }

    function getQuestionArr() {
        var questions = [
            {
                text: "Will this business be funded by Kickstarter?",
                type: "mcq",
                imagePath: "question-media/sockless-shoes.png",
                answers: ["Yes", "No"]
                // previousResponses: [{text: "Yes", count: 3}, {text: "No", count: 2}]
                //answers: ["Mary Poppins", "Star Wars", "Jurrasic Park", "Titanic"]
            },
            {
                text: "Will this business be funded by Kickstarter?",
                type: "mcq",
                imagePath: "question-media/sockless-shoes.png",
                answers: ["Yes", "No"],
                previousResponses: [{text: "Yes", count: 3}, {text: "No", count: 2}]
            },
            {
                text: "What is the name of this constellation?",
                type: "mcq",
                imagePath: "question-media/constellation.png",
                answers: ["Leo", "Apus", "Lupus", "Columba", "Gemini"],
                previousResponses: [{text: "Leo", count: 500}, {text: "Apus", count: 2}, {text: "Lupus", count: 2},
                    {text: "Columba", count: 2}, {text: "Gemini", count: 200}]
            },
            {
                text: "What is this country’s landmass in square meters?",
                type: "text",
                imagePath: "question-media/brazil.png",
                previousResponses: [28497, 328472, 124, 0, 23498]
            }
        ];
        return questions;
    }
});