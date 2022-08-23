import{B as ut,c as Gt,t as on,a as jt,b as q,d as At,e as F,s as Tr,j as Or,l as Pr}from"./utils.05904ff8.js";const Fr=`<style>\r
  .root {\r
    display: flex;\r
    flex-direction: column;\r
    align-items: center;\r
    width: 80vw;\r
  }\r
\r
  .step-contents {\r
    width: 100%;\r
    margin-top: 10px;\r
  }\r
\r
  .buttons {\r
    width: 100%;\r
    margin-top: 5px;\r
  }\r
\r
  .issue-container {\r
    flex: 0.33;\r
    overflow: hidden;\r
    margin-top: 5px;\r
    box-sizing: border-box;\r
    border: 1px solid #ccc;\r
    padding: 5px;\r
    overflow-y: auto;\r
    display: none;\r
    background-color: lightcyan;\r
  }\r
\r
  .validate-success {\r
    color: green;\r
    text-align: center;\r
    display: none;\r
  }\r
\r
  .validate-container {\r
    font-size: 25px;\r
  }\r
\r
  .validate-progress {\r
    display: flex;\r
    flex-direction: row;\r
    justify-content: center;\r
    height: 40px;\r
  }\r
\r
  .validate-progress .validate-label {\r
    align-self: center;\r
    margin-left: 10px;\r
  }\r
\r
  .validate-progress fluent-progress-ring {\r
    align-self: center;\r
  }\r
  .issue-display::part(main) {\r
    height: 100%;\r
    text-align: left;\r
    width: 100%;\r
  }\r
\r
  .issue-container {\r
    width: 100%;\r
    margin-top: 5px;\r
  }\r
\r
</style>\r
<div class="root" part="main">\r
  <div class="name" part="name">\r
    <slot name="name"></slot>\r
  </div>\r
  <div class="buttons buttons-top" part="buttons-top">\r
    <slot name="buttons-top"></slot>\r
  </div>\r
  <div class="validate-container">\r
    <div class="validate-progress" name="progress" style="display: none">\r
      <fluent-progress-ring></fluent-progress-ring>\r
      <span class="validate-label">...Validating</span>\r
    </div>\r
    <div class="validate-success" part="validate-success" style="display: none">\r
      <slot name="success"> \u{1F44D}Looks Good! </slot>\r
    </div>\r
  </div>\r
  <div class="step-contents" part="contents">\r
    <slot></slot>\r
  </div>\r
  <div class="issue-container" part="issues">\r
    <code-issue-display class="issue-display"></code-issue-display>\r
  </div>\r
  <div class="buttons buttons-bottom" part="buttons-bottom">\r
    <slot name="buttons-bottom"></slot>\r
  </div>\r
</div>\r
`;class Ir extends ut{static get observedAttributes(){return["style","name","step-issues","validating","valid"]}constructor(){super(Fr)}#t=null;#n=null;#e=null;#o=null;#r=null;#i=!1;#s=[];#a=!0;#c=null;get#l(){return this.#c||(this.#c=this.templateRoot.querySelector(".root")),this.#c}attributeChangedCallback(s,d,f){s==="step-issues"&&(this.#s=JSON.parse(this.getAttribute("step-issues")||"[]")),this.#u(s,f??"")}connectedCallback(){this.#t=this.#l.querySelector(".name"),this.#n=this.#l.querySelector(".validate-success"),this.#o=this.#l.querySelector(".validate-progress"),this.#e=this.#l.querySelector(".issue-container"),this.#r=this.#l.querySelector(".issue-display"),this.#i=!0,this.#u(),this.#a=!1}disconnectedCallback(){this.#i=!1}#u(s=null,d){if(this.#i){if(this.#d("style",s)&&(this.#l.style.cssText=d??this.getAttribute("style")??""),this.#d("name",s)&&(this.#t.innerHTML=d??this.getAttribute("name")??""),this.#d("validating",s)){const m=this.hasAttribute("validating");this.#o.style.display=m?"":"none"}this.#d("step-issues",s)&&this.#r.setAttribute("issues",JSON.stringify(this.#s));const f=this.#s.length>0;this.#e.style.display=f?"block":"none",this.#n.style.display=this.hasAttribute("valid")?"block":"none"}}#d(s,d){return this.#a||!d||d===s}}customElements.define("step-container",Ir);const Mr=`<style>
	.contents slot::slotted(*[step]) {
		display: none;
	}
	.contents slot::slotted(.active-step) {
		display: unset;
	}
	
	.buttons {
		margin-top: 10px;
	}
</style>
<div class="root" part="main">
	<div class="header" part="header">
		<slot name="header"></slot>
	</div>
	<div class="buttons buttons-top" part="buttons-top">
	  <slot name="buttons-top">
		<fluent-button part="next_button" class="next-button" appearance="accent">Next</fluent-button>
	  </slot>
	</div>
	<div class="contents" part="contents">
		<slot></slot>
	</div>
	<div class="buttons buttons-bottom" part="buttons-bottom">
	  <slot name="buttons-bottom"></slot>
	</div>
</div>
`;class Nr extends ut{static get observedAttributes(){return["style","class","step","max-step"]}#t=null;#n=null;#e=null;#o=null;#r=null;#i=null;#s=null;constructor(){super(Mr)}get step(){return this.#e}set step(s){this.setAttribute("step",`${s??""}`)}get maxStep(){return this.#o??0}set maxStep(s){if(s>0&&s!==this.maxStep)this.setAttribute("max-step",`${s??"0"}`);else throw new Error("max-step must be an integer greater than 0")}attributeChangedCallback(s,d,f){s==="style"?this.#u().style.cssText=f??"":s==="step"?(this.#e=f?parseInt(f,10):null,this.dispatchEvent(new CustomEvent("stepChanged",{detail:{step:this.#e??0}}))):s==="max-step"&&(this.#o=f?+f:0),this.#a()}connectedCallback(){this.#r=this.#u().querySelector(".contents slot"),this.#s=this.#u().querySelector(".header slot"),this.#i=this.#u().querySelector(".buttons slot"),this.#n=this.#u().querySelector(".next-button"),this.#n?.addEventListener("click",()=>this.step=(this.step??0)+1),this.#r?.addEventListener("slotchange",()=>this.#a()),this.#s?.addEventListener("slotchange",()=>this.#a()),this.#i?.addEventListener("slotchange",()=>this.#a()),this.#a()}#a(){const s=`${this.#e??"none"}`;if(this.#r&&this.#c(this.#r,s),this.#s&&this.#c(this.#s,s),this.#i&&this.#c(this.#i,s),this.#n){const d=(this.step??0)<this.maxStep;this.#n.toggleAttribute("disabled",!d),this.#n.part.toggle("disabled",!d)}}#c(s,d){const f=this.#l(s.assignedElements());for(const m of f){const y=m.getAttribute("step")===d;m.classList.toggle("active-step",y)}}#l(s){const d=[];return s.forEach(f=>{f instanceof HTMLElement&&((f.getAttribute("step")??f.getAttribute("data-step"))&&d.push(f),f.querySelectorAll("[step]").forEach(y=>{y instanceof HTMLElement&&(y.getAttribute("step")??y.getAttribute("data-step"))&&d.push(y)}))}),d}#u(){return this.#t||(this.#t=this.templateRoot.querySelector(".root")),this.#t}}customElements.define("step-controller",Nr);var Rr={};(function(){var c;function s(t){var e=0;return function(){return e<t.length?{done:!1,value:t[e++]}:{done:!0}}}var d=typeof Object.defineProperties=="function"?Object.defineProperty:function(t,e,n){return t==Array.prototype||t==Object.prototype||(t[e]=n.value),t};function f(t){t=[typeof globalThis=="object"&&globalThis,t,typeof window=="object"&&window,typeof self=="object"&&self,typeof Gt=="object"&&Gt];for(var e=0;e<t.length;++e){var n=t[e];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}var m=f(this);function y(t,e){if(e)t:{var n=m;t=t.split(".");for(var r=0;r<t.length-1;r++){var i=t[r];if(!(i in n))break t;n=n[i]}t=t[t.length-1],r=n[t],e=e(r),e!=r&&e!=null&&d(n,t,{configurable:!0,writable:!0,value:e})}}y("Symbol",function(t){function e(a){if(this instanceof e)throw new TypeError("Symbol is not a constructor");return new n(r+(a||"")+"_"+i++,a)}function n(a,o){this.g=a,d(this,"description",{configurable:!0,writable:!0,value:o})}if(t)return t;n.prototype.toString=function(){return this.g};var r="jscomp_symbol_"+(1e9*Math.random()>>>0)+"_",i=0;return e}),y("Symbol.iterator",function(t){if(t)return t;t=Symbol("Symbol.iterator");for(var e="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),n=0;n<e.length;n++){var r=m[e[n]];typeof r=="function"&&typeof r.prototype[t]!="function"&&d(r.prototype,t,{configurable:!0,writable:!0,value:function(){return j(s(this))}})}return t});function j(t){return t={next:t},t[Symbol.iterator]=function(){return this},t}function A(t){var e=typeof Symbol<"u"&&Symbol.iterator&&t[Symbol.iterator];return e?e.call(t):{next:s(t)}}function Zt(t){if(!(t instanceof Array)){t=A(t);for(var e,n=[];!(e=t.next()).done;)n.push(e.value);t=n}return t}var kn=typeof Object.create=="function"?Object.create:function(t){function e(){}return e.prototype=t,new e},Ot;if(typeof Object.setPrototypeOf=="function")Ot=Object.setPrototypeOf;else{var Pt;t:{var $n={a:!0},Qt={};try{Qt.__proto__=$n,Pt=Qt.a;break t}catch{}Pt=!1}Ot=Pt?function(t,e){if(t.__proto__=e,t.__proto__!==e)throw new TypeError(t+" is not extensible");return t}:null}var te=Ot;function G(t,e){if(t.prototype=kn(e.prototype),t.prototype.constructor=t,te)te(t,e);else for(var n in e)if(n!="prototype")if(Object.defineProperties){var r=Object.getOwnPropertyDescriptor(e,n);r&&Object.defineProperty(t,n,r)}else t[n]=e[n];t.ra=e.prototype}function Ft(){this.l=!1,this.i=null,this.h=void 0,this.g=1,this.u=this.o=0,this.j=null}function It(t){if(t.l)throw new TypeError("Generator is already running");t.l=!0}Ft.prototype.s=function(t){this.h=t};function Mt(t,e){t.j={fa:e,ga:!0},t.g=t.o||t.u}Ft.prototype.return=function(t){this.j={return:t},this.g=this.u};function E(t,e,n){return t.g=n,{value:e}}function Bn(t){this.g=new Ft,this.h=t}function Un(t,e){It(t.g);var n=t.g.i;return n?Nt(t,"return"in n?n.return:function(r){return{value:r,done:!0}},e,t.g.return):(t.g.return(e),K(t))}function Nt(t,e,n,r){try{var i=e.call(t.g.i,n);if(!(i instanceof Object))throw new TypeError("Iterator result "+i+" is not an object");if(!i.done)return t.g.l=!1,i;var a=i.value}catch(o){return t.g.i=null,Mt(t.g,o),K(t)}return t.g.i=null,r.call(t.g,a),K(t)}function K(t){for(;t.g.g;)try{var e=t.h(t.g);if(e)return t.g.l=!1,{value:e.value,done:!1}}catch(n){t.g.h=void 0,Mt(t.g,n)}if(t.g.l=!1,t.g.j){if(e=t.g.j,t.g.j=null,e.ga)throw e.fa;return{value:e.return,done:!0}}return{value:void 0,done:!0}}function zn(t){this.next=function(e){return It(t.g),t.g.i?e=Nt(t,t.g.i.next,e,t.g.s):(t.g.s(e),e=K(t)),e},this.throw=function(e){return It(t.g),t.g.i?e=Nt(t,t.g.i.throw,e,t.g.s):(Mt(t.g,e),e=K(t)),e},this.return=function(e){return Un(t,e)},this[Symbol.iterator]=function(){return this}}function Dn(t){function e(r){return t.next(r)}function n(r){return t.throw(r)}return new Promise(function(r,i){function a(o){o.done?r(o.value):Promise.resolve(o.value).then(e,n).then(a,i)}a(t.next())})}function I(t){return Dn(new zn(new Bn(t)))}y("Promise",function(t){function e(o){this.h=0,this.i=void 0,this.g=[],this.s=!1;var l=this.j();try{o(l.resolve,l.reject)}catch(u){l.reject(u)}}function n(){this.g=null}function r(o){return o instanceof e?o:new e(function(l){l(o)})}if(t)return t;n.prototype.h=function(o){if(this.g==null){this.g=[];var l=this;this.i(function(){l.l()})}this.g.push(o)};var i=m.setTimeout;n.prototype.i=function(o){i(o,0)},n.prototype.l=function(){for(;this.g&&this.g.length;){var o=this.g;this.g=[];for(var l=0;l<o.length;++l){var u=o[l];o[l]=null;try{u()}catch(h){this.j(h)}}}this.g=null},n.prototype.j=function(o){this.i(function(){throw o})},e.prototype.j=function(){function o(h){return function(p){u||(u=!0,h.call(l,p))}}var l=this,u=!1;return{resolve:o(this.D),reject:o(this.l)}},e.prototype.D=function(o){if(o===this)this.l(new TypeError("A Promise cannot resolve to itself"));else if(o instanceof e)this.H(o);else{t:switch(typeof o){case"object":var l=o!=null;break t;case"function":l=!0;break t;default:l=!1}l?this.A(o):this.o(o)}},e.prototype.A=function(o){var l=void 0;try{l=o.then}catch(u){this.l(u);return}typeof l=="function"?this.I(l,o):this.o(o)},e.prototype.l=function(o){this.u(2,o)},e.prototype.o=function(o){this.u(1,o)},e.prototype.u=function(o,l){if(this.h!=0)throw Error("Cannot settle("+o+", "+l+"): Promise already settled in state"+this.h);this.h=o,this.i=l,this.h===2&&this.G(),this.B()},e.prototype.G=function(){var o=this;i(function(){if(o.C()){var l=m.console;typeof l<"u"&&l.error(o.i)}},1)},e.prototype.C=function(){if(this.s)return!1;var o=m.CustomEvent,l=m.Event,u=m.dispatchEvent;return typeof u>"u"?!0:(typeof o=="function"?o=new o("unhandledrejection",{cancelable:!0}):typeof l=="function"?o=new l("unhandledrejection",{cancelable:!0}):(o=m.document.createEvent("CustomEvent"),o.initCustomEvent("unhandledrejection",!1,!0,o)),o.promise=this,o.reason=this.i,u(o))},e.prototype.B=function(){if(this.g!=null){for(var o=0;o<this.g.length;++o)a.h(this.g[o]);this.g=null}};var a=new n;return e.prototype.H=function(o){var l=this.j();o.M(l.resolve,l.reject)},e.prototype.I=function(o,l){var u=this.j();try{o.call(l,u.resolve,u.reject)}catch(h){u.reject(h)}},e.prototype.then=function(o,l){function u(v,g){return typeof v=="function"?function(b){try{h(v(b))}catch(S){p(S)}}:g}var h,p,w=new e(function(v,g){h=v,p=g});return this.M(u(o,h),u(l,p)),w},e.prototype.catch=function(o){return this.then(void 0,o)},e.prototype.M=function(o,l){function u(){switch(h.h){case 1:o(h.i);break;case 2:l(h.i);break;default:throw Error("Unexpected state: "+h.h)}}var h=this;this.g==null?a.h(u):this.g.push(u),this.s=!0},e.resolve=r,e.reject=function(o){return new e(function(l,u){u(o)})},e.race=function(o){return new e(function(l,u){for(var h=A(o),p=h.next();!p.done;p=h.next())r(p.value).M(l,u)})},e.all=function(o){var l=A(o),u=l.next();return u.done?r([]):new e(function(h,p){function w(b){return function(S){v[b]=S,g--,g==0&&h(v)}}var v=[],g=0;do v.push(void 0),g++,r(u.value).M(w(v.length-1),p),u=l.next();while(!u.done)})},e});function Jn(t,e){t instanceof String&&(t+="");var n=0,r=!1,i={next:function(){if(!r&&n<t.length){var a=n++;return{value:e(a,t[a]),done:!1}}return r=!0,{done:!0,value:void 0}}};return i[Symbol.iterator]=function(){return i},i}var Vn=typeof Object.assign=="function"?Object.assign:function(t,e){for(var n=1;n<arguments.length;n++){var r=arguments[n];if(r)for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t};y("Object.assign",function(t){return t||Vn}),y("Object.is",function(t){return t||function(e,n){return e===n?e!==0||1/e===1/n:e!==e&&n!==n}}),y("Array.prototype.includes",function(t){return t||function(e,n){var r=this;r instanceof String&&(r=String(r));var i=r.length;for(n=n||0,0>n&&(n=Math.max(n+i,0));n<i;n++){var a=r[n];if(a===e||Object.is(a,e))return!0}return!1}}),y("String.prototype.includes",function(t){return t||function(e,n){if(this==null)throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");if(e instanceof RegExp)throw new TypeError("First argument to String.prototype.includes must not be a regular expression");return this.indexOf(e,n||0)!==-1}}),y("Array.prototype.keys",function(t){return t||function(){return Jn(this,function(e){return e})}});var Gn=this||self;function Z(t,e){t=t.split(".");var n=Gn;t[0]in n||typeof n.execScript>"u"||n.execScript("var "+t[0]);for(var r;t.length&&(r=t.shift());)t.length||e===void 0?n[r]&&n[r]!==Object.prototype[r]?n=n[r]:n=n[r]={}:n[r]=e}function H(){throw Error("Invalid UTF8")}function ee(t,e){return e=String.fromCharCode.apply(null,e),t==null?e:t+e}var ne,Hn=typeof TextDecoder<"u",re,Wn=typeof TextEncoder<"u",ie={},Q=null;function oe(t){var e;e===void 0&&(e=0),ae(),e=ie[e];for(var n=Array(Math.floor(t.length/3)),r=e[64]||"",i=0,a=0;i<t.length-2;i+=3){var o=t[i],l=t[i+1],u=t[i+2],h=e[o>>2];o=e[(o&3)<<4|l>>4],l=e[(l&15)<<2|u>>6],u=e[u&63],n[a++]=h+o+l+u}switch(h=0,u=r,t.length-i){case 2:h=t[i+1],u=e[(h&15)<<2]||r;case 1:t=t[i],n[a]=e[t>>2]+e[(t&3)<<4|h>>4]+u+r}return n.join("")}function se(t){var e=t.length,n=3*e/4;n%3?n=Math.floor(n):"=.".indexOf(t[e-1])!=-1&&(n="=.".indexOf(t[e-2])!=-1?n-2:n-1);var r=new Uint8Array(n),i=0;return qn(t,function(a){r[i++]=a}),i!==n?r.subarray(0,i):r}function qn(t,e){function n(u){for(;r<t.length;){var h=t.charAt(r++),p=Q[h];if(p!=null)return p;if(!/^[\s\xa0]*$/.test(h))throw Error("Unknown base64 encoding at char: "+h)}return u}ae();for(var r=0;;){var i=n(-1),a=n(0),o=n(64),l=n(64);if(l===64&&i===-1)break;e(i<<2|a>>4),o!=64&&(e(a<<4&240|o>>2),l!=64&&e(o<<6&192|l))}}function ae(){if(!Q){Q={};for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),e=["+/=","+/","-_=","-_.","-_"],n=0;5>n;n++){var r=t.concat(e[n].split(""));ie[n]=r;for(var i=0;i<r.length;i++){var a=r[i];Q[a]===void 0&&(Q[a]=i)}}}}var le=typeof Uint8Array=="function";function Rt(t){return le&&t!=null&&t instanceof Uint8Array}var dt;function ue(t){if(this.L=t,t!==null&&t.length===0)throw Error("ByteString should be constructed with non-empty values")}var Yn=typeof Uint8Array.prototype.slice=="function",D=0,J=0;function Xn(t,e){if(t.constructor===Uint8Array)return t;if(t.constructor===ArrayBuffer)return new Uint8Array(t);if(t.constructor===Array)return new Uint8Array(t);if(t.constructor===String)return se(t);if(t.constructor===ue)return!e&&(e=t.L)&&e.constructor===Uint8Array?e:(e=t.L,e=e==null||Rt(e)?e:typeof e=="string"?se(e):null,(t=t.L=e)?new Uint8Array(t):dt||(dt=new Uint8Array(0)));if(t instanceof Uint8Array)return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, or Array of numbers")}function ce(t,e){return Error("Invalid wire type: "+t+" (at position "+e+")")}function Lt(){return Error("Failed to read varint, encoding is invalid.")}function de(t,e){e=e===void 0?{}:e,e=e.v===void 0?!1:e.v,this.h=null,this.g=this.i=this.j=0,this.v=e,t&&kt(this,t)}function kt(t,e){t.h=Xn(e,t.v),t.j=0,t.i=t.h.length,t.g=t.j}de.prototype.reset=function(){this.g=this.j};function M(t){if(t.g>t.i)throw Error("Tried to read past the end of the data "+t.g+" > "+t.i)}function tt(t){var e=t.h,n=e[t.g],r=n&127;if(128>n)return t.g+=1,M(t),r;if(n=e[t.g+1],r|=(n&127)<<7,128>n)return t.g+=2,M(t),r;if(n=e[t.g+2],r|=(n&127)<<14,128>n)return t.g+=3,M(t),r;if(n=e[t.g+3],r|=(n&127)<<21,128>n)return t.g+=4,M(t),r;if(n=e[t.g+4],t.g+=5,r|=(n&15)<<28,128>n)return M(t),r;if(128<=e[t.g++]&&128<=e[t.g++]&&128<=e[t.g++]&&128<=e[t.g++]&&128<=e[t.g++])throw Lt();return M(t),r}var fe=[];function $t(){this.g=[]}$t.prototype.length=function(){return this.g.length},$t.prototype.end=function(){var t=this.g;return this.g=[],t};function W(t,e){for(;127<e;)t.g.push(e&127|128),e>>>=7;t.g.push(e)}function he(t){var e={},n=e.W===void 0?!1:e.W;this.l={v:e.v===void 0?!1:e.v},this.W=n,e=this.l,fe.length?(n=fe.pop(),e&&(n.v=e.v),t&&kt(n,t),t=n):t=new de(t,e),this.g=t,this.j=this.g.g,this.h=this.i=-1}he.prototype.reset=function(){this.g.reset(),this.j=this.g.g,this.h=this.i=-1};function pe(t){var e=t.g;if(e.g==e.i)return!1;t.j=t.g.g;var n=tt(t.g)>>>0;if(e=n>>>3,n&=7,!(0<=n&&5>=n))throw ce(n,t.j);if(1>e)throw Error("Invalid field number: "+e+" (at position "+t.j+")");return t.i=e,t.h=n,!0}function ft(t){switch(t.h){case 0:if(t.h!=0)ft(t);else t:{t=t.g;for(var e=t.g,n=e+10;e<n;)if((t.h[e++]&128)===0){t.g=e,M(t);break t}throw Lt()}break;case 1:t=t.g,t.g+=8,M(t);break;case 2:t.h!=2?ft(t):(e=tt(t.g)>>>0,t=t.g,t.g+=e,M(t));break;case 5:t=t.g,t.g+=4,M(t);break;case 3:e=t.i;do{if(!pe(t))throw Error("Unmatched start-group tag: stream EOF");if(t.h==4){if(t.i!=e)throw Error("Unmatched end-group tag");break}ft(t)}while(1);break;default:throw ce(t.h,t.j)}}var ht=[];function Kn(){this.i=[],this.h=0,this.g=new $t}function Y(t,e){e.length!==0&&(t.i.push(e),t.h+=e.length)}function Zn(t,e){if(e=e.ca){Y(t,t.g.end());for(var n=0;n<e.length;n++)Y(t,e[n])}}var pt=typeof Symbol=="function"&&typeof Symbol()=="symbol"?Symbol(void 0):void 0;function ge(t,e){Object.isFrozen(t)||(pt?t[pt]|=e:t.N!==void 0?t.N|=e:Object.defineProperties(t,{N:{value:e,configurable:!0,writable:!0,enumerable:!1}}))}function me(t){var e;return pt?e=t[pt]:e=t.N,e??0}function et(t){return ge(t,1),t}function nt(t){return Array.isArray(t)?!!(me(t)&2):!1}function Bt(t){if(!Array.isArray(t))throw Error("cannot mark non-array as immutable");ge(t,2)}function ve(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)&&t.constructor===Object}var gt=Object.freeze(et([]));function ye(t){if(nt(t.m))throw Error("Cannot mutate an immutable Message")}var be=typeof Symbol<"u"&&typeof Symbol.hasInstance<"u";function we(t){return{value:t,configurable:!1,writable:!1,enumerable:!1}}function $(t,e,n){return e===-1?null:e>=t.i?t.g?t.g[e]:void 0:(n===void 0?0:n)&&t.g&&(n=t.g[e],n!=null)?n:t.m[e+t.h]}function T(t,e,n,r){r=r===void 0?!1:r,ye(t),e<t.i&&!r?t.m[e+t.h]=n:(t.g||(t.g=t.m[t.i+t.h]={}))[e]=n}function Se(t,e,n,r){n=n===void 0?!0:n,r=r===void 0?!1:r;var i=$(t,e,r);return i==null&&(i=gt),nt(t.m)?n&&(Bt(i),Object.freeze(i)):(i===gt||nt(i))&&(i=et(i.slice()),T(t,e,i,r)),i}function z(t,e,n){return t=$(t,e),t=t==null?t:+t,t??(n===void 0?0:n)}function rt(t,e,n,r){t.j||(t.j={});var i=nt(t.m),a=t.j[n];if(!a){r=Se(t,n,!0,r===void 0?!1:r),a=[],i=i||nt(r);for(var o=0;o<r.length;o++)a[o]=new e(r[o]),i&&Bt(a[o].m);i&&(Bt(a),Object.freeze(a)),t.j[n]=a}return a}function xe(t,e,n,r,i){var a=a===void 0?!1:a;return ye(t),a=rt(t,n,e,a),n=r||new n,t=Se(t,e),i!=null?(a.splice(i,0,n),t.splice(i,0,n.m)):(a.push(n),t.push(n.m)),n}function je(t,e){return t=$(t,e),t??0}function Ae(t,e){return t=$(t,e),t??""}function Qn(t){switch(typeof t){case"number":return isFinite(t)?t:String(t);case"object":if(t&&!Array.isArray(t)){if(Rt(t))return oe(t);if(t instanceof ue){var e=t.L;return e=e==null||typeof e=="string"?e:le&&e instanceof Uint8Array?oe(e):null,(t.L=e)||""}}}return t}function Ce(t){var e=tr;return e=e===void 0?er:e,Ee(t,e)}function _e(t,e){if(t!=null){if(Array.isArray(t))t=Ee(t,e);else if(ve(t)){var n={},r;for(r in t)n[r]=_e(t[r],e);t=n}else t=e(t);return t}}function Ee(t,e){for(var n=t.slice(),r=0;r<n.length;r++)n[r]=_e(n[r],e);return Array.isArray(t)&&me(t)&1&&et(n),n}function tr(t){return t&&typeof t=="object"&&t.toJSON?t.toJSON():(t=Qn(t),Array.isArray(t)?Ce(t):t)}function er(t){return Rt(t)?new Uint8Array(t):t}function mt(t,e,n){t||(t=Te),Te=null;var r=this.constructor.h;t||(t=r?[r]:[]),this.h=(r?0:-1)-(this.constructor.g||0),this.j=void 0,this.m=t;t:{if(r=this.m.length,t=r-1,r&&(r=this.m[t],ve(r))){this.i=t-this.h,this.g=r;break t}e!==void 0&&-1<e?(this.i=Math.max(e,t+1-this.h),this.g=void 0):this.i=Number.MAX_VALUE}if(n)for(e=0;e<n.length;e++)if(t=n[e],t<this.i)t+=this.h,(r=this.m[t])?Array.isArray(r)&&et(r):this.m[t]=gt;else{r=this.g||(this.g=this.m[this.i+this.h]={});var i=r[t];i?Array.isArray(i)&&et(i):r[t]=gt}}mt.prototype.toJSON=function(){return Ce(this.m)},mt.prototype.toString=function(){return this.m.toString()};var Te;function vt(){mt.apply(this,arguments)}if(G(vt,mt),be){var Oe={};Object.defineProperties(vt,(Oe[Symbol.hasInstance]=we(function(){throw Error("Cannot perform instanceof checks for MutableMessage")}),Oe))}function Pe(t,e,n){if(n){var r={},i;for(i in n){var a=n[i],o=a.ja;o||(r.F=a.pa||a.ha.P,a.ba?(r.U=Ne(a.ba),o=function(l){return function(u,h,p){return l.F(u,h,p,l.U)}}(r)):a.da?(r.T=Re(a.X.g,a.da),o=function(l){return function(u,h,p){return l.F(u,h,p,l.T)}}(r)):o=r.F,a.ja=o),o(e,t,a.X),r={F:r.F,U:r.U,T:r.T}}}Zn(e,t)}var yt=Symbol();function Fe(t,e,n){return t[yt]||(t[yt]=function(r,i){return e(r,i,n)})}function Ie(t){var e=t[yt];if(!e){var n=Be(t);e=function(r,i){return Ue(r,i,n)},t[yt]=e}return e}function nr(t){var e=t.ba;if(e)return Ie(e);if(e=t.oa)return Fe(t.X.g,e,t.da)}function rr(t){var e=nr(t),n=t.X,r=t.ha.O;return e?function(i,a){return r(i,a,n,e)}:function(i,a){return r(i,a,n)}}function Me(t,e,n,r,i,a){t=t();var o=0;for(t.length&&typeof t[0]!="number"&&(n(e,t[0]),o++);o<t.length;){n=t[o++];for(var l=o+1;l<t.length&&typeof t[l]!="number";)l++;var u=t[o++];switch(l-=o,l){case 0:r(e,n,u);break;case 1:r(e,n,u,t[o++]);break;case 2:i(e,n,u,t[o++],t[o++]);break;case 3:l=t[o++];var h=t[o++],p=t[o++];Array.isArray(p)?i(e,n,u,l,h,p):a(e,n,u,l,h,p);break;case 4:a(e,n,u,t[o++],t[o++],t[o++],t[o++]);break;default:throw Error("unexpected number of binary field arguments: "+l)}}return e}var bt=Symbol();function Ne(t){var e=t[bt];if(!e){var n=ke(t);e=function(r,i){return ze(r,i,n)},t[bt]=e}return e}function Re(t,e){var n=t[bt];return n||(n=function(r,i){return Pe(r,i,e)},t[bt]=n),n}var Le=Symbol();function ir(t,e){t.push(e)}function or(t,e,n){t.push(e,n.P)}function sr(t,e,n,r,i){var a=Ne(i),o=n.P;t.push(e,function(l,u,h){return o(l,u,h,r,a)})}function ar(t,e,n,r,i,a){var o=Re(r,a),l=n.P;t.push(e,function(u,h,p){return l(u,h,p,r,o)})}function ke(t){var e=t[Le];return e||Me(t,t[Le]=[],ir,or,sr,ar)}var $e=Symbol();function lr(t,e){t[0]=e}function ur(t,e,n,r){var i=n.O;t[e]=r?function(a,o,l){return i(a,o,l,r)}:i}function cr(t,e,n,r,i,a){var o=n.O,l=Ie(i);t[e]=function(u,h,p){return o(u,h,p,r,l,a)}}function dr(t,e,n,r,i,a,o){var l=n.O,u=Fe(r,i,a);t[e]=function(h,p,w){return l(h,p,w,r,u,o)}}function Be(t){var e=t[$e];return e||Me(t,t[$e]={},lr,ur,cr,dr)}function Ue(t,e,n){for(;pe(e)&&e.h!=4;){var r=e.i,i=n[r];if(!i){var a=n[0];a&&(a=a[r])&&(i=n[r]=rr(a))}if((!i||!i(e,t,r))&&(i=e,r=t,a=i.j,ft(i),!i.W)){var o=i.g.h;i=i.g.g,i=a===i?dt||(dt=new Uint8Array(0)):Yn?o.slice(a,i):new Uint8Array(o.subarray(a,i)),(a=r.ca)?a.push(i):r.ca=[i]}}return t}function it(t,e,n){if(ht.length){var r=ht.pop();t&&(kt(r.g,t),r.i=-1,r.h=-1),t=r}else t=new he(t);try{return Ue(new e,t,Be(n))}finally{e=t.g,e.h=null,e.j=0,e.i=0,e.g=0,e.v=!1,t.i=-1,t.h=-1,100>ht.length&&ht.push(t)}}function ze(t,e,n){for(var r=n.length,i=r%2==1,a=i?1:0;a<r;a+=2)(0,n[a+1])(e,t,n[a]);Pe(t,e,i?n[0]:void 0)}function Ut(t,e){var n=new Kn;ze(t,n,ke(e)),Y(n,n.g.end()),t=new Uint8Array(n.h),e=n.i;for(var r=e.length,i=0,a=0;a<r;a++){var o=e[a];t.set(o,i),i+=o.length}return n.i=[t],t}function ot(t,e){return{O:t,P:e}}var B=ot(function(t,e,n){if(t.h!==5)return!1;t=t.g;var r=t.h[t.g],i=t.h[t.g+1],a=t.h[t.g+2],o=t.h[t.g+3];return t.g+=4,M(t),i=(r<<0|i<<8|a<<16|o<<24)>>>0,t=2*(i>>31)+1,r=i>>>23&255,i&=8388607,T(e,n,r==255?i?NaN:1/0*t:r==0?t*Math.pow(2,-149)*i:t*Math.pow(2,r-150)*(i+Math.pow(2,23))),!0},function(t,e,n){if(e=$(e,n),e!=null){W(t.g,8*n+5),t=t.g;var r=e;r=(n=0>r?1:0)?-r:r,r===0?0<1/r?D=J=0:(J=0,D=2147483648):isNaN(r)?(J=0,D=2147483647):34028234663852886e22<r?(J=0,D=(n<<31|2139095040)>>>0):11754943508222875e-54>r?(r=Math.round(r/Math.pow(2,-149)),J=0,D=(n<<31|r)>>>0):(e=Math.floor(Math.log(r)/Math.LN2),r*=Math.pow(2,-e),r=Math.round(8388608*r),16777216<=r&&++e,J=0,D=(n<<31|e+127<<23|r&8388607)>>>0),n=D,t.g.push(n>>>0&255),t.g.push(n>>>8&255),t.g.push(n>>>16&255),t.g.push(n>>>24&255)}}),fr=ot(function(t,e,n){if(t.h!==0)return!1;for(var r=t.g,i=128,a=0,o=t=0;4>o&&128<=i;o++)i=r.h[r.g++],M(r),a|=(i&127)<<7*o;if(128<=i&&(i=r.h[r.g++],M(r),a|=(i&127)<<28,t|=(i&127)>>4),128<=i)for(o=0;5>o&&128<=i;o++)i=r.h[r.g++],M(r),t|=(i&127)<<7*o+3;if(128>i)r=a>>>0,i=t>>>0,(t=i&2147483648)&&(r=~r+1>>>0,i=~i>>>0,r==0&&(i=i+1>>>0)),r=4294967296*i+(r>>>0);else throw Lt();return T(e,n,t?-r:r),!0},function(t,e,n){if(e=$(e,n),e!=null&&e!=null){W(t.g,8*n),t=t.g;var r=e;for(n=0>r,r=Math.abs(r),e=r>>>0,r=Math.floor((r-e)/4294967296),r>>>=0,n&&(r=~r>>>0,e=(~e>>>0)+1,4294967295<e&&(e=0,r++,4294967295<r&&(r=0))),D=e,J=r,n=D,e=J;0<e||127<n;)t.g.push(n&127|128),n=(n>>>7|e<<25)>>>0,e>>>=7;t.g.push(n)}}),hr=ot(function(t,e,n){return t.h!==0?!1:(T(e,n,tt(t.g)),!0)},function(t,e,n){if(e=$(e,n),e!=null&&e!=null)if(W(t.g,8*n),t=t.g,n=e,0<=n)W(t,n);else{for(e=0;9>e;e++)t.g.push(n&127|128),n>>=7;t.g.push(1)}}),De=ot(function(t,e,n){if(t.h!==2)return!1;var r=tt(t.g)>>>0;t=t.g;var i=t.g;t.g+=r,M(t),t=t.h;var a;if(Hn)(a=ne)||(a=ne=new TextDecoder("utf-8",{fatal:!0})),a=a.decode(t.subarray(i,i+r));else{r=i+r;for(var o=[],l=null,u,h,p;i<r;)u=t[i++],128>u?o.push(u):224>u?i>=r?H():(h=t[i++],194>u||(h&192)!==128?(i--,H()):o.push((u&31)<<6|h&63)):240>u?i>=r-1?H():(h=t[i++],(h&192)!==128||u===224&&160>h||u===237&&160<=h||((a=t[i++])&192)!==128?(i--,H()):o.push((u&15)<<12|(h&63)<<6|a&63)):244>=u?i>=r-2?H():(h=t[i++],(h&192)!==128||(u<<28)+(h-144)>>30!==0||((a=t[i++])&192)!==128||((p=t[i++])&192)!==128?(i--,H()):(u=(u&7)<<18|(h&63)<<12|(a&63)<<6|p&63,u-=65536,o.push((u>>10&1023)+55296,(u&1023)+56320))):H(),8192<=o.length&&(l=ee(l,o),o.length=0);a=ee(l,o)}return T(e,n,a),!0},function(t,e,n){if(e=$(e,n),e!=null){var r=!1;if(r=r===void 0?!1:r,Wn){if(r&&/(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(e))throw Error("Found an unpaired surrogate");e=(re||(re=new TextEncoder)).encode(e)}else{for(var i=0,a=new Uint8Array(3*e.length),o=0;o<e.length;o++){var l=e.charCodeAt(o);if(128>l)a[i++]=l;else{if(2048>l)a[i++]=l>>6|192;else{if(55296<=l&&57343>=l){if(56319>=l&&o<e.length){var u=e.charCodeAt(++o);if(56320<=u&&57343>=u){l=1024*(l-55296)+u-56320+65536,a[i++]=l>>18|240,a[i++]=l>>12&63|128,a[i++]=l>>6&63|128,a[i++]=l&63|128;continue}else o--}if(r)throw Error("Found an unpaired surrogate");l=65533}a[i++]=l>>12|224,a[i++]=l>>6&63|128}a[i++]=l&63|128}}e=a.subarray(0,i)}W(t.g,8*n+2),W(t.g,e.length),Y(t,t.g.end()),Y(t,e)}}),Je=ot(function(t,e,n,r,i){if(t.h!==2)return!1;e=xe(e,n,r),n=t.g.i,r=tt(t.g)>>>0;var a=t.g.g+r,o=a-n;if(0>=o&&(t.g.i=a,i(e,t),o=a-t.g.g),o)throw Error("Message parsing ended unexpectedly. Expected to read "+(r+" bytes, instead read "+(r-o)+" bytes, either the data ended unexpectedly or the message misreported its own length"));return t.g.g=a,t.g.i=n,!0},function(t,e,n,r,i){if(e=rt(e,r,n),e!=null)for(r=0;r<e.length;r++){var a=t;W(a.g,8*n+2);var o=a.g.end();Y(a,o),o.push(a.h),a=o,i(e[r],t),o=t;var l=a.pop();for(l=o.h+o.g.length()-l;127<l;)a.push(l&127|128),l>>>=7,o.h++;a.push(l),o.h++}});function L(){vt.apply(this,arguments)}if(G(L,vt),be){var Ve={};Object.defineProperties(L,(Ve[Symbol.hasInstance]=we(Object[Symbol.hasInstance]),Ve))}function st(t){L.call(this,t)}G(st,L);function Ge(){return[1,hr,2,B,3,De,4,De]}function wt(t){L.call(this,t,-1,pr)}G(wt,L),wt.prototype.addClassification=function(t,e){return xe(this,1,st,t,e),this};function He(){return[1,Je,st,Ge]}var pr=[1];function at(t){L.call(this,t)}G(at,L);function We(){return[1,B,2,B,3,B,4,B,5,B]}function zt(t){L.call(this,t,-1,gr)}G(zt,L);function qe(){return[1,Je,at,We]}var gr=[1];function Dt(t){L.call(this,t)}G(Dt,L);function Ye(){return[1,B,2,B,3,B,4,B,5,B,6,fr]}function Xe(t,e,n){if(n=t.createShader(n===0?t.VERTEX_SHADER:t.FRAGMENT_SHADER),t.shaderSource(n,e),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))throw Error(`Could not compile WebGL shader.

`+t.getShaderInfoLog(n));return n}function Ke(t){return rt(t,st,1).map(function(e){return{index:je(e,1),score:z(e,2),label:$(e,3)!=null?Ae(e,3):void 0,displayName:$(e,4)!=null?Ae(e,4):void 0}})}function Ze(t){return{x:z(t,1),y:z(t,2),z:z(t,3),visibility:$(t,4)!=null?z(t,4):void 0}}function Qe(t){return t.map(function(e){return rt(it(e,zt,qe),at,1).map(Ze)})}function Jt(t,e){this.h=t,this.g=e,this.l=0}function tn(t,e,n){return mr(t,e),typeof t.g.canvas.transferToImageBitmap=="function"?Promise.resolve(t.g.canvas.transferToImageBitmap()):n?Promise.resolve(t.g.canvas):typeof createImageBitmap=="function"?createImageBitmap(t.g.canvas):(t.i===void 0&&(t.i=document.createElement("canvas")),new Promise(function(r){t.i.height=t.g.canvas.height,t.i.width=t.g.canvas.width,t.i.getContext("2d",{}).drawImage(t.g.canvas,0,0,t.g.canvas.width,t.g.canvas.height),r(t.i)}))}function mr(t,e){var n=t.g;if(t.o===void 0){var r=Xe(n,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,0),i=Xe(n,`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D sampler0;
  void main(){
    gl_FragColor = texture2D(sampler0, vTex);
  }`,1),a=n.createProgram();if(n.attachShader(a,r),n.attachShader(a,i),n.linkProgram(a),!n.getProgramParameter(a,n.LINK_STATUS))throw Error(`Could not compile WebGL program.

`+n.getProgramInfoLog(a));r=t.o=a,n.useProgram(r),i=n.getUniformLocation(r,"sampler0"),t.j={K:n.getAttribLocation(r,"aVertex"),J:n.getAttribLocation(r,"aTex"),qa:i},t.u=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,t.u),n.enableVertexAttribArray(t.j.K),n.vertexAttribPointer(t.j.K,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),t.s=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,t.s),n.enableVertexAttribArray(t.j.J),n.vertexAttribPointer(t.j.J,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array([0,1,0,0,1,0,1,1]),n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),n.uniform1i(i,0)}r=t.j,n.useProgram(t.o),n.canvas.width=e.width,n.canvas.height=e.height,n.viewport(0,0,e.width,e.height),n.activeTexture(n.TEXTURE0),t.h.bindTexture2d(e.glName),n.enableVertexAttribArray(r.K),n.bindBuffer(n.ARRAY_BUFFER,t.u),n.vertexAttribPointer(r.K,2,n.FLOAT,!1,0,0),n.enableVertexAttribArray(r.J),n.bindBuffer(n.ARRAY_BUFFER,t.s),n.vertexAttribPointer(r.J,2,n.FLOAT,!1,0,0),n.bindFramebuffer(n.DRAW_FRAMEBUFFER?n.DRAW_FRAMEBUFFER:n.FRAMEBUFFER,null),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.colorMask(!0,!0,!0,!0),n.drawArrays(n.TRIANGLE_FAN,0,4),n.disableVertexAttribArray(r.K),n.disableVertexAttribArray(r.J),n.bindBuffer(n.ARRAY_BUFFER,null),t.h.bindTexture2d(0)}function vr(t){this.g=t}var yr=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,9,1,7,0,65,0,253,15,26,11]);function br(t,e){return e+t}function en(t,e){window[t]=e}function wr(t){var e=document.createElement("script");return e.setAttribute("src",t),e.setAttribute("crossorigin","anonymous"),new Promise(function(n){e.addEventListener("load",function(){n()},!1),e.addEventListener("error",function(){n()},!1),document.body.appendChild(e)})}function Sr(){return I(function(t){switch(t.g){case 1:return t.o=2,E(t,WebAssembly.instantiate(yr),4);case 4:t.g=3,t.o=0;break;case 2:return t.o=0,t.j=null,t.return(!1);case 3:return t.return(!0)}})}function Vt(t){if(this.g=t,this.listeners={},this.j={},this.H={},this.o={},this.u={},this.I=this.s=this.$=!0,this.D=Promise.resolve(),this.Z="",this.C={},this.locateFile=t&&t.locateFile||br,typeof window=="object")var e=window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/";else if(typeof location<"u")e=location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/";else throw Error("solutions can only be loaded on a web page or in a web worker");if(this.aa=e,t.options){e=A(Object.keys(t.options));for(var n=e.next();!n.done;n=e.next()){n=n.value;var r=t.options[n].default;r!==void 0&&(this.j[n]=typeof r=="function"?r():r)}}}c=Vt.prototype,c.close=function(){return this.i&&this.i.delete(),Promise.resolve()};function xr(t){var e,n,r,i,a,o,l,u,h,p,w;return I(function(v){switch(v.g){case 1:return t.$?(e=t.g.files===void 0?[]:typeof t.g.files=="function"?t.g.files(t.j):t.g.files,E(v,Sr(),2)):v.return();case 2:if(n=v.h,typeof window=="object")return en("createMediapipeSolutionsWasm",{locateFile:t.locateFile}),en("createMediapipeSolutionsPackedAssets",{locateFile:t.locateFile}),o=e.filter(function(g){return g.data!==void 0}),l=e.filter(function(g){return g.data===void 0}),u=Promise.all(o.map(function(g){var b=St(t,g.url);if(g.path!==void 0){var S=g.path;b=b.then(function(_){return t.overrideFile(S,_),Promise.resolve(_)})}return b})),h=Promise.all(l.map(function(g){return g.simd===void 0||g.simd&&n||!g.simd&&!n?wr(t.locateFile(g.url,t.aa)):Promise.resolve()})).then(function(){var g,b,S;return I(function(_){if(_.g==1)return g=window.createMediapipeSolutionsWasm,b=window.createMediapipeSolutionsPackedAssets,S=t,E(_,g(b),2);S.h=_.h,_.g=0})}),p=function(){return I(function(g){return t.g.graph&&t.g.graph.url?g=E(g,St(t,t.g.graph.url),0):(g.g=0,g=void 0),g})}(),E(v,Promise.all([h,u,p]),7);if(typeof importScripts!="function")throw Error("solutions can only be loaded on a web page or in a web worker");return r=e.filter(function(g){return g.simd===void 0||g.simd&&n||!g.simd&&!n}).map(function(g){return t.locateFile(g.url,t.aa)}),importScripts.apply(null,Zt(r)),i=t,E(v,createMediapipeSolutionsWasm(Module),6);case 6:i.h=v.h,t.l=new OffscreenCanvas(1,1),t.h.canvas=t.l,a=t.h.GL.createContext(t.l,{antialias:!1,alpha:!1,na:typeof WebGL2RenderingContext<"u"?2:1}),t.h.GL.makeContextCurrent(a),v.g=4;break;case 7:if(t.l=document.createElement("canvas"),w=t.l.getContext("webgl2",{}),!w&&(w=t.l.getContext("webgl",{}),!w))return alert("Failed to create WebGL canvas context when passing video frame."),v.return();t.G=w,t.h.canvas=t.l,t.h.createContext(t.l,!0,!0,{});case 4:t.i=new t.h.SolutionWasm,t.$=!1,v.g=0}})}function jr(t){var e,n,r,i,a,o,l,u;return I(function(h){if(h.g==1){if(t.g.graph&&t.g.graph.url&&t.Z===t.g.graph.url)return h.return();if(t.s=!0,!t.g.graph||!t.g.graph.url){h.g=2;return}return t.Z=t.g.graph.url,E(h,St(t,t.g.graph.url),3)}for(h.g!=2&&(e=h.h,t.i.loadGraph(e)),n=A(Object.keys(t.C)),r=n.next();!r.done;r=n.next())i=r.value,t.i.overrideFile(i,t.C[i]);if(t.C={},t.g.listeners)for(a=A(t.g.listeners),o=a.next();!o.done;o=a.next())l=o.value,Er(t,l);u=t.j,t.j={},t.setOptions(u),h.g=0})}c.reset=function(){var t=this;return I(function(e){t.i&&(t.i.reset(),t.o={},t.u={}),e.g=0})},c.setOptions=function(t,e){var n=this;if(e=e||this.g.options){for(var r=[],i=[],a={},o=A(Object.keys(t)),l=o.next();!l.done;a={R:a.R,S:a.S},l=o.next()){var u=l.value;u in this.j&&this.j[u]===t[u]||(this.j[u]=t[u],l=e[u],l!==void 0&&(l.onChange&&(a.R=l.onChange,a.S=t[u],r.push(function(h){return function(){var p;return I(function(w){if(w.g==1)return E(w,h.R(h.S),2);p=w.h,p===!0&&(n.s=!0),w.g=0})}}(a))),l.graphOptionXref&&(u={valueNumber:l.type===1?t[u]:0,valueBoolean:l.type===0?t[u]:!1,valueString:l.type===2?t[u]:""},l=Object.assign(Object.assign(Object.assign({},{calculatorName:"",calculatorIndex:0}),l.graphOptionXref),u),i.push(l))))}(r.length!==0||i.length!==0)&&(this.s=!0,this.B=(this.B===void 0?[]:this.B).concat(i),this.A=(this.A===void 0?[]:this.A).concat(r))}};function Ar(t){var e,n,r,i,a,o,l;return I(function(u){switch(u.g){case 1:if(!t.s)return u.return();if(!t.A){u.g=2;break}e=A(t.A),n=e.next();case 3:if(n.done){u.g=5;break}return r=n.value,E(u,r(),4);case 4:n=e.next(),u.g=3;break;case 5:t.A=void 0;case 2:if(t.B){for(i=new t.h.GraphOptionChangeRequestList,a=A(t.B),o=a.next();!o.done;o=a.next())l=o.value,i.push_back(l);t.i.changeOptions(i),i.delete(),t.B=void 0}t.s=!1,u.g=0}})}c.initialize=function(){var t=this;return I(function(e){return e.g==1?E(e,xr(t),2):e.g!=3?E(e,jr(t),3):E(e,Ar(t),0)})};function St(t,e){var n,r;return I(function(i){return e in t.H?i.return(t.H[e]):(n=t.locateFile(e,""),r=fetch(n).then(function(a){return a.arrayBuffer()}),t.H[e]=r,i.return(r))})}c.overrideFile=function(t,e){this.i?this.i.overrideFile(t,e):this.C[t]=e},c.clearOverriddenFiles=function(){this.C={},this.i&&this.i.clearOverriddenFiles()},c.send=function(t,e){var n=this,r,i,a,o,l,u,h,p,w;return I(function(v){switch(v.g){case 1:return n.g.inputs?(r=1e3*(e??performance.now()),E(v,n.D,2)):v.return();case 2:return E(v,n.initialize(),3);case 3:for(i=new n.h.PacketDataList,a=A(Object.keys(t)),o=a.next();!o.done;o=a.next())if(l=o.value,u=n.g.inputs[l]){t:{var g=t[l];switch(u.type){case"video":var b=n.o[u.stream];if(b||(b=new Jt(n.h,n.G),n.o[u.stream]=b),b.l===0&&(b.l=b.h.createTexture()),typeof HTMLVideoElement<"u"&&g instanceof HTMLVideoElement)var S=g.videoWidth,_=g.videoHeight;else typeof HTMLImageElement<"u"&&g instanceof HTMLImageElement?(S=g.naturalWidth,_=g.naturalHeight):(S=g.width,_=g.height);_={glName:b.l,width:S,height:_},S=b.g,S.canvas.width=_.width,S.canvas.height=_.height,S.activeTexture(S.TEXTURE0),b.h.bindTexture2d(b.l),S.texImage2D(S.TEXTURE_2D,0,S.RGBA,S.RGBA,S.UNSIGNED_BYTE,g),b.h.bindTexture2d(0),b=_;break t;case"detections":for(b=n.o[u.stream],b||(b=new vr(n.h),n.o[u.stream]=b),b.data||(b.data=new b.g.DetectionListData),b.data.reset(g.length),_=0;_<g.length;++_){S=g[_];var C=b.data,P=C.setBoundingBox,k=_,N=S.ea,x=new Dt;if(T(x,1,N.ka),T(x,2,N.la),T(x,3,N.height),T(x,4,N.width),T(x,5,N.rotation),T(x,6,N.ia),N=Ut(x,Ye),P.call(C,k,N),S.Y)for(C=0;C<S.Y.length;++C){x=S.Y[C];var O=!!x.visibility;P=b.data,k=P.addNormalizedLandmark,N=_,x=Object.assign(Object.assign({},x),{visibility:O?x.visibility:0}),O=new at,T(O,1,x.x),T(O,2,x.y),T(O,3,x.z),x.visibility&&T(O,4,x.visibility),x=Ut(O,We),k.call(P,N,x)}if(S.V)for(C=0;C<S.V.length;++C)P=b.data,k=P.addClassification,N=_,x=S.V[C],O=new st,T(O,2,x.score),x.index&&T(O,1,x.index),x.label&&T(O,3,x.label),x.displayName&&T(O,4,x.displayName),x=Ut(O,Ge),k.call(P,N,x)}b=b.data;break t;default:b={}}}switch(h=b,p=u.stream,u.type){case"video":i.pushTexture2d(Object.assign(Object.assign({},h),{stream:p,timestamp:r}));break;case"detections":w=h,w.stream=p,w.timestamp=r,i.pushDetectionList(w);break;default:throw Error("Unknown input config type: '"+u.type+"'")}}return n.i.send(i),E(v,n.D,4);case 4:i.delete(),v.g=0}})};function Cr(t,e,n){var r,i,a,o,l,u,h,p,w,v,g,b,S,_;return I(function(C){switch(C.g){case 1:if(!n)return C.return(e);for(r={},i=0,a=A(Object.keys(n)),o=a.next();!o.done;o=a.next())l=o.value,u=n[l],typeof u!="string"&&u.type==="texture"&&e[u.stream]!==void 0&&++i;1<i&&(t.I=!1),h=A(Object.keys(n)),o=h.next();case 2:if(o.done){C.g=4;break}if(p=o.value,w=n[p],typeof w=="string")return S=r,_=p,E(C,_r(t,p,e[w]),14);if(v=e[w.stream],w.type==="detection_list"){if(v){for(var P=v.getRectList(),k=v.getLandmarksList(),N=v.getClassificationsList(),x=[],O=0;O<P.size();++O){var V=it(P.get(O),Dt,Ye);V={ea:{ka:z(V,1),la:z(V,2),height:z(V,3),width:z(V,4),rotation:z(V,5,0),ia:je(V,6)},Y:rt(it(k.get(O),zt,qe),at,1).map(Ze),V:Ke(it(N.get(O),wt,He))},x.push(V)}P=x}else P=[];r[p]=P,C.g=7;break}if(w.type==="proto_list"){if(v){for(P=Array(v.size()),k=0;k<v.size();k++)P[k]=v.get(k);v.delete()}else P=[];r[p]=P,C.g=7;break}if(v===void 0){C.g=3;break}if(w.type==="float_list"){r[p]=v,C.g=7;break}if(w.type==="proto"){r[p]=v,C.g=7;break}if(w.type!=="texture")throw Error("Unknown output config type: '"+w.type+"'");return g=t.u[p],g||(g=new Jt(t.h,t.G),t.u[p]=g),E(C,tn(g,v,t.I),13);case 13:b=C.h,r[p]=b;case 7:w.transform&&r[p]&&(r[p]=w.transform(r[p])),C.g=3;break;case 14:S[_]=C.h;case 3:o=h.next(),C.g=2;break;case 4:return C.return(r)}})}function _r(t,e,n){var r;return I(function(i){return typeof n=="number"||n instanceof Uint8Array||n instanceof t.h.Uint8BlobList?i.return(n):n instanceof t.h.Texture2dDataOut?(r=t.u[e],r||(r=new Jt(t.h,t.G),t.u[e]=r),i.return(tn(r,n,t.I))):i.return(void 0)})}function Er(t,e){for(var n=e.name||"$",r=[].concat(Zt(e.wants)),i=new t.h.StringList,a=A(e.wants),o=a.next();!o.done;o=a.next())i.push_back(o.value);a=t.h.PacketListener.implement({onResults:function(l){for(var u={},h=0;h<e.wants.length;++h)u[r[h]]=l.get(h);var p=t.listeners[n];p&&(t.D=Cr(t,u,e.outs).then(function(w){w=p(w);for(var v=0;v<e.wants.length;++v){var g=u[r[v]];typeof g=="object"&&g.hasOwnProperty&&g.hasOwnProperty("delete")&&g.delete()}w&&(t.D=w)}))}}),t.i.attachMultiListener(i,a),i.delete()}c.onResults=function(t,e){this.listeners[e||"$"]=t},Z("Solution",Vt),Z("OptionType",{BOOL:0,NUMBER:1,ma:2,0:"BOOL",1:"NUMBER",2:"STRING"});function nn(t){return t===void 0&&(t=0),t===1?"hand_landmark_full.tflite":"hand_landmark_lite.tflite"}function rn(t){var e=this;t=t||{},this.g=new Vt({locateFile:t.locateFile,files:function(n){return[{url:"hands_solution_packed_assets_loader.js"},{simd:!1,url:"hands_solution_wasm_bin.js"},{simd:!0,url:"hands_solution_simd_wasm_bin.js"},{data:!0,url:nn(n.modelComplexity)}]},graph:{url:"hands.binarypb"},inputs:{image:{type:"video",stream:"input_frames_gpu"}},listeners:[{wants:["multi_hand_landmarks","multi_hand_world_landmarks","image_transformed","multi_handedness"],outs:{image:"image_transformed",multiHandLandmarks:{type:"proto_list",stream:"multi_hand_landmarks",transform:Qe},multiHandWorldLandmarks:{type:"proto_list",stream:"multi_hand_world_landmarks",transform:Qe},multiHandedness:{type:"proto_list",stream:"multi_handedness",transform:function(n){return n.map(function(r){return Ke(it(r,wt,He))[0]})}}}}],options:{useCpuInference:{type:0,graphOptionXref:{calculatorType:"InferenceCalculator",fieldName:"use_cpu_inference"},default:typeof window!="object"||window.navigator===void 0?!1:"iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document},selfieMode:{type:0,graphOptionXref:{calculatorType:"GlScalerCalculator",calculatorIndex:1,fieldName:"flip_horizontal"}},maxNumHands:{type:1,graphOptionXref:{calculatorType:"ConstantSidePacketCalculator",calculatorName:"ConstantSidePacketCalculator",fieldName:"int_value"}},modelComplexity:{type:1,graphOptionXref:{calculatorType:"ConstantSidePacketCalculator",calculatorName:"ConstantSidePacketCalculatorModelComplexity",fieldName:"int_value"},onChange:function(n){var r,i,a;return I(function(o){return o.g==1?(r=nn(n),i="third_party/mediapipe/modules/hand_landmark/"+r,E(o,St(e.g,r),2)):(a=o.h,e.g.overrideFile(i,a),o.return(!0))})}},minDetectionConfidence:{type:1,graphOptionXref:{calculatorType:"TensorsToDetectionsCalculator",calculatorName:"handlandmarktrackinggpu__palmdetectiongpu__TensorsToDetectionsCalculator",fieldName:"min_score_thresh"}},minTrackingConfidence:{type:1,graphOptionXref:{calculatorType:"ThresholdingCalculator",calculatorName:"handlandmarktrackinggpu__handlandmarkgpu__ThresholdingCalculator",fieldName:"threshold"}}}})}c=rn.prototype,c.close=function(){return this.g.close(),Promise.resolve()},c.onResults=function(t){this.g.onResults(t)},c.initialize=function(){var t=this;return I(function(e){return E(e,t.g.initialize(),0)})},c.reset=function(){this.g.reset()},c.send=function(t){var e=this;return I(function(n){return E(n,e.g.send(t),0)})},c.setOptions=function(t){this.g.setOptions(t)},Z("Hands",rn),Z("HAND_CONNECTIONS",[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]]),Z("VERSION","0.4.1646424915")}).call(Gt);function Lr(c){const s=c.reduce((d,f)=>Math.max(Math.abs(d),Math.abs(f)),c[0]);return c.map(d=>d/s)}function kr(c){return c.reduce((s,d,f)=>s===void 0||d>c[s]?f:s,void 0)}function $r(c,s,d){const f="videoWidth"in c?c.videoWidth:c.width,m="videoHeight"in c?c.videoHeight:c.height,y=c,j=s.canvas??s;j.width=f,j.height=m,d?(s.translate(f,0),s.scale(-1,1),s.drawImage(y,0,0),s.setTransform(1,0,0,1,0,0)):s.drawImage(y,0,0)}const un=document.createElement("canvas"),Br=un.getContext("2d"),Ur=document.createElement("canvas");class zr{#t=null;#n=null;constructor(){this.#e()}#e(){this.#t||(console.log("loading hand model..."),this.#t=new(Rr.Hands||window.Hands)({locateFile:s=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${s}`}),this.#t.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:.5,minTrackingConfidence:.5}),this.#t.onResults(this.#o))}async warmup(s=Ur){await this.extract(s,!1)}async extract(s,d){return new Promise(f=>{this.#n=f,$r(s,Br,d),this.#t.send({image:un})})}#o=s=>{this.#n((s.multiHandLandmarks??[]).reduce((d,f)=>(f.length>0&&d.push(f),d),[]))}}const cn=new zr;function Dr(c){return cn.warmup(c)}async function Jr(c,s){return cn.extract(c,s)}function ct(c,s){const d=Object.keys(s?.steps||{})||[],f=d.map(y=>(s?.steps)[y].instance)||[];return new Function("extractAllJointPositions","tf","tfjs","defaultModelClasses","argMax","normalize",...d,`return (${c.replace(/export/g,"")})`)(Jr,on,on,jt,kr,Lr,...f)}const Vr=`<style>\r
	[slot="success"] {\r
		font-weight: bold;\r
	}\r
