"use strict";

angular.module('lnd')
.directive('draggable', ['$document', '$timeout', 'helpMethodsService', 'boardsService', function ($document, $timeout, helpMethodsService, boardsService) {
    return {
        restrict: 'A',
        scope: {
            'board': '='
        },
        link: function (scope, elem, attr, ctrl) {

            scope.$watch('board', function(){

                var startX = 0, startY = 0, x = 0, y = 0;
                var columns;
                var map;
                var pageX, pageY;
                var cardIndex = attr.index;
                var columnIndex = attr.columnIndex;


                function createMap() {
                    columns = elem.parent().siblings('.board-column').andSelf();
                    map = [];
                    columns.each(function(index){ // this way we'll draw the map
                        var borders = {};
                        var position = $(this).offset();
                        borders.columnTitle = scope.board.columns[index].title; // Now we know the columns' name
                        borders.top = position.top;
                        borders.bottom = position.top + $(this).outerHeight();
                        borders.left = position.left;
                        borders.right = position.left + $(this).outerWidth();
                        map.push(borders);
                    })
                }


                function moveCard() {
                    elem.css({
                        top: y + 'px',
                        left:  x + 'px',
                        'z-index': 10,
                        '-ms-transform': 'rotate(10deg)', /* IE 9 */
                        '-webkit-transform': 'rotate(10deg)', /* Chrome, Safari, Opera */
                        'transform': 'rotate(10deg)',
                    });
                }


                function dropCard() {
                    for (var i = 0; i < map.length; i++) {
                        if (pageX > map[i].left && pageX < map[i].right && pageY > map[i].top && pageY < map[i].bottom) {
                            if ( parseInt(columnIndex) !== i ) {
                                var card = scope.board.columns[columnIndex].cards.splice(cardIndex, 1);
                                scope.board.columns[i].cards.push(card[0]);
                                boardsService.updateBoard(scope.board);
                                scope.$parent.$parent.$parent.$apply();
                                return
                            }
                        } 
                    }
                    putBack();
                }


                function putBack() {
                    startX = 0;
                    startY = 0;
                    x = 0;
                    y = 0;
                    elem.css({
                        'z-index': 0,
                        '-ms-transform': 'rotate(0deg)', /* IE 9 */
                        '-webkit-transform': 'rotate(0deg)', /* Chrome, Safari, Opera */
                        'transform': 'rotate(0deg)',
                    })
                    elem.animate({
                        top: y + 'px',
                        left:  x + 'px',
                    }, 200);
                }

                elem.on('mousedown', function(event) {
                    event.preventDefault();
                    createMap();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });

                function mousemove(event) {
                    pageX = event.pageX;
                    pageY = event.pageY;
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    moveCard();
                }

                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    dropCard();
                }
            })
        }

    }
}]);