'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {guidanceMessages} from '@/lib/studio-guidance-messages';
import { translateUi, type StudioLocale } from '@/lib/studio-i18n';
const LanguageContext=createContext<{locale:StudioLocale;setLocale:(locale:StudioLocale)=>void}>({locale:'en',setLocale:()=>{}});
export function StudioLanguage({children}:{children:ReactNode}) {
 const [locale,setLocale]=useState<StudioLocale>('en');
 useEffect(()=>{const timer=setTimeout(()=>{try{if(localStorage.getItem('studio.locale')==='zh'){setLocale('zh');document.documentElement.lang='zh';}}catch{}},0);return()=>clearTimeout(timer);},[]);
 return <LanguageContext.Provider value={{locale,setLocale:next=>{setLocale(next);document.documentElement.lang=next;try{localStorage.setItem('studio.locale',next);}catch{}}}}>{children}</LanguageContext.Provider>;
}
export function useStudioLanguage(){return useContext(LanguageContext);}
export function Ui({text}:{text:string}){return translateUi(text,useStudioLanguage().locale);}
export function LanguagePicker(){const {locale,setLocale}=useStudioLanguage();return <label className="inline-flex items-center gap-2 text-sm">Language / 语言<select aria-label="Interface language" className="focus-ring rounded border border-hairline bg-white p-1" value={locale} onChange={event=>setLocale(event.target.value as StudioLocale)}><option value="en">English</option><option value="zh">中文</option></select></label>;}

export function GuidanceText({plotId,section}:{plotId:string;section:"definition"|"data"|"question"}){const {locale}=useStudioLanguage();return guidanceMessages[`help.${plotId}.${section}`]?.[locale==="zh"?1:0]??"";}
