'use client';
import {useEffect,useState,useSyncExternalStore} from 'react';
import {usePathname} from 'next/navigation';
const gaId=process.env.NEXT_PUBLIC_GA_ID;
const clarityId=process.env.NEXT_PUBLIC_CLARITY_ID;
declare global{interface Window{dataLayer?:unknown[];gtag?:(...args:unknown[])=>void;clarity?:((...args:unknown[])=>void)&{q?:unknown[][]}}}
function subscribe(fn:()=>void){window.addEventListener('storage',fn);window.addEventListener('fcgallery-consent',fn);return()=>{window.removeEventListener('storage',fn);window.removeEventListener('fcgallery-consent',fn)}}
function snapshot(){try{return localStorage.getItem('fcgallery-consent')??''}catch{return ''}}
function update(choice:string){try{localStorage.setItem('fcgallery-consent',choice)}catch{}window.dispatchEvent(new Event('fcgallery-consent'))}
export default function AnalyticsConsent(){const consent=useSyncExternalStore(subscribe,snapshot,()=> '');const [settings,setSettings]=useState(false);const path=usePathname();
 useEffect(()=>{if(consent!=='accepted')return;
 if(gaId&&!document.getElementById('fcgallery-ga')){window.dataLayer=window.dataLayer??[];window.gtag=function(){
 // gtag consumes Arguments objects, rather than plain arrays.
 // eslint-disable-next-line prefer-rest-params
 window.dataLayer?.push(arguments);
 }; window.gtag('js',new Date());window.gtag('config',gaId,{send_page_view:false,page_location:window.location.origin+path,page_path:path,allow_google_signals:false,allow_ad_personalization_signals:false});const script=document.createElement('script');script.id='fcgallery-ga';script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+gaId;document.head.appendChild(script)}
 if(clarityId&&path!=='/'&&path!=='/gallery-score-calculator/'&&!window.location.hash.startsWith('#plan=')&&!document.getElementById('fcgallery-clarity')){window.clarity=window.clarity??Object.assign((...args:unknown[])=>{window.clarity?.q?.push(args)},{q:[] as unknown[][]});window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'granted'});const script=document.createElement('script');script.id='fcgallery-clarity';script.async=true;script.src='https://www.clarity.ms/tag/'+clarityId;document.head.appendChild(script)}
 },[consent,path]);
 useEffect(()=>{if(consent==='accepted'&&gaId){window.gtag?.('event','page_view',{page_location:window.location.origin+path,page_path:path,page_title:document.title})}},[consent,path]);
 if(!gaId&&!clarityId)return null;
 const choose=(value:string)=>{update(value);setSettings(false);if(value==='declined'&&consent==='accepted')window.location.reload()};
 return <>{(!consent||settings)&&<section className="consent-banner" aria-label="Analytics cookie choice"><div><strong>Optional analytics</strong><p>Google Analytics measures page use. Clarity records guide pages only. Your tool inputs stay private; accepting is optional.</p></div><div className="tool-actions"><button className="button secondary" onClick={()=>choose('declined')}>Decline</button><button className="button primary" onClick={()=>choose('accepted')}>Accept analytics</button>{consent&&<button className="text-button" onClick={()=>setSettings(false)}>Close settings</button>}</div></section>}<button className="cookie-settings text-button" onClick={()=>setSettings(true)}>Cookie settings</button></>;
}
