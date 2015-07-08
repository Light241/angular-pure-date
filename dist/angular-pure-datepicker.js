angular.module("angular-pd.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("apd.html","<div class=apd_root><select ng-model=data.selected.day ng-options=\"day for day in data.days\" ng-init=\"data.selected.day = data.days[0]\" ng-change=onDaySelectChanged(data.selected.day) id={{::apdDayId}} class=\"apd_elem apd_select_day apd_select {{::apdDayClasses}}\"></select><span title={{getDayOfWeekName(data.selected.dayOfWeek)}} ng-bind=getDayOfWeekShortName(data.selected.dayOfWeek) class=\"apd_elem apd_day_of_week\"></span><select ng-model=data.selected.month ng-options=\"(month + 1) for month in data.month\" ng-init=\"data.selected.month = data.month[0]\" ng-change=onMonthSelectChanged(data.selected.month) id={{::apdMonthId}} class=\"apd_elem apd_select_month apd_select {{::apdMonthClasses}}\"></select><select ng-model=data.selected.year ng-options=\"year for year in data.years\" ng-init=\"data.selected.year = data.years[0]\" ng-change=onYearSelectChanged(data.selected.year) id={{::apdYearId}} class=\"apd_elem apd_select_year apd_select {{::apdYearClasses}}\"></select></div>");}]);
var apd;
(function (apd) {
    var Model;
    (function (Model) {
        'use strict';
        var DataClass = (function () {
            function DataClass(selected, startDateTime, endDateTime) {
                this.YEARS_LIST_DIRECTION = 'desc';
                this.MONTH_LIST_DIRECTION = 'asc';
                this.DAYS_LIST_DIRECTION = 'asc';
                this._getSelected = function (selected, startDateTime, endDateTime) {
                    var result;
                    var isBiggerThenStart = (selected.datetime > startDateTime);
                    var isEqualToStart = (selected.datetime === startDateTime);
                    var isLowerThenEnd = (selected.datetime > endDateTime);
                    var isEqualToEnd = (selected.datetime === endDateTime);
                    if ((isBiggerThenStart || isEqualToStart) && (isLowerThenEnd || isEqualToEnd)) {
                        result = new Model.DateModelClass(selected.datetime);
                    }
                    else if (!isBiggerThenStart) {
                        result = new Model.DateModelClass(startDateTime);
                    }
                    if (!isBiggerThenStart) {
                        result = new Model.DateModelClass(endDateTime);
                    }
                    else {
                        result = new Model.DateModelClass(new Date().getTime());
                    }
                    return result;
                };
                this._intArraySort = function (arr, direction) {
                    if (direction === void 0) { direction = 'asc'; }
                    function desc(a, b) {
                        return b - a;
                    }
                    switch (direction) {
                        default:
                            return arr.sort(function (a, b) {
                                return a - b;
                            });
                        case "desc":
                            return arr.sort(desc);
                    }
                };
                this._getArrayOfNumbers = function (start, end) {
                    var result = [];
                    for (var i = start; i <= end; i++) {
                        result.push(i);
                    }
                    return result;
                };
                this.reloadYearsList = function () {
                    this.years = this._getYearsList(this._startDateTime, this._endDateTime, this._limitDates, this.YEARS_LIST_DIRECTION);
                };
                this._getYearsList = function (startDateTime, endDateTime, limitDates, direction) {
                    var result = [];
                    var DEFAULT_YEARS_COUNT = 20;
                    var start = limitDates.startDate.year;
                    var end = limitDates.endDate.year;
                    var now = limitDates.nowDate.year;
                    if ((startDateTime && endDateTime) && (startDateTime < endDateTime)) {
                        result = this._getArrayOfNumbers(start, end);
                    }
                    else if ((startDateTime && endDateTime) && (startDateTime > endDateTime)) {
                        apd.messages.MessagesFactoryClass.throwDatesInvertedMessage();
                        result = this._getArrayOfNumbers(end, start);
                    }
                    else if ((startDateTime && endDateTime) && (startDateTime === endDateTime)) {
                        result = this._getArrayOfNumbers(start, end);
                    }
                    else if (startDateTime && !endDateTime) {
                        result = this._getArrayOfNumbers(start, now);
                    }
                    else if (!startDateTime && endDateTime) {
                        result = this._getArrayOfNumbers(end, end);
                    }
                    else if (!startDateTime && !endDateTime) {
                        result = this._getArrayOfNumbers(now - (DEFAULT_YEARS_COUNT - 1), now);
                    }
                    return this._intArraySort(result, direction);
                };
                this.reloadMonthList = function () {
                    var selectedYear = new Date(this.selected.datetime).getFullYear();
                    this.month = this._getMonthList(this._startDateTime, this._endDateTime, this._limitDates, selectedYear, this.MONTH_LIST_DIRECTION);
                };
                this._getMonthList = function (startDateTime, endDateTime, limitDates, selectedYear, direction) {
                    var result;
                    var START_MONTH = 0;
                    var END_MONTH = 11;
                    if (startDateTime && endDateTime) {
                        var isYearOfLowerLimit = (startDateTime) ? limitDates.startDate.year === selectedYear : false;
                        var isYearOfUpperLimit = (endDateTime) ? limitDates.endDate.year === selectedYear : false;
                        var start = (startDateTime) ? limitDates.startDate.month : START_MONTH;
                        var end = (endDateTime) ? limitDates.endDate.month : END_MONTH;
                        if (isYearOfLowerLimit && isYearOfUpperLimit) {
                            result = this._getArrayOfNumbers(start, end);
                        }
                        else if (isYearOfLowerLimit && !isYearOfUpperLimit) {
                            result = this._getArrayOfNumbers(start, END_MONTH);
                        }
                        else if (!isYearOfLowerLimit && isYearOfUpperLimit) {
                            result = this._getArrayOfNumbers(START_MONTH, end);
                        }
                        else {
                            result = this._getArrayOfNumbers(START_MONTH, END_MONTH);
                        }
                    }
                    else {
                        result = this._getArrayOfNumbers(START_MONTH, END_MONTH);
                    }
                    return this._intArraySort(result, direction);
                };
                this.reloadDaysList = function () {
                    var selectedYear = new Date(this.selected.datetime).getFullYear();
                    var selectedMonth = new Date(this.selected.datetime).getMonth();
                    this.days = this._getDaysList(this._startDateTime, this._endDateTime, this._limitDates, selectedYear, selectedMonth, this.DAYS_LIST_DIRECTION);
                };
                this._getDaysList = function (startDateTime, endDateTime, limitDates, selectedYear, selectedMonth, direction) {
                    var result;
                    var START_DAY = 1;
                    var lastDayInMonth = this.getDaysInMonth(selectedMonth, selectedYear);
                    if (startDateTime && endDateTime) {
                        var isYearOfLowerLimit = (startDateTime) ? limitDates.startDate.year === selectedYear : false;
                        var isYearOfUpperLimit = (endDateTime) ? limitDates.endDate.year === selectedYear : false;
                        var isMonthOfLowerLimit = (startDateTime) ? limitDates.startDate.month === selectedMonth : false;
                        var isMonthOfUpperLimit = (endDateTime) ? limitDates.endDate.month === selectedMonth : false;
                        var isLowerLimit = (isYearOfLowerLimit && isMonthOfLowerLimit);
                        var isUpperLimit = (isYearOfUpperLimit && isMonthOfUpperLimit);
                        var start = (startDateTime) ? limitDates.startDate.day : START_DAY;
                        var end = (endDateTime) ? limitDates.endDate.day : lastDayInMonth;
                        if (isLowerLimit && isUpperLimit) {
                            result = this._getArrayOfNumbers(start, end);
                        }
                        else if (isLowerLimit && !isUpperLimit) {
                            result = this._getArrayOfNumbers(start, lastDayInMonth);
                        }
                        else if (!isLowerLimit && isUpperLimit) {
                            result = this._getArrayOfNumbers(START_DAY, end);
                        }
                        else {
                            result = this._getArrayOfNumbers(START_DAY, lastDayInMonth);
                        }
                    }
                    else {
                        result = this._getArrayOfNumbers(START_DAY, lastDayInMonth);
                    }
                    return this._intArraySort(result, direction);
                };
                this._getIntArr = function (length) {
                    if (!length && length !== 0) {
                        apd.messages.MessagesFactoryClass.throwInvalidParamsMessage();
                        return null;
                    }
                    return length ? this._getIntArr(length - 1).concat(length) : [];
                };
                this.getDaysInMonth = function (month, year) {
                    return new Date(year, month + 1, 0).getDate();
                };
                if (!(this instanceof DataClass)) {
                    apd.messages.MessagesFactoryClass.throwWrongInstanceMessage();
                    return new DataClass(selected, startDateTime, endDateTime);
                }
                var self = this;
                self.selected = self._getSelected(selected, startDateTime, endDateTime);
                var selectedYear = new Date(this.selected.datetime).getFullYear();
                var selectedMonth = new Date(this.selected.datetime).getMonth();
                self._limitDates = new Model.LimitDatesClass(startDateTime, endDateTime);
                self._startDateTime = startDateTime;
                self._endDateTime = endDateTime;
                self.years = self._getYearsList(startDateTime, endDateTime, self._limitDates, this.YEARS_LIST_DIRECTION);
                self.month = self._getMonthList(startDateTime, endDateTime, self._limitDates, selectedYear, this.MONTH_LIST_DIRECTION);
                self.days = self._getDaysList(startDateTime, endDateTime, self._limitDates, selectedYear, selectedMonth, this.DAYS_LIST_DIRECTION);
                return this;
            }
            return DataClass;
        })();
        Model.DataClass = DataClass;
    })(Model = apd.Model || (apd.Model = {}));
})(apd || (apd = {}));

