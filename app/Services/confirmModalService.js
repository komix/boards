angular.module('lnd').factory('confirmService', ['$http', '$q', '$uibModal', function($http, $q, $modal) {
     
    var confirmService = {};
    

    var defer;
  
	_openConfirm = function(_message) {
		defer = $q.defer();
		
			$modal.open({
				templateUrl: 'partials/confirmModal.html',
				controller: 'ConfirmController',
				size: 'lg',    
				resolve: {
					message: function (){
						return _message;
					}
				}    
			})
		
		return defer.promise;
	};

 
	_confirmResolve = function(answer) {
			defer.resolve(answer);
	}

	confirmService.openConfirm = _openConfirm;
	confirmService.confirmResolve = _confirmResolve;

    return confirmService;
}]);