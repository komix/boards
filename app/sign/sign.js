'use strict';

angular.module('lnd')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
        .state('sign', {
            abstract: true,
            templateUrl: 'sign/sign.html',
            controller: 'SignController'
        })
        .state('sign.in', {
            url:'/signin',
            templateUrl: 'sign/signin.html',
            controller: 'SignInController'
        })
        .state('sign.up', {
            url:'/signup',
            templateUrl: 'sign/signup.html',
            controller: 'SignUpController'
        })

}])

.controller('SignController', ['$scope', '$location', function($scope, $location) {
    $scope.path = $location.path();
}])

.controller('SignInController', ['$scope', '$location', 'authService', function($scope, $location, authService) {
    $scope.$parent.path = $location.path();
    $scope.user = {};
    $scope.signIn = function(user) {
        var login = authService.signIn(user.name, user.password);
        if (login.success) {
            $location.path('/profile/' + authService.authentication.id);
        } else {
            $scope.message = login.message;
        }
    }
}])

.controller('SignUpController', ['$scope', '$location', 'authService', function($scope, $location, authService) {
    $scope.$parent.path = $location.path();
    $scope.user = {};

    $scope.signUp = function(user) {
        if (user.password !== user.passwordConfirmation) {
            $scope.message = "Passwords do not match";
            return
        }
        var registration = authService.signUp(user.name, user.password, user.passwordConfirmation);
        $scope.message = registration.message;
    }
}])