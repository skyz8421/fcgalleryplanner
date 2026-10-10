/** Calculations compare only the card prices and upgrade choices entered by the user. */
export type MarketCard = { id: string; name: string; buy: number; sell: number; owned: boolean; available?: boolean };
export type Upgrade = {
  id: string; setId: string; name: string; currentScore: number; plannedScore: number;
  currentTokens: number; plannedTokens: number; cardIds: string[];
};
export type PlannerInput = {
  currentScore: number; targetScore: number; currentTokens: number; targetTokens: number;
  coinBalance: number; taxRate: number; mode: 'points' | 'tokens'; objective: 'coins' | 'trades';
  cards: MarketCard[]; upgrades: Upgrade[];
};
export type Route = {
  upgradeIds: string[]; cardIds: string[]; pointsGain: number; tokensGain: number;
  tax: number; loss: number; upfront: number; transactions: number; sets: number;
  projectedScore: number; projectedTokens: number; coinBalanceAfter: number; order: string[];
};
export type PlannerResult = {
  errors: string[]; deficit: number; feasible: Route | null; alternative: Route | null;
  bestAvailable: Route | null; targetReached: boolean;
};
export type ScoreTag = { id: string; name: string; matchedScore: number; percent: number };
export type CalculatedTag = ScoreTag & { bonus: number };
export type ScoreResult = { base: number; bonus: number; total: number; counted: CalculatedTag[]; excluded: CalculatedTag[] };

export const PLAN_LIMITS = { cards: 128, upgrades: 16, tags: 64, encodedLength: 32768, decodedBytes: 24576 } as const;
const MAX_VALUE = 1_000_000_000_000;
const MAX_MONEY = 1_000_000_000;
const clean = (n: number) => Math.round(n * 1_000_000) / 1_000_000;
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const validText = (v: unknown, limit: number) => typeof v === 'string' && v.trim().length > 0 && v.length <= limit
  && !Array.from(v).some(ch => { const code = ch.codePointAt(0)!; return code < 32 || code === 127 || (code >= 0xd800 && code <= 0xdfff); });
const finite = (v: unknown, limit = MAX_VALUE, integer = false): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= limit && (!integer || Number.isSafeInteger(v));
function keys(v: Record<string, unknown>, expected: string[], label: string, errors: string[], optional: string[] = []) {
  if (Object.keys(v).some(k => !expected.includes(k) && !optional.includes(k))) errors.push(`${label} contains an unsupported field.`);
  for (const k of expected) if (!Object.hasOwn(v, k)) errors.push(`${label}.${k} is required.`);
}

