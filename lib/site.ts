import type { Metadata } from 'next';
export const origin = 'https://fcgallery.wiki';
export const contentRoutes = ['/', '/gallery-score-calculator/', '/gallery-levels/', '/first-owner-bonus/', '/gallery-guide/', '/sources/', '/about/', '/contact/', '/privacy/', '/terms/'];
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {title,description,alternates:{canonical:origin+path},openGraph:{title,description,url:origin+path,siteName:'FCGallery',type:'website',images:[{url:origin+'/og.png',width:1200,height:630,alt:'FCGallery collection route planner'}]},twitter:{card:'summary_large_image',title,description,images:[origin+'/og.png']}};
}