\r
	.editor-container {\r
		width: 100%;\r
		height: 600px;\r
	}\r
\r
	step-container::part(main) {\r
		/* max-width: 500px; */\r
		width: 80vw;\r
	}\r
\r
	.editor-container code-editor::part(main) {\r
		/* fills editor-container */\r
		height: 100%;\r
	}\r
\r
	.solution-editor::part(main) {\r
		margin-top: 5px;\r
	}\r
\r
	.solution-container code-editor::part(main) {\r
		/* fills editor-container */\r
		height: 600px;\r
	}\r
\r
	.solution-editor::part(main) {\r
		margin-top: 5px;\r
	}\r
\r
</style>\r
<div class="root">\r
	<step-container class="step-container">\r
		<div slot="name"></div>\r
		<div class="editor-container">\r
			<code-editor hide-issues class="code-editor"></code-editor>\r
		</div>\r
		<slot slot="success" name="success">\r
			<div class="success-message">Great job! Looks Good \u{1F44D}.</div>\r
		</slot>\r
		<div slot="buttons-bottom" class="solution-container">\r
			<div class="bottom-button-container">\r
				<fluent-button class="toggle-solution-button">Toggle Solution</fluent-button>\r
			</div>\r
			<code-editor style="display: none;" code="function test() {}" readonly hide-issues class="solution-editor"></code-editor>\r
		</div>\r
	</step-container>\r
