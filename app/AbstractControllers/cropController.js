
angular.module('lnd').controller('CropController', ['$scope', '$http', '$uibModalInstance', '$animate', 'blob', 'Cropper', '$timeout', 'cropWidth', 'aspectRatio', '$uibModalStack', 'cropperService', function($scope, $http, $modalInstance, $animate, blob, Cropper, $timeout, cropWidth, aspectRatio, $modalStack, cropperService) {

    $scope.blob = blob;
    $scope.cropWidth = cropWidth;
    $scope.aspectRatio = aspectRatio;
    var file, data;

    Cropper.encode((file = blob)).then(function(dataUrl) {
        $scope.dataUrl = dataUrl;
        $timeout(showCropper);
    });

    $scope.cropper = {};
    $scope.cropperProxy = 'cropper.first';


    $scope.preview = function() {
        if (!file || !data) return;
        Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
          ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
          cropperService.imageData.cropped = dataUrl;
      });
    };


    $scope.clear = function(degrees) {
        if (!$scope.cropper.first) return;
        $scope.cropper.first('clear');
    };

    $scope.scale = function(width) {
        Cropper.crop(file, data)
        .then(function(blob) {
            return Cropper.scale(blob, {width: $scope.cropWidth});
        })
        .then(Cropper.encode).then(function(dataUrl) {
            ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
        });
    }

    $scope.sendFile = function(file) {
        cropperService.sendImage(file);
        $modalStack.dismissAll()
    }


    $scope.showEvent = 'show';
    $scope.hideEvent = 'hide';

    $scope.options = {
        maximize: true,
        aspectRatio: $scope.aspectRatio,
        crop: function(dataNew) {
            data = dataNew;
        }
    };

    function showCropper() { $scope.$broadcast($scope.showEvent); }
    function hideCropper() { $scope.$broadcast($scope.hideEvent); }

}])