const DAYS_PER_WEEK = 7;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;

const week = document.querySelector('.cells');
const times = new Map();

function initWeek() {
  
  week.innerHTML = '';

  const hourDivisions = .5;
  const columns = DAYS_PER_WEEK + 1;
  const rows = HOURS_PER_DAY + 1;
  const totalCells = columns * rows / hourDivisions;

  let minutes = 0;
  let cellTime;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    if (i !== 0 && i % columns === 0) {
      const midnight = getMidnight();
      midnight.setMinutes(minutes);
      cellTime = midnight.getTime();
      times.set(cellTime, cell);
      cell.dataset.time = midnight.toLocaleTimeString();
      minutes += MINUTES_PER_HOUR * hourDivisions;

      cell.classList.remove('cell');
    }

    if (i !== 0 && i < columns) {
      cell.textContent = getWeekdayName(i - 1);
      cell.dataset.value = i - 1;
      cell.classList.remove('cell');
    }

    if (i > totalCells - columns) {
      cell.classList.remove('cell');
      cell.classList.add('null');
    }

    if (i === 0) {
      cell.textContent = getTimezoneName();
      cell.classList.remove('cell');
    }

    if (cell.classList.contains('cell')) {
      cell.dataset.value = cellTime;
    }

    week.appendChild(cell);
  }

  scrollToTime();
}

function scrollToTime() {
  const time = new Date().getTime();
  const closest = Array.from(times.keys()).reduce((prev, curr) => {
    return (Math.abs(curr - time) < Math.abs(prev - time) ? curr : prev);
  });
  const element = times.get(closest);
  element.scrollIntoView({ behavior: 'smooth' });
}

week.addEventListener('mousedown', onMousedown);

let currentSpan;
let startY;

function onMousedown(ev) {

  if (currentSpan) {
    currentSpan.classList.remove('focused');
    currentSpan = null;
  }

  const element = document.elementFromPoint(ev.pageX - window.scrollX, ev.pageY - window.scrollY);
  if (!element || !element.matches('.block, .cell')) {
    return;
  }

  week.addEventListener('mousemove', onMousemove);
  week.addEventListener('mouseleave', onMouseup);
  week.addEventListener('mouseup', onMouseup);

  startY = ev.pageY;

  if (element.classList.contains('cell')) {
    createSpan(element);
  } else if (element.classList.contains('block')) {
    currentSpan = element;
    currentSpan.classList.add('focused');
  }
}

function onMousemove(ev) {
  const element = document.elementFromPoint(ev.pageX - window.scrollX, ev.pageY - window.scrollY);
  const deltaY = ev.pageY - startY;
  if (element !== currentSpan) {

    if (element.offsetLeft !== currentSpan.offsetLeft) {
      return;
    }

    if (deltaY < 0) {
      currentSpan.style.top = `${element.offsetTop}px`;
      currentSpan.dataset.start = element.classList.contains('block') 
        ? element.dataset.start
        : getStartTime(element);
    } else {
      currentSpan.dataset.end = element.classList.contains('block') 
        ? element.dataset.end
        : getEndTime(element);
    }

    const height = parseInt(currentSpan.style.height);
    currentSpan.style.height = `${height + element.offsetHeight}px`;

    if (element.classList.contains('block')) {
      element.remove();
    }
  }
}

function createSpan(cell) {
  currentSpan = document.createElement('span');
  currentSpan.classList.add('block', 'focused');
  currentSpan.style.left = `${cell.offsetLeft}px`;
  currentSpan.style.top = `${cell.offsetTop}px`;
  currentSpan.style.height = `${cell.offsetHeight}px`;

  currentSpan.dataset.start = getStartTime(cell);
  currentSpan.dataset.end = getEndTime(cell);

  week.appendChild(currentSpan);
}

function getStartTime(cell) {
  const time = parseInt(cell.dataset.value);
  return times.get(time).dataset.time;
}

function getEndTime(cell) {
  const arr = Array.from(times.keys());
  const time = parseInt(cell.dataset.value);
  const index = arr.indexOf(time);
  return times.get(arr[index + 1]).dataset.time;
}

function onMouseup(ev) {
  week.removeEventListener('mousemove', onMousemove);
  week.removeEventListener('mouseup', onMouseup);
}

function getWeekdayName(index) {
  const d = new Date();
  d.setDate((d.getDate() - d.getDay()) + index);
  return d.toLocaleString(window.navigator.language || 'en-us', {weekday: 'long'});
}

function getMidnight() {
  const d = new Date();
  d.setMilliseconds(0);
  d.setSeconds(0);
  d.setMinutes(0);
  d.setHours(0);
  return d;
}

function getTimezoneName() {
  const today = new Date();
  const short = today.toLocaleDateString(undefined);
  const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });

  const shortIndex = full.indexOf(short);
  if (shortIndex >= 0) {
    return full
      .substring(0, shortIndex) + full.substring(shortIndex + short.length)
      .replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
  }
  return full;
}

initWeek();