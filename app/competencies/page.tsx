"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ShieldCheck, 
  Clock, 
  Construction, 
  Briefcase, 
  CheckCircle2, 
  Settings,
  HardHat,
  Gem,
  Cpu,
  Workflow,
  Zap,
  ArrowRight,
  Target,
  Rocket,
  Building2,
  Users2,
  Award,
  Home,
  PencilRuler,
  Landmark,
  Sparkles
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";

const coreCompetencies = [
  {
    title: "Civil Engineering & Turnkey",
    icon: Construction,
    description: "Undertaking diverse civil engineering constructions and specialized turnkey projects from concept to completion.",
    details: ["Civil Engineering Constructions", "Concrete Structures Construction", "Turnkey Projects", "General Civil Works"],
    iconColor: "text-blue-600",
    borderColor: "border-blue-600",
    hoverBorder: "hover:border-blue-600",
    hoverText: "group-hover:text-blue-600"
  },
  {
    title: "Industrial & Commercial",
    icon: Building2,
    description: "Expertise in the design and construction of high-performance factories, warehouses, and multi-storied buildings.",
    details: ["Factory Construction", "Warehouse Building", "Commercial Complexes", "Industrial Facilities"],
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-600",
    hoverBorder: "hover:border-emerald-600",
    hoverText: "group-hover:text-emerald-600"
  },
  {
    title: "Residential & Housing",
    icon: Home,
    description: "Professional house planning and construction for custom housing projects across the island.",
    details: ["House Planning", "Housing Projects", "Residential Construction", "Custom Homes"],
    iconColor: "text-cyan-600",
    borderColor: "border-cyan-600",
    hoverBorder: "hover:border-cyan-600",
    hoverText: "group-hover:text-cyan-600"
  },
  {
    title: "Structural & Architectural",
    icon: PencilRuler,
    description: "Comprehensive structural design and architectural services tailored to meet modern engineering standards.",
    details: ["Structural Design", "Architectural Services", "Planning & Approval", "Engineering Consultancy"],
    iconColor: "text-purple-600",
    borderColor: "border-purple-600",
    hoverBorder: "hover:border-purple-600",
    hoverText: "group-hover:text-purple-600"
  },
  {
    title: "Steel Fabrication",
    icon: Settings,
    description: "Precision steel fabrication and erection for industrial applications, machinery, and structural roofing.",
    details: ["Steel Fabrication", "Structural Erection", "Machine Structures", "Roofing Systems"],
    iconColor: "text-amber-500",
    borderColor: "border-amber-500",
    hoverBorder: "hover:border-amber-500",
    hoverText: "group-hover:text-amber-500"
  },
  {
    title: "Infrastructure & Utilities",
    icon: Zap,
    description: "Developing critical infrastructure including road construction, irrigation, and large-scale water projects.",
    details: ["Road Construction", "Water Projects", "Land Development", "Irrigation & Drainage"],
    iconColor: "text-rose-600",
    borderColor: "border-rose-600",
    hoverBorder: "hover:border-rose-600",
    hoverText: "group-hover:text-rose-600"
  }
];

