'use client';

import { useState } from 'react';
import { tokenTargetFromBalance } from '../lib/engines';

export default function TokenBalanceHelper({ onApply }: { onApply: (totals: { currentTokens: number; targetTokens: number }) => void }) {
  const [values, setValues] = useState({ balance: '', spent: '', desired: '' });
  const [message, setMessage] = useState('');
  const fields = [['balance', 'Token balance left'], ['spent', 'Tokens already spent'], ['desired', 'Desired token balance']] as const;
  const apply = () => {
    try {
      if (Object.values(values).some(value => value.trim() === '')) throw new Error('Fill in all three amounts. Enter 0 if you have not spent tokens.');
      const totals = tokenTargetFromBalance(Number(values.balance), Number(values.spent), Number(values.desired));
      onApply(totals);
      setMessage(`${totals.currentTokens.toLocaleString('en-US')} earned → ${totals.targetTokens.toLocaleString('en-US')} target. ${totals.remaining.toLocaleString('en-US')} more tokens needed.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Check the token amounts.'); }
  };
  return <details className="token-balance-helper">
    <summary>Already spent tokens? Start from your balance</summary>
    <p className="subtle">Add past spending to both balances to keep your route on the same cumulative basis.</p>
    <div className="grid-two">{fields.map(([key, label]) => <label className="field" key={key}><span>{label}</span><input type="number" min="0" step="1" value={values[key]} onChange={event => { setValues({ ...values, [key]: event.target.value }); setMessage(''); }} /></label>)}</div>
    <button className="button secondary" onClick={apply}>Apply token totals</button>
    <p className="feedback" role="status" aria-live="polite">{message}</p>
  </details>;
}
