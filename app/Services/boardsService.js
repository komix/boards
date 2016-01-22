'use strict';

angular.module('lnd')

.factory('boardsService', ['$injector', '$location', '$state', 'helpMethodsService', 'authService', function($injector, $location, $state, helpMethodsService, authService) { 

var boardsService = {};

var _createBoard = function(board, creatorId) {
	var boards = _getBoards();
	var clonedBoard = helpMethodsService.cloneObj(board);
	clonedBoard.id = Date.now();
	clonedBoard.team = helpMethodsService.cloneTrueProps(clonedBoard.team) // mapped
	clonedBoard.creator = creatorId;
	clonedBoard.columns = [];
	boards.push(clonedBoard);
	_updateBoards(boards);
	return clonedBoard.id
}


var _getBoard = function(id, map) {
	var boards = _getBoards();
	for (var i = 0; i < boards.length; i++) {
		if (boards[i].id === parseInt(id)) {
			if (map) {
				boards[i].team = helpMethodsService.arrayToTrueObj(boards[i].team);
			}
			return boards[i];
		}
	}
}


var _getBoards = function() {
	var boards = JSON.parse( localStorage.getItem('boards') ) || [];
	return boards
}

var _getUsersBoards = function(userId) {
	var boards = _getBoards();
	var usersBoards = []

	for (var i = 0; i < boards.length; i++) {
		if ( boards[i].creator === parseInt(userId) ) {
			usersBoards.push(boards[i]);
			continue
		}
		for (var k = 0; k < boards[i].team.length; k++) {
			if ( parseInt(boards[i].team[k]) === parseInt(userId) ) {
				usersBoards.push(boards[i]);
			}
		}

	}

	return usersBoards
}



var _updateBoard = function(board, map) {
	var boards = _getBoards();
	var clonedBoard = helpMethodsService.cloneObj(board);
	if (map) {
		clonedBoard.team = helpMethodsService.cloneTrueProps(clonedBoard.team);
	}
	for (var i = 0; i < boards.length; i++) {
		if ( boards[i].id === parseInt(board.id) ) {
			boards[i] = clonedBoard;
			_updateBoards(boards)
			return boards[i];
		}
	}
}

var _updateBoards = function(boards) {
	localStorage.setItem( 'boards', JSON.stringify(boards) );
}

var _deleteBoard = function(id) {
	var boards = _getBoards();
	for (var i = 0; i < boards.length; i++) {
		if (boards[i].id === id) {
			boards.splice(i, 1);
			_updateBoards(boards);
			return true
		}
	}
}

var _getBoardMembers = function(boardId) {
	var board = _getBoard(boardId);
	var member;
	var members = [];
	for (var m = 0; m < board.team.length; m++) {
		member = authService.getUser(board.team[m])
		members.push(member);
	}
	return members
}

var _getCard = function(boardId, columnId, cardId, map) {
	var board = _getBoard(boardId);
	var card;
	var time = {};
	for (var j = 0; j < board.columns.length; j++) {
		if ( parseInt(board.columns[j].id) === parseInt(columnId) ) {
			for (var k = 0; k < board.columns[j].cards.length; k++) {
				if ( parseInt(board.columns[j].cards[k].id) === parseInt(cardId)) {

					card = board.columns[j].cards[k]
					card.members = card.members || [];
					card.title = card.title || "";
					card.members = card.members || "";
					card.comments = card.comments || [];
					card.dueDate = card.dueDate || "";
					card.attachments = card.attachments || [];
					card.checklist = card.checklist || [];
					card.timeTracking = card.timeTracking || {estimatedTime: 0, spentTime: 0, remainingTime: 0};

					if (map) {
						card.members = helpMethodsService.arrayToTrueObj(card.members);
						for (var prop in card.timeTracking) {
							card.timeTracking[prop] = helpMethodsService.fromMinutes(card.timeTracking[prop]);
						} 
					}

					return card   // This could be easyly done from controller
				}				// without iterating throug all the boards
			}
		}
	}
}

var _updateCard = function(card, boardId, columnId, cardId, map) {
	var clonedCard = angular.copy(card);
	var boards = _getBoards();
	var oldCard;
	var time;
	if (map) {
		clonedCard.members = helpMethodsService.cloneTrueProps(clonedCard.members);
		for (var prop in clonedCard.timeTracking) {
			clonedCard.timeTracking[prop] = helpMethodsService.toMinutes(clonedCard.timeTracking[prop]);
		}
	}
	for (var i = 0; i < boards.length; i++) {
		if ( parseInt(boards[i].id) === parseInt(boardId) ) {
			for (var j = 0; j < boards[i].columns.length; j++) {
				if ( parseInt(boards[i].columns[j].id) === parseInt(columnId) ) {
					for (var k = 0; k < boards[i].columns[j].cards.length; k++) {
						if ( parseInt(boards[i].columns[j].cards[k].id) === parseInt(cardId) ) {
							boards[i].columns[j].cards[k] = clonedCard;
							_updateBoards(boards);
							return
						}
					}
				}
			}
		}
	}
}




boardsService.createBoard = _createBoard;
boardsService.getBoard = _getBoard;
boardsService.getBoards = _getBoards;
boardsService.getUsersBoards = _getUsersBoards;
boardsService.updateBoard = _updateBoard;
boardsService.updateBoards = _updateBoards;
boardsService.deleteBoard = _deleteBoard;
boardsService.getBoardMembers = _getBoardMembers;
boardsService.getCard = _getCard;
boardsService.updateCard = _updateCard;

return boardsService

}])