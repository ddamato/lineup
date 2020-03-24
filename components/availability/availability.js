import css from './availability.css';
import lib from '../lib.js';

class Availability extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style type="text/css">${css}</style>
      <ul class="availability"></ul>
      <button class="add">Add availability</button>
    `;

    this._week = createWeek(lib.DAYS_PER_WEEK, lib.MINUTE_DIVISIONS);
    this.$ul = this.shadowRoot.querySelector('.availability');
    this.$button = this.shadowRoot.querySelector('.add');
    this.$button.addEventListener('click', this._onClick.bind(this));
    this._createAvailability();
  }

  _onClick() {
    this._createAvailability();
  }

  _createAvailability() {
    const $li = document.createElement('li');
    const $input = document.createElement('input');
    $input.type = 'text';
    $input.addEventListener('input', this._onInput.bind(this));
    $li.appendChild($input);
    this.$ul.appendChild($li);
  }

  _onInput(ev) {
    try {
      const availability = JSON.parse(ev.target.value);
      if (Array.isArray(availability) && availability.length === lib.DAYS_PER_WEEK) {
        // store it!
      }
    } catch (err) {}
  }
}

function createWeek(days, divisions) {
  const week = [];
  for(let i = 0; i < days; i++) {
    const weekday = createWeekday(divisions);
    week.push(weekday);
  }
  return week;
}

function createWeekday(divisions) {
  return lib.times(divisions).reduce((acc, { startTime, endTime }) => {
    const time = `${lib.parseTime(startTime)}-${lib.parseTime(endTime)}`;
    return Object.assign(acc, {[time]: []});
  }, {});
}

window.customElements.define('lineup-availability', Availability);