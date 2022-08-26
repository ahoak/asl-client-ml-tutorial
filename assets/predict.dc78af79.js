import{c as Gt,t as ln,a as jt,b as ct,d as hn,e as N,f as Tr,j as Or,l as Pr,g as Mr,J as Fr,A as Ir,h as Nr,s as Rr}from"./utils.83332e14.js";import{B as dt}from"./VideoStreamViewer.750a7efa.js";const Lr=`<style>\r
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
`;class kr extends dt{static get observedAttributes(){return["style","name","step-issues","validating","valid"]}constructor(){super(Lr)}#t=null;#r=null;#e=null;#s=null;#n=null;#i=!1;#a=[];#o=!0;#u=null;get#l(){return this.#u||(this.#u=this.templateRoot.querySelector(".root")),this.#u}attributeChangedCallback(s,d,h){s==="step-issues"&&(this.#a=JSON.parse(this.getAttribute("step-issues")||"[]")),this.#c(s,h??"")}connectedCallback(){this.#t=this.#l.querySelector(".name"),this.#r=this.#l.querySelector(".validate-success"),this.#s=this.#l.querySelector(".validate-progress"),this.#e=this.#l.querySelector(".issue-container"),this.#n=this.#l.querySelector(".issue-display"),this.#i=!0,this.#c(),this.#o=!1}disconnectedCallback(){this.#i=!1}#c(s=null,d){if(this.#i){if(this.#d("style",s)&&(this.#l.style.cssText=d??this.getAttribute("style")??""),this.#d("name",s)&&(this.#t.innerHTML=d??this.getAttribute("name")??""),this.#d("validating",s)){const p=this.hasAttribute("validating");this.#s.style.display=p?"":"none"}this.#d("step-issues",s)&&this.#n.setAttribute("issues",JSON.stringify(this.#a));const h=this.#a.length>0;this.#e.style.display=h?"block":"none",this.#r.style.display=this.hasAttribute("valid")?"block":"none"}}#d(s,d){return this.#o||!d||d===s}}customElements.define("step-container",kr);const Br=`<style>
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
`;class zr extends dt{static get observedAttributes(){return["style","class","step","max-step"]}#t=null;#r=null;#e=null;#s=null;#n=null;#i=null;#a=null;constructor(){super(Br)}get step(){return this.#e}set step(s){this.setAttribute("step",`${s??""}`)}get maxStep(){return this.#s??0}set maxStep(s){if(s>0&&s!==this.maxStep)this.setAttribute("max-step",`${s??"0"}`);else throw new Error("max-step must be an integer greater than 0")}attributeChangedCallback(s,d,h){s==="style"?this.#c().style.cssText=h??"":s==="step"?(this.#e=h?parseInt(h,10):null,this.dispatchEvent(new CustomEvent("stepChanged",{detail:{step:this.#e??0}}))):s==="max-step"&&(this.#s=h?+h:0),this.#o()}connectedCallback(){this.#n=this.#c().querySelector(".contents slot"),this.#a=this.#c().querySelector(".header slot"),this.#i=this.#c().querySelector(".buttons slot"),this.#r=this.#c().querySelector(".next-button"),this.#r?.addEventListener("click",()=>this.step=(this.step??0)+1),this.#n?.addEventListener("slotchange",()=>this.#o()),this.#a?.addEventListener("slotchange",()=>this.#o()),this.#i?.addEventListener("slotchange",()=>this.#o()),this.#o()}#o(){const s=`${this.#e??"none"}`;if(this.#n&&this.#u(this.#n,s),this.#a&&this.#u(this.#a,s),this.#i&&this.#u(this.#i,s),this.#r){const d=(this.step??0)<this.maxStep;this.#r.toggleAttribute("disabled",!d),this.#r.part.toggle("disabled",!d)}}#u(s,d){const h=this.#l(s.assignedElements());for(const p of h){const y=p.getAttribute("step")===d;p.classList.toggle("active-step",y)}}#l(s){const d=[];return s.forEach(h=>{h instanceof HTMLElement&&((h.getAttribute("step")??h.getAttribute("data-step"))&&d.push(h),h.querySelectorAll("[step]").forEach(y=>{y instanceof HTMLElement&&(y.getAttribute("step")??y.getAttribute("data-step"))&&d.push(y)}))}),d}#c(){return this.#t||(this.#t=this.templateRoot.querySelector(".root")),this.#t}}customElements.define("step-controller",zr);var $r={};(function(){var c;function s(t){var e=0;return function(){return e<t.length?{done:!1,value:t[e++]}:{done:!0}}}var d=typeof Object.defineProperties=="function"?Object.defineProperty:function(t,e,n){return t==Array.prototype||t==Object.prototype||(t[e]=n.value),t};function h(t){t=[typeof globalThis=="object"&&globalThis,t,typeof window=="object"&&window,typeof self=="object"&&self,typeof Gt=="object"&&Gt];for(var e=0;e<t.length;++e){var n=t[e];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}var p=h(this);function y(t,e){if(e)t:{var n=p;t=t.split(".");for(var r=0;r<t.length-1;r++){var i=t[r];if(!(i in n))break t;n=n[i]}t=t[t.length-1],r=n[t],e=e(r),e!=r&&e!=null&&d(n,t,{configurable:!0,writable:!0,value:e})}}y("Symbol",function(t){function e(a){if(this instanceof e)throw new TypeError("Symbol is not a constructor");return new n(r+(a||"")+"_"+i++,a)}function n(a,o){this.g=a,d(this,"description",{configurable:!0,writable:!0,value:o})}if(t)return t;n.prototype.toString=function(){return this.g};var r="jscomp_symbol_"+(1e9*Math.random()>>>0)+"_",i=0;return e}),y("Symbol.iterator",function(t){if(t)return t;t=Symbol("Symbol.iterator");for(var e="Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "),n=0;n<e.length;n++){var r=p[e[n]];typeof r=="function"&&typeof r.prototype[t]!="function"&&d(r.prototype,t,{configurable:!0,writable:!0,value:function(){return A(s(this))}})}return t});function A(t){return t={next:t},t[Symbol.iterator]=function(){return this},t}function j(t){var e=typeof Symbol<"u"&&Symbol.iterator&&t[Symbol.iterator];return e?e.call(t):{next:s(t)}}function q(t){if(!(t instanceof Array)){t=j(t);for(var e,n=[];!(e=t.next()).done;)n.push(e.value);t=n}return t}var Tt=typeof Object.create=="function"?Object.create:function(t){function e(){}return e.prototype=t,new e},Ot;if(typeof Object.setPrototypeOf=="function")Ot=Object.setPrototypeOf;else{var Pt;t:{var Bn={a:!0},ne={};try{ne.__proto__=Bn,Pt=ne.a;break t}catch{}Pt=!1}Ot=Pt?function(t,e){if(t.__proto__=e,t.__proto__!==e)throw new TypeError(t+" is not extensible");return t}:null}var re=Ot;function G(t,e){if(t.prototype=Tt(e.prototype),t.prototype.constructor=t,re)re(t,e);else for(var n in e)if(n!="prototype")if(Object.defineProperties){var r=Object.getOwnPropertyDescriptor(e,n);r&&Object.defineProperty(t,n,r)}else t[n]=e[n];t.ra=e.prototype}function Mt(){this.l=!1,this.i=null,this.h=void 0,this.g=1,this.u=this.o=0,this.j=null}function Ft(t){if(t.l)throw new TypeError("Generator is already running");t.l=!0}Mt.prototype.s=function(t){this.h=t};function It(t,e){t.j={fa:e,ga:!0},t.g=t.o||t.u}Mt.prototype.return=function(t){this.j={return:t},this.g=this.u};function _(t,e,n){return t.g=n,{value:e}}function zn(t){this.g=new Mt,this.h=t}function $n(t,e){Ft(t.g);var n=t.g.i;return n?Nt(t,"return"in n?n.return:function(r){return{value:r,done:!0}},e,t.g.return):(t.g.return(e),K(t))}function Nt(t,e,n,r){try{var i=e.call(t.g.i,n);if(!(i instanceof Object))throw new TypeError("Iterator result "+i+" is not an object");if(!i.done)return t.g.l=!1,i;var a=i.value}catch(o){return t.g.i=null,It(t.g,o),K(t)}return t.g.i=null,r.call(t.g,a),K(t)}function K(t){for(;t.g.g;)try{var e=t.h(t.g);if(e)return t.g.l=!1,{value:e.value,done:!1}}catch(n){t.g.h=void 0,It(t.g,n)}if(t.g.l=!1,t.g.j){if(e=t.g.j,t.g.j=null,e.ga)throw e.fa;return{value:e.return,done:!0}}return{value:void 0,done:!0}}function Un(t){this.next=function(e){return Ft(t.g),t.g.i?e=Nt(t,t.g.i.next,e,t.g.s):(t.g.s(e),e=K(t)),e},this.throw=function(e){return Ft(t.g),t.g.i?e=Nt(t,t.g.i.throw,e,t.g.s):(It(t.g,e),e=K(t)),e},this.return=function(e){return $n(t,e)},this[Symbol.iterator]=function(){return this}}function Dn(t){function e(r){return t.next(r)}function n(r){return t.throw(r)}return new Promise(function(r,i){function a(o){o.done?r(o.value):Promise.resolve(o.value).then(e,n).then(a,i)}a(t.next())})}function M(t){return Dn(new Un(new zn(t)))}y("Promise",function(t){function e(o){this.h=0,this.i=void 0,this.g=[],this.s=!1;var l=this.j();try{o(l.resolve,l.reject)}catch(u){l.reject(u)}}function n(){this.g=null}function r(o){return o instanceof e?o:new e(function(l){l(o)})}if(t)return t;n.prototype.h=function(o){if(this.g==null){this.g=[];var l=this;this.i(function(){l.l()})}this.g.push(o)};var i=p.setTimeout;n.prototype.i=function(o){i(o,0)},n.prototype.l=function(){for(;this.g&&this.g.length;){var o=this.g;this.g=[];for(var l=0;l<o.length;++l){var u=o[l];o[l]=null;try{u()}catch(f){this.j(f)}}}this.g=null},n.prototype.j=function(o){this.i(function(){throw o})},e.prototype.j=function(){function o(f){return function(g){u||(u=!0,f.call(l,g))}}var l=this,u=!1;return{resolve:o(this.D),reject:o(this.l)}},e.prototype.D=function(o){if(o===this)this.l(new TypeError("A Promise cannot resolve to itself"));else if(o instanceof e)this.H(o);else{t:switch(typeof o){case"object":var l=o!=null;break t;case"function":l=!0;break t;default:l=!1}l?this.A(o):this.o(o)}},e.prototype.A=function(o){var l=void 0;try{l=o.then}catch(u){this.l(u);return}typeof l=="function"?this.I(l,o):this.o(o)},e.prototype.l=function(o){this.u(2,o)},e.prototype.o=function(o){this.u(1,o)},e.prototype.u=function(o,l){if(this.h!=0)throw Error("Cannot settle("+o+", "+l+"): Promise already settled in state"+this.h);this.h=o,this.i=l,this.h===2&&this.G(),this.B()},e.prototype.G=function(){var o=this;i(function(){if(o.C()){var l=p.console;typeof l<"u"&&l.error(o.i)}},1)},e.prototype.C=function(){if(this.s)return!1;var o=p.CustomEvent,l=p.Event,u=p.dispatchEvent;return typeof u>"u"?!0:(typeof o=="function"?o=new o("unhandledrejection",{cancelable:!0}):typeof l=="function"?o=new l("unhandledrejection",{cancelable:!0}):(o=p.document.createEvent("CustomEvent"),o.initCustomEvent("unhandledrejection",!1,!0,o)),o.promise=this,o.reason=this.i,u(o))},e.prototype.B=function(){if(this.g!=null){for(var o=0;o<this.g.length;++o)a.h(this.g[o]);this.g=null}};var a=new n;return e.prototype.H=function(o){var l=this.j();o.M(l.resolve,l.reject)},e.prototype.I=function(o,l){var u=this.j();try{o.call(l,u.resolve,u.reject)}catch(f){u.reject(f)}},e.prototype.then=function(o,l){function u(v,m){return typeof v=="function"?function(b){try{f(v(b))}catch(S){g(S)}}:m}var f,g,w=new e(function(v,m){f=v,g=m});return this.M(u(o,f),u(l,g)),w},e.prototype.catch=function(o){return this.then(void 0,o)},e.prototype.M=function(o,l){function u(){switch(f.h){case 1:o(f.i);break;case 2:l(f.i);break;default:throw Error("Unexpected state: "+f.h)}}var f=this;this.g==null?a.h(u):this.g.push(u),this.s=!0},e.resolve=r,e.reject=function(o){return new e(function(l,u){u(o)})},e.race=function(o){return new e(function(l,u){for(var f=j(o),g=f.next();!g.done;g=f.next())r(g.value).M(l,u)})},e.all=function(o){var l=j(o),u=l.next();return u.done?r([]):new e(function(f,g){function w(b){return function(S){v[b]=S,m--,m==0&&f(v)}}var v=[],m=0;do v.push(void 0),m++,r(u.value).M(w(v.length-1),g),u=l.next();while(!u.done)})},e});function Jn(t,e){t instanceof String&&(t+="");var n=0,r=!1,i={next:function(){if(!r&&n<t.length){var a=n++;return{value:e(a,t[a]),done:!1}}return r=!0,{done:!0,value:void 0}}};return i[Symbol.iterator]=function(){return i},i}var Vn=typeof Object.assign=="function"?Object.assign:function(t,e){for(var n=1;n<arguments.length;n++){var r=arguments[n];if(r)for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t};y("Object.assign",function(t){return t||Vn}),y("Object.is",function(t){return t||function(e,n){return e===n?e!==0||1/e===1/n:e!==e&&n!==n}}),y("Array.prototype.includes",function(t){return t||function(e,n){var r=this;r instanceof String&&(r=String(r));var i=r.length;for(n=n||0,0>n&&(n=Math.max(n+i,0));n<i;n++){var a=r[n];if(a===e||Object.is(a,e))return!0}return!1}}),y("String.prototype.includes",function(t){return t||function(e,n){if(this==null)throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");if(e instanceof RegExp)throw new TypeError("First argument to String.prototype.includes must not be a regular expression");return this.indexOf(e,n||0)!==-1}}),y("Array.prototype.keys",function(t){return t||function(){return Jn(this,function(e){return e})}});var Gn=this||self;function Z(t,e){t=t.split(".");var n=Gn;t[0]in n||typeof n.execScript>"u"||n.execScript("var "+t[0]);for(var r;t.length&&(r=t.shift());)t.length||e===void 0?n[r]&&n[r]!==Object.prototype[r]?n=n[r]:n=n[r]={}:n[r]=e}function H(){throw Error("Invalid UTF8")}function ie(t,e){return e=String.fromCharCode.apply(null,e),t==null?e:t+e}var oe,Hn=typeof TextDecoder<"u",se,Wn=typeof TextEncoder<"u",ae={},Q=null;function le(t){var e;e===void 0&&(e=0),ce(),e=ae[e];for(var n=Array(Math.floor(t.length/3)),r=e[64]||"",i=0,a=0;i<t.length-2;i+=3){var o=t[i],l=t[i+1],u=t[i+2],f=e[o>>2];o=e[(o&3)<<4|l>>4],l=e[(l&15)<<2|u>>6],u=e[u&63],n[a++]=f+o+l+u}switch(f=0,u=r,t.length-i){case 2:f=t[i+1],u=e[(f&15)<<2]||r;case 1:t=t[i],n[a]=e[t>>2]+e[(t&3)<<4|f>>4]+u+r}return n.join("")}function ue(t){var e=t.length,n=3*e/4;n%3?n=Math.floor(n):"=.".indexOf(t[e-1])!=-1&&(n="=.".indexOf(t[e-2])!=-1?n-2:n-1);var r=new Uint8Array(n),i=0;return qn(t,function(a){r[i++]=a}),i!==n?r.subarray(0,i):r}function qn(t,e){function n(u){for(;r<t.length;){var f=t.charAt(r++),g=Q[f];if(g!=null)return g;if(!/^[\s\xa0]*$/.test(f))throw Error("Unknown base64 encoding at char: "+f)}return u}ce();for(var r=0;;){var i=n(-1),a=n(0),o=n(64),l=n(64);if(l===64&&i===-1)break;e(i<<2|a>>4),o!=64&&(e(a<<4&240|o>>2),l!=64&&e(o<<6&192|l))}}function ce(){if(!Q){Q={};for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),e=["+/=","+/","-_=","-_.","-_"],n=0;5>n;n++){var r=t.concat(e[n].split(""));ae[n]=r;for(var i=0;i<r.length;i++){var a=r[i];Q[a]===void 0&&(Q[a]=i)}}}}var de=typeof Uint8Array=="function";function Rt(t){return de&&t!=null&&t instanceof Uint8Array}var ht;function he(t){if(this.L=t,t!==null&&t.length===0)throw Error("ByteString should be constructed with non-empty values")}var Xn=typeof Uint8Array.prototype.slice=="function",D=0,J=0;function Yn(t,e){if(t.constructor===Uint8Array)return t;if(t.constructor===ArrayBuffer)return new Uint8Array(t);if(t.constructor===Array)return new Uint8Array(t);if(t.constructor===String)return ue(t);if(t.constructor===he)return!e&&(e=t.L)&&e.constructor===Uint8Array?e:(e=t.L,e=e==null||Rt(e)?e:typeof e=="string"?ue(e):null,(t=t.L=e)?new Uint8Array(t):ht||(ht=new Uint8Array(0)));if(t instanceof Uint8Array)return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, or Array of numbers")}function fe(t,e){return Error("Invalid wire type: "+t+" (at position "+e+")")}function Lt(){return Error("Failed to read varint, encoding is invalid.")}function pe(t,e){e=e===void 0?{}:e,e=e.v===void 0?!1:e.v,this.h=null,this.g=this.i=this.j=0,this.v=e,t&&kt(this,t)}function kt(t,e){t.h=Yn(e,t.v),t.j=0,t.i=t.h.length,t.g=t.j}pe.prototype.reset=function(){this.g=this.j};function F(t){if(t.g>t.i)throw Error("Tried to read past the end of the data "+t.g+" > "+t.i)}function tt(t){var e=t.h,n=e[t.g],r=n&127;if(128>n)return t.g+=1,F(t),r;if(n=e[t.g+1],r|=(n&127)<<7,128>n)return t.g+=2,F(t),r;if(n=e[t.g+2],r|=(n&127)<<14,128>n)return t.g+=3,F(t),r;if(n=e[t.g+3],r|=(n&127)<<21,128>n)return t.g+=4,F(t),r;if(n=e[t.g+4],t.g+=5,r|=(n&15)<<28,128>n)return F(t),r;if(128<=e[t.g++]&&128<=e[t.g++]&&128<=e[t.g++]&&128<=e[t.g++]&&128<=e[t.g++])throw Lt();return F(t),r}var ge=[];function Bt(){this.g=[]}Bt.prototype.length=function(){return this.g.length},Bt.prototype.end=function(){var t=this.g;return this.g=[],t};function W(t,e){for(;127<e;)t.g.push(e&127|128),e>>>=7;t.g.push(e)}function me(t){var e={},n=e.W===void 0?!1:e.W;this.l={v:e.v===void 0?!1:e.v},this.W=n,e=this.l,ge.length?(n=ge.pop(),e&&(n.v=e.v),t&&kt(n,t),t=n):t=new pe(t,e),this.g=t,this.j=this.g.g,this.h=this.i=-1}me.prototype.reset=function(){this.g.reset(),this.j=this.g.g,this.h=this.i=-1};function ve(t){var e=t.g;if(e.g==e.i)return!1;t.j=t.g.g;var n=tt(t.g)>>>0;if(e=n>>>3,n&=7,!(0<=n&&5>=n))throw fe(n,t.j);if(1>e)throw Error("Invalid field number: "+e+" (at position "+t.j+")");return t.i=e,t.h=n,!0}function ft(t){switch(t.h){case 0:if(t.h!=0)ft(t);else t:{t=t.g;for(var e=t.g,n=e+10;e<n;)if((t.h[e++]&128)===0){t.g=e,F(t);break t}throw Lt()}break;case 1:t=t.g,t.g+=8,F(t);break;case 2:t.h!=2?ft(t):(e=tt(t.g)>>>0,t=t.g,t.g+=e,F(t));break;case 5:t=t.g,t.g+=4,F(t);break;case 3:e=t.i;do{if(!ve(t))throw Error("Unmatched start-group tag: stream EOF");if(t.h==4){if(t.i!=e)throw Error("Unmatched end-group tag");break}ft(t)}while(1);break;default:throw fe(t.h,t.j)}}var pt=[];function Kn(){this.i=[],this.h=0,this.g=new Bt}function X(t,e){e.length!==0&&(t.i.push(e),t.h+=e.length)}function Zn(t,e){if(e=e.ca){X(t,t.g.end());for(var n=0;n<e.length;n++)X(t,e[n])}}var gt=typeof Symbol=="function"&&typeof Symbol()=="symbol"?Symbol(void 0):void 0;function ye(t,e){Object.isFrozen(t)||(gt?t[gt]|=e:t.N!==void 0?t.N|=e:Object.defineProperties(t,{N:{value:e,configurable:!0,writable:!0,enumerable:!1}}))}function be(t){var e;return gt?e=t[gt]:e=t.N,e??0}function et(t){return ye(t,1),t}function nt(t){return Array.isArray(t)?!!(be(t)&2):!1}function zt(t){if(!Array.isArray(t))throw Error("cannot mark non-array as immutable");ye(t,2)}function we(t){return t!==null&&typeof t=="object"&&!Array.isArray(t)&&t.constructor===Object}var mt=Object.freeze(et([]));function Se(t){if(nt(t.m))throw Error("Cannot mutate an immutable Message")}var xe=typeof Symbol<"u"&&typeof Symbol.hasInstance<"u";function je(t){return{value:t,configurable:!1,writable:!1,enumerable:!1}}function B(t,e,n){return e===-1?null:e>=t.i?t.g?t.g[e]:void 0:(n===void 0?0:n)&&t.g&&(n=t.g[e],n!=null)?n:t.m[e+t.h]}function T(t,e,n,r){r=r===void 0?!1:r,Se(t),e<t.i&&!r?t.m[e+t.h]=n:(t.g||(t.g=t.m[t.i+t.h]={}))[e]=n}function Ae(t,e,n,r){n=n===void 0?!0:n,r=r===void 0?!1:r;var i=B(t,e,r);return i==null&&(i=mt),nt(t.m)?n&&(zt(i),Object.freeze(i)):(i===mt||nt(i))&&(i=et(i.slice()),T(t,e,i,r)),i}function $(t,e,n){return t=B(t,e),t=t==null?t:+t,t??(n===void 0?0:n)}function rt(t,e,n,r){t.j||(t.j={});var i=nt(t.m),a=t.j[n];if(!a){r=Ae(t,n,!0,r===void 0?!1:r),a=[],i=i||nt(r);for(var o=0;o<r.length;o++)a[o]=new e(r[o]),i&&zt(a[o].m);i&&(zt(a),Object.freeze(a)),t.j[n]=a}return a}function Ce(t,e,n,r,i){var a=a===void 0?!1:a;return Se(t),a=rt(t,n,e,a),n=r||new n,t=Ae(t,e),i!=null?(a.splice(i,0,n),t.splice(i,0,n.m)):(a.push(n),t.push(n.m)),n}function Ee(t,e){return t=B(t,e),t??0}function _e(t,e){return t=B(t,e),t??""}function Qn(t){switch(typeof t){case"number":return isFinite(t)?t:String(t);case"object":if(t&&!Array.isArray(t)){if(Rt(t))return le(t);if(t instanceof he){var e=t.L;return e=e==null||typeof e=="string"?e:de&&e instanceof Uint8Array?le(e):null,(t.L=e)||""}}}return t}function Te(t){var e=tr;return e=e===void 0?er:e,Pe(t,e)}function Oe(t,e){if(t!=null){if(Array.isArray(t))t=Pe(t,e);else if(we(t)){var n={},r;for(r in t)n[r]=Oe(t[r],e);t=n}else t=e(t);return t}}function Pe(t,e){for(var n=t.slice(),r=0;r<n.length;r++)n[r]=Oe(n[r],e);return Array.isArray(t)&&be(t)&1&&et(n),n}function tr(t){return t&&typeof t=="object"&&t.toJSON?t.toJSON():(t=Qn(t),Array.isArray(t)?Te(t):t)}function er(t){return Rt(t)?new Uint8Array(t):t}function vt(t,e,n){t||(t=Me),Me=null;var r=this.constructor.h;t||(t=r?[r]:[]),this.h=(r?0:-1)-(this.constructor.g||0),this.j=void 0,this.m=t;t:{if(r=this.m.length,t=r-1,r&&(r=this.m[t],we(r))){this.i=t-this.h,this.g=r;break t}e!==void 0&&-1<e?(this.i=Math.max(e,t+1-this.h),this.g=void 0):this.i=Number.MAX_VALUE}if(n)for(e=0;e<n.length;e++)if(t=n[e],t<this.i)t+=this.h,(r=this.m[t])?Array.isArray(r)&&et(r):this.m[t]=mt;else{r=this.g||(this.g=this.m[this.i+this.h]={});var i=r[t];i?Array.isArray(i)&&et(i):r[t]=mt}}vt.prototype.toJSON=function(){return Te(this.m)},vt.prototype.toString=function(){return this.m.toString()};var Me;function yt(){vt.apply(this,arguments)}if(G(yt,vt),xe){var Fe={};Object.defineProperties(yt,(Fe[Symbol.hasInstance]=je(function(){throw Error("Cannot perform instanceof checks for MutableMessage")}),Fe))}function Ie(t,e,n){if(n){var r={},i;for(i in n){var a=n[i],o=a.ja;o||(r.F=a.pa||a.ha.P,a.ba?(r.U=ke(a.ba),o=function(l){return function(u,f,g){return l.F(u,f,g,l.U)}}(r)):a.da?(r.T=Be(a.X.g,a.da),o=function(l){return function(u,f,g){return l.F(u,f,g,l.T)}}(r)):o=r.F,a.ja=o),o(e,t,a.X),r={F:r.F,U:r.U,T:r.T}}}Zn(e,t)}var bt=Symbol();function Ne(t,e,n){return t[bt]||(t[bt]=function(r,i){return e(r,i,n)})}function Re(t){var e=t[bt];if(!e){var n=De(t);e=function(r,i){return Je(r,i,n)},t[bt]=e}return e}function nr(t){var e=t.ba;if(e)return Re(e);if(e=t.oa)return Ne(t.X.g,e,t.da)}function rr(t){var e=nr(t),n=t.X,r=t.ha.O;return e?function(i,a){return r(i,a,n,e)}:function(i,a){return r(i,a,n)}}function Le(t,e,n,r,i,a){t=t();var o=0;for(t.length&&typeof t[0]!="number"&&(n(e,t[0]),o++);o<t.length;){n=t[o++];for(var l=o+1;l<t.length&&typeof t[l]!="number";)l++;var u=t[o++];switch(l-=o,l){case 0:r(e,n,u);break;case 1:r(e,n,u,t[o++]);break;case 2:i(e,n,u,t[o++],t[o++]);break;case 3:l=t[o++];var f=t[o++],g=t[o++];Array.isArray(g)?i(e,n,u,l,f,g):a(e,n,u,l,f,g);break;case 4:a(e,n,u,t[o++],t[o++],t[o++],t[o++]);break;default:throw Error("unexpected number of binary field arguments: "+l)}}return e}var wt=Symbol();function ke(t){var e=t[wt];if(!e){var n=$e(t);e=function(r,i){return Ve(r,i,n)},t[wt]=e}return e}function Be(t,e){var n=t[wt];return n||(n=function(r,i){return Ie(r,i,e)},t[wt]=n),n}var ze=Symbol();function ir(t,e){t.push(e)}function or(t,e,n){t.push(e,n.P)}function sr(t,e,n,r,i){var a=ke(i),o=n.P;t.push(e,function(l,u,f){return o(l,u,f,r,a)})}function ar(t,e,n,r,i,a){var o=Be(r,a),l=n.P;t.push(e,function(u,f,g){return l(u,f,g,r,o)})}function $e(t){var e=t[ze];return e||Le(t,t[ze]=[],ir,or,sr,ar)}var Ue=Symbol();function lr(t,e){t[0]=e}function ur(t,e,n,r){var i=n.O;t[e]=r?function(a,o,l){return i(a,o,l,r)}:i}function cr(t,e,n,r,i,a){var o=n.O,l=Re(i);t[e]=function(u,f,g){return o(u,f,g,r,l,a)}}function dr(t,e,n,r,i,a,o){var l=n.O,u=Ne(r,i,a);t[e]=function(f,g,w){return l(f,g,w,r,u,o)}}function De(t){var e=t[Ue];return e||Le(t,t[Ue]={},lr,ur,cr,dr)}function Je(t,e,n){for(;ve(e)&&e.h!=4;){var r=e.i,i=n[r];if(!i){var a=n[0];a&&(a=a[r])&&(i=n[r]=rr(a))}if((!i||!i(e,t,r))&&(i=e,r=t,a=i.j,ft(i),!i.W)){var o=i.g.h;i=i.g.g,i=a===i?ht||(ht=new Uint8Array(0)):Xn?o.slice(a,i):new Uint8Array(o.subarray(a,i)),(a=r.ca)?a.push(i):r.ca=[i]}}return t}function it(t,e,n){if(pt.length){var r=pt.pop();t&&(kt(r.g,t),r.i=-1,r.h=-1),t=r}else t=new me(t);try{return Je(new e,t,De(n))}finally{e=t.g,e.h=null,e.j=0,e.i=0,e.g=0,e.v=!1,t.i=-1,t.h=-1,100>pt.length&&pt.push(t)}}function Ve(t,e,n){for(var r=n.length,i=r%2==1,a=i?1:0;a<r;a+=2)(0,n[a+1])(e,t,n[a]);Ie(t,e,i?n[0]:void 0)}function $t(t,e){var n=new Kn;Ve(t,n,$e(e)),X(n,n.g.end()),t=new Uint8Array(n.h),e=n.i;for(var r=e.length,i=0,a=0;a<r;a++){var o=e[a];t.set(o,i),i+=o.length}return n.i=[t],t}function ot(t,e){return{O:t,P:e}}var z=ot(function(t,e,n){if(t.h!==5)return!1;t=t.g;var r=t.h[t.g],i=t.h[t.g+1],a=t.h[t.g+2],o=t.h[t.g+3];return t.g+=4,F(t),i=(r<<0|i<<8|a<<16|o<<24)>>>0,t=2*(i>>31)+1,r=i>>>23&255,i&=8388607,T(e,n,r==255?i?NaN:1/0*t:r==0?t*Math.pow(2,-149)*i:t*Math.pow(2,r-150)*(i+Math.pow(2,23))),!0},function(t,e,n){if(e=B(e,n),e!=null){W(t.g,8*n+5),t=t.g;var r=e;r=(n=0>r?1:0)?-r:r,r===0?0<1/r?D=J=0:(J=0,D=2147483648):isNaN(r)?(J=0,D=2147483647):34028234663852886e22<r?(J=0,D=(n<<31|2139095040)>>>0):11754943508222875e-54>r?(r=Math.round(r/Math.pow(2,-149)),J=0,D=(n<<31|r)>>>0):(e=Math.floor(Math.log(r)/Math.LN2),r*=Math.pow(2,-e),r=Math.round(8388608*r),16777216<=r&&++e,J=0,D=(n<<31|e+127<<23|r&8388607)>>>0),n=D,t.g.push(n>>>0&255),t.g.push(n>>>8&255),t.g.push(n>>>16&255),t.g.push(n>>>24&255)}}),hr=ot(function(t,e,n){if(t.h!==0)return!1;for(var r=t.g,i=128,a=0,o=t=0;4>o&&128<=i;o++)i=r.h[r.g++],F(r),a|=(i&127)<<7*o;if(128<=i&&(i=r.h[r.g++],F(r),a|=(i&127)<<28,t|=(i&127)>>4),128<=i)for(o=0;5>o&&128<=i;o++)i=r.h[r.g++],F(r),t|=(i&127)<<7*o+3;if(128>i)r=a>>>0,i=t>>>0,(t=i&2147483648)&&(r=~r+1>>>0,i=~i>>>0,r==0&&(i=i+1>>>0)),r=4294967296*i+(r>>>0);else throw Lt();return T(e,n,t?-r:r),!0},function(t,e,n){if(e=B(e,n),e!=null&&e!=null){W(t.g,8*n),t=t.g;var r=e;for(n=0>r,r=Math.abs(r),e=r>>>0,r=Math.floor((r-e)/4294967296),r>>>=0,n&&(r=~r>>>0,e=(~e>>>0)+1,4294967295<e&&(e=0,r++,4294967295<r&&(r=0))),D=e,J=r,n=D,e=J;0<e||127<n;)t.g.push(n&127|128),n=(n>>>7|e<<25)>>>0,e>>>=7;t.g.push(n)}}),fr=ot(function(t,e,n){return t.h!==0?!1:(T(e,n,tt(t.g)),!0)},function(t,e,n){if(e=B(e,n),e!=null&&e!=null)if(W(t.g,8*n),t=t.g,n=e,0<=n)W(t,n);else{for(e=0;9>e;e++)t.g.push(n&127|128),n>>=7;t.g.push(1)}}),Ge=ot(function(t,e,n){if(t.h!==2)return!1;var r=tt(t.g)>>>0;t=t.g;var i=t.g;t.g+=r,F(t),t=t.h;var a;if(Hn)(a=oe)||(a=oe=new TextDecoder("utf-8",{fatal:!0})),a=a.decode(t.subarray(i,i+r));else{r=i+r;for(var o=[],l=null,u,f,g;i<r;)u=t[i++],128>u?o.push(u):224>u?i>=r?H():(f=t[i++],194>u||(f&192)!==128?(i--,H()):o.push((u&31)<<6|f&63)):240>u?i>=r-1?H():(f=t[i++],(f&192)!==128||u===224&&160>f||u===237&&160<=f||((a=t[i++])&192)!==128?(i--,H()):o.push((u&15)<<12|(f&63)<<6|a&63)):244>=u?i>=r-2?H():(f=t[i++],(f&192)!==128||(u<<28)+(f-144)>>30!==0||((a=t[i++])&192)!==128||((g=t[i++])&192)!==128?(i--,H()):(u=(u&7)<<18|(f&63)<<12|(a&63)<<6|g&63,u-=65536,o.push((u>>10&1023)+55296,(u&1023)+56320))):H(),8192<=o.length&&(l=ie(l,o),o.length=0);a=ie(l,o)}return T(e,n,a),!0},function(t,e,n){if(e=B(e,n),e!=null){var r=!1;if(r=r===void 0?!1:r,Wn){if(r&&/(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(e))throw Error("Found an unpaired surrogate");e=(se||(se=new TextEncoder)).encode(e)}else{for(var i=0,a=new Uint8Array(3*e.length),o=0;o<e.length;o++){var l=e.charCodeAt(o);if(128>l)a[i++]=l;else{if(2048>l)a[i++]=l>>6|192;else{if(55296<=l&&57343>=l){if(56319>=l&&o<e.length){var u=e.charCodeAt(++o);if(56320<=u&&57343>=u){l=1024*(l-55296)+u-56320+65536,a[i++]=l>>18|240,a[i++]=l>>12&63|128,a[i++]=l>>6&63|128,a[i++]=l&63|128;continue}else o--}if(r)throw Error("Found an unpaired surrogate");l=65533}a[i++]=l>>12|224,a[i++]=l>>6&63|128}a[i++]=l&63|128}}e=a.subarray(0,i)}W(t.g,8*n+2),W(t.g,e.length),X(t,t.g.end()),X(t,e)}}),He=ot(function(t,e,n,r,i){if(t.h!==2)return!1;e=Ce(e,n,r),n=t.g.i,r=tt(t.g)>>>0;var a=t.g.g+r,o=a-n;if(0>=o&&(t.g.i=a,i(e,t),o=a-t.g.g),o)throw Error("Message parsing ended unexpectedly. Expected to read "+(r+" bytes, instead read "+(r-o)+" bytes, either the data ended unexpectedly or the message misreported its own length"));return t.g.g=a,t.g.i=n,!0},function(t,e,n,r,i){if(e=rt(e,r,n),e!=null)for(r=0;r<e.length;r++){var a=t;W(a.g,8*n+2);var o=a.g.end();X(a,o),o.push(a.h),a=o,i(e[r],t),o=t;var l=a.pop();for(l=o.h+o.g.length()-l;127<l;)a.push(l&127|128),l>>>=7,o.h++;a.push(l),o.h++}});function L(){yt.apply(this,arguments)}if(G(L,yt),xe){var We={};Object.defineProperties(L,(We[Symbol.hasInstance]=je(Object[Symbol.hasInstance]),We))}function st(t){L.call(this,t)}G(st,L);function qe(){return[1,fr,2,z,3,Ge,4,Ge]}function St(t){L.call(this,t,-1,pr)}G(St,L),St.prototype.addClassification=function(t,e){return Ce(this,1,st,t,e),this};function Xe(){return[1,He,st,qe]}var pr=[1];function at(t){L.call(this,t)}G(at,L);function Ye(){return[1,z,2,z,3,z,4,z,5,z]}function Ut(t){L.call(this,t,-1,gr)}G(Ut,L);function Ke(){return[1,He,at,Ye]}var gr=[1];function Dt(t){L.call(this,t)}G(Dt,L);function Ze(){return[1,z,2,z,3,z,4,z,5,z,6,hr]}function Qe(t,e,n){if(n=t.createShader(n===0?t.VERTEX_SHADER:t.FRAGMENT_SHADER),t.shaderSource(n,e),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))throw Error(`Could not compile WebGL shader.

`+t.getShaderInfoLog(n));return n}function tn(t){return rt(t,st,1).map(function(e){return{index:Ee(e,1),score:$(e,2),label:B(e,3)!=null?_e(e,3):void 0,displayName:B(e,4)!=null?_e(e,4):void 0}})}function en(t){return{x:$(t,1),y:$(t,2),z:$(t,3),visibility:B(t,4)!=null?$(t,4):void 0}}function nn(t){return t.map(function(e){return rt(it(e,Ut,Ke),at,1).map(en)})}function Jt(t,e){this.h=t,this.g=e,this.l=0}function rn(t,e,n){return mr(t,e),typeof t.g.canvas.transferToImageBitmap=="function"?Promise.resolve(t.g.canvas.transferToImageBitmap()):n?Promise.resolve(t.g.canvas):typeof createImageBitmap=="function"?createImageBitmap(t.g.canvas):(t.i===void 0&&(t.i=document.createElement("canvas")),new Promise(function(r){t.i.height=t.g.canvas.height,t.i.width=t.g.canvas.width,t.i.getContext("2d",{}).drawImage(t.g.canvas,0,0,t.g.canvas.width,t.g.canvas.height),r(t.i)}))}function mr(t,e){var n=t.g;if(t.o===void 0){var r=Qe(n,`
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`,0),i=Qe(n,`
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D sampler0;
  void main(){
    gl_FragColor = texture2D(sampler0, vTex);
  }`,1),a=n.createProgram();if(n.attachShader(a,r),n.attachShader(a,i),n.linkProgram(a),!n.getProgramParameter(a,n.LINK_STATUS))throw Error(`Could not compile WebGL program.

`+n.getProgramInfoLog(a));r=t.o=a,n.useProgram(r),i=n.getUniformLocation(r,"sampler0"),t.j={K:n.getAttribLocation(r,"aVertex"),J:n.getAttribLocation(r,"aTex"),qa:i},t.u=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,t.u),n.enableVertexAttribArray(t.j.K),n.vertexAttribPointer(t.j.K,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),t.s=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,t.s),n.enableVertexAttribArray(t.j.J),n.vertexAttribPointer(t.j.J,2,n.FLOAT,!1,0,0),n.bufferData(n.ARRAY_BUFFER,new Float32Array([0,1,0,0,1,0,1,1]),n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),n.uniform1i(i,0)}r=t.j,n.useProgram(t.o),n.canvas.width=e.width,n.canvas.height=e.height,n.viewport(0,0,e.width,e.height),n.activeTexture(n.TEXTURE0),t.h.bindTexture2d(e.glName),n.enableVertexAttribArray(r.K),n.bindBuffer(n.ARRAY_BUFFER,t.u),n.vertexAttribPointer(r.K,2,n.FLOAT,!1,0,0),n.enableVertexAttribArray(r.J),n.bindBuffer(n.ARRAY_BUFFER,t.s),n.vertexAttribPointer(r.J,2,n.FLOAT,!1,0,0),n.bindFramebuffer(n.DRAW_FRAMEBUFFER?n.DRAW_FRAMEBUFFER:n.FRAMEBUFFER,null),n.clearColor(0,0,0,0),n.clear(n.COLOR_BUFFER_BIT),n.colorMask(!0,!0,!0,!0),n.drawArrays(n.TRIANGLE_FAN,0,4),n.disableVertexAttribArray(r.K),n.disableVertexAttribArray(r.J),n.bindBuffer(n.ARRAY_BUFFER,null),t.h.bindTexture2d(0)}function vr(t){this.g=t}var yr=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,9,1,7,0,65,0,253,15,26,11]);function br(t,e){return e+t}function on(t,e){window[t]=e}function wr(t){var e=document.createElement("script");return e.setAttribute("src",t),e.setAttribute("crossorigin","anonymous"),new Promise(function(n){e.addEventListener("load",function(){n()},!1),e.addEventListener("error",function(){n()},!1),document.body.appendChild(e)})}function Sr(){return M(function(t){switch(t.g){case 1:return t.o=2,_(t,WebAssembly.instantiate(yr),4);case 4:t.g=3,t.o=0;break;case 2:return t.o=0,t.j=null,t.return(!1);case 3:return t.return(!0)}})}function Vt(t){if(this.g=t,this.listeners={},this.j={},this.H={},this.o={},this.u={},this.I=this.s=this.$=!0,this.D=Promise.resolve(),this.Z="",this.C={},this.locateFile=t&&t.locateFile||br,typeof window=="object")var e=window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/";else if(typeof location<"u")e=location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/";else throw Error("solutions can only be loaded on a web page or in a web worker");if(this.aa=e,t.options){e=j(Object.keys(t.options));for(var n=e.next();!n.done;n=e.next()){n=n.value;var r=t.options[n].default;r!==void 0&&(this.j[n]=typeof r=="function"?r():r)}}}c=Vt.prototype,c.close=function(){return this.i&&this.i.delete(),Promise.resolve()};function xr(t){var e,n,r,i,a,o,l,u,f,g,w;return M(function(v){switch(v.g){case 1:return t.$?(e=t.g.files===void 0?[]:typeof t.g.files=="function"?t.g.files(t.j):t.g.files,_(v,Sr(),2)):v.return();case 2:if(n=v.h,typeof window=="object")return on("createMediapipeSolutionsWasm",{locateFile:t.locateFile}),on("createMediapipeSolutionsPackedAssets",{locateFile:t.locateFile}),o=e.filter(function(m){return m.data!==void 0}),l=e.filter(function(m){return m.data===void 0}),u=Promise.all(o.map(function(m){var b=xt(t,m.url);if(m.path!==void 0){var S=m.path;b=b.then(function(E){return t.overrideFile(S,E),Promise.resolve(E)})}return b})),f=Promise.all(l.map(function(m){return m.simd===void 0||m.simd&&n||!m.simd&&!n?wr(t.locateFile(m.url,t.aa)):Promise.resolve()})).then(function(){var m,b,S;return M(function(E){if(E.g==1)return m=window.createMediapipeSolutionsWasm,b=window.createMediapipeSolutionsPackedAssets,S=t,_(E,m(b),2);S.h=E.h,E.g=0})}),g=function(){return M(function(m){return t.g.graph&&t.g.graph.url?m=_(m,xt(t,t.g.graph.url),0):(m.g=0,m=void 0),m})}(),_(v,Promise.all([f,u,g]),7);if(typeof importScripts!="function")throw Error("solutions can only be loaded on a web page or in a web worker");return r=e.filter(function(m){return m.simd===void 0||m.simd&&n||!m.simd&&!n}).map(function(m){return t.locateFile(m.url,t.aa)}),importScripts.apply(null,q(r)),i=t,_(v,createMediapipeSolutionsWasm(Module),6);case 6:i.h=v.h,t.l=new OffscreenCanvas(1,1),t.h.canvas=t.l,a=t.h.GL.createContext(t.l,{antialias:!1,alpha:!1,na:typeof WebGL2RenderingContext<"u"?2:1}),t.h.GL.makeContextCurrent(a),v.g=4;break;case 7:if(t.l=document.createElement("canvas"),w=t.l.getContext("webgl2",{}),!w&&(w=t.l.getContext("webgl",{}),!w))return alert("Failed to create WebGL canvas context when passing video frame."),v.return();t.G=w,t.h.canvas=t.l,t.h.createContext(t.l,!0,!0,{});case 4:t.i=new t.h.SolutionWasm,t.$=!1,v.g=0}})}function jr(t){var e,n,r,i,a,o,l,u;return M(function(f){if(f.g==1){if(t.g.graph&&t.g.graph.url&&t.Z===t.g.graph.url)return f.return();if(t.s=!0,!t.g.graph||!t.g.graph.url){f.g=2;return}return t.Z=t.g.graph.url,_(f,xt(t,t.g.graph.url),3)}for(f.g!=2&&(e=f.h,t.i.loadGraph(e)),n=j(Object.keys(t.C)),r=n.next();!r.done;r=n.next())i=r.value,t.i.overrideFile(i,t.C[i]);if(t.C={},t.g.listeners)for(a=j(t.g.listeners),o=a.next();!o.done;o=a.next())l=o.value,_r(t,l);u=t.j,t.j={},t.setOptions(u),f.g=0})}c.reset=function(){var t=this;return M(function(e){t.i&&(t.i.reset(),t.o={},t.u={}),e.g=0})},c.setOptions=function(t,e){var n=this;if(e=e||this.g.options){for(var r=[],i=[],a={},o=j(Object.keys(t)),l=o.next();!l.done;a={R:a.R,S:a.S},l=o.next()){var u=l.value;u in this.j&&this.j[u]===t[u]||(this.j[u]=t[u],l=e[u],l!==void 0&&(l.onChange&&(a.R=l.onChange,a.S=t[u],r.push(function(f){return function(){var g;return M(function(w){if(w.g==1)return _(w,f.R(f.S),2);g=w.h,g===!0&&(n.s=!0),w.g=0})}}(a))),l.graphOptionXref&&(u={valueNumber:l.type===1?t[u]:0,valueBoolean:l.type===0?t[u]:!1,valueString:l.type===2?t[u]:""},l=Object.assign(Object.assign(Object.assign({},{calculatorName:"",calculatorIndex:0}),l.graphOptionXref),u),i.push(l))))}(r.length!==0||i.length!==0)&&(this.s=!0,this.B=(this.B===void 0?[]:this.B).concat(i),this.A=(this.A===void 0?[]:this.A).concat(r))}};function Ar(t){var e,n,r,i,a,o,l;return M(function(u){switch(u.g){case 1:if(!t.s)return u.return();if(!t.A){u.g=2;break}e=j(t.A),n=e.next();case 3:if(n.done){u.g=5;break}return r=n.value,_(u,r(),4);case 4:n=e.next(),u.g=3;break;case 5:t.A=void 0;case 2:if(t.B){for(i=new t.h.GraphOptionChangeRequestList,a=j(t.B),o=a.next();!o.done;o=a.next())l=o.value,i.push_back(l);t.i.changeOptions(i),i.delete(),t.B=void 0}t.s=!1,u.g=0}})}c.initialize=function(){var t=this;return M(function(e){return e.g==1?_(e,xr(t),2):e.g!=3?_(e,jr(t),3):_(e,Ar(t),0)})};function xt(t,e){var n,r;return M(function(i){return e in t.H?i.return(t.H[e]):(n=t.locateFile(e,""),r=fetch(n).then(function(a){return a.arrayBuffer()}),t.H[e]=r,i.return(r))})}c.overrideFile=function(t,e){this.i?this.i.overrideFile(t,e):this.C[t]=e},c.clearOverriddenFiles=function(){this.C={},this.i&&this.i.clearOverriddenFiles()},c.send=function(t,e){var n=this,r,i,a,o,l,u,f,g,w;return M(function(v){switch(v.g){case 1:return n.g.inputs?(r=1e3*(e??performance.now()),_(v,n.D,2)):v.return();case 2:return _(v,n.initialize(),3);case 3:for(i=new n.h.PacketDataList,a=j(Object.keys(t)),o=a.next();!o.done;o=a.next())if(l=o.value,u=n.g.inputs[l]){t:{var m=t[l];switch(u.type){case"video":var b=n.o[u.stream];if(b||(b=new Jt(n.h,n.G),n.o[u.stream]=b),b.l===0&&(b.l=b.h.createTexture()),typeof HTMLVideoElement<"u"&&m instanceof HTMLVideoElement)var S=m.videoWidth,E=m.videoHeight;else typeof HTMLImageElement<"u"&&m instanceof HTMLImageElement?(S=m.naturalWidth,E=m.naturalHeight):(S=m.width,E=m.height);E={glName:b.l,width:S,height:E},S=b.g,S.canvas.width=E.width,S.canvas.height=E.height,S.activeTexture(S.TEXTURE0),b.h.bindTexture2d(b.l),S.texImage2D(S.TEXTURE_2D,0,S.RGBA,S.RGBA,S.UNSIGNED_BYTE,m),b.h.bindTexture2d(0),b=E;break t;case"detections":for(b=n.o[u.stream],b||(b=new vr(n.h),n.o[u.stream]=b),b.data||(b.data=new b.g.DetectionListData),b.data.reset(m.length),E=0;E<m.length;++E){S=m[E];var C=b.data,P=C.setBoundingBox,k=E,I=S.ea,x=new Dt;if(T(x,1,I.ka),T(x,2,I.la),T(x,3,I.height),T(x,4,I.width),T(x,5,I.rotation),T(x,6,I.ia),I=$t(x,Ze),P.call(C,k,I),S.Y)for(C=0;C<S.Y.length;++C){x=S.Y[C];var O=!!x.visibility;P=b.data,k=P.addNormalizedLandmark,I=E,x=Object.assign(Object.assign({},x),{visibility:O?x.visibility:0}),O=new at,T(O,1,x.x),T(O,2,x.y),T(O,3,x.z),x.visibility&&T(O,4,x.visibility),x=$t(O,Ye),k.call(P,I,x)}if(S.V)for(C=0;C<S.V.length;++C)P=b.data,k=P.addClassification,I=E,x=S.V[C],O=new st,T(O,2,x.score),x.index&&T(O,1,x.index),x.label&&T(O,3,x.label),x.displayName&&T(O,4,x.displayName),x=$t(O,qe),k.call(P,I,x)}b=b.data;break t;default:b={}}}switch(f=b,g=u.stream,u.type){case"video":i.pushTexture2d(Object.assign(Object.assign({},f),{stream:g,timestamp:r}));break;case"detections":w=f,w.stream=g,w.timestamp=r,i.pushDetectionList(w);break;default:throw Error("Unknown input config type: '"+u.type+"'")}}return n.i.send(i),_(v,n.D,4);case 4:i.delete(),v.g=0}})};function Cr(t,e,n){var r,i,a,o,l,u,f,g,w,v,m,b,S,E;return M(function(C){switch(C.g){case 1:if(!n)return C.return(e);for(r={},i=0,a=j(Object.keys(n)),o=a.next();!o.done;o=a.next())l=o.value,u=n[l],typeof u!="string"&&u.type==="texture"&&e[u.stream]!==void 0&&++i;1<i&&(t.I=!1),f=j(Object.keys(n)),o=f.next();case 2:if(o.done){C.g=4;break}if(g=o.value,w=n[g],typeof w=="string")return S=r,E=g,_(C,Er(t,g,e[w]),14);if(v=e[w.stream],w.type==="detection_list"){if(v){for(var P=v.getRectList(),k=v.getLandmarksList(),I=v.getClassificationsList(),x=[],O=0;O<P.size();++O){var V=it(P.get(O),Dt,Ze);V={ea:{ka:$(V,1),la:$(V,2),height:$(V,3),width:$(V,4),rotation:$(V,5,0),ia:Ee(V,6)},Y:rt(it(k.get(O),Ut,Ke),at,1).map(en),V:tn(it(I.get(O),St,Xe))},x.push(V)}P=x}else P=[];r[g]=P,C.g=7;break}if(w.type==="proto_list"){if(v){for(P=Array(v.size()),k=0;k<v.size();k++)P[k]=v.get(k);v.delete()}else P=[];r[g]=P,C.g=7;break}if(v===void 0){C.g=3;break}if(w.type==="float_list"){r[g]=v,C.g=7;break}if(w.type==="proto"){r[g]=v,C.g=7;break}if(w.type!=="texture")throw Error("Unknown output config type: '"+w.type+"'");return m=t.u[g],m||(m=new Jt(t.h,t.G),t.u[g]=m),_(C,rn(m,v,t.I),13);case 13:b=C.h,r[g]=b;case 7:w.transform&&r[g]&&(r[g]=w.transform(r[g])),C.g=3;break;case 14:S[E]=C.h;case 3:o=f.next(),C.g=2;break;case 4:return C.return(r)}})}function Er(t,e,n){var r;return M(function(i){return typeof n=="number"||n instanceof Uint8Array||n instanceof t.h.Uint8BlobList?i.return(n):n instanceof t.h.Texture2dDataOut?(r=t.u[e],r||(r=new Jt(t.h,t.G),t.u[e]=r),i.return(rn(r,n,t.I))):i.return(void 0)})}function _r(t,e){for(var n=e.name||"$",r=[].concat(q(e.wants)),i=new t.h.StringList,a=j(e.wants),o=a.next();!o.done;o=a.next())i.push_back(o.value);a=t.h.PacketListener.implement({onResults:function(l){for(var u={},f=0;f<e.wants.length;++f)u[r[f]]=l.get(f);var g=t.listeners[n];g&&(t.D=Cr(t,u,e.outs).then(function(w){w=g(w);for(var v=0;v<e.wants.length;++v){var m=u[r[v]];typeof m=="object"&&m.hasOwnProperty&&m.hasOwnProperty("delete")&&m.delete()}w&&(t.D=w)}))}}),t.i.attachMultiListener(i,a),i.delete()}c.onResults=function(t,e){this.listeners[e||"$"]=t},Z("Solution",Vt),Z("OptionType",{BOOL:0,NUMBER:1,ma:2,0:"BOOL",1:"NUMBER",2:"STRING"});function sn(t){return t===void 0&&(t=0),t===1?"hand_landmark_full.tflite":"hand_landmark_lite.tflite"}function an(t){var e=this;t=t||{},this.g=new Vt({locateFile:t.locateFile,files:function(n){return[{url:"hands_solution_packed_assets_loader.js"},{simd:!1,url:"hands_solution_wasm_bin.js"},{simd:!0,url:"hands_solution_simd_wasm_bin.js"},{data:!0,url:sn(n.modelComplexity)}]},graph:{url:"hands.binarypb"},inputs:{image:{type:"video",stream:"input_frames_gpu"}},listeners:[{wants:["multi_hand_landmarks","multi_hand_world_landmarks","image_transformed","multi_handedness"],outs:{image:"image_transformed",multiHandLandmarks:{type:"proto_list",stream:"multi_hand_landmarks",transform:nn},multiHandWorldLandmarks:{type:"proto_list",stream:"multi_hand_world_landmarks",transform:nn},multiHandedness:{type:"proto_list",stream:"multi_handedness",transform:function(n){return n.map(function(r){return tn(it(r,St,Xe))[0]})}}}}],options:{useCpuInference:{type:0,graphOptionXref:{calculatorType:"InferenceCalculator",fieldName:"use_cpu_inference"},default:typeof window!="object"||window.navigator===void 0?!1:"iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document},selfieMode:{type:0,graphOptionXref:{calculatorType:"GlScalerCalculator",calculatorIndex:1,fieldName:"flip_horizontal"}},maxNumHands:{type:1,graphOptionXref:{calculatorType:"ConstantSidePacketCalculator",calculatorName:"ConstantSidePacketCalculator",fieldName:"int_value"}},modelComplexity:{type:1,graphOptionXref:{calculatorType:"ConstantSidePacketCalculator",calculatorName:"ConstantSidePacketCalculatorModelComplexity",fieldName:"int_value"},onChange:function(n){var r,i,a;return M(function(o){return o.g==1?(r=sn(n),i="third_party/mediapipe/modules/hand_landmark/"+r,_(o,xt(e.g,r),2)):(a=o.h,e.g.overrideFile(i,a),o.return(!0))})}},minDetectionConfidence:{type:1,graphOptionXref:{calculatorType:"TensorsToDetectionsCalculator",calculatorName:"handlandmarktrackinggpu__palmdetectiongpu__TensorsToDetectionsCalculator",fieldName:"min_score_thresh"}},minTrackingConfidence:{type:1,graphOptionXref:{calculatorType:"ThresholdingCalculator",calculatorName:"handlandmarktrackinggpu__handlandmarkgpu__ThresholdingCalculator",fieldName:"threshold"}}}})}c=an.prototype,c.close=function(){return this.g.close(),Promise.resolve()},c.onResults=function(t){this.g.onResults(t)},c.initialize=function(){var t=this;return M(function(e){return _(e,t.g.initialize(),0)})},c.reset=function(){this.g.reset()},c.send=function(t){var e=this;return M(function(n){return _(n,e.g.send(t),0)})},c.setOptions=function(t){this.g.setOptions(t)},Z("Hands",an),Z("HAND_CONNECTIONS",[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]]),Z("VERSION","0.4.1646424915")}).call(Gt);function Ur(c){const s=c.reduce((d,h)=>Math.max(Math.abs(d),Math.abs(h)),c[0]);return c.map(d=>d/s)}function Dr(c){return c.reduce((s,d,h)=>s===void 0||d>c[s]?h:s,void 0)}function Jr(c,s,d){const h="videoWidth"in c?c.videoWidth:c.width,p="videoHeight"in c?c.videoHeight:c.height,y=c,A=s.canvas??s;A.width=h,A.height=p,d?(s.translate(h,0),s.scale(-1,1),s.drawImage(y,0,0),s.setTransform(1,0,0,1,0,0)):s.drawImage(y,0,0)}const fn=document.createElement("canvas"),Vr=fn.getContext("2d"),Gr=document.createElement("canvas");class Hr{#t=null;#r=null;constructor(){this.#e()}#e(){this.#t||(console.log("loading hand model..."),this.#t=new($r.Hands||window.Hands)({locateFile:s=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${s}`}),this.#t.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:.5,minTrackingConfidence:.5}),this.#t.onResults(this.#s))}async warmup(s=Gr){await this.extract(s,!1)}async extract(s,d){return new Promise(h=>{this.#r=h,Jr(s,Vr,d),this.#t.send({image:fn})})}#s=s=>{this.#r((s.multiHandLandmarks??[]).reduce((d,h)=>(h.length>0&&d.push(h),d),[]))}}const pn=new Hr;function Wr(c){return pn.warmup(c)}async function qr(c,s){return pn.extract(c,s)}function At(c,s){const d=Object.keys(s?.steps||{})||[],h=d.map(y=>(s?.steps)[y].instance)||[];return new Function("extractAllJointPositions","tf","tfjs","defaultModelClasses","argMax","normalize",...d,`return (${c.replace(/export/g,"")})`)(qr,ln,ln,jt,Dr,Ur,...h)}const Xr=`<style>\r
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
		<div slot="buttons-top">\r
			<fluent-button class="toggle-code-button">Toggle Code</fluent-button>\r
		</div>\r
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
</div>`,Yr=["style"];class gn extends dt{static get observedAttributes(){return Yr}#t=null;#r=null;#e=null;#s=null;#n=null;#i;defaultCode;solutionCode;successMessage;showCodeToggleButton;codeHints;validate;readonly;constructor({defaultCode:s,defaultState:d,solutionCode:h,readonly:p,showCodeToggleButton:y=!1,hints:A,validate:j,template:q=Xr,successMessage:Tt}){super(q),this.defaultCode=s,this.solutionCode=h??null,this.successMessage=Tt??null,this.showCodeToggleButton=y??!1,this.readonly=p??!1,this.codeHints=A??null,this.validate=j,this.#i={...d}}get codeVisible(){return this.#t?.style.display!=="none"}set codeVisible(s){this.#t&&(this.#t.style.display=s?"":"none")}get solutionVisible(){return this.#n?.style.display!=="none"}set solutionVisible(s){this.#n&&(this.#n.style.display=s?"":"none")}get stepState(){return this.#i}set stepState(s){const d=this.#i;if(s!==this.#i){this.#i=s,d.code!==s.code&&this.#t?.setAttribute("code",s.code||this.defaultCode),this?.toggleAttribute("valid",s.valid),this.#r?.toggleAttribute("valid",s.valid);const h=s.syntaxIssues||[];h.length===0&&h.push(...(s.validationIssues||[]).map(p=>({type:"validation",message:p.detail}))),this.#r?.setAttribute("step-issues",h?JSON.stringify(h||[]):""),this?.toggleAttribute("valid",s.valid),this.dispatchEvent(new CustomEvent("stateChanged",{detail:s}))}}#a=null;get root(){return this.#a||(this.#a=this.templateRoot.querySelector(".root")),this.#a}connectedCallback(){this.#t=this.root.querySelector(".code-editor"),this.#r=this.root.querySelector(".step-container"),this.#n=this.root.querySelector(".solution-editor"),this.#e=this.root.querySelector(".toggle-solution-button"),this.#s=this.root.querySelector(".toggle-code-button"),this.solutionCode?(this.#n?.setAttribute("code",this.solutionCode),this.#e?.addEventListener("click",()=>{this.solutionVisible=!this.solutionVisible})):this.#e&&(this.#e.style.display="none"),this.#s&&(this.#s.style.display=this.showCodeToggleButton?"":"none",this.#s.addEventListener("click",()=>{this.codeVisible=!this.codeVisible}));const s=this.root.querySelector(".success-message");this.successMessage&&s&&(s.innerHTML=this.successMessage),this.#t?.toggleAttribute("readonly",this.readonly),this.#t?.setAttribute("code",this.stepState.code||this.defaultCode),this.#t?.setAttribute("hints",JSON.stringify(this.codeHints||{})),this.#t?.addEventListener("change",d=>{this.#o(d.detail)})}async#o(s){let d,h,p;s?{code:d,transpiledCode:h,issues:p}=s:(d=this.#t?.getAttribute("code")||"",h=this.#t?.getAttribute("transpiled-code")||"",p=JSON.parse(this.#t?.getAttribute("issues")||"[]"));const y=(p??[]).filter(j=>j.type==="error"||j.type==="warning")||[],A={valid:!1,code:d,transpiledCode:h,syntaxIssues:y,data:null,instance:null};if(A.valid=y.length===0,A.validationIssues=[],A.instance=void 0,A.transpiledCode&&A?.syntaxIssues?.length===0)try{A.instance=At(A.transpiledCode);const j=await this.validate(A,null);A.valid=j.valid,A.validationIssues.push(...j.errors||[])}catch(j){A.valid=!1,A.validationIssues.push(...ct(`${j}`).errors)}this.stepState=Object.freeze(A)}}const mn=(c,s,d)=>`
  // This will return an Tensor containing a match confidence (0 - 1) for each sign
  const predictionTensor = model.predict(${c});

  // Copy the prediction tensor into to a javascript array
  const prediction = predictionTensor.dataSync();

  // This will contain the index of the sign with the highest confidence
  const predictedClassIndex = 

    /* Go through all the confidences, and find the one that is the highest */
    predictionTensor
      .argMax()

      /* Copy the data off of the gpu into a regular array, and get the first element */
      .dataSync()[0];

  return {
    // Map the predicted index to the actual sign
    classification: classes[${s}],

    // Get the original confidence
    confidence: prediction[${d}],
  }
