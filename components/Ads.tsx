'use client';

import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { AD_FRAME_ORIGIN, AD_GUIDE_ROUTES, AD_ROUTES, AD_UNITS } from '../data/ads';

type Unit = keyof typeof AD_UNITS;
const serverPreview = () => false;
const serverViewport = () => 'unknown';
function viewport() {
  return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';
}
function subscribeViewport(update: () => void) {
  const media = window.matchMedia('(max-width: 767px)');
  media.addEventListener('change', update);
  return () => media.removeEventListener('change', update);
}
function subscribePreview(update: () => void) {
  window.addEventListener('popstate', update);
  return () => window.removeEventListener('popstate', update);
}
function localPreview() {
  return ['localhost', '127.0.0.1', '10.0.2.2'].includes(window.location.hostname)
    && new URLSearchParams(window.location.search).get('ad-preview') === '1';
}
function normalizedPath(path: string) {
  return path === '/' ? '/' : path.replace(/\/$/, '');
}

/** Local-only size rehearsal never supplies a key or loads an advertising network. */
function Placement({ kind }: { kind: Unit }) {
  const pathname = normalizedPath(usePathname());
  const preview = useSyncExternalStore(subscribePreview, localPreview, serverPreview);
  const device = useSyncExternalStore(subscribeViewport, viewport, serverViewport);
  const unit = AD_UNITS[kind];
  if (!(AD_ROUTES as readonly string[]).includes(pathname)) return null;
  if (kind === 'rectangle' && !(AD_GUIDE_ROUTES as readonly string[]).includes(pathname)) return null;
  if (device === 'unknown' || (kind === 'mobile' && device !== 'mobile') || (kind === 'leaderboard' && device !== 'desktop')) return null;
  if (!unit.key && !preview) return null;
  const local = ['localhost', '127.0.0.1', '10.0.2.2'].includes(window.location.hostname);
  const document = (local ? '' : AD_FRAME_ORIGIN) + unit.document;
  const source = preview
    ? unit.document + '?preview=1'
    : document + '?key=' + encodeURIComponent(unit.key);
  return (
    <aside className={'ad-placement ad-' + kind} aria-label={preview ? 'Advertisement size preview' : 'Advertisement'}>
      <span className="ad-label">Advertisement{preview ? ' · size preview' : ''}</span>
      <iframe
        src={source}
        width={unit.width}
        height={unit.height}
        title={preview ? `Advertisement size preview ${unit.width} by ${unit.height}` : `Advertisement ${unit.width} by ${unit.height}`}
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="strict-origin-when-cross-origin"
        loading={kind === 'mobile' ? 'eager' : 'lazy'}
        scrolling="no"
      />
    </aside>
  );
}

export function AdContentEnd() {
  return <div className="ad-content-end"><Placement kind="leaderboard"/><Placement kind="rectangle"/></div>;
}

export function AdStickyBanner() {
  return <Placement kind="mobile"/>;
}
