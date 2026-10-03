/** Empty keys keep every production placement disabled. Fill only this site's issued units. */
export const AD_HOST = 'www.highperformanceformat.com';

export const AD_ROUTES = [
  '/',
  '/gallery-score-calculator',
  '/gallery-guide',
  '/gallery-levels',
  '/first-owner-bonus',
] as const;

export const AD_GUIDE_ROUTES = [
  '/gallery-guide',
  '/gallery-levels',
  '/first-owner-bonus',
] as const;

export const AD_UNITS = {
  mobile: { key: '', width: 320, height: 50, document: '/ads/320x50.html' },
  leaderboard: { key: '', width: 728, height: 90, document: '/ads/728x90.html' },
  rectangle: { key: '', width: 300, height: 250, document: '/ads/300x250.html' },
} as const;
