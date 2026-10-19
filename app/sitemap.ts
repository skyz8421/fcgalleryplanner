import type { MetadataRoute } from 'next';
import {contentRoutes,origin} from '../lib/site';
export const dynamic = 'force-static';
export default function sitemap():MetadataRoute.Sitemap{return contentRoutes.map(route=>({url:origin+route,...(['/','/gallery-guide/'].includes(route)?{lastModified:'2026-10-20'}:['/gallery-levels/','/sources/'].includes(route)?{lastModified:'2026-10-19'}:route==='/privacy/'?{lastModified:'2026-10-07'}:{})}))}