</div>`;class qt extends ut{static get observedAttributes(){return["style"]}#t=null;#n=null;#e=null;#o=null;#r;defaultCode;solutionCode;successMessage;validate;readonly;constructor({defaultCode:s,defaultState:d,solutionCode:f,readonly:m,validate:y,template:j=Vr,successMessage:A}){super(j),this.defaultCode=s,this.solutionCode=f??null,this.successMessage=A??null,this.readonly=m??!1,this.validate=y,this.#r={...d}}get solutionVisible(){return this.#o?.style.display!=="none"}set solutionVisible(s){this.#o&&(this.#o.style.display=s?"":"none")}get stepState(){return this.#r}set stepState(s){const d=this.#r;if(s!==this.#r){this.#r=s,d.code!==s.code&&this.#t?.setAttribute("code",s.code||this.defaultCode),this?.toggleAttribute("valid",s.valid),this.#n?.toggleAttribute("valid",s.valid);const f=s.syntaxIssues||[];f.length===0&&f.push(...(s.validationIssues||[]).map(m=>({type:"validation",message:m.detail}))),this.#n?.setAttribute("step-issues",f?JSON.stringify(f||[]):""),this?.toggleAttribute("valid",s.valid),this.dispatchEvent(new CustomEvent("stateChanged",{detail:s}))}}#i=null;get root(){return this.#i||(this.#i=this.templateRoot.querySelector(".root")),this.#i}connectedCallback(){this.#t=this.root.querySelector(".code-editor"),this.#n=this.root.querySelector(".step-container"),this.#o=this.root.querySelector(".solution-editor"),this.#e=this.root.querySelector(".toggle-solution-button"),this.solutionCode?(this.#o?.setAttribute("code",this.solutionCode),this.#e?.addEventListener("click",()=>{this.solutionVisible=!this.solutionVisible})):this.#e&&(this.#e.style.display="none");const s=this.root.querySelector(".success-message");this.successMessage&&s&&(s.innerHTML=this.successMessage),this.#t?.toggleAttribute("readonly",this.readonly),this.#t?.setAttribute("code",this.stepState.code||this.defaultCode),this.#t?.addEventListener("change",d=>{this.#s(d.detail)})}async#s(s){let d,f,m;s?{code:d,transpiledCode:f,issues:m}=s:(d=this.#t?.getAttribute("code")||"",f=this.#t?.getAttribute("transpiled-code")||"",m=JSON.parse(this.#t?.getAttribute("issues")||"[]"));const y=(m??[]).filter(A=>A.type==="error"||A.type==="warning")||[],j={valid:!1,code:d,transpiledCode:f,syntaxIssues:y,data:null,instance:null};if(j.valid=y.length===0,j.validationIssues=[],j.instance=void 0,j.transpiledCode&&j?.syntaxIssues?.length===0)try{j.instance=ct(j.transpiledCode);const A=await this.validate(j,null);j.valid=A.valid,j.validationIssues.push(...A.errors||[])}catch(A){j.valid=!1,j.validationIssues.push(...q(`${A}`).errors)}this.stepState=Object.freeze(j)}}const dn=`
/**
 * Predicts the classification (ASL sign) of the given joint position tensor
 * @param {tf.LayersModel} model The model to run the prediction with
 * @param {string[]} classes The list of classes (ASL sign) the model supports
 * @param {tf.tensor1d} tensor The joint position tensor
 * @returns {{
 *   // The classification (ASL sign)
 *   classification: string,
 *   // The confidence 0 - 1
 *   confidence: number
 *}}
 */
