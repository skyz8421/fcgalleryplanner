'use client';
import type { PlannerInput } from '../lib/engines';

export default function RouteLimits({ input, onChange }: { input: PlannerInput; onChange: (limits: Partial<PlannerInput>) => void }) {
  const fields = [
    ['maxLoss', 'Maximum net coin loss', 1_000_000_000, '0.01'],
    ['maxTransactions', 'Maximum buy / sell actions', 256, '1'],
    ['maxSets', 'Maximum Set upgrades', 16, '1'],
  ] as const;
  const active = fields.filter(([key]) => input[key] !== undefined).length;
  return <details className="route-limits">
    <summary>Optional route limits{active > 0 ? ` · ${active} active` : ''}</summary>
    <p className="subtle">Your own spending and effort limits. Leave a box blank for no cap; 0 allows no net loss, actions or upgrades for that box.</p>
    <div className="grid-two">{fields.map(([key, label, max, step]) => <label className="field" key={key}><span>{label}</span><input type="number" min="0" max={max} step={step} placeholder="No cap" value={input[key] ?? ''} onChange={event => onChange({ [key]: event.target.value === '' ? undefined : Number(event.target.value) })} /></label>)}</div>
    <p className="subtle">Net loss is the estimated purchase cost minus sale proceeds after tax. It is separate from the trading coins needed upfront.</p>
    <button className="text-button" onClick={() => onChange({ maxLoss: undefined, maxTransactions: undefined, maxSets: undefined })} disabled={active === 0}>Clear route limits</button>
  </details>;
}
