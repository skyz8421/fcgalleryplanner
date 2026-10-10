import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, decodePlan, encodePlan, planRoutes, tokenTargetFromBalance, PLAN_LIMITS, type MarketCard, type PlannerInput, type Upgrade } from '../lib/engines';
import { samplePlan } from '../lib/sample-plan';

const card = (id: string, buy = 1000, sell = buy, owned = false): MarketCard => ({ id, name: id, buy, sell, owned });
const upgrade = (id: string, cardIds: string[], gain = 100, setId = id): Upgrade => ({
  id, name: id, setId, currentScore: 100, plannedScore: 100 + gain, currentTokens: 5, plannedTokens: 15, cardIds,
});
const input = (patch: Partial<PlannerInput> = {}): PlannerInput => ({
  currentScore: 1000, targetScore: 1100, currentTokens: 0, targetTokens: 10,
  coinBalance: 10_000, taxRate: 0.05, mode: 'points', objective: 'coins', cards: [], upgrades: [], ...patch,
});
const packed = (data: unknown) => Buffer.from(JSON.stringify(data)).toString('base64url');

test('consecutive exchanges need more capital than the most expensive single card', () => {
  const p = input({ cards: [card('a'), card('b'), card('c')], upgrades: [upgrade('s', ['a', 'b', 'c'])] });
  const r = planRoutes(p).feasible!;
  assert.equal(r.upfront, 1100);
  assert.equal(r.tax, 150);
  assert.equal(r.loss, 150);
  assert.equal(r.coinBalanceAfter, 9850);
  assert.equal(r.transactions, 6);
  assert.equal(planRoutes({ ...p, coinBalance: 1099 }).feasible, null);
});

test('one shared card purchase funds multiple sets without duplicate tax or transactions', () => {
  const p = input({ targetScore: 1200, cards: [card('shared')], upgrades: [upgrade('club', ['shared']), upgrade('league', ['shared'])] });
  const r = planRoutes(p).feasible!;
  assert.equal(r.pointsGain, 200);
  assert.deepEqual(r.cardIds, ['shared']);
  assert.equal(r.loss, 50);
  assert.equal(r.transactions, 2);
  assert.equal(r.sets, 2);
});

test('already collected card creates no purchase, tax, capital or sell action', () => {
  const r = planRoutes(input({ coinBalance: 0, cards: [card('owned', 1000, 1000, true)], upgrades: [upgrade('s', ['owned'])] })).feasible!;
  assert.equal(r.upfront, 0); assert.equal(r.tax, 0); assert.equal(r.transactions, 0); assert.deepEqual(r.order, []);
});

test('a set can contribute only one alternative; old score is counted only as a baseline', () => {
  const p = input({ targetScore: 1250, upgrades: [upgrade('a', [], 100, 'same'), upgrade('b', [], 150, 'same')] });
  const result = planRoutes(p);
  assert.equal(result.feasible, null);
  assert.equal(result.bestAvailable?.pointsGain, 150);
  assert.equal(result.bestAvailable?.projectedScore, 1150);
  assert.equal(result.bestAvailable?.sets, 1);
});

test('coins and trades objectives yield distinct feasible choices', () => {
  const p = input({ cards: [card('cheap-a', 500), card('cheap-b', 500), card('costly', 2000)], upgrades: [upgrade('cheap', ['cheap-a', 'cheap-b']), upgrade('few', ['costly'])] });
  const coins = planRoutes(p);
  assert.deepEqual(coins.feasible?.upgradeIds, ['cheap']);
  assert.deepEqual(coins.alternative?.upgradeIds, ['few']);
  const trades = planRoutes({ ...p, objective: 'trades' });
  assert.deepEqual(trades.feasible?.upgradeIds, ['few']);
  assert.deepEqual(trades.alternative?.upgradeIds, ['cheap']);
});

test('equal loss and transactions prefer less excess progress', () => {
  const r = planRoutes(input({ upgrades: [upgrade('overshoot', [], 200), upgrade('exact', [], 100)] })).feasible!;
  assert.deepEqual(r.upgradeIds, ['exact']);
});

test('profit exchanges are performed before losing exchanges and improve available funds', () => {
  const r = planRoutes(input({ coinBalance: 500, taxRate: 0, cards: [card('loss', 900, 0), card('profit', 500, 1000)], upgrades: [upgrade('s', ['loss', 'profit'])] })).feasible!;
  assert.deepEqual(r.order, ['profit', 'loss']);
  assert.equal(r.upfront, 500);
  assert.equal(r.loss, 400);
  assert.equal(r.coinBalanceAfter, 100);
});

