'use client';

import { useId, useRef, useState } from 'react';
import Link from './SiteLink';
import { reportedLevelPoints } from '@/lib/gallery-levels';

export default function LevelGapCalculator() {
  const milestoneLabel = useId();
  const currentInput = useRef<HTMLInputElement>(null);
  const targetInput = useRef<HTMLInputElement>(null);
  const [level, setLevel] = useState('15');
  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');
  const reference = reportedLevelPoints[level];
  const values = [Number(current), Number(target)];
  const valid = current !== '' && target !== '' && values.every(value => Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000_000_000) && values[1] > 0;
  const gap = valid ? Math.max(0, values[1] - values[0]) : null;
  const focusMissingPoints = () => {
    const currentIsValid = current !== '' && Number.isSafeInteger(values[0]) && values[0] >= 0 && values[0] <= 1_000_000_000_000;
    const field = currentIsValid ? targetInput.current : currentInput.current;
    field?.focus();
    field?.scrollIntoView({ block: 'center', behavior: 'instant' });
  };
  return <section id="points-gap" tabIndex={-1} className="level-gap-calculator" aria-label="Gallery level points gap calculator" data-clarity-mask="true">
    <h3>Calculate your next milestone gap</h3>
    <label className="field"><span id={milestoneLabel}>Level to plan for</span><select aria-labelledby={milestoneLabel} value={level} onChange={event => { setLevel(event.target.value); setTarget(''); }}>{[...Object.keys(reportedLevelPoints), '20', '25'].map(value => <option key={value} value={value}>Level {value}</option>)}</select></label>
    {reference ? <p><button type="button" className="button secondary" onClick={() => { setTarget(String(reference)); targetInput.current?.focus(); }}>Use {reference.toLocaleString('en-US')} reference</button><br />{level === '15' ? 'Player screenshot reference' : 'FUT.GG-reported points'}; editable, not an official EA threshold. <Link href="#reported-points">Read the reference table</Link>.</p> : <p>No confirmed reference is included for Level {level}. Enter your own planning target; the result is a scenario, not a verified level unlock.</p>}
    <div className="grid-two">
      <label className="field"><span>Your current Gallery points</span><input ref={currentInput} type="number" min="0" max="1000000000000" step="1" value={current} onChange={event => setCurrent(event.target.value)} /></label>
      <label className="field"><span>Your points target for Level {level}</span><input ref={targetInput} type="number" min="1" max="1000000000000" step="1" value={target} onChange={event => setTarget(event.target.value)} /></label>
    </div>
    {gap === null && <div className="level-gap-start"><p>Enter your current points and a target. Use a reported reference where available, or try your own value. The gap updates as you type.</p><button type="button" className="button secondary" onClick={focusMissingPoints}>Enter point totals <span aria-hidden="true">↑</span></button></div>}
    <div role="status" aria-live="polite" className="level-gap-result">{gap === null ? (current !== '' && target !== '' ? 'Use whole, non-negative point totals up to 1,000,000,000,000; the target must be above zero.' : '') : gap === 0 ? `Your entered total reaches the Level ${level} target.` : `${gap.toLocaleString('en-US')} more Gallery points to your entered Level ${level} target.`}</div>
    {valid && <progress aria-label={`Progress toward your entered Level ${level} target`} max={values[1]} value={Math.min(values[0], values[1])} />}
    <p>Use these two totals in the <Link href="/">route planner</Link>, then compare the upgrades you can actually complete. Add your own spending and buy / sell action limits when choosing a route. Your saved cards and upgrade options stay available when you return.</p>
  </section>;
}
