'use strict';

angular.module('lnd')

.factory('authService', ['$injector', '$location', '$state', function($injector, $location, $state) { 
	var authService = {};

	var _authentication = {
		isAuth: false,
		id: "",
	}

	var _setAuth = function(authData) {
		_authentication.isAuth = true;
        _authentication.id = authData.id;
	}

	var _getUsers = function() {
		var users = JSON.parse( localStorage.getItem('users') ) || [];
		return users
	}

	var _getUser = function(userId) {
		var users = _getUsers();
		for (var i = 0; i < users.length; i++) {
			if( users[i].id === parseInt(userId) ) {
				return users[i]
			}
		}
		return false
	}

	var _updateUsers = function(users) {
		localStorage.setItem( 'users', JSON.stringify(users) );
	}

	var _updateUser = function(user) {
		var users = _getUsers();
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === parseInt(user.id)) {
				users[i] = user;
				_updateUsers(users);
				break
			}
		}

	}

	var _signIn = function(username, password) {
		var result = {};
		var users = _getUsers();
		for (var i = 0; i < users.length; i++) {
			if (users[i].name === username && users[i].password === password) {
				localStorage.setItem( 'authData', JSON.stringify(users[i]) );
				_authentication.isAuth = true;
				_authentication.id = users[i].id;
				result.success = true;
				result.message = "Logged in successfully!";
				return result
			}
		}
		result.success = false;
		result.message = "Wrong credentials!";
		return result
	}

	var _signUp = function(username, password, passwordConfirmation) {
		var result = {};
		var users = JSON.parse( localStorage.getItem('users') ) || [];

		for (var i = 0; i < users.length; i++) {
			if (users[i].name === username) {
				result.success = false;
				result.message = "User with such name already exists."
				return result
			} 
		}

		var newUser = {};
		newUser.id = Date.now();
		newUser.name = username;
		newUser.password = password;
		newUser.boards = [];
		users.push(newUser);
		_updateUsers(users);
		result.success = true;
		result.message = "New user created successfully!"
		return result
	}

	var _checkAuthentication = function(event, toState) {
		var $scope = $injector.get('$rootScope');
        var authData = JSON.parse( localStorage.getItem('authData') );
        if (authData) {
            _setAuth(authData);
        } else {
            if (toState.url !== '/signin' && toState.url !== '/signup') {
                event.preventDefault();
                $scope.$state.go('sign.in');
            }
        }
    }


    var _signOut = function() {
    	localStorage.removeItem('authData');
    	_authentication.isAuth = false;
    	_authentication.id = "";
    }

    authService.getUser = _getUser;
    authService.updateUser = _updateUser;
    authService.getUsers = _getUsers;
    authService.updateUsers = _updateUsers;
    authService.authentication = _authentication;
	authService.signIn = _signIn;
	authService.signUp = _signUp;
	authService.signOut = _signOut;
	authService.checkAuthentication = _checkAuthentication;

    return authService;

}])