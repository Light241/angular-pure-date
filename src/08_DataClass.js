var DataClass = (function (DateUtils, CommonUtils, YearsUtils, MonthUtils, DaysUtils, DateModel) {
    'use strict';

    function _getSelected(model, start, end) {
        var result;

        var isUpperStart = (model.dt > start);
        var isEqualStart = (model.dt === start);
        var isLowerEnd = (model.dt > end);
        var isEqualEnd = (model.dt === end);

        //start == 1; model == 1 or 2 or 3; end == 3;
        if ((isUpperStart || isEqualStart) || (isLowerEnd || isEqualEnd)) {
            result = new DateModel(model.dt);
        } else
        //start == 1; model == 0
        if (!isUpperStart) {
            result = new DateModel(start);
        } else
        //model == 4; end == 3;
        if (!isUpperStart) {
            result = new DateModel(end);
        }
        //paranoid case
        else {
            result = new DateModel(new Date().getTime());
        }

        return result;
    }

    return function (model, start, end) {

        var _private = {
            _start: null,
            _end: null,
            _limitDates: null
        };

        var exports = {
            selected: {},
            list: {
                y: null,
                m: null,
                d: null
            },
            reloadYearsList: function () {
                exports.list.y = YearsUtils.getYearsList(_private._start, _private._end);
                return this;
            },
            reloadMonthList: function () {
                var selectedYear = DateUtils.getYear(exports.selected.dt);
                exports.list.m = MonthUtils.getMonthList(_private._start, _private._end, selectedYear);
                return this;
            },
            reloadDaysList: function () {
                var selectedYear = DateUtils.getYear(exports.selected.dt);
                var selectedMonth = DateUtils.getMonth(exports.selected.dt);
                exports.list.d = DaysUtils.getDaysList(_private._start, _private._end, selectedYear, selectedMonth);
                return this;
            }
        };

        model.dt = CommonUtils.isValidNumber(model.dt) ? model.dt : null;
        start = CommonUtils.isValidNumber(start) ? start : null;
        end = CommonUtils.isValidNumber(end) ? end : null;

        exports.selected = _getSelected(model, start, end);
        var selectedYear = DateUtils.getYear(exports.selected.dt);
        var selectedMonth = DateUtils.getMonth(exports.selected.dt);

        _private._limitDates = new LimitsModel(start, end);
        _private._start = start;
        _private._end = end;

        exports.list.y = YearsUtils.getYearsList(start, end, exports.selected, _private._limitDates);
        exports.list.m = MonthUtils.getMonthList(start, end, selectedYear, _private._limitDates);
        exports.list.d = DaysUtils.getDaysList(start, end, selectedYear, selectedMonth, exports.selected, _private._limitDates);

        return exports;
    };

})(DateUtils, CommonUtils, YearsUtils, MonthUtils, DaysUtils, DateModel);