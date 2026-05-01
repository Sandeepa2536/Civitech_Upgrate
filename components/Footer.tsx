"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, ShieldCheck, Youtube, Music, LucideIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TerminalData {
  office_address?: string;
  office_line?: string;
  mobile_connect?: string;
  office_email?: string;
  [key: string]: string | undefined;
}

interface SocialIcon {
  Icon: LucideIcon;
  href: string;
}

export default function Footer() {
  const pathname = usePathname();
  const [terminalData, setTerminalData] = useState<TerminalData | null>(null);
  const isProjectDetailPage = pathname?.startsWith('/projects/') && pathname.split('/').length > 2;
  const isUnderConstruction = pathname === '/under-construction';

  useEffect(() => {
    fetchTerminalData();
  }, []);

  async function fetchTerminalData() {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('key, value');
      if (error) throw error;
      const contentMap: TerminalData = {};
      data?.forEach(item => { contentMap[item.key] = item.value; });
      setTerminalData(contentMap);
    } catch (err) {
      console.error("Error fetching terminal data for footer:", err);
    }
  }

  if (isProjectDetailPage || isUnderConstruction) return null;

  const socialLinks: SocialIcon[] = [
    { Icon: Facebook, href: "https://www.facebook.com/share/1JwvRor3EW/" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/civitech-constructions-426159405" },
    { Icon: Instagram, href: "#" },
    { Icon: Music, href: "https://www.tiktok.com/@civitechconstructions?_r=1&_t=ZS-95ihRS2OrbU" },
    { Icon: Youtube, href: "#" }
  ];

  return (
    <footer className="tracking-normal bg-slate-50 dark:bg-slate-950 px-8 sm:px-12 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid min-[1200px]:grid-cols-3 gap-12 xl:gap-24 text-center min-[1200px]:text-left">
        <div className="min-[1200px]:max-w-sm max-w-lg w-full mx-auto min-[1200px]:mx-0 flex flex-col items-center min-[1200px]:items-start">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm transition-all group-hover:shadow-md">
              <Image src="/logo.png" alt="Civitech logo" width={40} height={40} className="h-8 md:h-10 w-auto object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-slate-900 dark:text-white font-bold text-xl md:text-2xl leading-none tracking-tight">CIVITECH</span>
              <span className="text-emerald-700 dark:text-emerald-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] leading-none mt-1">CONSTRUCTIONS</span>
            </div>
          </Link>
          <div className="mt-8">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm font-medium">Civitech Constructions delivers world-class engineering precision across Sri Lanka since 2002. We are built on integrity and dedicated to the nation&apos;s infrastructure legacy.</p>
          </div>
          <div className="mt-8 flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl w-fit">
            <ShieldCheck className="text-emerald-700 dark:text-emerald-500" size={24} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">ICTAD C4 Graded</p>
              <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest leading-none">ISO 9001:2015 Certified</p>
            </div>
          </div>
          <ul className="mt-10 flex space-x-5 justify-center min-[1200px]:justify-start">
            {socialLinks.map(({ Icon, href }, idx) => (
              <li key={idx}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:border-emerald-500/50 transition-all shadow-sm"><Icon size={18} /></a>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-[1200px]:col-span-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="flex flex-col items-center min-[1200px]:items-start">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-[0.2em] mb-8 flex items-center">
              Specializations
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Commercial and Industrial", href: "/specializations#commercial-and-industrial-buildings" },
                { name: "Institutional Projects", href: "/specializations#institutional-projects" },
                { name: "Steel Structures", href: "/specializations#steel-structures" },
                { name: "Road Projects", href: "/specializations#road-projects" },
                { name: "Water Projects", href: "/specializations#water-projects" },
                { name: "Residential Projects", href: "/specializations#residential-projects" }
              ].map((item) => (
                <li key={item.name}><Link href={item.href} className="text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center min-[1200px]:justify-start group">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center min-[1200px]:items-start">
            <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-[0.2em] mb-8 flex items-center">
              Corporate
            </h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", href: "/about" },
                { name: "Our Portfolio", href: "/projects" },
                { name: "Career Openings", href: "/careers" },
                { name: "Contact Hub", href: "/contact" },
                { name: "Competencies", href: "/competencies" }
              ].map((item) => (
                <li key={item.name}><Link href={item.href} className="text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center min-[1200px]:justify-start group">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center min-[1200px]:items-start">
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.2em] mb-8 flex items-center">
              Get In Touch
            </h4>
            <ul className="space-y-6">
              <li className="flex flex-col items-center min-[1200px]:flex-row min-[1200px]:items-start gap-4">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-700 dark:text-emerald-500"><MapPin size={16} /></div>
                <p className="text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wide leading-relaxed">
                  {terminalData?.office_address || "NO.9 / A/ 4, Kaluwala Road, Pahala Imbulgoda, Sri Lanka."}
                </p>
              </li>
              <li className="flex flex-col items-center min-[1200px]:flex-row min-[1200px]:items-center gap-4">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-700 dark:text-emerald-500"><Phone size={16} /></div>
                <p className="text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wide leading-none">
                  {terminalData?.office_line || "033 2263059"}<br/>
                  {terminalData?.mobile_connect || "070 3747474"}
                </p>
              </li>
              <li className="flex flex-col items-center min-[1200px]:flex-row min-[1200px]:items-center gap-4">
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-700 dark:text-emerald-500"><Mail size={16} /></div>
                <p className="text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wide leading-none">
                  {terminalData?.office_email || "civitec@sltnet.lk"}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-wrap max-md:flex-col items-center justify-between gap-6 text-center mt-16">
        <p className="text-emerald-700 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-[0.1em]">© {new Date().getFullYear()} Civitech Constructions (Pvt) Ltd. All rights reserved.</p>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest transition-colors"> developed by <span className="text-blue-700 dark:text-blue-500">CodeXpro Solutions</span> - Developing Section </p>
      </div>
    </footer>
  );
}
