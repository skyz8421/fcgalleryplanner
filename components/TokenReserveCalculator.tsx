'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from './SiteLink';

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export default function TokenReserveCalculator() {
  // Prevent pre-hydration inputs from being replaced by initial React state.
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [balance, setBalance] = useState('');
  const [cost, setCost] = useState('');
  const [reserve, setReserve] = useState('');
  const fields = [balance, cost, reserve];
  const [available, price, saved] = fields.map(Number);
  const complete = fields.every(value => value !== '');
  const valid = complete && [available, price, saved].every(value => Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000) && price > 0;
  const affordable = valid && available >= price;
  const goal = price + saved;
  return <section className="level-gap-calculator" aria-label="Gallery token purchase and reserve calculator" data-clarity-mask="true">
    <h3>Check a purchase against your token reserve</h3>
    <p>Use your spendable balance, the offer&apos;s current cost and the tokens you want left afterwards. Enter 0 if you do not want a reserve.</p>
    <div className="grid-two" aria-busy={!ready}>
      <label className="field"><span>Gallery tokens available now</span><input disabled={!ready} type="number" min="0" max="1000000" step="1" value={balance} onChange={event => setBalance(event.target.value)} /></label>
      <label className="field"><span>Reward cost in Gallery tokens</span><input disabled={!ready} type="number" min="1" max="1000000" step="1" value={cost} onChange={event => setCost(event.target.value)} /></label>
      <label className="field"><span>Tokens to keep after buying</span><input disabled={!ready} type="number" min="0" max="1000000" step="1" value={reserve} onChange={event => setReserve(event.target.value)} /></label>
    </div>
    <div role="status" aria-live="polite" className="level-gap-result">
      {!ready ? 'Loading calculator…' : !complete ? 'Enter all three amounts to compare.' : !valid ? 'Use whole amounts from 0 to 1,000,000. The reward cost must be above zero.' : affordable ? `${(available - price).toLocaleString('en-US')} tokens left after buying. ${Math.max(0, goal - available).toLocaleString('en-US')} more needed to buy and keep your reserve.` : `${(price - available).toLocaleString('en-US')} more tokens needed for the purchase alone. ${Math.max(0, goal - available).toLocaleString('en-US')} more needed to buy and keep your reserve.`}
    </div>
    {valid && <>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Token purchase comparison">
        <table className="data-table"><caption>Your entered purchase and reserve</caption><thead><tr><th scope="col">Choice</th><th scope="col">Balance afterwards</th><th scope="col">Short of your reserve</th></tr></thead><tbody>
          <tr><th scope="row">Keep tokens for now</th><td>{available.toLocaleString('en-US')}</td><td>{Math.max(0, saved - available).toLocaleString('en-US')}</td></tr>
          <tr><th scope="row">Buy this reward now</th><td>{affordable ? (available - price).toLocaleString('en-US') : 'Not affordable yet'}</td><td>{affordable ? Math.max(0, goal - available).toLocaleString('en-US') : 'Purchase unavailable'}</td></tr>
        </tbody></table>
      </div>
      <p>To buy and retain your reserve, your desired balance before buying is <strong>{goal.toLocaleString('en-US')} tokens</strong>. In the <Link href="/">route planner</Link>, open the token balance helper and use this as your desired balance, alongside your current balance and past spending.</p>
    </>}
    <p>This comparison uses only the amounts you enter. Check the live offer&apos;s currency, cost, purchase limit and expiry in your game. It does not predict future offers.</p>
  </section>;
}
