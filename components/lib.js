const DAYS_PER_WEEK = 7;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTE_DIVISIONS = 30;

function times(divisions) {
  const times = [];
  for (let minutes = 0; minutes <= HOURS_PER_DAY * MINUTES_PER_HOUR; minutes += divisions) {
    times.push({
      startTime: minutesISOString(minutes),
      endTime: minutesISOString(minutes + divisions),
    });
  }
  return times;
}

function getMidnight() {
  const d = new Date();
  d.setMilliseconds(0);
  d.setSeconds(0);
  d.setMinutes(0);
  d.setHours(0);
  return d;
}

function minutesISOString(minutes) {
  const midnight = getMidnight();
  midnight.setMinutes(minutes);
  return midnight.toISOString();
}

function parseTime(time) {
  return time.replace(/.*T/, '');
}

export default {
  times,
  parseTime,
  DAYS_PER_WEEK,
  HOURS_PER_DAY,
  MINUTES_PER_HOUR,
  MINUTE_DIVISIONS,
};