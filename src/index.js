const MINUTE_SECONDS = 60;
const HOUR_SECONDS = 3600;
const DAY_SECONDS = 86400;
const YEAR_SECONDS = 31536000;

const JUST_NOW = '刚刚';
const MINUTES_AGO = '分钟前';
const YESTERDAY = '昨日';

const YEAR = '年';
const MONTH = '月';
const DAY = '日';
const DAY_PERIOD = ['凌晨', '拂晓', '早晨', '午前', '午后', '傍晚', '薄暮', '深夜'];
const HOUR = '时';
const MINUTE = '分';

const DAY_PERIOD_STRING = [
  ['00', '01', '02', '0', '1', '2'],
  ['03', '04', '05', '3', '4', '5'],
  ['06', '07', '08', '6', '7', '8'],
  ['09', '10', '11', '9'],
  ['12', '13', '14'],
  ['15', '16', '17'],
  ['18', '19', '20'],
  ['21', '22', '23']
];

function parseToMilliseconds(input) {
  if (!isNaN(input)) {
    return input;
  } else if (input instanceof Date) {
    return input.getTime();
  } else {
    let milliseconds = Date.parse(input);
    if (!isNaN(milliseconds)) {
      return milliseconds;
    } else {
      throw new Error('invalid input type of Date!');
    }
  }
}

function parseToLocaleDateString(milliseconds, needYear = false) {
  let dateString = new Date(milliseconds).toLocaleDateString().replace('-', '/').replace('-', '/').split('/');
  if (needYear) {
    return `${dateString[0]}${YEAR}${dateString[1]}${MONTH}${dateString[2]}${DAY}`;
  };
  return `${dateString[1]}${MONTH}${dateString[2]}${DAY}`;
};

function parseToLocaleTimeString(milliseconds) {
  let timeString = new Date(milliseconds).toTimeString().slice(0, 8).split(':');
  let localeTimeString = `${timeString[0]}${HOUR}${timeString[1]}${MINUTE}`;
  let periodIndex = DAY_PERIOD_STRING.findIndex(period => period.some(hour => hour === timeString[0]));
  return `${DAY_PERIOD[periodIndex]} ${localeTimeString}`;
};

function parseToTimeAgo(deltaSeconds, milliseconds) {
  if (deltaSeconds < MINUTE_SECONDS) {
    return `${JUST_NOW}`;
  } else if (deltaSeconds < HOUR_SECONDS) {
    let deltaMinutes = Math.floor(deltaSeconds / 60);
    return `${deltaMinutes}${MINUTES_AGO}`;
  } else if (deltaSeconds < DAY_SECONDS) {
    return parseToLocaleTimeString(milliseconds);
  } else if (deltaSeconds < DAY_SECONDS * 2) {
    let localeTimeString = parseToLocaleTimeString(milliseconds);
    return `${YESTERDAY} ${localeTimeString}`;
  } else if (deltaSeconds < YEAR_SECONDS) {
    let localeDateString = parseToLocaleDateString(milliseconds);
    let localeTimeString = parseToLocaleTimeString(milliseconds);
    return `${localeDateString} ${localeTimeString}`;
  } else {
    let localeDateString = parseToLocaleDateString(milliseconds, true);
    let localeTimeString = parseToLocaleTimeString(milliseconds);
    return `${localeDateString} ${localeTimeString}`;
  }
};

module.exports = function(input) {
  let milliseconds = parseToMilliseconds(input);
  let deltaSeconds = Math.ceil((Date.now() - milliseconds) / 1000);
  return parseToTimeAgo(deltaSeconds, milliseconds);
}