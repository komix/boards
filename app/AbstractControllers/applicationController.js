
  angular.module('lnd')
  .controller('ApplicationController', ['$scope', '$location', 'authService', function($scope, $location, authService){

    $scope.auth = authService.authentication;

    $scope.signOut = function() {
    	authService.signOut();
    	$location.path('/signin');
    }

  }]);
