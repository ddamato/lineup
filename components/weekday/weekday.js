import css from './weekday.css';
import lib from '../lib.js';

class Weekday extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style type="text/css">${css}</style>
      <div class="weekday">
        <div class="heading"></div>
        <div class="times"></div>
      </div>
    `;
    this.$heading = this.shadowRoot.querySelector('.heading');
    this.$weekday = this.shadowRoot.querySelector('.weekday');
    this.$times = this.shadowRoot.querySelector('.times');

    if (!this.legend) {
      this._addAvailability();
      this._addListeners();
    }
  }

  _setHeading() {
    this.$heading.textContent = this.legend
      ? getTimezoneName()
      : this.name;
  }

  _addAvailability() {
    if (!this.$availability) {
      this.$availability = document.createElement('div');
      this.$availability.classList.add('availability');
      this.$weekday.appendChild(this.$availability);
    }
  }

  _removeAvailability() {
    if (this.$availability) {
      this.$availability.remove();
      this.$availability = null;
    }
  }

  _addListeners() {
    this._listeners = {
      mousedown: this._onMousedown.bind(this),
      mousemove: this._onMousemove.bind(this),
      mouseup: this._onMouseup.bind(this),
      mouseleave: this._onMouseup.bind(this)
    };

    this.$weekday.addEventListener('mousedown', this._listeners.mousedown);
    window.addEventListener('keydown', this._onKeydown.bind(this));
  }

  _removeListeners() {
    if (this._listeners) {
      Object.keys(this._listeners).forEach((listener) => {
        this.$weekday.removeEventListener(listener, this._listeners[listener]);
      });
  
      this._listeners = null;
    }
  }

  connectedCallback() {
    this._setHeading();
    this._times = lib.times(this.divisions);
    this._availability = [];
    return this._renderTimes();
  }

  _onKeydown(ev) {
    if (this.legend) {
      return;
    }

    if (ev.code === 'Space') {
      ev.preventDefault();
      const $span = this.shadowRoot.activeElement;
      if ($span) {
        const id = Number($span.dataset.id);
        this._availability[id].tentative = !this._availability[id].tentative;
        return this._renderAvailability();
      }
    }

    if (ev.code === 'Backspace' || ev.code === 'Delete') {
      ev.preventDefault();
      const $span = this.shadowRoot.activeElement;
      if ($span) {
        const id = Number($span.dataset.id);
        this._availability.splice(id, 1);
        return this._renderAvailability();
      }
    }
  }

  _onMousedown(ev) {

    ev.preventDefault();
    this.$weekday.addEventListener('mousemove', this._listeners.mousemove);
    this.$weekday.addEventListener('mouseleave', this._listeners.mouseleave);
    this.$weekday.addEventListener('mouseup', this._listeners.mouseup);

    this.startY = ev.pageY;
    const id = Number(ev.target.dataset.id);

    // entering new cell
    if (ev.target.classList.contains('cell')) {
      const { startTime, endTime } = this._times[id];
      this._focusedAvailability = { startTime, endTime, tentative: false };
      this._availability.push(this._focusedAvailability);
      return this._renderAvailability();
    } 
    
    // entering existing availability
    if (ev.target.classList.contains('available')) {
      this._focusedAvailability = this._availability[id];
      return this._renderAvailability();
    }
  }

  _onMousemove(ev) {
    if (!this._focusedAvailability) {
      return;
    }

    const id = Number(ev.target.dataset.id);
    const updatedKey = ev.pageY - this.startY < 0 ? 'startTime' : 'endTime';

    // if entering new cell
    if (ev.target.classList.contains('cell')) {
      const time = this._times[id];
      this._focusedAvailability[updatedKey] = time[updatedKey];
      return this._renderAvailability();
    }
    
    // if entering existing availability
    if (ev.target.classList.contains('available')) {
      const availability = this._availability[id];
      if (availability !== this._focusedAvailability) {
        this._availability.splice(id, 1);
        this._focusedAvailability[updatedKey] = availability[updatedKey];
        return this._renderAvailability();
      }
    }
  }

  _onMouseup(ev) {
    this.$weekday.removeEventListener('mousemove', this._listeners.mousemove);
    this.$weekday.removeEventListener('mouseleave', this._listeners.mouseleave);
    this.$weekday.removeEventListener('mouseup', this._listeners.mouseup);
    this._focusedAvailability = null;
  }

  _renderTimes() {
    this.$times.innerHTML = '';

    if (this._times) {
      this._times.forEach((time, i) => {
        const { startTime, endTime } = time;
        const $cell = document.createElement('div');
        $cell.dataset.start = this.legend ? isoToLocale(startTime) : startTime;
        $cell.dataset.end = this.legend ? isoToLocale(endTime) : endTime;
        $cell.dataset.id = i;
        $cell.classList.add('cell');
        this.$times.appendChild($cell);
      });
    }

    this._scrollToTime();
  }

  _renderAvailability() {
    this.$availability.innerHTML = '';

    this._availability.forEach((availability, i) => {

      const startIndex = findClosestIndex(this._times, availability, 'startTime');
      const endIndex = findClosestIndex(this._times, availability, 'endTime');

      const $startCell = this.$times.children[startIndex];
      const $endCell = this.$times.children[endIndex];

      if ($startCell && $endCell) {
        const { startTime, endTime, tentative } = availability;
        const $span = document.createElement('span');
        const height = $endCell.offsetTop - $startCell.offsetTop + $endCell.offsetHeight;
        $span.style.top = `${$startCell.offsetTop}px`;
        $span.style.height = `${height}px`;
        $span.dataset.start = isoToLocale(startTime);
        $span.dataset.end = isoToLocale(endTime);
        $span.dataset.id = i;
        $span.tabIndex = 0;
        $span.classList.add('available');
        $span.classList.toggle('tentative', tentative);
        $span.title = 'Space: toggle tentative. Delete: remove availability';

        this.$availability.appendChild($span);
        if (this._focusedAvailability === availability) {
          $span.focus();
        }
      }
    });

    this.dispatchEvent(new CustomEvent('updatedavailability', { detail: this.availability }));
  }

  _scrollToTime() {
    if (this.legend) {
      const time = { startTime: new Date().toISOString() }
      const index = findClosestIndex(this._times, time, 'startTime');
      const $cell = this.$times.children[index];
      if ($cell) {
        $cell.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === 'index') {
      this._setHeading();
    }

    if (attr === 'legend') {
      if (this.legend && !this._listeners) {
        this._addAvailability();
        this._addListeners();
      } else {
        this._removeAvailability();
        this._removeListeners();
      }
    }
  }

  get name() {
    return getWeekdayName(this.index);
  }

  get lastday() {
    return this.hasAttribute('lastday');
  }

  set lastday(val) {
    if (val) {
      this.setAttribute('lastday', '');
    } else {
      this.removeAttribute('lastday');
    }
  }

  get index() {
    if (this.legend) {
      return -1;
    }
    return Number(this.getAttribute('index'));
  }

  set index(val) {
    this.setAttribute('index', val);
  }

  get divisions() {
    return Number(this.getAttribute('divisions')) || lib.MINUTE_DIVISIONS;
  }

  set divisions(val) {
    this.setAttribute('divisions', val);
    this._renderTimes();
  }

  get availability() {
    if (!this.legend) {
      return this._availability.slice().map(({ startTime, endTime, tentative }) => {
        return {
          startTime: lib.parseTime(startTime),
          endTime: lib.parseTime(endTime),
          tentative,
        }
      });
    }
    return [];
  }

  get legend() {
    return this.hasAttribute('legend');
  }

  set legend(val) {
    if (val) {
      this.setAttribute('legend', '');
    } else {
      this.removeAttribute('legend');
    }
  }

  clearAvailability() {
    if (!this.legend) {
      this._availability = [];
      this._renderAvailability();
    }
  }
}

function getWeekdayName(index) {
  const d = new Date();
  d.setDate((d.getDate() - d.getDay()) + index);
  return d.toLocaleString(window.navigator.language || 'en-us', {weekday: 'long'});
}

function isoToLocale(iso) {
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
}

function findClosestIndex(times, availability, key) {
  const goal = new Date(availability[key]);
  const closest = times.reduce((acc, time) => {
    const prevDelta = Math.abs(new Date(acc[key]) - goal);
    const currDelta = Math.abs(new Date(time[key]) - goal);
    return currDelta < prevDelta ? time : acc;
  });
  return times.findIndex((time) => time[key] === closest[key]);
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

window.customElements.define('lineup-weekday', Weekday);