/** Runtime validation also guards imported JSON; no unrecognised fields pass the codec. */
function validate(input: unknown): string[] {
  const errors: string[] = [];
  if (!record(input)) return ['Plan must be an object.'];
  keys(input, ['currentScore', 'targetScore', 'currentTokens', 'targetTokens', 'coinBalance', 'taxRate', 'mode', 'objective', 'cards', 'upgrades'], 'Plan', errors);
  for (const field of ['currentScore', 'targetScore', 'currentTokens', 'targetTokens'])
    if (!finite(input[field], MAX_VALUE, true)) errors.push(`${field} must be a non-negative whole number within limits.`);
  if (!finite(input.coinBalance, MAX_MONEY)) errors.push('coinBalance must be a finite non-negative amount within limits.');
  if (!finite(input.taxRate, 1)) errors.push('taxRate must be between 0 and 1.');
  if (input.mode !== 'points' && input.mode !== 'tokens') errors.push('Choose points or tokens mode.');
  if (input.objective !== 'coins' && input.objective !== 'trades') errors.push('Choose coins or trades objective.');
  if (!Array.isArray(input.cards) || input.cards.length > PLAN_LIMITS.cards) errors.push(`Use at most ${PLAN_LIMITS.cards} cards.`);
  if (!Array.isArray(input.upgrades) || input.upgrades.length > PLAN_LIMITS.upgrades) errors.push(`Use at most ${PLAN_LIMITS.upgrades} upgrades.`);
  if (!Array.isArray(input.cards) || !Array.isArray(input.upgrades) || input.cards.length > PLAN_LIMITS.cards || input.upgrades.length > PLAN_LIMITS.upgrades) return errors;
  const cards = new Map<string, Record<string, unknown>>();
  input.cards.forEach((c, i) => {
    const label = `Card ${i + 1}`;
    if (!record(c)) { errors.push(`${label} must be an object.`); return; }
    keys(c, ['id', 'name', 'buy', 'sell', 'owned'], label, errors, ['available']);
    if (!validText(c.id, 100)) errors.push(`${label} needs a valid variant ID.`);
    if (!validText(c.name, 160)) errors.push(`${label} needs a name within 160 characters.`);
    for (const field of ['buy', 'sell']) if (!finite(c[field], MAX_MONEY)) errors.push(`${label}.${field} must be a finite non-negative amount within limits.`);
    if (typeof c.owned !== 'boolean') errors.push(`${label}.owned must be true or false.`);
    if (Object.hasOwn(c, 'available') && typeof c.available !== 'boolean') errors.push(`${label}.available must be true or false.`);
    if (typeof c.id === 'string') {
      const prior = cards.get(c.id);
      if (prior) errors.push(prior.buy !== c.buy || prior.sell !== c.sell || prior.owned !== c.owned
        ? `${label} has conflicting prices or ownership for variant ${c.id}.` : `${label} repeats variant ${c.id}; enter each card once.`);
      cards.set(c.id, c);
    }
  });
  const ids = new Set<string>();
  const setBaseline = new Map<string, Record<string, unknown>>();
  input.upgrades.forEach((u, i) => {
    const label = `Upgrade ${i + 1}`;
    if (!record(u)) { errors.push(`${label} must be an object.`); return; }
    keys(u, ['id', 'setId', 'name', 'currentScore', 'plannedScore', 'currentTokens', 'plannedTokens', 'cardIds'], label, errors);
    for (const field of ['id', 'setId']) if (!validText(u[field], 100)) errors.push(`${label}.${field} needs a valid ID.`);
    if (!validText(u.name, 160)) errors.push(`${label} needs a name within 160 characters.`);
    for (const field of ['currentScore', 'plannedScore', 'currentTokens', 'plannedTokens']) if (!finite(u[field], MAX_VALUE, true)) errors.push(`${label}.${field} must be a non-negative whole number within limits.`);
    if (typeof u.plannedScore === 'number' && typeof u.currentScore === 'number' && u.plannedScore < u.currentScore) errors.push(`${label} cannot reduce its current score.`);
    if (typeof u.plannedTokens === 'number' && typeof u.currentTokens === 'number' && u.plannedTokens < u.currentTokens) errors.push(`${label} cannot reduce its earned tokens.`);
    if (!Array.isArray(u.cardIds) || u.cardIds.length > PLAN_LIMITS.cards) errors.push(`${label} needs a card ID list within limits.`);
    else {
      const seen = new Set<string>();
      for (const id of u.cardIds) {
        if (!validText(id, 100) || !cards.has(id)) errors.push(`${label} references an unknown card.`);
        if (typeof id === 'string' && seen.has(id)) errors.push(`${label} repeats the same card variant.`);
        if (typeof id === 'string') seen.add(id);
      }
    }
    if (typeof u.id === 'string') { if (ids.has(u.id)) errors.push(`${label} repeats an upgrade ID.`); ids.add(u.id); }
    if (typeof u.setId === 'string') {
      const prior = setBaseline.get(u.setId);
      if (prior && (prior.currentScore !== u.currentScore || prior.currentTokens !== u.currentTokens)) errors.push(`${label} must share the same baseline as other options for this set.`);
      setBaseline.set(u.setId, u);
    }
  });
  return errors;
}

/** A two-part exchange ordering minimises required initial funds for these input cards.
 * Profitable exchanges go first in ascending purchase price; losing exchanges follow in
 * descending net resale proceeds. Assumes each sale succeeds before the next purchase.
 */
