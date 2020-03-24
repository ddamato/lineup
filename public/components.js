class e extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n      <style type="text/css">:host {\n  --cellHeight: 24px;\n  --cellWidth: 160px;\n  --tableBorderColor: #241772;\n  --tableBackground: #000;\n  --focusedBorderColor: #fff;\n  --availableBackground: #2A898F;\n  --tentativeBackground: #4A5A73;\n\n  box-sizing: border-box;\n  text-align: center;\n  display: block;\n  margin: 1rem 0;\n}\n\n:host * {\n  box-sizing: border-box;\n}\n\n.days {\n  display: flex;\n  position: sticky;\n  top: 0;\n  background-color: var(--tableBackground);\n}\n\n.timezone, .th {\n  display: block;\n  width: var(--cellWidth);\n  flex: 1 0 auto;\n  text-align: center;\n}\n\n.week {\n  display: inline-flex;\n  padding: 1rem;\n  border: 1px solid var(--tableBorderColor);\n}\n</style>\n      <div class="week">\n        <lineup-weekday legend divisions="30"></lineup-weekday>\n      </div>\n    ',this.$week=this.shadowRoot.querySelector(".week");for(let e=0;e<7;e++){const t=document.createElement("lineup-weekday");t.index=e,t.divisions=30,6===e&&(t.lastday=!0),this.$week.appendChild(t)}}}window.customElements.define("lineup-week",e);class t extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML='\n      <style type="text/css">:host {\n  display: block;\n  box-sizing: border-box;\n}\n\n:host * {\n  box-sizing: border-box;\n}\n\n:host([lastday]) .cell:not(:last-child) {\n  border-right: 1px solid var(--tableBorderColor);\n}\n\n:host([legend]) .cell:before {\n  display: block;\n  background-color: var(--tableBackground);\n  padding: 0 1rem;\n  transform: translateY(-50%);\n}\n\n\n:host([legend]) .cell:before {\n  content: attr(data-start);\n}\n\n.weekday {\n  position: relative;\n}\n\n.heading {\n  text-align: center;\n  position: sticky;\n  top: 0;\n  background-color: var(--tableBackground);\n  z-index: 1;\n  padding: 1rem 0;\n}\n\n.times {\n  padding: var(--cellHeight) 0 0;\n  width: var(--cellWidth);\n}\n\n.cell {\n  height: var(--cellHeight);\n  border-top: 1px solid var(--tableBorderColor);\n  border-left: 1px solid var(--tableBorderColor);\n  display: flex;\n  justify-content: center;\n}\n\n.cell:last-child {\n  border-left: none;\n  pointer-events: none;\n}\n\n.availability {\n  display: contents;\n}\n\n.available {\n  position: absolute;\n  background-color: var(--availableBackground);\n  border: 2px solid transparent;\n  border-radius: 4px;\n  width: 100%;\n  left: 0;\n}\n\n.available[data-start][data-end]:before {\n  content: attr(data-start) "-" attr(data-end);\n  display: block;\n  font-size: .7em;\n  text-align: left;\n  padding: 2px 6px;\n}\n\n.available.focused {\n  border: 2px solid var(--focusedBorderColor);\n}</style>\n      <div class="weekday">\n        <div class="heading"></div>\n        <div class="times"></div>\n      </div>\n    ',this.$heading=this.shadowRoot.querySelector(".heading"),this.$weekday=this.shadowRoot.querySelector(".weekday"),this.$times=this.shadowRoot.querySelector(".times"),this.legend||(this._addAvailability(),this._addListeners())}_setHeading(){this.$heading.textContent=this.legend?function(){const e=new Date,t=e.toLocaleDateString(void 0),i=e.toLocaleDateString(void 0,{timeZoneName:"long"}),s=i.indexOf(t);if(s>=0)return i.substring(0,s)+i.substring(s+t.length).replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g,"");return i}():this.name}_addAvailability(){this.$availability||(this.$availability=document.createElement("div"),this.$availability.classList.add("availability"),this.$weekday.appendChild(this.$availability))}_removeAvailability(){this.$availability&&(this.$availability.remove(),this.$availability=null)}_addListeners(){this._listeners={mousedown:this._onMousedown.bind(this),mousemove:this._onMousemove.bind(this),mouseup:this._onMouseup.bind(this),mouseleave:this._onMouseup.bind(this)},this.$weekday.addEventListener("mousedown",this._listeners.mousedown)}_removeListeners(){this._listeners&&(Object.keys(this._listeners).forEach(e=>{this.$weekday.removeEventListener(e,this._listeners[e])}),this._listeners=null)}connectedCallback(){this._setHeading(),this._times=[],this._availability=[];for(let e=0;e<=1440;e+=this.divisions)this._times.push({startTime:i(e),endTime:i(e+this.divisions)});return this._renderTimes()}_onMousedown(e){this._focusedAvailability&&(this._focusedAvailability.focused=!1,this._focusedAvailability=null),this.$weekday.addEventListener("mousemove",this._listeners.mousemove),this.$weekday.addEventListener("mouseleave",this._listeners.mouseleave),this.$weekday.addEventListener("mouseup",this._listeners.mouseup),this.startY=e.pageY;const t=Number(e.target.dataset.id);if(e.target.classList.contains("cell")){const{startTime:e,endTime:i}=this._times[t];return this._focusedAvailability={startTime:e,endTime:i,tentative:!1,focused:!0},this._availability.push(this._focusedAvailability),this._renderAvailability()}e.target.classList.contains("availability")&&(this._focusedAvailability=this._availability[t])}_onMousemove(e){if(!this._focusedAvailability)return;const t=Number(e.target.dataset.id),i=e.pageY-this.startY<0?"startTime":"endTime";if(e.target.classList.contains("cell")){const e=this._times[t];return this._focusedAvailability[i]=e[i],this._renderAvailability()}if(e.target.classList.contains("available")){const e=this._availability[t];if(e!==this._focusedAvailability)return this._availability.splice(t,1),this._focusedAvailability[i]=e[i],this._renderAvailability()}}_onMouseup(e){this.$weekday.removeEventListener("mousemove",this._listeners.mousemove),this.$weekday.removeEventListener("mouseleave",this._listeners.mouseleave),this.$weekday.removeEventListener("mouseup",this._listeners.mouseup)}_renderTimes(){this.$times.innerHTML="",this._times&&this._times.forEach((e,t)=>{const{startTime:i,endTime:n}=e,a=document.createElement("div");a.dataset.start=this.legend?s(i):i,a.dataset.end=this.legend?s(n):n,a.dataset.id=t,a.classList.add("cell"),this.$times.appendChild(a)}),this._scrollToTime()}_renderAvailability(){this.$availability.innerHTML="",this._availability.forEach((e,t)=>{const i=n(this._times,e,"startTime"),a=n(this._times,e,"endTime"),l=this.$times.children[i],o=this.$times.children[a];if(l&&o){const{startTime:i,endTime:n,tentative:a,focused:r}=e,d=document.createElement("span"),h=o.offsetTop-l.offsetTop+o.offsetHeight;d.style.top=`${l.offsetTop}px`,d.style.height=`${h}px`,d.dataset.start=s(i),d.dataset.end=s(n),d.dataset.id=t,d.classList.add("available"),d.classList.toggle("tentative",a),d.classList.toggle("focused",r),this.$availability.appendChild(d)}})}_scrollToTime(){if(this.legend){const e={startTime:(new Date).toISOString()},t=n(this._times,e,"startTime"),i=this.$times.children[t];i&&i.scrollIntoView({behavior:"smooth"})}}attributeChangedCallback(e,t,i){"index"===e&&this._setHeading(),"legend"===e&&(this.legend&&!this._listeners?(this._addAvailability(),this._addListeners()):(this._removeAvailability(),this._removeListeners()))}get name(){return function(e){const t=new Date;return t.setDate(t.getDate()-t.getDay()+e),t.toLocaleString(window.navigator.language||"en-us",{weekday:"long"})}(this.index)}get lastday(){return this.hasAttribute("lastday")}set lastday(e){e?this.setAttribute("lastday",""):this.removeAttribute("lastday")}get index(){return Number(this.getAttribute("index"))}set index(e){this.setAttribute("index",e)}get divisions(){return Number(this.getAttribute("divisions"))}set divisions(e){this.setAttribute("divisions",e),this._renderTimes()}get availability(){return this.legend?[]:this._availability.slice()}set availability(e){this.legend||(this._availability=[...new Set(this._availability.concat(e))],this._renderAvailability())}get legend(){return this.hasAttribute("legend")}set legend(e){e?this.setAttribute("legend",""):this.removeAttribute("legend")}}function i(e){const t=function(){const e=new Date;return e.setMilliseconds(0),e.setSeconds(0),e.setMinutes(0),e.setHours(0),e}();return t.setMinutes(e),t.toISOString()}function s(e){return new Date(e).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function n(e,t,i){const s=new Date(t[i]),n=e.reduce((e,t)=>{const n=Math.abs(new Date(e[i])-s);return Math.abs(new Date(t[i])-s)<n?t:e});return e.findIndex(e=>e[i]===n[i])}window.customElements.define("lineup-weekday",t);