function classify(model: LayersModel, classes: string[], tensor: Tensor1D): {
  classification: string,
  confidence: number,
} | null {
  // 1. Call tensor flow model prediction
  // 2. Find the index of the highest confidence
  // 3. Convert the index to a class (ASL sign)
  // 3. return the classification and confidence
  // There is an argMax utility function available
  return null;
}
`,Gr=`
/**
 * Predicts the classification (ASL sign) of the given joint position tensor
 * @param {tf.LayersModel} model The model to run the prediction with
 * @param {string[]} classes The list of classes (ASL sign) the model supports
 * @param {tf.tensor1d} tensor The joint position tensor
 * @returns {{
 *   // The classification (ASL sign)
 *   classification: string,
 *   // The confidence 0 - 1
 *   confidence: number
 *}}
 */
function classifySolution(model: LayersModel, classes: string[], tensor: Tensor1D): {
  classification: string,
  confidence: number,
} | null {
  const prediction = model.predict(tensor);
  const predictionSynced = prediction.dataSync();
  const index = argMax(predictionSynced);
  if (index != null && index >= 0 && index < classes.length) {
    const confidence = predictionSynced[index]
    return {
      classification: classes[index],
      confidence,
    }
  }
  return null;
}
`,fn=63,Hr=At(Array.from({length:fn}).map(()=>Math.random()*2-1)).expandDims(0),Ht="C",Wr=()=>At(jt.map(c=>c===Ht?1:0));async function hn(c){try{const s=c.instance,d=Wr(),f=Tr({});f.predict=y=>d;const m=await s(f,jt,Hr);if(!m||!m.classification)return F(`
classify() didn't return anything OR the correct format.<br>
It should return an object of the form: <br>
<pre>
return {
  classification: "&lt;Some sign&gt;",
  confidence: &lt;some number from 0 - 1&gt;
}
</pre>
`);if(m.classification!==Ht)return F(`classify() returned <b>"${m.classification}"</b>, but it should've returned <b>"${Ht}"</b>`)}catch(s){const d=`${s}`;return d.indexOf("Implement")>=0?F("Your implementation is incomplete"):q(d)}return{valid:!0,errors:[]}}const pn=()=>F(`
It should return an object of the form: <br />
<pre>
return {
        // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
        jointPositionsFlat,

        // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
        jointPositions,
}
</pre>
`),qr=(c=null)=>F(`
Your jointPositionsFlat value is not the correct length.<br />
It should have a length of ${fn}, but 
${c!=null?`${c} was returned`:"the incorrect length was returned."}.<br />
Remember the format for the <b>jointPositionsFlat</b> property
should be:<br />
<pre>[x1, y1, z1, x2, y2, z2...., xN, yN, zN]</pre>
`),Ct={valid:!1,validationIssues:pn().errors,code:dn};function Yr(c){return JSON.stringify(c)}function Xr(c){if(c){const s=JSON.parse(c);if(s.transpiledCode)try{s.instance=ct(s.transpiledCode)}catch(d){console.error(d)}return s}return Ct}class gn extends qt{constructor(){super({defaultCode:dn,defaultState:Ct,solutionCode:Gr,validate:hn})}}customElements.define("classify-step",gn);const mn="classify",Kr=Object.freeze(Object.defineProperty({__proto__:null,name:mn,Renderer:gn,defaultState:Ct,serialize:Yr,deserialize:Xr,validate:hn,createIncorrectReturnTypeError:pn,createIncorrectReturnShapeError:qr},Symbol.toStringTag,{value:"Module"})),vn=`
/**
 * Cleans up the given _tensor_
 * @param {tf.Tensor} tensor The tensor to clean up
 */
