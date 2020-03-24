import css from './week.css';

const divisions = 30; // minutes
const DAYS_PER_WEEK = 7;

class Week extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style type="text/css">${css}</style>
      <div class="week">
        <lineup-weekday legend divisions="${divisions}"></lineup-weekday>
      </div>
    `;

    this.$week = this.shadowRoot.querySelector('.week');

    for (let i = 0; i < DAYS_PER_WEEK; i++) {
      const weekday = document.createElement('lineup-weekday');
      weekday.index = i;
      weekday.divisions = divisions;

      if (i === DAYS_PER_WEEK - 1) {
        weekday.lastday = true;
      }

      this.$week.appendChild(weekday);
    }
  }
}

window.customElements.define('lineup-week', Week);