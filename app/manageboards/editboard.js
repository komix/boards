'use strict';

angular.module('lnd')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('editboard', {
            url:'/editboard/:boardId',
            templateUrl: 'manageboards/createboard.html',
            controller: 'EditBoardController'
        })
}])

.controller('EditBoardController', ['$scope', '$location', 'authService', 'cropperService', '$stateParams', 'boardsService', function($scope, $location, authService, cropperService, $stateParams, boardsService) {
    $scope.board = boardsService.getBoard($stateParams.boardId, true);
    $scope.users = authService.getUsers();
    $scope.updating = true; 

    $scope.sendBoard = function(board) {
        var boardId = boardsService.updateBoard(board, $scope.auth.id);
        if (boardId) {
            $location.path('/profile/' + $scope.auth.id);
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
