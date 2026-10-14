import type { MetadataRoute } from 'next';
import {contentRoutes,origin} from '../lib/site';
export const dynamic = 'force-static';
export default function sitemap():MetadataRoute.Sitemap{return contentRoutes.map(route=>({url:origin+route,...(route==='/gallery-levels/'?{lastModified:'2026-10-15'}:['/','/gallery-guide/'].includes(route)?{lastModified:'2026-10-13'}:route==='/privacy/'?{lastModified:'2026-10-07'}:{})}))}
