import type { PlannerInput } from './engines';
/** ILLUSTRATIVE arithmetic scenario. These are not live cards, prices or game set scores. */
export const samplePlan: PlannerInput = {
  currentScore: 2_700_000, targetScore: 3_000_000, currentTokens: 420, targetTokens: 500,
  coinBalance: 15_000, taxRate: 0.05, mode: 'points', objective: 'coins',
  cards: [
    { id: 'illustrative-shared-card', name: 'Illustrative shared card', buy: 10_000, sell: 10_000, owned: false },
    { id: 'illustrative-club-card', name: 'Illustrative club card', buy: 1_000, sell: 1_000, owned: false },
    { id: 'illustrative-league-card', name: 'Illustrative league card', buy: 2_000, sell: 2_000, owned: false },
    { id: 'illustrative-rarity-card', name: 'Illustrative rarity card', buy: 4_000, sell: 4_000, owned: false },
  ],
  upgrades: [
    { id: 'illustrative-club-upgrade', setId: 'illustrative-club', name: 'Illustrative club', currentScore: 50_000, plannedScore: 200_000, currentTokens: 10, plannedTokens: 40, cardIds: ['illustrative-shared-card', 'illustrative-club-card'] },
    { id: 'illustrative-league-upgrade', setId: 'illustrative-league', name: 'Illustrative league', currentScore: 100_000, plannedScore: 280_000, currentTokens: 15, plannedTokens: 65, cardIds: ['illustrative-shared-card', 'illustrative-league-card'] },
    { id: 'illustrative-rarity-upgrade', setId: 'illustrative-rarity', name: 'Illustrative rarity', currentScore: 20_000, plannedScore: 320_000, currentTokens: 5, plannedTokens: 85, cardIds: ['illustrative-shared-card', 'illustrative-rarity-card'] },
  ],
};