function cleanup(tensor: Tensor) {
  // solution in solutions/cleanup.js
  // 1. https://js.tensorflow.org/api/latest/#tf.Tensor.dispose
}
`,Zr=`
/**
 * Cleans up the given _tensor_
 * @param {tf.Tensor} tensor The tensor to clean up
 */
function cleanupSolution(tensor: Tensor) {
  tensor.dispose();
}
`;async function yn(c){try{if(c.instance){const s=c.instance,d=At([1,2,3]);let f=!1;if(d.dispose=()=>f=!0,await s(d),!f)return Yt()}else return F("Missing Implementation!")}catch(s){const d=`${s}`;return q(d)}return{valid:!0,errors:[]}}const Yt=()=>F("Your function did not clean up the tensor that was passed in."),_t={valid:!1,validationIssues:Yt().errors,code:vn};function Qr(c){return JSON.stringify(c)}function ti(c){if(c){const s=JSON.parse(c);if(s.transpiledCode)try{s.instance=ct(s.transpiledCode)}catch(d){console.error(d)}return s}return _t}class bn extends qt{constructor(){super({defaultCode:vn,defaultState:_t,solutionCode:Zr,validate:yn})}}customElements.define("cleanup-step",bn);const wn="cleanup",ei=Object.freeze(Object.defineProperty({__proto__:null,name:wn,Renderer:bn,defaultState:_t,serialize:Qr,deserialize:ti,validate:yn,createNotCleanedUpError:Yt},Symbol.toStringTag,{value:"Module"})),Sn=`
/**
 * Returns the hand joint locations in 3d space within the given _imageSource_
 * ** Note ** Only returns the first hand in the image
 * @param {CanvasImageSource} imageSource The image to detect hand joints within
 * @param {boolean} loadMirrored If the image should be mirrored before extracting joint positions
 * @returns The joint positions
 */
