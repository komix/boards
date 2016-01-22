angular.module('lnd').factory('cropperService', ['$http', '$q', '$uibModal', 'Cropper', function($http, $q, $modal, Cropper) {
     
    var cropperService = {};
    var _imageData = {}

    var defer;
  
	_openCropper = function(_blob, _aspectRatio, _cropWidth) {
		defer = $q.defer();
		if (_blob) {
			$modal.open({
				templateUrl: 'partials/cropModal.html',
				controller: 'CropController',
				size: 'lg',
				resolve: {
					blob: function () {
					return _blob;
					},
					aspectRatio: function () {
					return _aspectRatio;
					},
					cropWidth: function (){
					return _cropWidth;
					}
				}        
			})
		}
		return defer.promise;
	};



 
	_sendImage = function(image) {
		defer.resolve(image); // We can add http request here
	}


	cropperService.imageData = _imageData;
	cropperService.openCropper = _openCropper;
	cropperService.sendImage = _sendImage;


    return cropperService;
}]);