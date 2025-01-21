import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/font-nunito.css';
//import './css/font-awesome-6.1.1.css';
//import './css/font-awesome-4.7.0.css';
import './css/animate-4.1.1.css';
import './css/swiper.css';
import './css/bootstrap.css';
import './css/turbo-slider.css';
import './css/global.css';
import './index.css';
import './js_dep.js';
import App from './App';
import { setInitialState } from './state.js';
import { read_seed64_as_keypair, from_b58 } from './util.js';

const globalThis = window;

var wizardExtra;
if (globalThis.location.hash.length > 0) {
  var json = JSON.parse(new TextDecoder().decode(from_b58(globalThis.location.hash.replace("#", ""))))
  if (json.opcode == "access_wizard") {
    wizardExtra = json;
  }
  if (json.opcode == "pay_for_resources_wizard") {
    wizardExtra = json;
  }
  if (json.opcode == "headless") {
    wizardExtra = json;
  }
  if (json.opcode == "signin") {
    wizardExtra = json;
  }
  setInitialState({wizardExtra: wizardExtra});
}

export const PARENT = window.opener || window.parent;
export var PARENT_HOST;
export var PARENT_HOST_ORIGIN;
export var ACCESS_GRANTED = null;
if (document.location.ancestorOrigins && document.location.ancestorOrigins[0]) {
  PARENT_HOST = new URL(document.location.ancestorOrigins[0]).host
  PARENT_HOST_ORIGIN = new URL(document.location.ancestorOrigins[0]).origin
} else if (document.referrer) {
  PARENT_HOST = new URL(document.referrer).host
  PARENT_HOST_ORIGIN = new URL(document.referrer).origin
}

ACCESS_GRANTED = false;
if (localStorage) {
  ACCESS_GRANTED = localStorage.getItem(`access_host:${PARENT_HOST}`);
}
if (PARENT_HOST && PARENT_HOST.endsWith("amadeus.bot")) {
  ACCESS_GRANTED = true;
}

var [pk, sk] = read_seed64_as_keypair()
if (pk) {
  setInitialState({pk: pk, sk: sk, wizardExtra: wizardExtra});
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