`,vn=(c,s,d,h="classify")=>`
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
function ${h}(model: LayersModel, classes: string[], tensor: Tensor1D): {
  classification: string,
  confidence: number,
} | null {
${mn(c,s,d)}
}
`,qt="tensor",Xt="predictedClassIndex",Yt="predictedClassIndex",Ht="/*\u2728INSERT_HERE\u2728*/",yn=vn(Ht,Ht,Ht),Kr=vn(qt,Xt,Yt,"classifySolution"),Zr={answer1:{code:qt},answer2:{code:Xt},answer3:{code:Yt},solution:{code:mn(qt,Xt,Yt)}},bn=63,Qr=hn(Array.from({length:bn}).map(()=>Math.random()*2-1)).expandDims(0),Kt="C",ti=()=>hn(jt.map(c=>c===Kt?1:0));async function wn(c){try{const s=c.instance,d=ti(),h=Tr({});h.predict=y=>d;const p=await s(h,jt,Qr);if(!p||!p.classification)return N(`
classify() didn't return anything OR the correct format.<br>
It should return an object of the form: <br>
<pre>
return {
  classification: "&lt;Some sign&gt;",
  confidence: &lt;some number from 0 - 1&gt;
}
</pre>
`);if(p.classification!==Kt)return N(`classify() returned <b>"${p.classification}"</b>, but it should've returned <b>"${Kt}"</b>`)}catch(s){const d=`${s}`;return d.indexOf("Implement")>=0?N("Your implementation is incomplete"):ct(d)}return{valid:!0,errors:[]}}const Sn=()=>N(`
It should return an object of the form: <br />
<pre>
return {
        // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
        jointPositionsFlat,

        // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
        jointPositions,
}
</pre>
`),ei=(c=null)=>N(`
Your jointPositionsFlat value is not the correct length.<br />
It should have a length of ${bn}, but 
${c!=null?`${c} was returned`:"the incorrect length was returned."}.<br />
Remember the format for the <b>jointPositionsFlat</b> property
should be:<br />
<pre>[x1, y1, z1, x2, y2, z2...., xN, yN, zN]</pre>
`),Ct={valid:!1,validationIssues:Sn().errors,code:yn};function ni(c){return JSON.stringify(c)}function ri(c){if(c){const s=JSON.parse(c);if(s.transpiledCode)try{s.instance=At(s.transpiledCode)}catch(d){console.error(d)}return s}return Ct}class xn extends gn{constructor(){super({defaultCode:yn,defaultState:Ct,solutionCode:Kr,validate:wn,hints:Zr})}}customElements.define("classify-step",xn);const jn="classify",ii=!0,oi=Object.freeze(Object.defineProperty({__proto__:null,name:jn,userMutable:ii,Renderer:xn,defaultState:Ct,serialize:ni,deserialize:ri,validate:wn,createIncorrectReturnTypeError:Sn,createIncorrectReturnShapeError:ei},Symbol.toStringTag,{value:"Module"})),An=`
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
`,si="/asl-client-ml-tutorial/data/testImage.jpg",Y=document.createElement("img");Y.setAttribute("crossorigin","anonymous");const Cn=63;async function En(c){if(c.instance){const s=new Promise((h,p)=>{Y.onload=h,Y.onerror=p});Y.src=si,await s;let d=null;try{const h=await c.instance(Y,!1);if(h?.jointPositionsFlat&&h.jointPositionsFlat.size!==Cn)return _n(h.jointPositionsFlat.size??null);if(!h||!h.jointPositionsFlat)return te();d=[h]}catch(h){return ct(`${h}`)}return{valid:!0,errors:[],data:d}}else return{valid:!1,errors:N("No implementation found!").errors}}const te=()=>N(`
It should return an object of the form: <br />
<pre>
return {
        // flattened should look like [x1, y1, z1, x2, y2, z2...., xN, yN, zN]
        jointPositionsFlat,

        // This will look like [{ x, y, z }, { x, y, z } ... for every joint]
        jointPositions,
}
</pre>
`),_n=(c=null)=>N(`
Your jointPositionsFlat value is not the correct length.<br />
It should have a length of ${Cn}, but 
${c!=null?`${c} was returned`:"the incorrect length was returned."}.<br />
Remember the format for the <b>jointPositionsFlat</b> property
should be:<br />
<pre>[x1, y1, z1, x2, y2, z2...., xN, yN, zN]</pre>
`),Et={valid:!1,validationIssues:te().errors,code:An};function ai(c){return JSON.stringify(c)}function li(c){if(c){const s=JSON.parse(c);if(s.transpiledCode)try{s.instance=At(s.transpiledCode)}catch(d){console.error(d)}return s}return Et}const ui=`<style>\r
	[slot="success"] {\r
		font-weight: bold;\r
	}\r
