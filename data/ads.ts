/** Adsterra units issued to fcgallery.wiki (domain 6101738); public placement identifiers. */
export const AD_HOST = 'bauval.org';
export const AD_FRAME_ORIGIN = 'https://ads.fcgallery.wiki';

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
  mobile: { key: '9c8720af94c4ebbb92347a955348d286', width: 320, height: 50, document: '/ads/320x50.html' },
  leaderboard: { key: 'e418fb45869062ae16228afd37d895eb', width: 728, height: 90, document: '/ads/728x90.html' },
  rectangle: { key: 'ee01971825bd9bdc1cd56dc4f9f2ded3', width: 300, height: 250, document: '/ads/300x250.html' },
} as const;
