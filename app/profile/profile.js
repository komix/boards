'use strict';

angular.module('lnd')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('profile', {
            url:'/profile/:id',
            templateUrl: 'profile/profile.html',
            controller: 'ProfileController'
        })
}])

.controller('ProfileController', ['$scope', '$location', 'authService', 'cropperService', '$stateParams', 'boardsService', 'confirmService', '$uibModalStack', function($scope, $location, authService, cropperService, $stateParams, boardsService, confirmService, $modalStack) {

	$scope.user = authService.getUser($stateParams.id);
    $scope.boards = boardsService.getUsersBoards($stateParams.id);

    $scope.editBoards = false;
    $scope.profilePage = parseInt($stateParams.id) === parseInt($scope.auth.id) ? true : false

    $scope.localStorage = localStorage.getItem('users');
	$scope.triggerInput = function() {
        if ( $scope.auth.id !== parseInt($stateParams.id) ) return
        $('#photo-input').click();
    }

    $scope.onFile = function(file) {
        cropperService.openCropper(file, 1, 500).then(function(data){
            $('#photo-input').val(null);
            $scope.user.image = data;
            authService.updateUser($scope.user);
        });
    }


    $scope.goToBoard = function(id) {
        if($scope.editBoards) {
            return
        } else {
            $location.path('/board/' + id);
        }
    }

    $scope.deleteBoard = function(id, index) {
        var message = "Do you really want to delete board \"" + $scope.boards[index].title + " \"?"
        confirmService.openConfirm(message).then(function(data){
            if (data === true) {
                var deleteBoard = boardsService.deleteBoard(id);
                if (deleteBoard) {
                    $scope.boards.splice(index, 1);
                    $modalStack.dismissAll();
                }
            } else {
                $modalStack.dismissAll();
            }
         });
    }

}])
