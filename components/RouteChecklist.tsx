'use client';
import { useState } from 'react';
import type { Upgrade } from '../lib/engines';

const prefix = 'fcgallery-checklist-';
type Scope = 'main' | 'alternative';

export function clearRouteChecklists() {
  for (const scope of ['main', 'alternative']) {
    try { sessionStorage.removeItem(prefix + scope); } catch {}
  }
}

export default function RouteChecklist({ snapshot, upgrades, scope }: {
  snapshot: string; upgrades: Upgrade[]; scope: Scope;
}) {
  const signature = JSON.stringify([snapshot, upgrades.map(upgrade => upgrade.id)]);
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(prefix + scope) || 'null');
      return saved?.signature === signature && Array.isArray(saved.checked)
        ? upgrades.filter(upgrade => saved.checked.includes(upgrade.id)).map(upgrade => upgrade.id)
        : [];
    } catch { return []; }
  });
  const [temporary, setTemporary] = useState(false);
  const update = (next: string[]) => {
    setChecked(next);
    try {
      sessionStorage.setItem(prefix + scope, JSON.stringify({ signature, checked: next }));
      setTemporary(false);
    } catch { setTemporary(true); }
  };
  const number = (value: number) => new Intl.NumberFormat('en-US').format(value);

  return <fieldset className="route-checklist">
    <legend>Grade your Sets</legend>
    <p className="subtle">Tick each upgrade after grading it in-game. These checks are your notes; they do not change the route estimate or your game progress.</p>
    <p className="checklist-progress" role="status">{checked.length} of {upgrades.length} Set upgrades checked</p>
    <ul>
      {upgrades.map(upgrade => <li key={upgrade.id}>
        <label className="checklist-item">
          <input type="checkbox" checked={checked.includes(upgrade.id)} onChange={event => update(event.target.checked ? [...checked, upgrade.id] : checked.filter(id => id !== upgrade.id))} />
          <span><strong>{upgrade.name}</strong><span className="subtle">Planned gain: +{number(upgrade.plannedScore - upgrade.currentScore)} points / +{number(upgrade.plannedTokens - upgrade.currentTokens)} tokens</span></span>
        </label>
      </li>)}
    </ul>
    {checked.length === upgrades.length && <p className="notice">All upgrades checked. Confirm your actual totals in-game, then update your starting totals and Set scores before planning another route.</p>}
    <p className="subtle">Checks stay in this tab, including after a reload. Editing the plan clears them. Share links and JSON exports exclude them.</p>
    {temporary && <p role="alert">This browser could not save the checklist. Keep this page open to retain your checks.</p>}
    <button className="text-button" disabled={checked.length === 0} onClick={() => update([])}>Reset this checklist</button>
  </fieldset>;
}