async function extractAndProcessJointPositions(
  imageSource: CanvasImageSource,
  loadMirrored: boolean
): Promise<{
  jointPositionsFlat: Tensor1D;
  jointPositions: Point3D[];
} | null> {
  // Extracts a set of joint positions for every hand in the image
  const allJointPositions = await extractAllJointPositions(imageSource, loadMirrored);
  
  // Is there at least one hand in the image?
  if (allJointPositions !== null && allJointPositions.length > 0) {
    // Get the first hand's joint positions
    const firstHand = allJointPositions[0];

    // Flatten the joint positions, so they look like the format
    // [joint1_x, joint1_y, joint1_z, ...jointN_x, jointN_y, jointN_z]
    const flattenedJoints = firstHand.reduce((result, joint) => {
      result.push(joint.x, joint.y, joint.z);
      return result;
    }, []);

    // Create a tensorflow tensor for the flattened joints
    const flattenedTensor = tf.tensor1d(flattenedJoints);

    // Normalize the flattened tensor values to [-1, 1]
    const dataMax = flattenedTensor.max();
    const dataMin = flattenedTensor.min();
    const normalizedTensor = flattenedTensor.sub(dataMin).div(dataMax.sub(dataMin));
    return {
      jointPositionsFlat: normalizedTensor.expandDims(0),
      jointPositions: firstHand
    };
  }

  // We didn't find anything, so return null
  return null;
}
`,X=document.createElement("img");X.setAttribute("crossorigin","anonymous");const xn=63;async function jn(c){if(c.instance){const s=new Promise((f,m)=>{X.onload=f,X.onerror=m});X.src="data/testImage.jpg",await s;let d=null;try{const f=await c.instance(X,!1);if(f?.jointPositionsFlat&&f.jointPositionsFlat.size!==xn)return An(f.jointPositionsFlat.size??null);if(!f||!f.jointPositionsFlat)return Xt();d=[f]}catch(f){return q(`${f}`)}return{valid:!0,errors:[],data:d}}else return{valid:!1,errors:F("No implementation found!").errors}}const Xt=()=>F(`
It should return an object of the form: <br />
<pre>
return {
        // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
        jointPositionsFlat,

        // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
        jointPositions,
}
</pre>
`),An=(c=null)=>F(`
Your jointPositionsFlat value is not the correct length.<br />
It should have a length of ${xn}, but 
${c!=null?`${c} was returned`:"the incorrect length was returned."}.<br />
Remember the format for the <b>jointPositionsFlat</b> property
should be:<br />
<pre>[x1, y1, z1, x2, y2, z2...., xN, yN, zN]</pre>
`),Et={valid:!1,validationIssues:Xt().errors,code:Sn};function ni(c){return JSON.stringify(c)}function ri(c){if(c){const s=JSON.parse(c);if(s.transpiledCode)try{s.instance=ct(s.transpiledCode)}catch(d){console.error(d)}return s}return Et}class Cn extends qt{constructor(){super({defaultCode:Sn,defaultState:Et,validate:jn,readonly:!0})}}customElements.define("extract-and-process-joint-positions-step",Cn);const _n="extractAndProcessJointPositions",ii=Object.freeze(Object.defineProperty({__proto__:null,name:_n,Renderer:Cn,defaultState:Et,serialize:ni,deserialize:ri,validateImageSource:X,validate:jn,createIncorrectReturnTypeError:Xt,createIncorrectReturnShapeError:An},Symbol.toStringTag,{value:"Module"}));async function En(c,s){const d={valid:!1,data:null};if(c)try{const f=await Or.exports.loadAsync(c);"model.json"in f.files?(d.data=c,d.valid=!0):d.validationIssues=On().errors}catch(f){d.validationIssues=q(`${f}`).errors,console.error(f)}else d.validationIssues=F("No model data selected!").errors;return d}const Tn=()=>F("No model data selected!"),On=()=>F("The file that was selected does not contain a model.json file!"),Tt={valid:!1,validationIssues:Tn().errors};function oi(c){if(c){const s={...c};return c.data&&(s.data=li(c.data)),JSON.stringify(s)}return null}function si(c){if(c)try{const s=JSON.parse(c);return s.data&&(s.data=ai(s.data)),s}catch(s){console.error("could not deserialize state",s)}return Tt}function ai(c){const s=window.atob(c),d=s.length,f=new Uint8Array(d);for(let m=0;m<d;m++)f[m]=s.charCodeAt(m);return f.buffer}function li(c){let s="";const d=new Uint8Array(c),f=d.byteLength;for(let m=0;m<f;m++)s+=String.fromCharCode(d[m]);return window.btoa(s)}const ui=`<style>\r
	[slot="success"] {\r
		font-weight: bold;\r
	}\r