var apd;
(function (apd) {
    var Model;
    (function (Model) {
        'use strict';
        var DayOfWeek = (function () {
            function DayOfWeek(name, short) {
                if (!(this instanceof DayOfWeek)) {
                    apd.messages.MessagesFactoryClass.throwWrongInstanceMessage();
                    return new DayOfWeek(name, short);
                }
                this.name = name;
                this.short = short;
                return this;
            }
            return DayOfWeek;
        })();
        Model.DayOfWeek = DayOfWeek;
    })(Model = apd.Model || (apd.Model = {}));
})(apd || (apd = {}));

var apd;
(function (apd) {
    var Model;
    (function (Model) {
        'use strict';
        var DaysOfWeek = (function () {
            function DaysOfWeek(days) {
                var _this = this;
                this.getListOfShorts = function () {
                    var result = [];
                    for (var i = 0; i < _this.list.length; i++) {
                        var dayOfWeek = _this.list[i];
                        result.push(dayOfWeek.short);
                    }
                    return result;
                };
                this.getListOfNames = function () {
                    var result = [];
                    for (var i = 0; i < _this.list.length; i++) {
                        var dayOfWeek = _this.list[i];
                        result.push(dayOfWeek.name);
                    }
                    return result;
                };
                this.getDayOfWeekShortName = function (dayNum) {
                    return _this.shorts[dayNum];
                };
                this.getDayOfWeekName = function (dayNum) {
                    return _this.names[dayNum];
                };
                if (!(this instanceof DaysOfWeek)) {
                    apd.messages.MessagesFactoryClass.throwWrongInstanceMessage();
                    return new DaysOfWeek(days);
                }
                this.list = days;
                this.shorts = this.getListOfShorts();
                this.names = this.getListOfNames();
                return this;
            }
            return DaysOfWeek;
        })();
        Model.DaysOfWeek = DaysOfWeek;
    })(Model = apd.Model || (apd.Model = {}));
})(apd || (apd = {}));