\r
	.contents {\r
		width: 100%;\r
	}\r
\r
	step-container::part(main) {\r
		/* max-width: 500px; */\r
		width: 80vw;\r
	}\r
\r
	.contents {\r
		display: flex;\r
		flex-direction: column;\r
	}\r
\r
	.editor-container {\r
		height: 600px;\r
	}\r
\r
	.toggle-code-button {\r
		align-self: center;\r
	}\r
\r
	.description {\r
		text-align: left;\r
		align-self: center;\r
	}\r
\r
	.editor-container code-editor::part(main) {\r
		/* fills editor-container */\r
		height: 100%;\r
	}\r
\r
	.description-header {\r
		text-align: center;\r
	}\r
</style>\r
<div class="root">\r
	<step-container class="step-container">\r
		<div slot="name">\r
		</div>\r
		<div slot="success" name="success">\r
			<div class="success-message">Looking Good! \u{1F44D}</div>\r
		</div>\r
		<div class="contents">\r
			<div class="description">\r
				<h3 class="description-header">Basic Process</h3>\r
				<ol>\r
					<li>Use the Mediapipe model to extract the set of joint positions from an image, in this case, your\r
						webcam.</li>\r
					<li>Flatten the joint positions into an array of values with the format:\r
						<code>[joint1_x, joint1_y, joint1_z, ..., jointN_x, jointN_y, jointN_z]</code></li>\r
					<li>Normalize the flattened joint positions so that their values are scaled from -1 to 1.</li>\r
				</ol>\r
			</div>\r
			<fluent-button class="toggle-code-button">Toggle Code</fluent-button>\r
			<div class="editor-container">\r
				<code-editor style="display: none;" hide-issues class="code-editor"></code-editor>\r
			</div>\r
		</div>\r
	</step-container>\r