test('exchange ordering minimises capital across mixed profitable and losing cards', () => {
  const cards = [card('a', 600, 1100), card('b', 200, 400), card('c', 1000, 950), card('d', 800, 0), card('e', 500, 450)];
  function permutations<T>(xs: T[]): T[][] { return xs.length ? xs.flatMap((x, i) => permutations(xs.filter((_, j) => i !== j)).map(rest => [x, ...rest])) : [[]]; }
  const required = (xs: MarketCard[]) => {
    let loss = 0, capital = 0;
    for (const c of xs) { capital = Math.max(capital, c.buy + loss); loss += c.buy - c.sell * 0.95; }
    return Math.max(0, capital);
  };
  const r = planRoutes(input({ cards, upgrades: [upgrade('s', cards.map(c => c.id))] })).feasible!;
  assert.equal(r.upfront, Math.min(...permutations(cards).map(required)));
});

test('unreachable target returns the best affordable progress, without claiming success', () => {
  const result = planRoutes(input({ targetScore: 1500, cards: [card('pricey', 20_000)], upgrades: [upgrade('free', [], 200), upgrade('blocked', ['pricey'], 500)] }));
  assert.equal(result.feasible, null); assert.equal(result.targetReached, false);
  assert.equal(result.bestAvailable?.pointsGain, 200); assert.equal(result.deficit, 500);
});

test('already reached goal returns empty route without recommending extra spend', () => {
  const result = planRoutes(input({ currentScore: 1200, upgrades: [upgrade('extra', [], 500)] }));
  assert.equal(result.targetReached, true); assert.equal(result.deficit, 0);
  assert.equal(result.feasible?.sets, 0); assert.equal(result.feasible?.pointsGain, 0);
});

test('tokens mode counts new rewards only, independent of point deficit', () => {
  const result = planRoutes(input({ mode: 'tokens', currentTokens: 7, targetTokens: 17, targetScore: 9_000_000, upgrades: [upgrade('s', [], 100)] }));
  assert.equal(result.feasible?.tokensGain, 10); assert.equal(result.feasible?.projectedTokens, 17); assert.equal(result.deficit, 10);
});

test('input validation rejects non-finite, negative, reverse, duplicate, conflicting and unknown values', () => {
  const invalid: PlannerInput[] = [
    input({ currentScore: NaN }), input({ taxRate: Infinity }), input({ coinBalance: -1 }), input({ taxRate: 1.01 }),
    input({ cards: [card('a', -1)] }), input({ cards: [card('a'), card('a', 2000)] }),
    input({ upgrades: [upgrade('s', ['missing'])] }),
    input({ upgrades: [{ ...upgrade('s', []), plannedScore: 99 }] }),
    input({ upgrades: [{ ...upgrade('s', []), plannedTokens: 4 }] }),
    input({ cards: [card('a')], upgrades: [upgrade('s', ['a', 'a'])] }),
    input({ upgrades: [upgrade('a', [], 100, 'same'), { ...upgrade('b', [], 150, 'same'), currentScore: 200 }] }),
    input({ upgrades: Array.from({ length: 17 }, (_, i) => upgrade(String(i), [])) }),
    input({ cards: Array.from({ length: 129 }, (_, i) => card(String(i))) }),
  ];
  for (const p of invalid) { const r = planRoutes(p); assert.ok(r.errors.length); assert.equal(r.feasible, null); }
});

test('score bonuses round each tag down independently and use the highest ten bonus amounts', () => {
  const floor = calculateScore(70, [{ id: 'a', name: 'A', matchedScore: 35, percent: 2 }, { id: 'b', name: 'B', matchedScore: 35, percent: 2 }]);
  assert.equal(floor.bonus, 0); assert.equal(floor.total, 70);
  const top = calculateScore(10_000, Array.from({ length: 11 }, (_, i) => ({ id: String(i), name: String(i), matchedScore: 10_000, percent: i + 1 })));
  assert.equal(top.bonus, 6500); assert.equal(top.total, 16_500);
  assert.equal(top.counted.length, 10); assert.equal(top.excluded[0].bonus, 100);
});

test('First Owner bonus applies to matching subtotal and is additional to base', () => {
  assert.equal(calculateScore(6000, [{ id: 'fo', name: 'First Owner', matchedScore: 1000, percent: 150 }]).total, 7500);
  assert.equal(calculateScore(8200, [{ id: 'fo', name: 'First Owner', matchedScore: 8200, percent: 500 }]).total, 49_200);
});

