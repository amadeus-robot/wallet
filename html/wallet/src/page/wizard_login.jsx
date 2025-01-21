import React, { useState, useEffect } from 'react';
import { globalState, setGlobalState } from '../state.js'
import { generate_random_seed64, seed64_to_keypair, set_seed64, from_b58, to_b58 } from '../util.js'

const fn_generate_new_seed64 = function(e) {
  e.preventDefault();
  const seed64 = generate_random_seed64();
  setGlobalState({register_state: "save_recovery_seed64", recovery_seed64: seed64});
  return false;
}

const fn_login_with_recovery_seed64 = function(e, seed64) {
  e.preventDefault();
	const [pk, sk] = seed64_to_keypair(seed64);
  if (pk) {
  	set_seed64(seed64);
    setGlobalState({pk: pk, sk: sk});
  }
  return false;
}

const fn_login_with_seed64 = async function(e) {
  e.preventDefault();
  var [pk, sk] = seed64_to_keypair(globalState.wizard_new_user.seed64)
  if (pk) {
  		set_seed64(globalState.wizard_new_user.seed64);
    setGlobalState({pk: pk, sk: sk});
  }
  return false;
}

export function WizardLogin() {
  var gs = globalState;
  if (gs.did && gs.wizardExtra && gs.wizardExtra.opcode === "signin") {
    return WizardSignIn({app: gs.wizardExtra.app, success_url: gs.wizardExtra.success_url});
  }
  if (gs.register_state === "import_seed64") {
    return WizardLogin2();
  }
  if (gs.register_state === "save_recovery_seed64") {
    return WizardLoginSaveRecoverySeed64();
  }

  return (
    <div class="wrapper">
        <div class="wrapper-inline">
            <header>
                <h1 class="page-title">Wallet</h1>
            </header>
            <main>
                <div class="container" style={{maxWidth: "480px", paddingTop: "18px"}}>

                    <div class="form-row">
                        <a href="/generate_seed64" class="button circle block orange mb-5" style={{backgroundColor: "mediumseagreen"}}
                        	onClick={e=> fn_generate_new_seed64(e)}>
                         		<i class="fa fa-facebook"></i>🎲 Generate New Wallet</a>
                    </div>
                    <div class="form-row">
                        <a href="/import_seed64" class="button circle block white"
                        	onClick={e=> {e.preventDefault(); setGlobalState({register_state: "import_seed64"}); return false;}}>
                         		<i class="fa fa-google"></i> 🔐 Import Seed64</a>
                    </div>

                    <div class="form-divider"></div>

                    <div class="form-row txt-center mt-15">
                        Back to <a href="https://amadeus.bot/" data-loader="show">AMADEUS</a>
                    </div>

                </div>
            </main>
        </div>
    </div>
  )
}

export function WizardLogin2() {
  return (
    <div class="wrapper">
        <div class="wrapper-inline">
            <header>
                <h1 class="page-title">Wallet</h1>
            </header>
            <main>
                <div class="container" style={{maxWidth: "480px"}}>
                    <div class="form-divider"></div>
                    <div class="form-label-divider"><span>Import Seed64</span></div>
                    <div class="form-divider"></div>

                    <div class="form-row-group with-icons mb-5">
                        <div class="form-row no-padding">
                            <i class="fa fa-envelope"></i>
                            <input type="text" class="form-element" placeholder="3J3HEMvK...X3ppy1m" onBlur={e=> setGlobalState({wizard_new_user: {seed64: from_b58(e.target.value)}})} />
                        </div>
                    </div>

                    <div class="form-row">
                        <a href="/import_seed64" class="button circle block orange" onClick={e=> fn_login_with_seed64(e)}><i class="fa fa-google"></i> Continue</a>
                    </div>

                    <div class="form-divider"></div>

                    <div class="form-row txt-center mt-15">
                        Go <a href="https://amadeus.bot" onClick={e=> {e.preventDefault(); setGlobalState({register_state: 0}); return false;}} data-loader="show">BACK</a>
                    </div>

                </div>
            </main>
        </div>
    </div>
  )
}

export function WizardLoginSaveRecoverySeed64() {
  const [savedKey, setSavedKey] = useState(false)
  return (
    <div class="wrapper">
        <div class="wrapper-inline">
            <header>
                <h1 class="page-title">Wallet</h1>
            </header>
            <main>
                <div class="container" style={{maxWidth: "480px"}}>
                    <div class="form-divider"></div>
                    <div class="form-label-divider"><span>Recovery Seed64</span></div>
                    <div class="form-divider"></div>

                    <div class="form-row txt-center mt-15">Store this seed offline in a safe place. You can use it to recover your account.</div>
                    <br/>
                    <div class="form-row-group with-icons mb-5">
                        <div class="form-row no-padding">
                            <i class="fa fa-user"></i>
                            <input type="text" class="form-element" value={to_b58(globalState.recovery_seed64)} />
                        </div>
                    </div>

                    <div class="form-row">
                      {!savedKey ?
                        <a href="/import_seed64" class="button circle block" onClick={e=> {e.preventDefault(); setSavedKey(true); return false;}}>
                        	<i class="fa fa-google"></i>I saved my Key</a>
                        :
                        <a href="/import_seed64" class="button circle block orange" onClick={e=> fn_login_with_recovery_seed64(e, globalState.recovery_seed64)}>
                        	<i class="fa fa-google"></i>Continue</a>
                      }
                    </div>

                    <div class="form-divider"></div>

                    <div class="form-row txt-center mt-15">
                        Go <a href="https://amadeus.bot" onClick={e=> {e.preventDefault(); setGlobalState({register_state: 0}); return false;}} data-loader="show">BACK</a>
                    </div>

                </div>
            </main>
        </div>
    </div>
  )
}

export function WizardSignIn({app, success_url, extra}) {
  const fn_cancel = function(e) {
    e.preventDefault();
    if (success_url) {
      window.location = success_url
    } else {
      window.close()
    }
    return false;
  }

  const fn_approve = async function(e) {
    e.preventDefault();
    return false;
  }

  var host = "no-referrer";
  try { host = (new URL(document.referrer)).host } catch (err) {}

  return (
    <div class="wrapper">
        <div class="wrapper-inline">
            <main style={{marginTop: "0px"}}>
                <div class="container" style={{maxWidth: "480px"}}>
                    <div class="form-label-divider" style={{visibility: "hidden"}}><span>Connect</span></div>
                    <div class="form-row txt-center mt-15">Application hosted on {host}</div>
                    <br/>

                    <div class="form-row">
                      <a href="/import_seed64" class="button circle block orange" onClick={e=> fn_approve(e)}><i class="fa fa-google"></i> Connect to {app}</a>
                    </div>

                    <div class="form-divider"></div>

                    <div class="form-row txt-center mt-15">
                        <a href="https://amadeus.bot" onClick={e=> fn_cancel(e)} data-loader="show">CANCEL</a>
                    </div>

                </div>
            </main>
        </div>
    </div>
  )
}