</div>`;class Tn extends gn{constructor(){super({defaultCode:An,defaultState:Et,validate:En,readonly:!0,showCodeToggleButton:!0,template:ui})}}customElements.define("extract-and-process-joint-positions-step",Tn);const On="extractAndProcessJointPositions",ci=!1,di=Object.freeze(Object.defineProperty({__proto__:null,name:On,userMutable:ci,Renderer:Tn,defaultState:Et,serialize:ai,deserialize:li,validateImageSource:Y,validate:En,createIncorrectReturnTypeError:te,createIncorrectReturnShapeError:_n},Symbol.toStringTag,{value:"Module"}));async function Zt(c,s){const d={valid:!1,data:null};if(c)try{const h=await Or.exports.loadAsync(c);"model.json"in h.files?(d.data=c,d.valid=!0):d.validationIssues=Mn().errors}catch(h){d.validationIssues=ct(`${h}`).errors,console.error(h)}else d.validationIssues=N("No model data selected!").errors;return d}const Pn=()=>N("No model data selected!"),Mn=()=>N("The file that was selected does not contain a model.json file!"),_t={valid:!1,validationIssues:Pn().errors};function hi(c){if(c){const s={...c};return c.data&&(s.data=gi(c.data)),JSON.stringify(s)}return null}function fi(c){if(c)try{const s=JSON.parse(c);return s.data&&(s.data=pi(s.data)),s}catch(s){console.error("could not deserialize state",s)}return _t}function pi(c){const s=window.atob(c),d=s.length,h=new Uint8Array(d);for(let p=0;p<d;p++)h[p]=s.charCodeAt(p);return h.buffer}function gi(c){let s="";const d=new Uint8Array(c),h=d.byteLength;for(let p=0;p<h;p++)s+=String.fromCharCode(d[p]);return window.btoa(s)}const mi=`<style>\r
	[slot="success"] {\r
		font-weight: bold;\r
	}\r
