var Config = (function () {
    'use strict';

    return {
        isUtc: false,
        monthDirection: 'asc',
        daysDirection: 'asc',
        yearsDirection: 'desc',
        defaultYearsCount: 50,
        daysList: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthList: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
})();

////TODO (S.Panfilov) test
//if ( typeof module === 'object' && module.exports) {
//    module.exports = Config;
//}