\r
	step-container::part(main) {\r
		width: 500px;\r
	}\r
</style>\r
<div class="root">\r
	<step-container class="step-container">\r
		<div slot="name">Import Model</div>\r
		<label class="model-import-container">\r
			Select the model.zip file that you saved in the previous step.\r
			<div>\r
				<input title="Model file to import" class="model-import-file" type="file" accept="application/zip">\r
			</div>\r
		</label>\r
		<div slot="success">\r
			<div>The model that you selected looks good! \u{1F44D}</div>\r
		</div>\r
	</step-container>\r
</div>`,Pn="import-model-step";class Wt extends ut{static get observedAttributes(){return["style"]}constructor(){super(ui)}#t=null;#n=null;#e=null;#o=null;#r={...Tt};get stepState(){return this.#r}set stepState(s){s!==this.#r&&(this.#r=s,this?.toggleAttribute("valid",s.valid),this.#o?.toggleAttribute("valid",s.valid),this.#o?.setAttribute("step-issues",s.validationIssues?JSON.stringify((s.validationIssues||[]).map(d=>({type:"validation",message:d.detail}))):""),this.#e&&(this.#e.style.display=s.valid?"":"none"),this.#n&&(this.#n.style.display=s.valid?"none":""),this.dispatchEvent(new CustomEvent("stateChanged",{detail:s})))}#i=null;get#s(){return this.#i||(this.#i=this.templateRoot.querySelector(".root")),this.#i}connectedCallback(){this.#o=this.#s.querySelector(".step-container"),this.#n=this.#s.querySelector(".model-import-container"),this.#e=this.#s.querySelector(".model-reset-button"),this.#e?.addEventListener("click",()=>{this.stepState={valid:!1,validationIssues:F("No model data selected!").errors,data:null}}),this.#t=this.#s.querySelector(".model-import-file"),this.#t?.addEventListener("change",()=>void this.#a()),this.#a()}async#a(){const s={valid:!1,data:null},d=this.#t?.files;if(d&&d.length>0){const f=d[0];try{const m=await f.arrayBuffer();Object.assign(s,await En(m))}catch(m){s.valid=!1,s.validationIssues=q(`Could not load zip file, ${m}`).errors,console.error(m)}this.#t.value=""}else s.valid=!1,s.validationIssues=F("No model data selected!").errors;this.stepState=Object.freeze(s)}}customElements.define(Pn,Wt);const Fn="importModel",ci=Object.freeze(Object.defineProperty({__proto__:null,name:Fn,Renderer:Wt,elementName:Pn,ImportModelStep:Wt,validate:En,createNoModelSelectedError:Tn,createInvalidModelFileError:On,defaultState:Tt,serialize:oi,deserialize:si},Symbol.toStringTag,{value:"Module"})),In=`
/**
 * Runs the ASL prediction with the given model and input image
 * @param {tf.LayersModel} model The model to run the prediction with
 * @param {CanvasImageSource} imageSource The image to run prediction on
 * @param {boolean=false} loadMirrored If the image should be mirrored before running prediction
 * @param {string[]} classes The list of classes this model can predict
 */