\r
	step-container::part(main) {\r
		width: 500px;\r
	}\r
\r
</style>\r
<div class="root">\r
	<step-container class="step-container">\r
		<div slot="name">Import Model</div>\r
		<div class="model-import-container">\r
			<div class="localstorage-import">\r
				Continue with the model you created from the "Build" tutorial.\r
				<div>\r
					<fluent-button class="localstorage-import-button" appearance="basic">Load from "Build"</fluent-button>\r
				</div>\r
			</div>\r
			<h3>OR</h3>\r
			<div class="zip-file-import">\r
				Select a different model.zip file that you downloaded to your machine.\r
				<div>\r
					<input title="Model file to import" class="model-import-file" type="file" accept="application/zip">\r
				</div>\r
			</div>\r
		</div>\r
		<div slot="success">\r
			<div>The model that you selected is valid \u{1F44D}</div>\r
		</div>\r
	</step-container>\r
</div>`,Fn="import-model-step";class Qt extends dt{static get observedAttributes(){return["style"]}constructor(){super(mi)}#t=null;#r=null;#e=null;#s=null;#n=null;#i={..._t};get stepState(){return this.#i}set stepState(s){s!==this.#i&&(this.#i=s,this?.toggleAttribute("valid",s.valid),this.#n?.toggleAttribute("valid",s.valid),this.#n?.setAttribute("step-issues",s.validationIssues?JSON.stringify((s.validationIssues||[]).map(d=>({type:"validation",message:d.detail}))):""),this.#s&&(this.#s.style.display=s.valid?"":"none"),this.#e&&(this.#e.style.display=s.valid?"none":""),this.dispatchEvent(new CustomEvent("stateChanged",{detail:s})))}#a=null;get#o(){return this.#a||(this.#a=this.templateRoot.querySelector(".root")),this.#a}connectedCallback(){this.#n=this.#o.querySelector(".step-container"),this.#e=this.#o.querySelector(".model-import-container"),this.#r=this.#o.querySelector(".localstorage-import-button"),this.#r?.addEventListener("click",()=>void this.#u()),this.#s=this.#o.querySelector(".model-reset-button"),this.#s?.addEventListener("click",()=>{this.stepState={valid:!1,validationIssues:N("No model data selected!").errors,data:null}}),this.#t=this.#o.querySelector(".model-import-file"),this.#t?.addEventListener("change",()=>void this.#l()),this.#l()}async#u(){const s={valid:!1,data:null};try{const d=await Pr(Mr),h=new Fr,y=await d.save(new Ir);Object.keys(y.data).forEach((j,q)=>{q===0?h.file(j,JSON.stringify(y.data[j])):h.file(j,y.data[j])});const A=await h.generateAsync({type:"arraybuffer"});Object.assign(s,await Zt(A))}catch(d){s.valid=!1,s.validationIssues=N(`Could not load model from "Build" step!: ${d}`).errors,console.error(d)}this.stepState=Object.freeze(s)}async#l(){const s={valid:!1,data:null},d=this.#t?.files;if(d&&d.length>0){const h=d[0];try{const p=await h.arrayBuffer();Object.assign(s,await Zt(p))}catch(p){s.valid=!1,s.validationIssues=ct(`Could not load zip file, ${p}`).errors,console.error(p)}this.#t.value=""}else s.valid=!1,s.validationIssues=N("No model data selected!").errors;this.stepState=Object.freeze(s)}}customElements.define(Fn,Qt);const vi=!0,In="importModel",yi=Object.freeze(Object.defineProperty({__proto__:null,userMutable:vi,name:In,Renderer:Qt,elementName:Fn,ImportModelStep:Qt,validate:Zt,createNoModelSelectedError:Pn,createInvalidModelFileError:Mn,defaultState:_t,serialize:hi,deserialize:fi},Symbol.toStringTag,{value:"Module"})),Nn=`
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
    jointPositionsFlat.dispose();

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
`,bi=`<style>\r
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
    content: '<div>test</div>';\r
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
      <div class="options"></div>\r
    </div>\r
    <div slot="buttons-bottom">\r
      <div class="bottom-button-container">\r
        <fluent-button class="toggle-code-button">Show Code</fluent-button>\r
        <div class="editor-container">\r
          <code-editor\r
            style="display: none"\r
            readonly\r
            hide-issues\r
            allow-background-execution\r
            class="code-editor"\r
          ></code-editor>\r
        </div>\r
      </div>\r
    </div>\r
  </step-container>\r
