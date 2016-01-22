"use strict";

angular.module('lnd')
.directive('computeWidth', ['$document', '$timeout', function ($document, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attr, ctrl) {
        	scope.$watch(function() {
	        	var columns = elem.children('.board-column');
	        	var columnWidth = columns.outerWidth();
	        	elem.width( (columnWidth + 19) * columns.length + 268);
                var windWidth = $( window ).width();

                if (elem.width() < windWidth) {
                    console.log(windWidth);
                    elem.width(windWidth);
                }
	        })
        }
    }
}]);