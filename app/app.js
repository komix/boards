'use strict';

// Declare app level module which depends on views, and components
angular.module('lnd', [
  'ui.router',
  'ui.bootstrap',
  'uiGmapgoogle-maps',
  'ngCropper'
])

.config(['$urlRouterProvider', function($urlRouterProvider) {
  $urlRouterProvider.otherwise("/signin");
}])


.run(['$rootScope', '$state', '$stateParams', 'authService', function ($rootScope, $state, $stateParams, authService) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.user = null;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    	authService.checkAuthentication(event, toState);
    });
}]);