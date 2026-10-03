'use client';

import { useId, useState, useSyncExternalStore } from 'react';
import { calculateScore, PLAN_LIMITS, type ScoreResult } from '../lib/engines';

type TagRow = { id: string; name: string; matchedScore: string; percent: string };
type ScoreDraft = {base:string;tags:TagRow[];gameTotal:string};
const initialDraft=JSON.stringify({base:'',tags:[],gameTotal:''});let currentDraft:string|null=null;
function subscribeDraft(fn:()=>void){window.addEventListener('fcgallery-score-change',fn);return()=>window.removeEventListener('fcgallery-score-change',fn)}
function snapshotDraft(){if(currentDraft===null){try{const stored=sessionStorage.getItem('fcgallery-score-draft');if(stored&&stored.length<24576){const value=JSON.parse(stored);if(typeof value.base==='string'&&typeof value.gameTotal==='string'&&Array.isArray(value.tags)&&value.tags.length<=PLAN_LIMITS.tags&&value.tags.every((row:TagRow)=>['id','name','matchedScore','percent'].every(key=>typeof row[key as keyof TagRow]==='string')))currentDraft=stored}}catch{}}return currentDraft??initialDraft}
function publishDraft(value:ScoreDraft){currentDraft=JSON.stringify(value);try{sessionStorage.setItem('fcgallery-score-draft',currentDraft)}catch{}window.dispatchEvent(new Event('fcgallery-score-change'))}
const number = (value: number) => value.toLocaleString('en-US');

