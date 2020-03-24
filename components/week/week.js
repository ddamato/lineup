import css from './week.css';
import lib from '../lib.js';

class Week extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style type="text/css">${css}</style>
      <header class="header">
        <label>Lineup Availability JSON</label>
        <textarea class="json" readonly></textarea>
        <button class="copy">Copy JSON</button>
      </header>
      <div class="week">
        <lineup-weekday legend divisions="${lib.MINUTE_DIVISIONS}"></lineup-weekday>
      </div>
    `;

    this.$week = this.shadowRoot.querySelector('.week');
    this.$json = this.shadowRoot.querySelector('.json');
    this.$copy = this.shadowRoot.querySelector('.copy');
    this.availability = [];

    for (let i = 0; i < lib.DAYS_PER_WEEK; i++) {
      const weekday = document.createElement('lineup-weekday');
      weekday.index = i;
      weekday.divisions = lib.MINUTE_DIVISIONS;

      if (i === lib.DAYS_PER_WEEK - 1) {
        weekday.lastday = true;
      }

      this.availability.push([]);
      this.$week.appendChild(weekday);
      weekday.addEventListener('updatedavailability', ({ detail }) => {
        this.availability[i] = detail;
        this.$json.value = JSON.stringify(this.availability);
        this.$copy.textContent = 'Copy JSON';
      });
    }

    this.$json.value = JSON.stringify(this.availability);
    this.$copy.addEventListener('click', () => {
      this.$json.select();
      this.$json.setSelectionRange(0, 99999);
      document.execCommand("copy");
      this.$copy.textContent = 'Copied!';
    });
  }
}

window.customElements.define('lineup-week', Week);