var apd;
(function (apd) {
    var Model;
    (function (Model) {
        'use strict';
        var DateModelClass = (function () {
            function DateModelClass(datetime) {
                if (!(this instanceof DateModelClass)) {
                    apd.messages.MessagesFactoryClass.throwWrongInstanceMessage();
                    return new DateModelClass(datetime);
                }
                var date = new Date(datetime);
                this.day = date.getDate();
                this.dayOfWeek = date.getDay();
                this.month = date.getMonth();
                this.year = date.getFullYear();
                this.datetime = datetime;
                this.timezone = date.getTimezoneOffset();
                return this;
            }
            return DateModelClass;
        })();
        Model.DateModelClass = DateModelClass;
    })(Model = apd.Model || (apd.Model = {}));
})(apd || (apd = {}));

var apd;
(function (apd) {
    var directive;
    (function (directive) {
        'use strict';
        var daysOfWeek = new apd.Model.DaysOfWeek([
            new apd.Model.DayOfWeek('Sunday', 'Sun'),
            new apd.Model.DayOfWeek('Monday', 'Mon'),
            new apd.Model.DayOfWeek('Tuesday', 'Tue'),
            new apd.Model.DayOfWeek('Wednesday', 'Wed'),
            new apd.Model.DayOfWeek('Thursday', 'Thu'),
            new apd.Model.DayOfWeek('Friday', 'Fri'),
            new apd.Model.DayOfWeek('Saturday', 'Sat')
        ]);
        angular.module('angular-pd.datepicker', [
            'angular-pd.templates'
        ]).directive('pureDatepicker', ['DateUtilsFactory', 'MessagesFactory', function (DateUtilsFactory, MessagesFactory) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'apd.html',
                scope: {
                    ngModel: '=',
                    apdStart: '=?',
                    apdEnd: '=?',
                    apdDayId: '@?',
                    apdMonthId: '@?',
                    apdYearId: '@?',
                    apdDayClasses: '@?',
                    apdMonthClasses: '@?',
                    apdYearClasses: '@?'
                },
                link: function (scope) {
                    var settings = {
                        initDateModel: null,
                        startDateTime: null,
                        endDateTime: null
                    };
                    function init() {
                        settings.initDateModel = getInitDateModel(scope.ngModel);
                        settings.startDateTime = (scope.apdStart) ? +scope.apdStart : null;
                        settings.endDateTime = (scope.apdEnd) ? +scope.apdEnd : null;
                        _initData(settings.initDateModel, settings.startDateTime, settings.endDateTime);
                        scope.getDayOfWeekShortName = daysOfWeek.getDayOfWeekShortName;
                        scope.getDayOfWeekName = daysOfWeek.getDayOfWeekName;
                    }
                    init();
                    function getInitDateModel(model) {
                        var isInitModelValid = DateUtilsFactory.validateModel(model);
                        var initDatetime;
                        if (isInitModelValid) {
                            initDatetime = model.datetime;
                        }
                        else {
                            initDatetime = new Date().getTime();
                        }
                        return new apd.Model.DateModelClass(initDatetime);
                    }
                    function _initData(initDateModel, startDateTime, endDateTime) {
                        scope.data = DateUtilsFactory.getData(initDateModel, startDateTime, endDateTime);
                        scope.ngModel = scope.data.selected;
                    }
                    function updateModel(datetime) {
                        scope.data.selected = new apd.Model.DateModelClass(datetime);
                        scope.ngModel = scope.data.selected;
                    }
                    scope.onDaySelectChanged = function (day) {
                        if (!day)
                            return;
                        var datetime = getDateTime(scope.data.selected.day, scope.data.selected.month, scope.data.selected.year);
                        updateModel(datetime);
                    };
                    scope.onMonthSelectChanged = function (month) {
                        if (!month && month !== 0)
                            return;
                        var datetime;
                        var year = scope.data.selected.year;
                        var day = scope.data.selected.day;
                        if (!isCorrectDay(day, month, year)) {
                            day = scope.data.getDaysInMonth(month, year);
                        }
                        scope.data.reloadDaysList();
                        datetime = getDateTime(day, month, year);
                        updateModel(datetime);
                    };
                    scope.onYearSelectChanged = function (year) {
                        if (!year && year !== 0)
                            return;
                        var datetime;
                        var month = scope.data.selected.month;
                        var day = scope.data.selected.day;
                        if (!isCorrectDay(day, month, year)) {
                            day = scope.data.getDaysInMonth(year, year);
                        }
                        scope.data.reloadMonthList();
                        datetime = getDateTime(day, month, year);
                        updateModel(datetime);
                    };
                    function getDateTime(day, month, year) {
                        if (!day || (!month && month !== 0) || !year) {
                            MessagesFactory.throwInvalidParamsMessage();
                        }
                        return new Date(year, month, day).getTime();
                    }
                    function isCorrectDay(day, month, year) {
                        var daysInMonth = scope.data.getDaysInMonth(month, year);
                        return day <= daysInMonth;
                    }
                }
            };
        }]);
    })(directive = apd.directive || (apd.directive = {}));
})(apd || (apd = {}));

