/* 
 *   Angular Timepicker 1.0.4
 *   https://github.com/Geta/angular-timepicker
 *
 *   Copyright 2013, Geta AS
 *   Author: Dzulqarnain Nasir
 *
 *   Licensed under the MIT license:
 *   http://www.opensource.org/licenses/MIT
 */

angular.module('dnTimepicker', ['ui.bootstrap.position', 'dateParser'])
    .factory('dnTimepickerHelpers', function() {
        return {
            stringToMinutes: function(str) {
                if(!str) return null;

                var t = str.match(/(\d+)(h?)/);
                return t[1] * (t[2] ? 60 : 1);
            },

            buildOptionList: function(minTime, maxTime, step) {
                var result = [];

                var i = minTime;
                while (i <= maxTime) {
                    result.push(new Date(i));
                    i.setMinutes(i.getMinutes() + step);
                }

                return result;
            },

            getClosestIndex: function(value, from) {
                if(!value) return -1;
            
                var closest = null;
                var index = -1;

                var _value = value.getHours() * 60 + value.getMinutes();
                for (var i = 0; i < from.length; i++) {
                    var current = from[i];
                    var _current = current.getHours() * 60 + current.getMinutes();

                    if (closest === null || Math.abs(_current - _value) < Math.abs(closest - _value)) {
                        closest = _current;
                        index = i;
                    }
                }
                return index;
            }
        }
    })
    .directive('dnTimepicker', ['$compile', '$parse', '$position', '$document', 'dateFilter', '$dateParser', 'dnTimepickerHelpers', function($compile, $parse, $position, $document, dateFilter, $dateParser, dnTimepickerHelpers) {
        return {
            restrict: 'A',
            // scope: {
            //     model: '=ngModel'
            // },
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {

                scope.timepicker = {
                    element: null,
                    timeFormat: 'h:mm a',
                    isOpen: false,
                    activeIdx: -1,
                    optionList: []
                };

                // Local variables
                var minTime = $dateParser('12:00 am', scope.timepicker.timeFormat),
                    maxTime = $dateParser('11:59 pm', scope.timepicker.timeFormat),
                    step = 15,
                    current = null;

                attrs.$observe('dnTimepicker', function(value) {
                    scope.timepicker.timeFormat = value;
                    scope.updateOptionList();
                    ngModel.$render();
                });

                attrs.$observe('minTime', function(value) {
                    minTime = value;
                    scope.updateOptionList();
                });

                attrs.$observe('maxTime', function(value) {
                    maxTime = value;
                    scope.updateOptionList();
                });

                scope.updateOptionList = function() {
                    scope.timepicker.optionList = dnTimepickerHelpers.buildOptionList(minTime, maxTime, step);
                };
                

                // // Select action handler
                // // (int) index
                // scope.select = function(index) {
                //     scope.update(scope.timepicker.optionList[index]);

                //     // Closes the timepicker
                //     if (scope.timepicker.isOpen) scope.timepicker.isOpen = false;
                // };

                // // Update the current selected time
                // // (Date) value
                // scope.update = function(value) {
                //     if(!value) return;

                //     current.setHours(value.getHours());
                //     current.setMinutes(value.getMinutes());
                //     current.setSeconds(value.getSeconds());

                //     scope.model = current;

                //     ngModel.$render();
                // };

                // ngModel.$render = function() {
                //     var timeString = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, scope.timepicker.timeFormat) : '';
                //     element.val(timeString);
                // };

                // // Checks for current active item
                // // (int) index
                // scope.isActive = function(index) {
                //     return index === scope.timepicker.activeIdx;
                // };

                // // Sets the current active item
                // // (int) index
                // scope.setActive = function(index) {
                //     scope.timepicker.activeIdx = index;
                // };

                // // Opens the timepicker
                // scope.openPopup = function() {
                //     // Set position
                //     scope.position = $position.position(element);
                //     scope.position.top = scope.position.top + element.prop('offsetHeight');

                //     // Open list
                //     scope.timepicker.isOpen = true;

                //     // Set active item
                //     scope.timepicker.activeIdx = getClosestIndex(ngModel.$viewValue, scope.timepicker.optionList);

                //     // Trigger digest
                //     scope.$digest();

                //     // Scroll to selected
                //     if (scope.timepicker.element && scope.timepicker.activeIdx > -1) {
                //         var target = scope.timepicker.element[0].querySelector('.active');
                //         target.parentNode.scrollTop = target.offsetTop;
                //     }
                // };

                // Set up the element
                // element
                //     .bind('focus', function() {
                //         scope.openPopup();
                //     })
                //     .bind('change', function() {
                //         var time = scope.stringToDate(element.val());

                //         // If the manually entered time is not valid, update it with last valid value
                //         if(angular.isDate(time)) {
                //             scope.update(time);
                //         } else {
                //             scope.update(current);
                //         }

                //         scope.timepicker.isOpen = false;
                //         scope.$apply();
                //     });

                // $document.bind('click', function(event) {
                //     if (scope.timepicker.isOpen && event.target !== element[0]) {
                //         scope.timepicker.isOpen = false;
                //         scope.$apply();
                //     }
                // });

                // Append timepicker dropdown
                element.after($compile(angular.element('<div dn-timepicker-popup></div>'))(scope));

                // // Set initial value
                // if(!angular.isDate(scope.model)) {
                //     scope.model = new Date();
                // }

                // current = scope.model;

                // // Set initial selected item
                // scope.timepicker.activeIdx = getClosestIndex(scope.model, scope.timepicker.optionList);
                // if (scope.timepicker.activeIdx > -1) scope.select(scope.timepicker.activeIdx);
            }
        };
    }])
    .directive('dnTimepickerPopup', [function() {
        return {
            restrict: 'A',
            replace: true,
            transclude: false,
            template: '<ul class="dn-timepicker-popup dropdown-menu" ng-style="{display: timepicker.isOpen && \'block\' || \'none\', top: position.top+\'px\', left: position.left+\'px\'}">\
            <li ng-repeat="time in timepicker.optionList" ng-class="{active: isActive($index) }" ng-mouseenter="setActive($index)" ng-click="select($index)">\
            <a>{{time | date:timepicker.timeFormat}}</a>\
            </li>\
            </ul>',
            link: function(scope, element, attrs) {
                scope.timepicker.element = element;

                element.find('a').bind('click', function(event) {
                    event.preventDefault();
                });
            }
        };
    }]);