import Link from '@/components/SiteLink';
import { origin } from '../lib/site';
export default function PageShell({title,description,path,children}:{title:string;description:string;path:string;children:React.ReactNode}) {
  const breadcrumb={ '@context':'https://schema.org', '@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Gallery planner',item:origin+'/'},{'@type':'ListItem',position:2,name:title,item:origin+path}]};
  return <main id="main" className="page-shell"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Planner</Link><span aria-hidden="true">/</span><span>{title}</span></nav><header className="page-heading"><h1>{title}</h1><p>{description}</p></header>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb).replace(/</g,'\\u003c')}}/></main>;
}
