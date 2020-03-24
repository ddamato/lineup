function e(e){const t=function(){const e=new Date;return e.setMilliseconds(0),e.setSeconds(0),e.setMinutes(0),e.setHours(0),e}();return t.setMinutes(e),t.toISOString()}var t={times:function(t){const i=[];for(let n=0;n<=1440;n+=t)i.push({startTime:e(n),endTime:e(n+t)});return i},parseTime:function(e){return e.replace(/.*T/,"")},DAYS_PER_WEEK:7,HOURS_PER_DAY:24,MINUTES_PER_HOUR:60,MINUTE_DIVISIONS:30};class i extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n      <style type="text/css"></style>\n      <ul class="availability"></ul>\n      <button class="add">Add availability</button>\n    ',this._week=function(e,t){const i=[];for(let s=0;s<e;s++){const e=n(t);i.push(e)}return i}(t.DAYS_PER_WEEK,t.MINUTE_DIVISIONS),this.$ul=this.shadowRoot.querySelector(".availability"),this.$button=this.shadowRoot.querySelector(".add"),this.$button.addEventListener("click",this._onClick.bind(this)),this._createAvailability()}_onClick(){this._createAvailability()}_createAvailability(){const e=document.createElement("li"),t=document.createElement("input");t.type="text",t.addEventListener("input",this._onInput.bind(this)),e.appendChild(t),this.$ul.appendChild(e)}_onInput(e){try{const i=JSON.parse(e.target.value);Array.isArray(i)&&(i.length,t.DAYS_PER_WEEK)}catch(e){}}}function n(e){return t.times(e).reduce((e,{startTime:i,endTime:n})=>{const s=`${t.parseTime(i)}-${t.parseTime(n)}`;return Object.assign(e,{[s]:[]})},{})}window.customElements.define("lineup-availability",i);class s extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`\n      <style type="text/css">:host {\n  --cellHeight: 24px;\n  --cellWidth: 160px;\n  --tableBorderColor: #241772;\n  --tableBackground: #000;\n  --focusedBorderColor: #fff;\n  --availableBackground: #168C34;\n  --tentativeBackground: #162D59;\n\n  box-sizing: border-box;\n  text-align: center;\n  display: block;\n  margin: 1rem 0;\n\n  background-color: var(--backgroundColor, #000);\n  color: var(--foregroundColor, #fff);\n}\n\n:host * {\n  box-sizing: border-box;\n}\n\n.header {\n  text-align: left;\n  display: flex;\n  padding: 1rem;\n  align-items: center;\n}\n\n.json {\n  all: initial;\n  color: inherit;\n  font: inherit;\n  font-family: monospace;\n  text-overflow: ellipsis;\n  border: 1px solid;\n  margin: 0 1rem;\n  padding: 1rem;\n  flex: 1;\n}\n\n.copy {\n  background-color: var(--tableBorderColor);\n  color: inherit;\n  border: 0;\n  align-self: stretch;\n  padding: 0 1rem;\n}\n\n.days {\n  display: flex;\n  position: sticky;\n  top: 0;\n  background-color: var(--tableBackground);\n}\n\n.timezone, .th {\n  display: block;\n  width: var(--cellWidth);\n  flex: 1 0 auto;\n  text-align: center;\n}\n\n.week {\n  display: inline-flex;\n  padding: 1rem;\n  border: 1px solid var(--tableBorderColor);\n}\n\n.week > :first-child {\n  position: sticky;\n  left: 0;\n  z-index: 1;\n}</style>\n      <header class="header">\n        <label>Lineup Availability JSON</label>\n        <textarea class="json" readonly></textarea>\n        <button class="copy">Copy JSON</button>\n      </header>\n      <div class="week">\n        <lineup-weekday legend divisions="${t.MINUTE_DIVISIONS}"></lineup-weekday>\n      </div>\n    `,this.$week=this.shadowRoot.querySelector(".week"),this.$json=this.shadowRoot.querySelector(".json"),this.$copy=this.shadowRoot.querySelector(".copy"),this.availability=[];for(let e=0;e<t.DAYS_PER_WEEK;e++){const i=document.createElement("lineup-weekday");i.index=e,i.divisions=t.MINUTE_DIVISIONS,e===t.DAYS_PER_WEEK-1&&(i.lastday=!0),this.availability.push([]),this.$week.appendChild(i),i.addEventListener("updatedavailability",({detail:t})=>{this.availability[e]=t,this.$json.value=JSON.stringify(this.availability),this.$copy.textContent="Copy JSON"})}this.$json.value=JSON.stringify(this.availability),this.$copy.addEventListener("click",()=>{this.$json.select(),this.$json.setSelectionRange(0,99999),document.execCommand("copy"),this.$copy.textContent="Copied!"})}}window.customElements.define("lineup-week",s);class a extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n      <style type="text/css">:host {\n  display: block;\n  box-sizing: border-box;\n}\n\n:host * {\n  box-sizing: border-box;\n}\n\n:host([lastday]) .cell:not(:last-child) {\n  border-right: 1px solid var(--tableBorderColor);\n}\n\n:host([legend]) .cell:before {\n  display: block;\n  background-color: var(--tableBackground);\n  padding: 0 1rem;\n  transform: translateY(-50%);\n}\n\n\n:host([legend]) .cell:before {\n  content: attr(data-start);\n}\n\n.weekday {\n  position: relative;\n}\n\n.heading {\n  text-align: center;\n  position: sticky;\n  top: 0;\n  background-color: var(--tableBackground);\n  z-index: 2;\n  padding: 1rem 0;\n}\n\n.times {\n  padding: var(--cellHeight) 0 0;\n  width: var(--cellWidth);\n}\n\n.cell {\n  height: var(--cellHeight);\n  border-top: 1px solid var(--tableBorderColor);\n  border-left: 1px solid var(--tableBorderColor);\n  display: flex;\n  justify-content: center;\n}\n\n.cell:last-child {\n  border-left: none;\n  pointer-events: none;\n}\n\n.availability {\n  display: contents;\n}\n\n.available {\n  position: absolute;\n  background-color: var(--availableBackground);\n  border: 2px solid transparent;\n  border-radius: 4px;\n  width: 100%;\n  left: 0;\n  display: flex;\n  font-size: .7em;\n  padding: 5px;\n  line-height: 1;\n  z-index: 1;\n  opacity: .8;\n}\n\n.available.tentative {\n  background-color: var(--tentativeBackground);\n}\n\n.available.tentative:after {\n  content: "tenative";\n  margin-top: auto;\n  margin-left: auto;\n}\n\n.available[data-start][data-end]:before {\n  content: attr(data-start) "-" attr(data-end);\n  display: block;\n  text-align: left;\n  flex-shrink: 0;\n}\n\n.available:focus {\n  border: 2px solid var(--focusedBorderColor);\n  outline: 0;\n}</style>\n      <div class="weekday">\n        <div class="heading"></div>\n        <div class="times"></div>\n      </div>\n    ',this.$heading=this.shadowRoot.querySelector(".heading"),this.$weekday=this.shadowRoot.querySelector(".weekday"),this.$times=this.shadowRoot.querySelector(".times"),this.legend||(this._addAvailability(),this._addListeners())}_setHeading(){this.$heading.textContent=this.legend?function(){const e=new Date,t=e.toLocaleDateString(void 0),i=e.toLocaleDateString(void 0,{timeZoneName:"long"}),n=i.indexOf(t);if(n>=0)return i.substring(0,n)+i.substring(n+t.length).replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g,"");return i}():this.name}_addAvailability(){this.$availability||(this.$availability=document.createElement("div"),this.$availability.classList.add("availability"),this.$weekday.appendChild(this.$availability))}_removeAvailability(){this.$availability&&(this.$availability.remove(),this.$availability=null)}_addListeners(){this._listeners={mousedown:this._onMousedown.bind(this),mousemove:this._onMousemove.bind(this),mouseup:this._onMouseup.bind(this),mouseleave:this._onMouseup.bind(this)},this.$weekday.addEventListener("mousedown",this._listeners.mousedown),window.addEventListener("keydown",this._onKeydown.bind(this))}_removeListeners(){this._listeners&&(Object.keys(this._listeners).forEach(e=>{this.$weekday.removeEventListener(e,this._listeners[e])}),this._listeners=null)}connectedCallback(){return this._setHeading(),this._times=t.times(this.divisions),this._availability=[],this._renderTimes()}_onKeydown(e){if(!this.legend){if("Space"===e.code){e.preventDefault();const t=this.shadowRoot.activeElement;if(t){const e=Number(t.dataset.id);return this._availability[e].tentative=!this._availability[e].tentative,this._renderAvailability()}}if("Backspace"===e.code||"Delete"===e.code){e.preventDefault();const t=this.shadowRoot.activeElement;if(t){const e=Number(t.dataset.id);return this._availability.splice(e,1),this._renderAvailability()}}}}_onMousedown(e){e.preventDefault(),this.$weekday.addEventListener("mousemove",this._listeners.mousemove),this.$weekday.addEventListener("mouseleave",this._listeners.mouseleave),this.$weekday.addEventListener("mouseup",this._listeners.mouseup),this.startY=e.pageY;const t=Number(e.target.dataset.id);if(e.target.classList.contains("cell")){const{startTime:e,endTime:i}=this._times[t];return this._focusedAvailability={startTime:e,endTime:i,tentative:!1},this._availability.push(this._focusedAvailability),this._renderAvailability()}if(e.target.classList.contains("available"))return this._focusedAvailability=this._availability[t],this._renderAvailability()}_onMousemove(e){if(!this._focusedAvailability)return;const t=Number(e.target.dataset.id),i=e.pageY-this.startY<0?"startTime":"endTime";if(e.target.classList.contains("cell")){const e=this._times[t];return this._focusedAvailability[i]=e[i],this._renderAvailability()}if(e.target.classList.contains("available")){const e=this._availability[t];if(e!==this._focusedAvailability)return this._availability.splice(t,1),this._focusedAvailability[i]=e[i],this._renderAvailability()}}_onMouseup(e){this.$weekday.removeEventListener("mousemove",this._listeners.mousemove),this.$weekday.removeEventListener("mouseleave",this._listeners.mouseleave),this.$weekday.removeEventListener("mouseup",this._listeners.mouseup),this._focusedAvailability=null}_renderTimes(){this.$times.innerHTML="",this._times&&this._times.forEach((e,t)=>{const{startTime:i,endTime:n}=e,s=document.createElement("div");s.dataset.start=this.legend?l(i):i,s.dataset.end=this.legend?l(n):n,s.dataset.id=t,s.classList.add("cell"),this.$times.appendChild(s)}),this._scrollToTime()}_renderAvailability(){this.$availability.innerHTML="",this._availability.forEach((e,t)=>{const i=o(this._times,e,"startTime"),n=o(this._times,e,"endTime"),s=this.$times.children[i],a=this.$times.children[n];if(s&&a){const{startTime:i,endTime:n,tentative:o}=e,r=document.createElement("span"),d=a.offsetTop-s.offsetTop+a.offsetHeight;r.style.top=`${s.offsetTop}px`,r.style.height=`${d}px`,r.dataset.start=l(i),r.dataset.end=l(n),r.dataset.id=t,r.tabIndex=0,r.classList.add("available"),r.classList.toggle("tentative",o),r.title="Space: toggle tentative. Delete: remove availability",this.$availability.appendChild(r),this._focusedAvailability===e&&r.focus()}}),this.dispatchEvent(new CustomEvent("updatedavailability",{detail:this.availability}))}_scrollToTime(){if(this.legend){const e={startTime:(new Date).toISOString()},t=o(this._times,e,"startTime"),i=this.$times.children[t];i&&i.scrollIntoView({behavior:"smooth"})}}attributeChangedCallback(e,t,i){"index"===e&&this._setHeading(),"legend"===e&&(this.legend&&!this._listeners?(this._addAvailability(),this._addListeners()):(this._removeAvailability(),this._removeListeners()))}get name(){return function(e){const t=new Date;return t.setDate(t.getDate()-t.getDay()+e),t.toLocaleString(window.navigator.language||"en-us",{weekday:"long"})}(this.index)}get lastday(){return this.hasAttribute("lastday")}set lastday(e){e?this.setAttribute("lastday",""):this.removeAttribute("lastday")}get index(){return this.legend?-1:Number(this.getAttribute("index"))}set index(e){this.setAttribute("index",e)}get divisions(){return Number(this.getAttribute("divisions"))||t.MINUTE_DIVISIONS}set divisions(e){this.setAttribute("divisions",e),this._renderTimes()}get availability(){return this.legend?[]:this._availability.slice().map(({startTime:e,endTime:i,tentative:n})=>({startTime:t.parseTime(e),endTime:t.parseTime(i),tentative:n}))}get legend(){return this.hasAttribute("legend")}set legend(e){e?this.setAttribute("legend",""):this.removeAttribute("legend")}clearAvailability(){this.legend||(this._availability=[],this._renderAvailability())}}function l(e){return new Date(e).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function o(e,t,i){const n=new Date(t[i]),s=e.reduce((e,t)=>{const s=Math.abs(new Date(e[i])-n);return Math.abs(new Date(t[i])-n)<s?t:e});return e.findIndex(e=>e[i]===s[i])}window.customElements.define("lineup-weekday",a);