function exchangeOrder(cards: MarketCard[], rate: number): MarketCard[] {
  const net = (c: MarketCard) => c.sell * (1 - rate);
  return [...cards].sort((a, b) => {
    const aGain = net(a) >= a.buy, bGain = net(b) >= b.buy;
    if (aGain !== bGain) return aGain ? -1 : 1;
    return (aGain ? a.buy - b.buy : net(b) - net(a)) || a.id.localeCompare(b.id);
  });
}
function route(input: PlannerInput, upgrades: Upgrade[], cardMap: Map<string, MarketCard>): Route {
  const cardIds = [...new Set(upgrades.flatMap(u => u.cardIds))].sort();
  const missing = cardIds.map(id => cardMap.get(id)!).filter(c => !c.owned);
  const ordered = exchangeOrder(missing, input.taxRate);
  let loss = 0, upfront = 0, tax = 0;
  for (const card of ordered) {
    upfront = Math.max(upfront, card.buy + loss);
    tax += card.sell * input.taxRate;
    loss += card.buy - card.sell * (1 - input.taxRate);
  }
  const pointsGain = upgrades.reduce((sum, u) => sum + u.plannedScore - u.currentScore, 0);
  const tokensGain = upgrades.reduce((sum, u) => sum + u.plannedTokens - u.currentTokens, 0);
  return {
    upgradeIds: upgrades.map(u => u.id), cardIds, pointsGain, tokensGain,
    tax: clean(tax), loss: clean(loss), upfront: clean(Math.max(0, upfront)), transactions: missing.length * 2,
    sets: upgrades.length, projectedScore: input.currentScore + pointsGain,
    projectedTokens: input.currentTokens + tokensGain, coinBalanceAfter: clean(input.coinBalance - loss),
    order: ordered.map(c => c.id),
  };
}
function compare(a: Route, b: Route, objective: PlannerInput['objective'], mode: PlannerInput['mode']) {
  const gain = (r: Route) => mode === 'points' ? r.pointsGain : r.tokensGain;
  return (objective === 'coins' ? a.loss - b.loss || a.transactions - b.transactions : a.transactions - b.transactions || a.loss - b.loss)
    || gain(a) - gain(b) || a.upfront - b.upfront || a.sets - b.sets || a.upgradeIds.join('|').localeCompare(b.upgradeIds.join('|'));
}
export function planRoutes(input: PlannerInput): PlannerResult {
  const errors = validate(input);
  if (errors.length) return { errors, deficit: 0, feasible: null, alternative: null, bestAvailable: null, targetReached: false };
  const deficit = Math.max(0, input.mode === 'points' ? input.targetScore - input.currentScore : input.targetTokens - input.currentTokens);
  const cardMap = new Map(input.cards.map(c => [c.id, c]));
  if (deficit === 0) {
    const empty = route(input, [], cardMap);
    return { errors: [], deficit, feasible: empty, alternative: null, bestAvailable: empty, targetReached: true };
  }
  const gain = (r: Route) => input.mode === 'points' ? r.pointsGain : r.tokensGain;
  const otherObjective = input.objective === 'coins' ? 'trades' : 'coins';
  let feasible: Route | null = null, alternativeBest: Route | null = null, bestAvailable: Route | null = null;
  // At most 2^16 subsets. Reject same-set alternatives before calculating a route.
  for (let mask = 0; mask < 2 ** input.upgrades.length; mask++) {
    const upgrades: Upgrade[] = [], sets = new Set<string>();
    let valid = true;
    for (let i = 0; i < input.upgrades.length; i++) if (mask & (1 << i)) {
      const u = input.upgrades[i];
      if (sets.has(u.setId) || u.cardIds.some(id => {
        const card = cardMap.get(id)!;
        return !card.owned && card.available === false;
      })) { valid = false; break; }
      sets.add(u.setId); upgrades.push(u);
    }
    if (!valid) continue;
    const candidate = route(input, upgrades, cardMap);
    if (candidate.upfront > input.coinBalance + 0.000001) continue;
    if (!bestAvailable || gain(candidate) > gain(bestAvailable) || (gain(candidate) === gain(bestAvailable) && compare(candidate, bestAvailable, input.objective, input.mode) < 0)) bestAvailable = candidate;
    if (gain(candidate) < deficit) continue;
    if (!feasible || compare(candidate, feasible, input.objective, input.mode) < 0) feasible = candidate;
    if (!alternativeBest || compare(candidate, alternativeBest, otherObjective, input.mode) < 0) alternativeBest = candidate;
  }
  const alternative = feasible && alternativeBest && feasible.upgradeIds.join('|') !== alternativeBest.upgradeIds.join('|') ? alternativeBest : null;
  return { errors: [], deficit, feasible, alternative, bestAvailable, targetReached: false };
}

