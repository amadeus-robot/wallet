import React, { useEffect } from 'react';
import { to_b58, build_tx } from '../util.js'
import { globalState } from '../state.js'

export function WalletDashboard() {

	return (
  <div class="wrapper-inline">
    <header>
      <h1 class="page-title">Wallet</h1>
      <div class="search-button" data-search="open" onClick={e=> build_tx()}>
      AMADEUS
      </div>
      <div class="navi-menu-button">
        <em></em>
        <em></em>
        <em></em>
      </div>
    </header>
    <main>

      <div class="container">
        <div class="form-divider"></div>
        <div class="form-label-divider"><span>{to_b58(globalState.pk)}</span></div>
        <div class="form-divider"></div>
      </div>

    </main>
  </div>
  )
}
