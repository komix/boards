'use strict';

angular.module('lnd')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('editcard', {
            url:'/editcard/:boardId/:columnId/:cardId',
            templateUrl: 'editcard/editcard.html',
            controller: 'EditCardController'
        })
}])

.controller('EditCardController', ['$scope', '$location', 'authService', 'cropperService', '$stateParams', 'boardsService', function($scope, $location, authService, cropperService, $stateParams, boardsService) {
    
    $scope.board = boardsService.getBoard($stateParams.boardId);
    $scope.card = boardsService.getCard($stateParams.boardId, $stateParams.columnId, $stateParams.cardId, true);
    $scope.members = boardsService.getBoardMembers($stateParams.boardId);
    $scope.minDate = new Date();
    $scope.newCheck = {};
   

    $scope.$watch('card.dueDate', function(newValue, oldValue) {
        if (newValue) {
            $scope.editCard();
        }
    })

    $scope.editCard = function() {
        var editing = boardsService.updateCard($scope.card, $stateParams.boardId, $stateParams.columnId, $stateParams.cardId, true);
    }

    $scope.watchForMax = function() {
        var maxValues = {'month': 12, 'day': 31, 'hour': 24, 'minute': 60};
        for (var prop in $scope.card.timeTracking) {
            if ($scope.card.timeTracking[prop]) {
                for (var cProp in $scope.card.timeTracking[prop]) {
                    if ($scope.card.timeTracking[prop][cProp] > maxValues[cProp]) {
                        $scope.card.timeTracking[prop][cProp] = maxValues[cProp];
                    }
                }
            }
        }
        $scope.editCard();
    }


    $scope.addChecklist = function(checklist) {
        if(!checklist.task) return
            checklist.checked = false;
            $scope.card.checklist.push(checklist);
            $scope.newCheck = {};
            $scope.showChecklistAdd = false;
            $scope.editCard();
    }


    $scope.addComment = function(comment) {
        var copy = angular.copy(comment);
        if (!copy.text) return
        var user = authService.getUser($scope.auth.id)
        copy.author = {};
        copy.author.image = user.image;
        copy.author.name = user.name;
        copy.author.id = user.id;
        $scope.card.comments.push(copy);
        comment.text = "";
        $scope.showCommentAdd = false;
        $scope.editCard();
    }



	$scope.triggerInput = function() {
        $('#photo-input').click();
    }

    $scope.onFile = function(file) {
        cropperService.openCropper(file, 1, 500).then(function(data){
            $('#photo-input').val(null);
            $scope.card.attachments.push(data);
            $scope.editCard();
        });
    }

}])