/** Convert a spendable balance into the cumulative totals used by the planner. */
export function tokenTargetFromBalance(balance: number, spent: number, desiredBalance: number) {
  if (![balance, spent, desiredBalance].every(n => finite(n, MAX_VALUE, true)))
    throw new Error('Enter non-negative whole token amounts within limits.');
  const currentTokens = balance + spent, targetTokens = desiredBalance + spent;
  if (![currentTokens, targetTokens].every(n => finite(n, MAX_VALUE, true)))
    throw new Error('Combined token totals are too large.');
  return { currentTokens, targetTokens, remaining: Math.max(0, desiredBalance - balance) };
}
export function calculateScore(base: number, tags: ScoreTag[]): ScoreResult {
  if (!finite(base, MAX_VALUE, true)) throw new Error('Base score must be a non-negative whole number within limits.');
  if (!Array.isArray(tags) || tags.length > PLAN_LIMITS.tags) throw new Error(`Use at most ${PLAN_LIMITS.tags} bonus tags.`);
  const ids = new Set<string>();
  const computed = tags.map((tag): CalculatedTag => {
    if (!record(tag) || !validText(tag.id, 100) || !validText(tag.name, 160)) throw new Error('Every tag needs a valid ID and name.');
    if (ids.has(tag.id)) throw new Error('Each bonus tag can only appear once.');
    ids.add(tag.id);
    if (!finite(tag.matchedScore, base, true)) throw new Error('A matching subtotal must be a whole number between zero and the base score.');
    if (!finite(tag.percent, 1000)) throw new Error('Bonus percentages must be finite and between 0 and 1000.');
    return { ...tag, bonus: Math.floor(tag.matchedScore * tag.percent / 100) };
  }).sort((a, b) => b.bonus - a.bonus || a.id.localeCompare(b.id));
  const counted = computed.slice(0, 10), excluded = computed.slice(10);
  const bonus = counted.reduce((sum, tag) => sum + tag.bonus, 0);
  return { base, bonus, total: base + bonus, counted, excluded };
}

const CODEC_VERSION = 1;
export function encodePlan(input: PlannerInput): string {
  const errors = validate(input);
  if (errors.length) throw new Error(errors.join(' '));
  const bytes = new TextEncoder().encode(JSON.stringify({ version: CODEC_VERSION, input }));
  if (bytes.length > PLAN_LIMITS.decodedBytes) throw new Error('Plan is too large to share.');
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const encoded = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
  if (encoded.length > PLAN_LIMITS.encodedLength) throw new Error('Plan is too large to share.');
  return encoded;
}
export function decodePlan(encoded: string): PlannerInput {
  if (typeof encoded !== 'string' || !encoded.length || encoded.length > PLAN_LIMITS.encodedLength || !/^[A-Za-z0-9_-]+$/.test(encoded) || encoded.length % 4 === 1) throw new Error('Invalid or oversized shared plan.');
  let envelope: unknown;
  try {
    const binary = atob(encoded.replaceAll('-', '+').replaceAll('_', '/'));
    if (binary.length > PLAN_LIMITS.decodedBytes) throw new Error('Plan is too large.');
    const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
    envelope = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch { throw new Error('Shared plan is not valid UTF-8 plan data.'); }
  if (!record(envelope) || Object.keys(envelope).length !== 2 || !Object.hasOwn(envelope, 'input') || envelope.version !== CODEC_VERSION) throw new Error('Unsupported shared plan version or fields.');
  const errors = validate(envelope.input);
  if (errors.length) throw new Error(errors.join(' '));
  return envelope.input as PlannerInput;
}
