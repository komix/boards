'use strict';
angular.module('lnd')

.factory('helpMethodsService', ['$injector', '$location', '$state', function($injector, $location, $state) { 
	var helpMethodsService = {};

	var _clone = function(array) {
		var clone = [];
		for (var elem in array) {
			clone.push(elem);
		}
		return clone
	}

	var _cloneTrueProps = function(obj) {
		var clone = [];
		for (var prop in obj) {
			if (obj[prop]) clone.push(prop);
		}
		return clone
	}

	var _cloneObj = function(obj) {
		var clone = {};
		for (var prop in obj) {
			clone[prop] = obj[prop];
		}
		return clone
	}

	var _arrayToTrueObj = function(arr) {
		var object = {};
		for (var elem in arr) {
			object[ arr[elem] ] = true;
		}
		return object
	}

	var _toMinutes = function(timeObj) {
		var minutes = timeObj.minute + timeObj.hour * 60 + timeObj.day * 60 * 24 + timeObj.month * 60 * 24 * 31;
		return minutes
	}


	var _fromMinutes = function(minutes) {
		var time = {};
		var usedMinutes;
		time.month = minutes / 30 / 24 / 60 > 0 ? Math.floor(minutes / 30 / 24 / 60) : 0;
		usedMinutes = time.month * 30 * 24 * 60;
		time.day = (minutes - usedMinutes) / 24 / 60 > 0 ? Math.floor((minutes - usedMinutes) / 24 / 60) : 0;
		usedMinutes += time.day * 24 * 60;
		time.hour = (minutes - usedMinutes) / 60 > 0 ? Math.floor((minutes - usedMinutes) / 60) : 0;
		usedMinutes += Math.floor(time.hour * 60);
		time.minute = (minutes - usedMinutes);

		return time;
	}


	helpMethodsService.clone = _clone;
	helpMethodsService.cloneTrueProps = _cloneTrueProps;
	helpMethodsService.cloneObj = _cloneObj;
	helpMethodsService.arrayToTrueObj = _arrayToTrueObj;
	helpMethodsService.toMinutes = _toMinutes
	helpMethodsService.fromMinutes = _fromMinutes;
	return helpMethodsService;
}]);