async function predict(
  model: LayersModel,
  imageSource: CanvasImageSource,
  loadMirrored: boolean,
  classes: string[]
): 
Promise<{ 
  classification: string;
  confidence: number;
} | null> {
  
  // Extract joint positions from the image
  const jointPositionsResult = await extractAndProcessJointPositions(
    imageSource,
    loadMirrored
  );

  // Were any joint positions detected in the image?
  if (jointPositionsResult != null) {

    // Pull off the flattened, and the original joint positions from the jointPositionsResult
    const { jointPositionsFlat, jointPositions } = jointPositionsResult;

    // Run model prediction and get a class index
    const predictionResult = await classify(
      model,
      classes,
      jointPositionsFlat
    );

    // Cleanup the tensor that we created
    await cleanup(jointPositionsFlat);

    // Were we able to classify at all?
    if (predictionResult != null && predictionResult.classification != null) {
      return {
        ...predictionResult,
        jointPositions,
      };
    }
  }
  return null;
}
`,di=`<style>\r
  [slot='success'] {\r
    font-weight: bold;\r
  }\r
\r
  .editor-container {\r
    width: 100%;\r
    height: 600px;\r
  }\r
\r
  step-container::part(main) {\r
    /* max-width: 500px; */\r
    width: 80vw;\r
  }\r
\r
  .editor-container code-editor::part(main) {\r
    /* fills editor-container */\r
    height: 100%;\r
  }\r
\r
  .solution-editor::part(main) {\r
    margin-top: 5px;\r
  }\r
\r
  .solution-container code-editor::part(main) {\r
    /* fills editor-container */\r
    height: 600px;\r
  }\r
\r
  .solution-editor::part(main) {\r
    margin-top: 5px;\r
  }\r
\r
  .output-container {\r
	display: flex;\r
	flex-direction: column;\r
  }\r
  \r
  .predictions-output {\r
    text-align: center;\r
    margin: 10px;\r
  }\r
  \r
  .start-button {\r
    width: 100px;\r
    align-self: center;\r
  }\r
  \r
  .options {\r
    text-align: center;\r
/*     margin-top: 10px; */\r
  }\r
  \r
  .options .model-options h4 {\r
    margin-top: 0px;\r
    margin-bottom: 5px;\r
  }\r
  .options h4 {\r
    margin-top: 10px;\r
    margin-bottom: 10px;\r
  }\r
  \r
  fluent-divider {\r
    margin-top: 10px;\r
    margin-bottom: 10px;\r
  }\r
  \r
  .import-model-button::part(content)::before {\r
    content: "<div>test</div>"\r
  }\r
</style>\r
<div class="root">\r
  <step-container class="step-container">\r
    <div slot="name"></div>\r
	<div class="output-container">\r
		<h3 class="predictions-output">No Predictions</h3>\r
		<video-stream-viewer class="video-stream-viewer"></video-stream-viewer>\r
		<fluent-button class="start-button" appearance="accent">Start</fluent-button>\r
		<fluent-divider></fluent-divider>\r
		<div class="options">\r
		<div class="datasource-options">\r
			<h4>Datasource</h4>\r
			<fluent-select class="datasource-select" title="Select a data source">\r
			<fluent-option value="webcam">Webcam</fluent-option>\r
			</fluent-select>\r
		</div>\r
		</div>\r
	</div>\r
    <div slot="buttons-bottom">\r
      <div class="bottom-button-container">\r
        <fluent-button class="toggle-code-button">Show Code</fluent-button>\r
		<div class="editor-container">\r
		  <code-editor style="display: none" readonly hide-issues allow-background-execution class="code-editor"></code-editor>\r
		</div>\r
      </div>\r
    </div>\r
  </step-container>\r
</div>\r
`;class Mn extends ut{#t=null;#n=null;#e=null;#o=null;#r=null;#i=null;#s="webcam";#a=null;#c=!1;#l=null;constructor(){super(di)}#u=null;get#d(){return this.#u||(this.#u=this.templateRoot.querySelector(".root")),this.#u}#f={valid:!1};get stepState(){return this.#f}set stepState(s){s!==this.#f&&(this.#f=s)}#h=null;get pipelineState(){return this.#h}set pipelineState(s){this.#h=s,this.#i=null;const d=s?.steps.importModel?.data;d&&Pr(d).then(f=>{this.#i=f}),this.#m()}async predict(){if(this.#r&&this.#a&&this.#h&&this.#i){const s=this.#t.imageSource,d=s instanceof HTMLVideoElement;if(!d||s.readyState>=2){const f=await this.#a(this.#i,s,d,jt),m=f?`${f.classification} (${(f.confidence*100).toFixed(2)}%)`:"No Prediction";this.#S(m)}}}connectedCallback(){this.#t=this.#d.querySelector(".video-stream-viewer"),this.#n=this.#d.querySelector(".start-button"),this.#n.onclick=()=>this.#v(),this.#o=this.#d.querySelector(".predictions-output"),this.#e=this.#d.querySelector(".code-editor");const s=this.#d.querySelector(".toggle-code-button");if(this.#e){this.#e.addEventListener("change",()=>this.#m()),this.#e.setAttribute("code",In);let d=!1;s?.addEventListener("click",()=>{d=!d,this.#e.style.display=d?"":"none"})}super.connectedCallback()}#v(){this.#y()}async#y(){this.#c?await this.#p():await this.#b()}async#b(){await this.#p(),this.#c=!0,this.#n.innerText="Stop",await this.#w(),this.#l=(()=>{let s=!1;const d=async()=>{s||(await this.predict(),setTimeout(d,0))};return setTimeout(d,0),()=>s=!0})()}async#p(){this.#c=!1,this.#n.innerText="Start",await this.#g(),this.#l&&(this.#l(),this.#l=null)}async#w(){if(await this.#g(),this.#s==="webcam"){const s={video:!0,width:200,height:200};this.#r=await navigator.mediaDevices.getUserMedia(s),this.#t.stream=this.#r}}async#g(){this.#r&&(this.#r.getTracks().forEach(s=>s.stop()),this.#t.stream=null,this.#r=null)}#S(s){this.#o.innerText=s??""}#m(){if(this.#a=null,this.#e){const s=this.#e.getAttribute("transpiled-code");s&&(this.#a=ct(s,this.pipelineState))}}}customElements.define("run-step",Mn);const Kt={valid:!1,validationIssues:[],code:In};function fi(c){return JSON.stringify(c)}function hi(c){return c?JSON.parse(c):Kt}async function pi(c){try{if(c.instance){const s=c.instance,d=At([1,2,3]);let f=!1;if(d.dispose=()=>f=!0,await s(d),!f)return Nn()}else return F("Missing Implementation!")}catch(s){const d=`${s}`;return q(d)}return{valid:!0,errors:[]}}const Nn=()=>F("Your function did not clean up the tensor that was passed in."),Rn="run",gi=Object.freeze(Object.defineProperty({__proto__:null,name:Rn,Renderer:Mn,defaultState:Kt,serialize:fi,deserialize:hi,validate:pi,createNotCleanedUpError:Nn},Symbol.toStringTag,{value:"Module"})),xt=Object.freeze(Object.defineProperty({__proto__:null,classify:Kr,cleanup:ei,extractAndProcessJointPositions:ii,importModel:ci,run:gi},Symbol.toStringTag,{value:"Module"})),U=document.querySelector(".predict-contents"),sn=document.querySelector("step-controller"),lt=U.querySelector(".next-button"),mi=U.querySelector(".predict-container .breadcrumbs"),R=bi(),vi=Ln();async function yi(){U?.classList.add("initializing"),await Dr();const c=await Si();let s=Object.freeze({stepNum:1,name:R[0].getAttribute("name")});sn?.setAttribute("step",`${s}`),lt?.addEventListener("click",()=>{s.stepNum<R.length&&R[s.stepNum-1].stepState.valid&&m(s.stepNum+1)}),U.querySelector(".reset-button")?.addEventListener("click",()=>{const y=R[s.stepNum-1],j=y.getAttribute("name");y.stepState=vi.steps[j]});async function f(y,j){c.steps[y]={...j},await wi(c),s.name===y&&lt?.toggleAttribute("disabled",!c.steps[y].valid);for(const A of R)A.pipelineState=c;ln(R,c)}function m(y){const j=Math.min(y,R.length);s=Object.freeze({stepNum:j,name:R[j-1].getAttribute("name")}),window.location.hash=`#step${s.stepNum}`,sn?.setAttribute("step",`${s.stepNum}`);const A=R[s.stepNum-1].getAttribute("name");R[s.stepNum-1].stepState=c.steps[A],lt&&(lt.toggleAttribute("disabled",!c.steps[A].valid),lt.style.display=y===R.length?"none":""),ln(R,c)}m(an()||1),R.forEach(y=>{y.pipelineState=c;const j=y.getAttribute("name");j&&y.addEventListener("stateChanged",()=>void f(j,y.stepState))}),addEventListener("hashchange",()=>m(an())),U?.classList.add("ready"),U?.classList.remove("initializing")}function an(){return+((window.location.hash??null).replace("#step","")||"1")}function Ln(){return{steps:{importModel:{...Tt},extractAndProcessJointPositions:{...Et},classify:{...Ct},cleanup:{..._t},run:{...Kt}}}}function ln(c,s){for(let d=0;d<c.length;d++){const f=mi?.querySelector(`[step="${d+1}"]`);if(f){const m=c[d].getAttribute("name"),y=s.steps[m]?.valid??!1;f.classList.toggle("valid",y),f.classList.toggle("invalid",!y)}}}function bi(){return[U.querySelector(`[name="${Fn}"]`),U.querySelector(`[name="${_n}"]`),U.querySelector(`[name="${mn}"]`),U.querySelector(`[name="${wn}"]`),U.querySelector(`[name="${Rn}"]`)]}function wi(c){Object.keys(c.steps).forEach(s=>{if(s in xt&&s in c.steps){const d=xt[s].serialize(c.steps[s]);localStorage.setItem(`predict:${s}`,d??"")}})}function Si(){const c=Ln();return Object.keys(c.steps).forEach(s=>{if(s in xt&&s in c.steps){const d=localStorage.getItem(`predict:${s}`);c.steps[s]=xt[s].deserialize(d)}}),c}yi();