</div>\r
`;class Rn extends dt{#t=null;#r=null;#e=null;#s=null;#n=null;#i=null;#a="webcam";#o=null;#u=!1;#l=null;constructor(){super(bi)}#c=null;get#d(){return this.#c||(this.#c=this.templateRoot.querySelector(".root")),this.#c}#h={valid:!1};get stepState(){return this.#h}set stepState(s){s!==this.#h&&(this.#h=s)}#f=null;get pipelineState(){return this.#f}set pipelineState(s){this.#f=s,this.#i=null;const d=s?.steps.importModel?.data;d&&Nr(d).then(h=>{this.#i=h}),this.#m()}async predict(){if(this.#n&&this.#o&&this.#f&&this.#i){const s=this.#t.imageSource,d=s instanceof HTMLVideoElement;if(!d||s.readyState>=2){const h=await this.#o(this.#i,s,d,jt),p=h?`${h.classification} (${(h.confidence*100).toFixed(2)}%)`:"No Prediction";this.#S(p)}}}connectedCallback(){this.#t=this.#d.querySelector(".video-stream-viewer"),this.#r=this.#d.querySelector(".start-button"),this.#r.onclick=()=>this.#v(),this.#s=this.#d.querySelector(".predictions-output"),this.#e=this.#d.querySelector(".code-editor");const s=this.#d.querySelector(".toggle-code-button");if(this.#e){this.#e.addEventListener("change",()=>this.#m()),this.#e.setAttribute("code",Nn);let d=!1;s?.addEventListener("click",()=>{d=!d,this.#e.style.display=d?"":"none"})}super.connectedCallback()}#v(){this.#y()}async#y(){this.#u?await this.#p():await this.#b()}async#b(){await this.#p(),this.#u=!0,this.#r.innerText="Stop",await this.#w(),this.#l=(()=>{let s=!1;const d=async()=>{s||(await this.predict(),setTimeout(d,0))};return setTimeout(d,0),()=>s=!0})()}async#p(){this.#u=!1,this.#r.innerText="Start",await this.#g(),this.#l&&(this.#l(),this.#l=null)}async#w(){if(await this.#g(),this.#a==="webcam"){const s={video:!0,width:200,height:200};this.#n=await navigator.mediaDevices.getUserMedia(s),this.#t.stream=this.#n}}async#g(){this.#n&&(this.#n.getTracks().forEach(s=>s.stop()),this.#t.stream=null,this.#n=null)}#S(s){this.#s.innerText=s??""}#m(){if(this.#o=null,this.#e){const s=this.#e.getAttribute("transpiled-code");s&&(this.#o=At(s,this.pipelineState))}}}customElements.define("run-step",Rn);const ee={valid:!1,validationIssues:[],code:Nn};function wi(c){return JSON.stringify(c)}function Si(c){return c?JSON.parse(c):ee}const Ln="run",xi=!1,ji=Object.freeze(Object.defineProperty({__proto__:null,name:Ln,userMutable:xi,Renderer:Rn,defaultState:ee,serialize:wi,deserialize:Si},Symbol.toStringTag,{value:"Module"})),ut=Object.freeze(Object.defineProperty({__proto__:null,classify:oi,extractAndProcessJointPositions:di,importModel:yi,run:ji},Symbol.toStringTag,{value:"Module"}));Rr("predict");const U=document.querySelector(".predict-contents"),un=document.querySelector("step-controller"),lt=U.querySelector(".next-button"),Wt=U.querySelector(".reset-button"),Ai=U.querySelector(".predict-container .breadcrumbs"),R=_i(),Ci=kn();async function Ei(){U?.classList.add("initializing"),await Wr();const c=await Oi();let s=Object.freeze({stepNum:1,name:R[0].getAttribute("name")});un?.setAttribute("step",`${s}`),lt?.addEventListener("click",()=>{s.stepNum<R.length&&R[s.stepNum-1].stepState.valid&&h(s.stepNum+1)}),Wt?.addEventListener("click",()=>{const p=R[s.stepNum-1],y=p.getAttribute("name");p.stepState=Ci.steps[y]});async function d(p,y){c.steps[p]={...y},await Ti(c),s.name===p&&lt?.toggleAttribute("disabled",!c.steps[p].valid);for(const A of R)A.pipelineState=c;dn(R,c)}function h(p){const y=Math.min(p,R.length);s=Object.freeze({stepNum:y,name:R[y-1].getAttribute("name")}),window.location.hash=`#step${s.stepNum}`,un?.setAttribute("step",`${s.stepNum}`);const A=R[s.stepNum-1].getAttribute("name");if(R[s.stepNum-1].stepState=c.steps[A],lt&&(lt.toggleAttribute("disabled",!c.steps[A].valid),lt.style.display=p===R.length?"none":""),Wt){const j=ut[s.name].userMutable;Wt.style.display=j?"":"none"}dn(R,c)}h(cn()||1),R.forEach(p=>{p.pipelineState=c;const y=p.getAttribute("name");y&&p.addEventListener("stateChanged",()=>void d(y,p.stepState))}),addEventListener("hashchange",()=>h(cn())),U?.classList.add("ready"),U?.classList.remove("initializing")}function cn(){return+((window.location.hash??null).replace("#step","")||"1")}function kn(){return{steps:{importModel:{..._t},extractAndProcessJointPositions:{...Et},classify:{...Ct},run:{...ee}}}}function dn(c,s){for(let d=0;d<c.length;d++){const h=Ai?.querySelector(`[step="${d+1}"]`);if(h){const p=c[d].getAttribute("name"),y=s.steps[p]?.valid??!1;h.classList.toggle("valid",y),h.classList.toggle("invalid",!y)}}}function _i(){return[U.querySelector(`[name="${In}"]`),U.querySelector(`[name="${On}"]`),U.querySelector(`[name="${jn}"]`),U.querySelector(`[name="${Ln}"]`)]}function Ti(c){Object.keys(c.steps).forEach(s=>{if(s in ut&&s in c.steps){const d=ut[s].serialize(c.steps[s]);localStorage.setItem(`predict:${s}`,d??"")}})}function Oi(){const c=kn();return Object.keys(c.steps).forEach(s=>{if(s in ut&&s in c.steps){const d=localStorage.getItem(`predict:${s}`);c.steps[s]=ut[s].deserialize(d)}}),c}Ei();