var apd;
(function (apd) {
    var dateUtils;
    (function (dateUtils) {
        'use strict';
        angular.module('angular-pd.date_utils', []).factory('DateUtilsFactory', function () {
            var exports = {
                getData: function (selected, startDateTime, endDateTime) {
                    return new apd.Model.DataClass(selected, startDateTime, endDateTime);
                },
                validateModel: function (model) {
                    return !!(model && model.datetime);
                }
            };
            return exports;
        });
    })(dateUtils = apd.dateUtils || (apd.dateUtils = {}));
})(apd || (apd = {}));

angular.module('angular-pd', [
    'angular-pd.datepicker',
    'angular-pd.date_utils',
    'angular-pd.messages'
]);

var apd;
(function (apd) {
    var messages;
    (function (messages) {
        'use strict';
        var MessagesFactoryClass = (function () {
            function MessagesFactoryClass() {
                this.messages = {
                    wrongInstance: 'Class created without \'new\', wrong \'this\'',
                    invalidParams: 'Invalid params',
                    invalidDateModel: 'Invalid date model',
                    datesInverted: 'Warning! Start date > End date'
                };
            }
            MessagesFactoryClass.throwDeveloperError = function (message) {
                console.error(message);
            };
            MessagesFactoryClass.throwModelValidationMessage = function (field) {
                this.throwDeveloperError(this.messages.invalidDateModel + ': error on field \"' + field + '+\"');
            };
            MessagesFactoryClass.throwInvalidParamsMessage = function () {
                this.throwDeveloperError(this.messages.invalidParams);
            };
            MessagesFactoryClass.throwWrongInstanceMessage = function () {
                this.throwDeveloperError(this.messages.wrongInstance);
            };
            MessagesFactoryClass.throwDatesInvertedMessage = function () {
                this.throwDeveloperError(this.messages.datesInverted);
            };
            return MessagesFactoryClass;
        })();
        messages.MessagesFactoryClass = MessagesFactoryClass;
        angular.module('angular-pd.messages', []).factory('MessagesFactory', function () {
            return new MessagesFactoryClass();
        });
    })(messages = apd.messages || (apd.messages = {}));
})(apd || (apd = {}));

