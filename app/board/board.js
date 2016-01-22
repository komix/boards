'use strict';

angular.module('lnd')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('board', {
            url:'/board/:id',
            templateUrl: 'board/board.html',
            controller: 'BoardController'
        })
}])

.controller('BoardController', ['$scope', '$stateParams', '$timeout', 'authService', 'boardsService', 'helpMethodsService', 'confirmService', '$uibModalStack',  function($scope, $stateParams, $timeout, authService, boardsService, helpMethodsService, confirmService, $modalStack) {
    
    $scope.credentials = authService.authentication;
    $scope.boardId = parseInt($stateParams.id);
    $scope.board = boardsService.getBoard($scope.boardId);
    $scope.newList = {};
    $scope.addListForm = false;

    $scope.addList = function(newList) {
        if (!newList.title) return
        var cloned = helpMethodsService.cloneObj(newList);
        cloned.id = Date.now();
        cloned.cards = [];
        $scope.board.columns.push(cloned);
        newList.title = "";
        $scope.addListForm = false;
        boardsService.updateBoard($scope.board);
    };

    $scope.addCard = function(newCard, index) {
        if (!newCard) return
        var cloned = helpMethodsService.cloneObj(newCard);
        cloned.id = Date.now();
        $scope.board.columns[index].cards.push(cloned);
        newCard.title = '';
        $scope.showCardAdd = 0;
        boardsService.updateBoard($scope.board);
    };

    $scope.rand = function(i) {
        return i + Math.random();
    };


    $scope.deleteCard = function(columnIndex, cardIndex, cardTitle) {
        var message = "Do you really want to delete card \"" + cardTitle + " \"?"
        confirmService.openConfirm(message).then(function(data){
            if (data === true) {
                $scope.board.columns[columnIndex].cards.splice(cardIndex, 1);
                boardsService.updateBoard($scope.board);
                $modalStack.dismissAll();
            } else {
                $modalStack.dismissAll();
            }
         });
    };

    $scope.deleteColumn = function(index, columnTitle) {
        var message = "Do you really want to delete list \"" + columnTitle + " \" with all cards it contains?"
        confirmService.openConfirm(message).then(function(data){
            if (data === true) {
                $scope.board.columns.splice(index, 1);
                boardsService.updateBoard($scope.board);
                $modalStack.dismissAll();
            } else {
                $modalStack.dismissAll();
            }
         });
    };

    $scope.getColumnInfo = function(columnIndex) {
        $scope.columnInfo = {}
        var estimatedSum = 0, remainingSum = 0, eSum, rSum;
        var cards = $scope.board.columns[columnIndex].cards
        
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].timeTracking) estimatedSum += cards[i].timeTracking.estimatedTime;
            
            if (cards[i].timeTracking) remainingSum += cards[i].timeTracking.remainingTime;
        } 
        eSum = helpMethodsService.fromMinutes(estimatedSum);
        rSum = helpMethodsService.fromMinutes(remainingSum);
        $scope.columnInfo.estimatedSum = eSum.month + ' (m), ' + eSum.day + ' (d), ' + eSum.hour + ' (h), ' + eSum.minute + ' (m).';
        $scope.columnInfo.remainingSum = rSum.month + ' (m), ' + rSum.day + ' (d), ' + rSum.hour + ' (h), ' + rSum.minute + ' (m).';
        if (eSum || rSum) {
            $scope.columnToShow = columnIndex;
        }
        $timeout(function() {
          $scope.columnToShow = false;
        }, 3000);
    }



}])
