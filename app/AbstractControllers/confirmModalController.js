'use strict';
angular.module('lnd')
.controller('ConfirmController', ['$scope',  '$uibModalStack', 'confirmService', 'message', function($scope, $modalStack, confirmService, message) { 
    $scope.message = message;
    $scope.answerSubmit = function(answer) {
        confirmService.confirmResolve(answer);
    }
}])