var apd;
(function (apd) {
    var Model;
    (function (Model) {
        'use strict';
        var LimitDatesClass = (function () {
            function LimitDatesClass(startDateTime, endDateTime) {
                this._setStartDate = function (datetime) {
                    this.startDate.day = new Date(datetime).getDate();
                    this.startDate.month = new Date(datetime).getMonth();
                    this.startDate.year = new Date(datetime).getFullYear();
                    return this;
                };
                this._setEndDate = function (datetime) {
                    this.endDate.day = new Date(datetime).getDate();
                    this.endDate.month = new Date(datetime).getMonth();
                    this.endDate.year = new Date(datetime).getFullYear();
                    return this;
                };
                this._setNowDate = function () {
                    this.nowDate.day = new Date().getDate();
                    this.nowDate.month = new Date().getMonth();
                    this.nowDate.year = new Date().getFullYear();
                    return this;
                };
                if (!(this instanceof LimitDatesClass)) {
                    apd.messages.MessagesFactoryClass.throwWrongInstanceMessage();
                    return new LimitDatesClass(startDateTime, endDateTime);
                }
                this.startDate = { day: null, month: null, year: null };
                this.endDate = { day: null, month: null, year: null };
                this.nowDate = { day: null, month: null, year: null };
                this._setStartDate(startDateTime);
                this._setEndDate(endDateTime);
                this._setNowDate();
            }
            return LimitDatesClass;
        })();
        Model.LimitDatesClass = LimitDatesClass;
    })(Model = apd.Model || (apd.Model = {}));
})(apd || (apd = {}));