export default function ScoreCalculator() {
  const prefix = useId();
  const raw=useSyncExternalStore(subscribeDraft,snapshotDraft,()=>initialDraft);
  const {base,tags,gameTotal}:ScoreDraft=JSON.parse(raw);
  const setBase=(value:string)=>publishDraft({base:value,tags,gameTotal});
  const setTags=(value:TagRow[]|((rows:TagRow[])=>TagRow[]))=>publishDraft({base,tags:typeof value==='function'?value(tags):value,gameTotal});
  const setGameTotal=(value:string)=>publishDraft({base,tags,gameTotal:value});
  const [attempted, setAttempted] = useState(false);
  const [example, setExample] = useState(false);

  const update = (id: string, field: keyof Omit<TagRow, 'id'>, value: string) => {
    setExample(false);
    setTags(rows => rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };
  const addTag = () => {
    if (tags.length >= PLAN_LIMITS.tags) return;
    const id = crypto.randomUUID();
    setTags(rows => [...rows, { id, name: `Bonus tag ${rows.length + 1}`, matchedScore: '', percent: '' }]);
    setExample(false);
  };
  const loadExample = () => {
    publishDraft({base:'6000',tags:[{id:crypto.randomUUID(),name:'First Owner',matchedScore:'1000',percent:'150'}],gameTotal:''});
    setAttempted(true);
    setExample(true);
  };
  const clear = () => { publishDraft({base:'',tags:[],gameTotal:''}); setAttempted(false); setExample(false); };

  let result: ScoreResult | null = null;
  let error = '';
  if (base.trim() || attempted) {
    try {
      if (!base.trim()) throw new Error('Enter the base score shown for your set.');
      const names = new Set<string>();
      for (const tag of tags) {
        if (!tag.name.trim()) throw new Error('Give every bonus tag a name.');
        const key = tag.name.trim().toLowerCase();
        if (names.has(key)) throw new Error('Enter each bonus tag only once.');
        names.add(key);
        if (!tag.matchedScore.trim() || !tag.percent.trim()) throw new Error(`Enter the matching subtotal and percentage for ${tag.name}.`);
      }
      result = calculateScore(Number(base), tags.map(tag => ({
        id: tag.id, name: tag.name.trim(), matchedScore: Number(tag.matchedScore), percent: Number(tag.percent),
      })));
    } catch (cause) { error = cause instanceof Error ? cause.message : 'Check your entered scores and percentages.'; }
  }
  const actual = gameTotal.trim() ? Number(gameTotal) : null;
  const actualError = actual !== null && (!Number.isSafeInteger(actual) || actual < 0 || actual > 1_000_000_000_000)
    ? 'The game total must be a non-negative whole number within limits.' : '';
  const difference = result && actual !== null && !actualError ? result.total - actual : null;
  const excludedIds = new Set(result?.excluded.map(tag => tag.id) ?? []);
  const allResults = result ? [...result.counted, ...result.excluded] : [];

  return (
    <section className="score-tool panel" data-clarity-mask="true" aria-labelledby={`${prefix}-heading`}>
      <h2 id={`${prefix}-heading`}>Check your Gallery set score</h2>
      <p className="subtle">Add the set’s base score and the subtotal for each matching bonus tag. The ten largest bonus amounts count.</p>
      <div className="tool-actions">
        <button type="button" className="button subtle" onClick={loadExample}>Load worked example</button>
        <button type="button" className="button subtle" onClick={clear}>Clear inputs</button>
      </div>
      {example && <p className="subtle">Illustrative example: a 6,000-point base, including five First Owner items worth 1,000 points together. Their +150% tag adds 1,500, giving 7,500. No other tags are included.</p>}
      <form onSubmit={event => { event.preventDefault(); setAttempted(true); }}>
        <fieldset>
          <legend>Set scores</legend>
          <div className="grid-two">
            <div className="field">
              <label htmlFor={`${prefix}-base`}>Base item score</label>
              <input id={`${prefix}-base`} type="number" inputMode="numeric" min="0" max="1000000000000" step="1" value={base}
                onChange={event => { setBase(event.target.value); setExample(false); }} aria-describedby={`${prefix}-base-help`} required />
              <p className="subtle" id={`${prefix}-base-help`}>The sum of the original item scores, before Gallery tag bonuses.</p>
            </div>
            <div className="field">
              <label htmlFor={`${prefix}-actual`}>Total shown in your game <span className="subtle">(optional)</span></label>
              <input id={`${prefix}-actual`} type="number" inputMode="numeric" min="0" max="1000000000000" step="1" value={gameTotal}
                onChange={event => setGameTotal(event.target.value)} aria-invalid={Boolean(actualError)} aria-describedby={`${prefix}-actual-help`} />
              <p className="subtle" id={`${prefix}-actual-help`}>Use the same completed set and card versions for this comparison.</p>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>Matching bonus tags</legend>
          <p className="subtle" id={`${prefix}-tag-help`}>A matching subtotal includes only the cards that qualify for that tag. It can be smaller than the whole set’s base. The same item can qualify for several different tags.</p>
          {tags.map((tag, index) => (
            <fieldset className="tag-row" key={tag.id} aria-describedby={`${prefix}-tag-help`}>
              <legend>Tag {index + 1}</legend>
              <div className="field">
                <label htmlFor={`${prefix}-${tag.id}-name`}>Tag name</label>
                <input id={`${prefix}-${tag.id}-name`} type="text" maxLength={160} value={tag.name} onChange={event => update(tag.id, 'name', event.target.value)} required />
              </div>
              <div className="grid-two">
                <div className="field">
                  <label htmlFor={`${prefix}-${tag.id}-matched`}>Matching item score subtotal</label>
                  <input id={`${prefix}-${tag.id}-matched`} type="number" inputMode="numeric" min="0" max={base.trim() && Number.isFinite(Number(base)) ? Math.max(0, Number(base)) : 1_000_000_000_000} step="1"
                    value={tag.matchedScore} onChange={event => update(tag.id, 'matchedScore', event.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor={`${prefix}-${tag.id}-percent`}>Bonus percentage (%)</label>
                  <input id={`${prefix}-${tag.id}-percent`} type="number" inputMode="decimal" min="0" max="1000" step="any" value={tag.percent} onChange={event => update(tag.id, 'percent', event.target.value)} required />
                </div>
              </div>
              <button className="button subtle" type="button" onClick={() => { setTags(rows => rows.filter(row => row.id !== tag.id)); setExample(false); }} aria-label={`Remove ${tag.name || `tag ${index + 1}`}`}>Remove tag</button>
            </fieldset>
          ))}
          {!tags.length && <p className="subtle">No bonus tags entered. The total will equal the base score.</p>}
          <button className="button" type="button" onClick={addTag} disabled={tags.length >= PLAN_LIMITS.tags}>Add bonus tag</button>
        </fieldset>
        <button className="button" type="submit">Check score</button>
      </form>
      <div aria-live="polite" aria-atomic="true" className="tool-errors">
        {error && <p className="error">{error}</p>}
        {actualError && <p className="error">{actualError}</p>}
      </div>
      {result && (
        <div className="score-results">
          <h3>Projected score</h3>
          <figure className="score-figure">
            <svg viewBox="0 0 320 28" role="img" aria-labelledby={`${prefix}-chart-title`}>
              <title id={`${prefix}-chart-title`}>{number(result.base)} base points plus {number(result.bonus)} bonus points</title>
              <rect x="0" y="3" width="320" height="22" rx="3" fill="#e9e8df" />
              {result.total > 0 && <>
                <rect x="0" y="3" width={320 * result.base / result.total} height="22" fill="#166534" />
                <rect x={320 * result.base / result.total} y="3" width={320 * result.bonus / result.total} height="22" fill="#b89135" />
              </>}
            </svg>
            <figcaption className="subtle">Base items + counted tag bonuses</figcaption>
          </figure>
          <dl className="score-summary">
            <div><dt>Base</dt><dd>{number(result.base)}</dd></div>
            <div><dt>Bonus</dt><dd>{number(result.bonus)}</dd></div>
            <div><dt>Total</dt><dd><strong>{number(result.total)}</strong></dd></div>
          </dl>
          {allResults.length > 0 && <div className="table-scroll" tabIndex={0} role="region" aria-label="Bonus score breakdown">
            <table className="data-table">
              <caption>Each bonus is rounded down separately before the highest ten are added.</caption>
              <thead><tr><th scope="col">Tag</th><th scope="col">Matching subtotal</th><th scope="col">Bonus</th><th scope="col">Points</th><th scope="col">Included</th></tr></thead>
              <tbody>{allResults.map(tag => <tr key={tag.id}>
                <th scope="row">{tag.name}</th><td>{number(tag.matchedScore)}</td><td>+{number(tag.percent)}%</td><td>{number(tag.bonus)}</td><td>{excludedIds.has(tag.id) ? 'Outside top 10' : 'Counted'}</td>
              </tr>)}</tbody>
            </table>
          </div>}
          {difference !== null && <div className="score-comparison" aria-live="polite">
            <h3>Compared with your game</h3>
            <p>{difference === 0 ? 'The entered totals match.' : `The calculated total is ${number(Math.abs(difference))} points ${difference > 0 ? 'higher' : 'lower'} than your game total.`}</p>
            {difference !== 0 && <ul>
              <li>Check the First Owner count and use only those items’ scores for that tag.</li>
              <li>Use the original card score for an Evolution and the exact regular or Holographic version.</li>
              <li>Confirm which tags this set allows, and whether every matching card meets its requirements.</li>
              <li>Fill every required slot and regrade the same set before comparing totals.</li>
            </ul>}
            <p className="subtle">This comparison checks your entered numbers. Confirm card eligibility and active tags in the game.</p>
          </div>}
        </div>
      )}
      <details className="tool-explanation">
        <summary>How to enter bonuses correctly</summary>
        <p>Enter the applicable percentage once for each distinct tag. Bonuses add to the base score; they do not compound with each other. A +500% bonus adds five times the matching subtotal on top of its original points.</p>
        <p>For First Owner, five to nine matching items use +150%, ten to nineteen use +300%, and twenty or more use +500%. Buying a card from the market does not make it First Owner.</p>
        <p>Different-nation, club and league tags use the highest-scoring item from each qualifying group. Same-group tags use the largest group; total item score breaks equal-count ties. Use the matching subtotal shown for the actual tag when comparing.</p>
        <p>Only the ten largest bonus amounts count. Ten small bonuses can contribute less than one large bonus. This calculator does not turn an incomplete set into a claimable grade or convert set points into Gallery Tokens.</p>
      </details>
    </section>
  );
}
