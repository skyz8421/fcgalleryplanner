import type { MetadataRoute } from 'next';
import {contentRoutes,origin} from '../lib/site';
export const dynamic = 'force-static';
export default function sitemap():MetadataRoute.Sitemap{return contentRoutes.map(route=>({url:origin+route,...(['/','/gallery-levels/','/sources/'].includes(route)?{lastModified:'2026-10-31'}:route==='/gallery-guide/'?{lastModified:'2026-10-29'}:route==='/privacy/'?{lastModified:'2026-10-07'}:{})}))}
