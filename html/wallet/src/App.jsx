import React, { useState, useEffect } from 'react';
import {wireUpGlobalState, buildInitialState, globalState} from './state.js'

import { PARENT, PARENT_HOST, PARENT_HOST_ORIGIN, ACCESS_GRANTED } from "./index.jsx"
import { to_b58, sign_oob } from "./util.js"

import { WalletDashboard } from "./page/dashboard.jsx"
import { MenuSide } from "./page/menu_side.jsx"
import { WizardLogin } from "./page/wizard_login.jsx"

var PARENT_LOADED = !!window.opener;

function hook_up_message_handler() {
  window.addEventListener("message",
    async function(e) {
      if (!(typeof e.data === 'object' && e.data !== null)) {
        return
      }

      var json = e.data
      if (json.opcode === "loaded_parent") {
        if (PARENT_LOADED) {
          return;
        }
        PARENT_LOADED = true;
        PARENT.postMessage({opcode: "access", pk: globalState.pk, access: ACCESS_GRANTED ? "full" : "none"}, PARENT_HOST_ORIGIN)
        //if (!globalState.remote.checked_balance && !!globalState.pub_b58) {
        //  await api_balance()
        //}
        if (ACCESS_GRANTED && !!globalState.pub_b58) {
          PARENT.postMessage({opcode: "balance", coin: globalState.remote.coin}, PARENT_HOST_ORIGIN)
        }
      }
      if (json.opcode === "sign") {
        if (!ACCESS_GRANTED) {
          PARENT.postMessage({opcode: "access_denied", rpcid: json.rpcid}, PARENT_HOST_ORIGIN)
          return;
        }

        var msg = JSON.stringify({
        	opcode: "signed_message",
        	payload: json.payload,
          signer: to_b58(globalState.pk),
          timestamp: window.BigInt(Date.now()) * 1_000_000n
        })

				const signature = sign_oob(msg);

        PARENT.postMessage({opcode: "signed_message", rpcid: json.rpcid, msg: msg, signer: globalState.pk, signature: signature}, PARENT_HOST_ORIGIN)
      }
    }
  )
}

function App() {
  const [s, hook_setGlobalState0] = useState(buildInitialState());
  wireUpGlobalState(s, hook_setGlobalState0);

  useEffect(e=> {
    if ((!s.wizardExtra || s.wizardExtra.opcode === "headless") && PARENT_HOST && PARENT_HOST !== "amadeus.bot" && PARENT_HOST !== "wallet.amadeus.bot") {
      hook_up_message_handler();
    }
    //if (s.pk) {
    //  api_balance()
    //}
  }, [])

  if (s.wizardExtra && s.wizardExtra.opcode === "headless") {
    return (<div className="wrapper"></div>)
  }

  if (!s.pk || (s.wizardExtra && s.wizardExtra.opcode === "signin")) {
    return (<div class="wrapper">
      <MenuSide />
      <WizardLogin />
    </div>)
  }

  return (
    <div class="wrapper">
      <MenuSide />
      ${!s.pk
        ? (<WizardLogin />)
            :
              (<WalletDashboard />)
      }
    </div>
  );
}

export default App;
