import { globalState, setGlobalState } from '../state.js'
import { to_b58 } from '../util.js'

import ICON_1 from "../img/content/icons/1.png"
import ICON_9 from "../img/content/icons/9.png"
import ICON_11 from "../img/content/icons/11.png"
import ICON_12 from "../img/content/icons/12.png"

function fn_logout(e) {
  e.preventDefault();
  if (localStorage) {
    localStorage.removeItem("seed64:0");
  }
  setGlobalState({pk: undefined, sk: undefined})
  window.location = "/"
  return false;
}

export function MenuSide() {
    return (
    <div class="nav-menu">
      <nav class="menu">
        <div class="nav-container">

          <div class="popup-overlay" id="basicPopup" style={{display: globalState.menu.modal_public_key_open ? "block" : "none", zIndex: 1111}}>
            <div class="popup-container">
              <div class="popup-content">
                {to_b58(globalState.pk)}
              </div>
            </div>
          </div>
          <div class="popup-overlay" id="basicPopup" style={{display: globalState.menu.modal_private_key_open ? "block" : "none", zIndex: 1111}}>
            <div class="popup-container">
              <div class="popup-content">
                {to_b58(globalState.sk)}
              </div>
            </div>
          </div>

          <ul class="main-menu">
            <li class="active">
              <a href="/"><img src={ICON_1} alt="" /><strong class="special">Dashboard</strong></a>
            </li>

            <li>
              <a href="/logout" onClick={e=> fn_logout(e)}><img src={ICON_9} alt="" /><strong class="special">Disconnect</strong> </a>
            </li>

          </ul>
        </div>
      </nav>
    </div>
    )
}
