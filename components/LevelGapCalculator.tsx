'use client';

import { useId, useState } from 'react';
import Link from './SiteLink';

export default function LevelGapCalculator() {
  const milestoneLabel = useId();
  const [level, setLevel] = useState('15');
  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');
  const values = [Number(current), Number(target)];
  const valid = current !== '' && target !== '' && values.every(value => Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000_000) && values[1] > 0;
  const gap = valid ? Math.max(0, values[1] - values[0]) : null;
  return <section className="level-gap-calculator" aria-label="Gallery level points gap calculator">
    <h3>Calculate your next milestone gap</h3>
    <label className="field"><span id={milestoneLabel}>Milestone to plan for</span><select aria-labelledby={milestoneLabel} value={level} onChange={event => { setLevel(event.target.value); setTarget(''); }}>{['5', '10', '15', '20', '25'].map(value => <option key={value} value={value}>Level {value}</option>)}</select></label>
    <div className="grid-two">
      <label className="field"><span>Your current Gallery points</span><input type="number" min="0" step="1" value={current} onChange={event => setCurrent(event.target.value)} /></label>
      <label className="field"><span>Points target shown for Level {level}</span><input type="number" min="1" step="1" value={target} onChange={event => setTarget(event.target.value)} /></label>
    </div>
    <div role="status" aria-live="polite" className="level-gap-result">{gap === null ? 'Enter both point totals from your game.' : gap === 0 ? `Your entered total reaches the Level ${level} target.` : `${gap.toLocaleString('en-US')} more Gallery points to your entered Level ${level} target.`}</div>
    {valid && <progress aria-label={`Progress toward your entered Level ${level} target`} max={values[1]} value={Math.min(values[0], values[1])} />}
    <p>Use these two totals in the <Link href="/">route planner</Link>, then compare the upgrades you can actually complete. Your saved cards and upgrade options stay available when you return.</p>
  </section>;
}
