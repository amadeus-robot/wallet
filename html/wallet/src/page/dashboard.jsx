import React, { useEffect, useState } from 'react';
import { from_b58, to_b58, build_tx } from '../util.js'
import { globalState } from '../state.js'

async function fn_transfer(e) {
	e.preventDefault();
	var pk = prompt("Enter receiver Public Key")
	if (pk) {
		var amount = prompt("Enter amount")
		amount = Number(amount)
		if (!isNaN(amount)) {
			if (window.confirm(`You will send ${amount} to ${pk}`)) {
				amount = amount * 1_000_000_000;
				const packed_tx = build_tx("Coin", "transfer", [from_b58(pk), amount]);
				var result = await fetch(`https://nodes.amadeus.bot/api/tx/submit/${to_b58(packed_tx)}`)
				result = await result.json()
				console.log(result);

				//window.location.reload();
			}
		}
	}
	return false;
}

async function fn_burn(e) {
	e.preventDefault();
	alert("Why you want to do this? If so.. proceed")
	return false;
}

export function WalletDashboard() {
	//format_8(globalState.dashboard.balance)
	const [balance, setBalance] = useState(0.0);

  useEffect(e=> {
  	fetch(`https://nodes.amadeus.bot/api/wallet/balance/${to_b58(globalState.pk)}`)
    .then(response => { return response.json() })
    .then(data => {
      if (data.error === "ok") {
        setBalance(data.balance.float)
      }
    })
    .catch(error => {
      alert("Error fetching wallet balance:", error);
    });
  }, [])

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

        <form id="settingsForm">

          <div class="list-box">
            <div class="list-item">
              <img src="https://assets.coingecko.com/coins/images/17233/large/imx.png?1636691817" alt="" />
              <em class="seperate"></em>
              <span class="list-item-title">AMA <small class="text-muted"> - {balance.toFixed(3)} </small></span>
            </div>
          </div>

          <div class="list-box">
            <div class="list-item">
              <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="" />
              <em class="seperate"></em>
              <span class="list-item-title">USDT <small class="text-muted"> - {0.0} </small></span>
            </div>
          </div>

          <div class="list-box">
            <div class="list-item">
              <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/34176.png" alt="" />
              <em class="seperate"></em>
              <span class="list-item-title">EURQ <small class="text-muted"> - {0.0} </small></span>
            </div>
          </div>



          <div class="form-divider"></div>
          <div class="form-label-divider"><span>Operations</span></div>

          <div class="list-box">
            <div class="list-item">

            	<div style={{display: "inline", marginRight: "8px"}}>
                <a href="/transfer" class="more-btn" style={{marginTop: "0px", padding: "6px 30px", borderRadius: "0px"}}
                  onClick={e=> fn_transfer(e)}>Transfer</a>
              </div>

            	<div style={{display: "inline", marginRight: "8px"}}>
                <a href="/burn" class="more-btn" style={{marginTop: "0px", padding: "6px 30px", borderRadius: "0px"}}
                  onClick={e=> fn_burn(e)}>Burn</a>
              </div>

            </div>
          </div>
        </form>

      </div>

    </main>
  </div>
  )
}