export default function CompetenciesPage() {
  return (
    <main className="bg-white dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden text-slate-900 dark:text-white">
      <PageHeader
        subtitle="Strategic Performance"
        title="Core"
        highlightedTitle="Competencies."
        description="Our success is built on a foundation of operational strength, financial stability, and technical engineering mastery, registered as a C4 graded contractor."
        backgroundImage="https://humanfocus.co.uk/wp-content/uploads/competency-in-construction.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-24">
        {/* Intro Section - Vision & Mission */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 md:mb-32">
          <ScrollReveal>
            <div className="space-y-6 md:space-y-10 text-center lg:text-left">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-10 h-[2px] bg-emerald-600"></div>
                  <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">Our Purpose</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-tight">
                  Built on <span className="text-emerald-600">Integrity.</span><br className="hidden md:block"/>
                  Driven by <span className="text-emerald-600">Excellence.</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                  At Civitech, we combine years of field experience with advanced management strategies to deliver engineering projects that are structurally sound and economically efficient.
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 pt-4">
                <div className="px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center">
                  ICTAD & NCASL Registered (C4)
                </div>
                <div className="px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center">
                  ISO 9001:2015 Compliant
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -inset-4 border border-emerald-500/10 rounded-3xl md:rounded-[4rem] pointer-events-none"></div>
              <div className="relative rounded-2xl md:rounded-[3.5rem] overflow-hidden aspect-video shadow-2xl">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYmQRpS5f5UoTP2wIA13CmHf3BxPf6FI0zFg&s" 
                  alt="Engineering Precision"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/20"></div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Competencies Grid */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-16">
          {coreCompetencies.map((comp, index) => (
            <ScrollReveal key={comp.title} delay={index % 2 * 0.1}>
              <motion.div 
                id={comp.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}
                className={`group relative flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl md:rounded-[3rem] p-6 md:p-14 border-2 ${comp.borderColor} hover:shadow-2xl transition-all duration-500 overflow-hidden scroll-mt-32`}
              >
                {/* Header Block */}
                <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-10">
                  <div className={`flex-none p-3 md:p-4 rounded-xl md:rounded-2xl border-2 ${comp.borderColor} ${comp.iconColor} shadow-sm transition-transform duration-500 group-hover:scale-110`}>
                    <comp.icon size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
                  </div>
                  <h3 className={`text-xl md:text-3xl font-bold uppercase tracking-tighter leading-tight transition-colors ${comp.iconColor} md:text-slate-900 md:dark:text-white ${comp.hoverText}`}>
                    {comp.title}
                  </h3>
                </div>

                <div className="flex-grow flex flex-col">
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-medium">
                    {comp.description}
                  </p>

                  <div className="space-y-6 pt-6 md:pt-10 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {comp.details.map((detail) => (
                        <div key={detail} className="flex items-center space-x-3 group/item">
                          <CheckCircle2 size={16} className={`${comp.iconColor} shrink-0 md:w-[18px] md:h-[18px]`} />
                          <span className={`text-slate-700 dark:text-slate-300 text-[10px] md:text-sm font-bold tracking-wide uppercase group-hover/item:${comp.iconColor.split(' ')[0]} transition-colors`}>
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Quality Policy Section */}
        <div className="mb-16">
          <ScrollReveal>
            <div className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-[3rem] p-6 md:p-14 relative overflow-hidden group border-2 border-emerald-600/20">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
                <div className="space-y-6 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <div className="w-10 h-[2px] bg-emerald-600"></div>
                    <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">Quality Commitment</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                    Exceeding <br className="hidden md:block"/> <span className="text-emerald-500">Expectations.</span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg leading-relaxed font-medium mx-auto lg:mx-0 max-w-xl">
                    Our Quality Policy is built on ISO 9001:2015 standards, ensuring every project meets stringent legal requirements and client expectations.
                  </p>
                  <ul className="space-y-3 flex flex-col items-center lg:items-start">
                    {[
                      "Continuous QMS Improvement (ISO 9001:2015)",
                      "Proactive Customer Engagement",
                      "Professional Workforce Development",
                      "Measurable Quality Objectives"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[9px] text-left">
                        <Award size={16} className="text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-md p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-1 shadow-sm">
                    <div className="text-3xl md:text-4xl font-bold text-emerald-500 tracking-tighter">100%</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Compliance</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-md p-6 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-1 shadow-sm">
                    <div className="text-3xl md:text-4xl font-bold text-blue-500 tracking-tighter">ISO</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">9001:2015</div>
                  </div>
                  <div className="sm:col-span-2 bg-emerald-600 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl text-center space-y-1">
                    <div className="text-white text-lg md:text-xl font-bold uppercase tracking-tighter">Safety First Culture</div>
                    <div className="text-emerald-100 text-[9px] font-bold uppercase tracking-widest">Across All Project Sites</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Closing Authority Banner */}
        <div className="mb-24">
          <ScrollReveal>
            <div className="p-8 md:p-16 rounded-3xl md:rounded-[4rem] bg-emerald-600 text-center relative overflow-hidden shadow-2xl shadow-emerald-500/20 active:scale-[0.99] transition-transform">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"></div>
              <div className="relative z-10 space-y-6 md:space-y-8">
                <h3 className="text-3xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none">
                  Engineering <br className="hidden md:block"/> <span className="text-slate-950">Mastery.</span>
                </h3>
                <p className="text-emerald-50 max-w-2xl mx-auto text-sm md:text-xl leading-relaxed font-medium opacity-90">
                  Experience the Civitech difference in every square inch of your landmark infrastructure.
                </p>
                <div className="pt-2 md:pt-4">
                  <Link href="/contact" className="inline-flex items-center gap-3 md:gap-4 bg-slate-950 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-white hover:text-emerald-600 transition-all shadow-2xl">
                    Connect with our Experts
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
