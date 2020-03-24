import css from './week.css';

const divisions = 30; // minutes
const DAYS_PER_WEEK = 7;

class Week extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style type="text/css">${css}</style>
      <header class="header">
        <label>Lineup Availability JSON</label>
        <input type="text" class="json"/>
        <button class="copy">Copy JSON</button>
      </header>
      <div class="week">
        <lineup-weekday legend divisions="${divisions}"></lineup-weekday>
      </div>
    `;

    this.$week = this.shadowRoot.querySelector('.week');
    this.$json = this.shadowRoot.querySelector('.json');
    this.$copy = this.shadowRoot.querySelector('.copy');
    this.availability = [];

    for (let i = 0; i < DAYS_PER_WEEK; i++) {
      const weekday = document.createElement('lineup-weekday');
      weekday.index = i;
      weekday.divisions = divisions;

      if (i === DAYS_PER_WEEK - 1) {
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