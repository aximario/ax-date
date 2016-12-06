'use strict';

var MINUTE_SECONDS = 60;
var HOUR_SECONDS = 3600;
var DAY_SECONDS = 86400;
var YEAR_SECONDS = 31536000;

var JUST_NOW = '刚刚';
var MINUTES_AGO = '分钟前';
var YESTERDAY = '昨日';

var YEAR = '年';
var MONTH = '月';
var DAY = '日';
var DAY_PERIOD = ['凌晨', '拂晓', '早晨', '午前', '午后', '傍晚', '薄暮', '深夜'];
var HOUR = '时';
var MINUTE = '分';

var DAY_PERIOD_STRING = [['00', '01', '02', '0', '1', '2'], ['03', '04', '05', '3', '4', '5'], ['06', '07', '08', '6', '7', '8'], ['09', '10', '11', '9'], ['12', '13', '14'], ['15', '16', '17'], ['18', '19', '20'], ['21', '22', '23']];

function parseToMilliseconds(input) {
  if (!isNaN(input)) {
    return input;
  } else if (input instanceof Date) {
    return input.getTime();
  } else {
    var milliseconds = Date.parse(input);
    if (!isNaN(milliseconds)) {
      return milliseconds;
    } else {
      throw new Error('invalid input type of Date!');
    }
  }
}

function parseToLocaleDateString(milliseconds) {
  var needYear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var dateString = new Date(milliseconds).toLocaleDateString().replace('-', '/').replace('-', '/').split('/');
  if (needYear) {
    return '' + dateString[0] + YEAR + dateString[1] + MONTH + dateString[2] + DAY;
  };
  return '' + dateString[1] + MONTH + dateString[2] + DAY;
};

function parseToLocaleTimeString(milliseconds) {
  var timeString = new Date(milliseconds).toTimeString().slice(0, 8).split(':');
  var localeTimeString = '' + timeString[0] + HOUR + timeString[1] + MINUTE;
  var periodIndex = DAY_PERIOD_STRING.findIndex(function (period) {
    return period.some(function (hour) {
      return hour === timeString[0];
    });
  });
  return DAY_PERIOD[periodIndex] + ' ' + localeTimeString;
};

function parseToTimeAgo(deltaSeconds, milliseconds) {
  if (deltaSeconds < MINUTE_SECONDS) {
    return '' + JUST_NOW;
  } else if (deltaSeconds < HOUR_SECONDS) {
    var deltaMinutes = Math.floor(deltaSeconds / 60);
    return '' + deltaMinutes + MINUTES_AGO;
  } else if (deltaSeconds < DAY_SECONDS) {
    return parseToLocaleTimeString(milliseconds);
  } else if (deltaSeconds < DAY_SECONDS * 2) {
    var localeTimeString = parseToLocaleTimeString(milliseconds);
    return YESTERDAY + ' ' + localeTimeString;
  } else if (deltaSeconds < YEAR_SECONDS) {
    var localeDateString = parseToLocaleDateString(milliseconds);
    var _localeTimeString = parseToLocaleTimeString(milliseconds);
    return localeDateString + ' ' + _localeTimeString;
  } else {
    var _localeDateString = parseToLocaleDateString(milliseconds, true);
    var _localeTimeString2 = parseToLocaleTimeString(milliseconds);
    return _localeDateString + ' ' + _localeTimeString2;
  }
};

module.exports = function (input) {
  var milliseconds = parseToMilliseconds(input);
  var deltaSeconds = Math.ceil((Date.now() - milliseconds) / 1000);
  return parseToTimeAgo(deltaSeconds, milliseconds);
};