test('score checker rejects invalid subtotals, duplicated tags and invalid percentages', () => {
  for (const [base, tags] of [
    [NaN, []], [-1, []], [100, [{ id: 'a', name: 'A', matchedScore: 101, percent: 10 }]],
    [100, [{ id: 'a', name: 'A', matchedScore: 50, percent: Infinity }]],
    [100, [{ id: 'a', name: 'A', matchedScore: 50, percent: -1 }]],
    [100, [{ id: 'a', name: 'A', matchedScore: 50, percent: 10 }, { id: 'a', name: 'A', matchedScore: 50, percent: 10 }]],
  ] as Parameters<typeof calculateScore>[]) assert.throws(() => calculateScore(base, tags));
});

test('illustrative sample demonstrates shared purchases with transparent arithmetic', () => {
  const r = planRoutes(samplePlan).feasible!;
  assert.deepEqual(r.upgradeIds, ['illustrative-club-upgrade', 'illustrative-league-upgrade']);
  assert.equal(r.pointsGain, 330_000); assert.equal(r.tokensGain, 80);
  assert.equal(r.transactions, 6); assert.equal(r.loss, 650); assert.equal(r.upfront, 10_000);
});

test('versioned codec preserves full Unicode text, emoji, and identity', () => {
  const p = input({ cards: [{ ...card('日本⚽'), name: '球队 🎯 Málaga' }], upgrades: [upgrade('方案', ['日本⚽'])] });
  const encoded = encodePlan(p);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/); assert.deepEqual(decodePlan(encoded), p);
  assert.deepEqual(planRoutes(decodePlan(encoded)), planRoutes(p));
});

test('codec rejects malformed, huge, wrong-version, prototype, unexpected and invalid UTF-8 payloads', () => {
  const attacks = [
    '', 'a', '!!', 'a'.repeat(PLAN_LIMITS.encodedLength + 1),
    packed({ version: 2, input: input() }), packed({ version: 1, input: input(), extra: 1 }),
    packed({ version: 1, input: { ...input(), script: 'alert(1)' } }),
    packed({ version: 1, input: { ...input(), currentScore: null } }),
    packed({ version: 1, input: JSON.parse('{"__proto__":{"polluted":true}}') }),
    Buffer.from([0xff, 0xff]).toString('base64url'),
    packed({ version: 1, input: input({ cards: [{ ...card('a'), name: '\ud800' }] }) }),
    packed({ version: 1, input: input({ upgrades: Array.from({ length: 17 }, (_, i) => upgrade(String(i), [])) }) }),
  ];
  for (const attack of attacks) assert.throws(() => decodePlan(attack));
  assert.throws(() => encodePlan(input({ cards: [{ ...card('a'), name: '\ud800' }] })));
  assert.equal(({} as Record<string, unknown>).polluted, undefined);
});


test('unavailable purchases exclude every dependent upgrade without blocking independent routes', () => {
  const p = input({ cards: [{ ...card('missing', 100), available: false }, card('buyable', 200)], upgrades: [upgrade('blocked', ['missing'], 500), upgrade('backup', ['buyable'], 100)] });
  const result = planRoutes(p);
  assert.equal(result.errors.length, 0);
  assert.deepEqual(result.feasible?.upgradeIds, ['backup']);
  assert.equal(result.feasible?.transactions, 2);
  const restored = decodePlan(encodePlan(p));
  assert.equal(restored.cards[0].available, false);
  assert.deepEqual(planRoutes(restored), result);
  p.cards[0].owned = true;
  assert.deepEqual(planRoutes(p).feasible?.upgradeIds, ['blocked']);
});

test('older plans without availability are still tradable and invalid availability is rejected', () => {
  const old = input({ cards: [card('a')], upgrades: [upgrade('u', ['a'])] });
  assert.deepEqual(decodePlan(encodePlan(old)), old);
  assert.ok(planRoutes(old).feasible);
  const wrong = { ...old, cards: [{ ...card('a'), available: 'false' }] } as unknown as PlannerInput;
  assert.ok(planRoutes(wrong).errors.some(error => error.includes('available')));
  assert.throws(() => encodePlan(wrong));
});

test('token balance conversion preserves spending basis, already-reached targets and bounds', () => {
  assert.deepEqual(tokenTargetFromBalance(300, 200, 400), { currentTokens: 500, targetTokens: 600, remaining: 100 });
  assert.deepEqual(tokenTargetFromBalance(400, 200, 300), { currentTokens: 600, targetTokens: 500, remaining: 0 });
  for (const n of [-1, NaN, Infinity, 1.5]) assert.throws(() => tokenTargetFromBalance(n, 0, 1));
  assert.throws(() => tokenTargetFromBalance(1_000_000_000_000, 1, 0));
});
