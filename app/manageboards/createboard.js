'use strict';

angular.module('lnd')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('createboard', {
            url:'/createboard/:userId',
            templateUrl: 'manageboards/createboard.html',
            controller: 'CreateBoardController'
        })
}])

.controller('CreateBoardController', ['$scope', '$location', 'authService', 'cropperService', '$stateParams', 'boardsService', function($scope, $location, authService, cropperService, $stateParams, boardsService) {
    $scope.board = {};
    $scope.users = authService.getUsers();

    $scope.sendBoard = function(board) {
        var boardId = boardsService.createBoard(board, $scope.auth.id);
        if (boardId) {
            $location.path('/board/' + boardId);
        }
    }



	$scope.triggerInput = function() {
        $('#photo-input').click();
    }

    $scope.onFile = function(file) {
        cropperService.openCropper(file, 1, 500).then(function(data){
            $('#photo-input').val(null);
            $scope.board.image = data;
        });
    }

}])
