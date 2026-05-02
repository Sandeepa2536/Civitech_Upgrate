"use client";

import Image from "next/image";
import { 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  Award, 
  Users, 
  Construction, 
  History,
  FileCheck,
  HardHat,
  LucideIcon
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { aboutData } from "@/app/data/siteData";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const iconMap: Record<string, LucideIcon> = {
  History, Award, Construction, HardHat, FileCheck, Users, Target, ShieldCheck
};

interface AboutContent {
  vision: string;
  mission: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

interface QualityPolicyItem {
  title: string;
  description: string;
  icon: string;
}

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent>({
    vision: aboutData.vision,
    mission: aboutData.mission
  });

  useEffect(() => {
    fetchDynamicContent();
  }, []);

  async function fetchDynamicContent() {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('key, value')
        .in('key', ['about_vision', 'about_mission']);

      if (error) throw error;

      if (data) {
        const dynamicContent: Partial<AboutContent> = {};
        data.forEach(item => {
          if (item.key === 'about_vision') dynamicContent.vision = item.value;
          if (item.key === 'about_mission') dynamicContent.mission = item.value;
        });

        setContent((prev) => ({
          ...prev,
          ...dynamicContent
        }));
      }
    } catch (err) {
      console.error("Error fetching about content:", err);
    }
  }

  const data = aboutData;

  return (
    <main className="pb-20 bg-white dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden">
      <PageHeader
        subtitle="The Civitech Legacy"
        title="Engineering"
        highlightedTitle="Excellence."
        description="For over two decades, Civitech Constructions has been at the forefront of Sri Lanka's infrastructure development, delivering quality and precision."
        backgroundImage="https://naxmltd.az/images/Reconstrcution.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-stretch mb-16 md:mb-24 relative">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col gap-6 relative z-10">
            <ScrollReveal>
              <div className="group relative h-full bg-white dark:bg-slate-900 rounded-3xl md:rounded-[3rem] p-6 md:p-10 shadow-sm border-2 border-emerald-600/50 transition-all hover:shadow-2xl hover:border-emerald-500/20 overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Target size={120} className="md:w-[180px] md:h-[180px] text-emerald-700 dark:text-emerald-500 -rotate-12" />
                </div>
                <div className="flex items-center space-x-3 md:space-x-5 mb-6 md:mb-8">
                  <div className="p-3.5 md:p-5 rounded-xl md:rounded-2xl shadow-xl transform group-hover:rotate-[360deg] transition-all duration-700 border-2 border-emerald-700">
                    <Target className="w-5 h-5 md:w-7 md:h-7 text-emerald-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-500 text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-1">Our Vision</h4>
                    <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tighter">Corporate Direction</h3>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-slate-700 dark:text-slate-300 text-base md:text-2xl leading-relaxed font-medium italic border-l-4 border-emerald-700 pl-5 md:pl-8">
                    &quot;{content.vision}&quot;
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="group relative h-full bg-white dark:bg-slate-900 rounded-3xl md:rounded-[3rem] p-6 md:p-10 shadow-sm border-2 border-emerald-600/50 transition-all hover:shadow-2xl hover:border-emerald-500/20 overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Lightbulb size={120} className="md:w-[180px] md:h-[180px] text-emerald-700 dark:text-emerald-500 -rotate-12" />
                </div>
                <div className="flex items-center space-x-3 md:space-x-5 mb-6 md:mb-8">
                  <div className="p-3.5 md:p-5 rounded-xl md:rounded-2xl shadow-xl transform group-hover:rotate-[360deg] transition-all duration-700 border-2 border-emerald-700">
                    <Lightbulb className="w-5 h-5 md:w-7 md:h-7 text-emerald-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-700 dark:text-emerald-500 text-[8px] md:text-[10px] uppercase tracking-[0.3em] mb-1">Our Mission</h4>
                    <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tighter">Strategic Commitment</h3>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-slate-700 dark:text-slate-300 text-sm md:text-lg leading-relaxed font-medium italic border-l-4 border-emerald-700 pl-5 md:pl-8">
                    &quot;{content.mission}&quot;
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2} className="h-full [&>div]:h-full">
            <div className="relative h-full">
              <div className="relative h-full rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-800 aspect-square lg:aspect-auto">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF9iL1TRFaqO5qtkFlZ3uW_8CaruarlgP_Ww&s"
                  alt="Construction Site"
                  fill
                  className="object-cover transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 p-4 md:p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                   <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">C4</div>
                      <div>
                         <p className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">ICTAD Certified</p>
                         <p className="text-emerald-400 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em]">NCASL Member Firm</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-stretch">
          <ScrollReveal id="history" className="h-full [&>div]:h-full scroll-mt-[100px] md:scroll-mt-[200px]">
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl md:rounded-[4rem] p-6 md:p-16 shadow-sm border-2 border-emerald-600/50 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 text-[60px] md:text-[120px] font-bold text-slate-50 dark:text-slate-800/20 select-none pointer-events-none">2002</div>
              <h2 className="text-2xl md:text-4xl text-slate-900 dark:text-slate-100 font-bold uppercase tracking-tighter mb-8 md:mb-12 relative z-10">Official <span className="text-emerald-700">History</span></h2>
              <div className="space-y-6 md:space-y-10 relative z-10">
                <div className="group">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="p-2.5 md:p-3 rounded-xl shadow-lg transform group-hover:rotate-12 transition-all duration-500 shrink-0 border-2 border-emerald-700">
                      <History className="w-4 h-4 md:w-5 md:h-5 text-emerald-700" strokeWidth={2} />
                    </div>
                    <h4 className="text-slate-900 dark:text-slate-100 font-bold text-[10px] md:text-sm uppercase tracking-[0.1em]">About Us</h4>
                  </div>
                  <div className="space-y-4 md:space-y-6">
                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-[15px] leading-relaxed">
                      <span className="font-bold text-slate-900 dark:text-white">Civitech Constructions (Pvt) Ltd</span> is a wholly Sri Lankan-owned company with a rich legacy in the construction industry, tracing its origins to 14th August 2002 under the name Civitech Constructions.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-[15px] leading-relaxed">
                      It was incorporated as a private limited company on 20th April 2006. The company is an ICTAD and NCASL registered contractor graded as C4, with proven financial and technical capabilities to undertake diverse civil engineering projects across Sri Lanka.
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-0 md:px-8 mt-10 md:mt-16 pt-8 md:pt-12 border-t border-slate-100 dark:border-slate-800 relative z-10">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {data?.stats.map((stat: StatItem, index: number) => {
                    const Icon = iconMap[stat.icon] || Construction;
                    
                    const statStyles = [
                      { // blue
                        icon: "text-blue-600 dark:text-blue-500",
                        border: "border-blue-600/30 dark:border-blue-500/20",
                        hoverBorder: "hover:border-blue-600 dark:hover:border-blue-500",
                        bgDefault: "bg-blue-50/30 dark:bg-blue-900/10"
                      },
                      { // emerald
                        icon: "text-emerald-600 dark:text-emerald-500",
                        border: "border-emerald-600/30 dark:border-emerald-500/20",
                        hoverBorder: "hover:border-emerald-600 dark:hover:border-emerald-500",
                        bgDefault: "bg-emerald-50/30 dark:bg-emerald-900/10"
                      },
                      { // amber
                        icon: "text-amber-600 dark:text-amber-500",
                        border: "border-amber-600/30 dark:border-amber-500/20",
                        hoverBorder: "hover:border-amber-600 dark:hover:border-amber-500",
                        bgDefault: "bg-amber-50/30 dark:bg-amber-900/10"
                      },
                      { // rose
                        icon: "text-rose-600 dark:text-rose-500",
                        border: "border-rose-600/30 dark:border-rose-500/20",
                        hoverBorder: "hover:border-rose-600 dark:hover:border-rose-500",
                        bgDefault: "bg-rose-50/30 dark:bg-rose-900/10"
                      }
                    ];

                    const style = statStyles[index] || statStyles[0];

                    return (
                      <div key={index} className={`flex flex-col items-center text-center p-4 md:p-5 rounded-2xl border-2 ${style.border} md:border-transparent transition-all duration-300 group/stat-mini shadow-sm hover:shadow-xl ${style.bgDefault} ${style.hoverBorder}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 md:mb-4 shadow-md transform group-hover/stat-mini:rotate-12 transition-all duration-500 shrink-0 border-2 ${style.border} ${style.icon} bg-white dark:bg-slate-800`}>
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col items-center">
                          <div className={`text-xl md:text-2xl font-bold tracking-tighter leading-none mb-1 transition-colors ${style.icon}`}>{stat.value}</div>
                          <div className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-tight ${style.icon} opacity-80`}>{stat.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="h-full [&>div]:h-full scroll-mt-[100px] md:scroll-mt-[200px]">
            <div id="quality-policy" className="h-full py-12 md:py-16 px-8 md:px-16 bg-gray-50 dark:bg-slate-900 rounded-3xl md:rounded-[4rem] border-2 border-emerald-600/50 shadow-sm relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
                <ShieldCheck size={300} className="text-slate-900 dark:text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl text-slate-900 dark:text-slate-100 font-bold uppercase tracking-tighter mb-4 relative z-10">Quality <span className="text-emerald-700">Policy</span></h2>
              <p className="text-sm md:text-[14px] text-slate-600 dark:text-slate-400 mb-8 md:mb-12 leading-relaxed relative z-10 font-medium">
                We are dedicated to providing construction solutions that consistently meet or exceed customer expectations while complying with legal requirements.
              </p>
              <div className="space-y-4 relative z-10">
                {data?.qualityPolicy.map((item: QualityPolicyItem, index: number) => {
                  const Icon = iconMap[item.icon] || FileCheck;
                  
                  const itemStyles = [
                    { // blue
                      icon: "text-blue-600 dark:text-blue-500",
                      hoverIcon: "group-hover:text-blue-600",
                      darkHoverIcon: "dark:group-hover:text-blue-500",
                      border: "border-blue-600/30 dark:border-blue-500/20",
                      hoverBorder: "hover:border-blue-600 dark:hover:border-blue-500",
                      bgDefault: "bg-blue-50/30 dark:bg-blue-900/10"
                    },
                    { // emerald
                      icon: "text-emerald-600 dark:text-emerald-500",
                      hoverIcon: "group-hover:text-emerald-600",
                      darkHoverIcon: "dark:group-hover:text-emerald-500",
                      border: "border-emerald-600/30 dark:border-emerald-500/20",
                      hoverBorder: "hover:border-emerald-600 dark:hover:border-emerald-500",
                      bgDefault: "bg-emerald-50/30 dark:bg-emerald-900/10"
                    },
                    { // amber
                      icon: "text-amber-600 dark:text-amber-500",
                      hoverIcon: "group-hover:text-amber-600",
                      darkHoverIcon: "dark:group-hover:text-amber-500",
                      border: "border-amber-600/30 dark:border-amber-500/20",
                      hoverBorder: "hover:border-amber-600 dark:hover:border-amber-500",
                      bgDefault: "bg-amber-50/30 dark:bg-amber-900/10"
                    },
                    { // rose
                      icon: "text-rose-600 dark:text-rose-500",
                      hoverIcon: "group-hover:text-rose-600",
                      darkHoverIcon: "dark:group-hover:text-rose-500",
                      border: "border-rose-600/30 dark:border-rose-500/20",
                      hoverBorder: "hover:border-rose-600 dark:hover:border-rose-500",
                      bgDefault: "bg-rose-50/30 dark:bg-rose-900/10"
                    }
                  ];

                  const style = itemStyles[index % 4];

                  return (
                    <div key={index} className={`flex flex-col sm:flex-row items-center p-5 md:p-6 rounded-2xl md:rounded-[2rem] border-2 ${style.border} md:border-transparent ${style.hoverBorder} group transition-all shadow-sm hover:shadow-xl text-center sm:text-left ${style.bgDefault}`}>
                      <div className={`p-3 md:p-4 rounded-xl mb-4 sm:mb-0 sm:mr-6 group-hover:rotate-12 transition-all duration-500 shadow-lg shrink-0 border-2 ${style.border} bg-white dark:bg-slate-800 ${style.icon}`}>
                        <Icon className={`w-5 h-5`} strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className={`font-bold text-[10px] md:text-xs uppercase tracking-[0.1em] mb-1 transition-colors ${style.icon} md:text-slate-900 md:dark:text-slate-100 ${style.hoverIcon} ${style.darkHoverIcon}`}>{item.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-[11px] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-8 md:mt-10 text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 italic text-center relative z-10">
                (This policy is reviewed periodically to ensure alignment with our strategic direction)
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
