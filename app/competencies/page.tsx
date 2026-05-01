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
  ArrowRight
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import NextImage from "next/image";

const coreCompetencies = [
  {
    title: "Project Management",
    icon: Briefcase,
    iconColor: "text-blue-600",
    borderColor: "border-blue-600",
    hoverText: "group-hover:text-blue-600",
    description: "Our integrated project management framework ensures precision from inception to handover. We utilize advanced scheduling and resource allocation protocols to maintain critical path efficiency.",
    benefits: ["Optimized Resource Allocation", "Strict Timeline Adherence", "Risk Mitigation Strategies", "Quality Control Protocols"]
  },
  {
    title: "Engineering Expertise",
    icon: HardHat,
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-600",
    hoverText: "group-hover:text-emerald-600",
    description: "Backed by 22+ years of market presence, our engineering team excels in complex structural designs and civil works. We deliver technical excellence across industrial and institutional sectors.",
    benefits: ["Structural Integrity Assurance", "Advanced Civil Engineering", "Technical Design Mastery", "Innovation in Construction"]
  },
  {
    title: "Quality Assurance",
    icon: ShieldCheck,
    iconColor: "text-rose-600",
    borderColor: "border-rose-600",
    hoverText: "group-hover:text-rose-600",
    description: "Committed to international standards, we implement rigorous QA/QC measures at every stage. Our C4 grading reflects our ability to deliver projects that meet national safety and quality benchmarks.",
    benefits: ["ICTAD C4 Compliance", "ISO 9001:2015 Standards", "Material Testing Rigor", "Zero-Defect Delivery Target"]
  },
  {
    title: "Operational Efficiency",
    icon: Workflow,
    iconColor: "text-amber-500",
    borderColor: "border-amber-500",
    hoverText: "group-hover:text-amber-500",
    description: "We optimize construction workflows through modernized machinery and tactical site management. Our logistics hub ensures seamless material distribution and equipment uptime.",
    benefits: ["Modern Machinery Fleet", "Tactical Site Coordination", "Logistics Hub Support", "Cost-Effective Execution"]
  }
];

export default function CompetenciesPage() {
  return (
    <main className="bg-white dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden text-slate-900 dark:text-white">
      <PageHeader
        subtitle="Operational Excellence"
        title="Our Core"
        highlightedTitle="Competencies."
        description="Combining technical mastery with strategic management to deliver Sri Lanka's most demanding engineering infrastructure."
        backgroundImage="https://humanfocus.co.uk/wp-content/uploads/Construction-Site-Management.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-24">
        {/* Intro Section */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-24 md:mb-32">
          <ScrollReveal>
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="w-10 h-[2px] bg-emerald-600"></div>
                  <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs">Our Purpose</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-tight">
                  Built on <span className="text-emerald-600">Integrity.</span><br className="hidden md:block"/>
                  Driven by <span className="text-emerald-600">Excellence.</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                  At Civitech, we combine years of field experience with advanced management strategies to deliver engineering projects that are structurally sound and economically efficient.
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-4 pt-2 md:pt-4">
                <div className="px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-center">
                  ICTAD & NCASL (C4)
                </div>
                <div className="px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-2xl bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-center">
                  ISO 9001:2015
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="relative mt-4 lg:mt-0 max-w-2xl mx-auto">
              <div className="absolute -inset-2 md:-inset-4 border border-emerald-500/10 rounded-2xl md:rounded-[4rem] pointer-events-none"></div>
              <div className="relative rounded-xl md:rounded-[3.5rem] overflow-hidden aspect-video shadow-2xl">
                <NextImage 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYmQRpS5f5UoTP2wIA13CmHf3BxPf6FI0zFg&s" 
                  alt="Engineering Precision"
                  fill
                  className="object-cover"
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
                className={`group relative flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl md:rounded-[3rem] p-6 md:p-14 border-2 ${comp.borderColor} hover:shadow-2xl transition-all duration-500 overflow-hidden scroll-mt-32`}
              >
                {/* Header Block */}
                <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-10">
                  <div className={`flex-none p-3 md:p-4 rounded-xl md:rounded-2xl border-2 ${comp.borderColor} ${comp.iconColor} shadow-sm transition-transform duration-500 group-hover:scale-110`}>
                    <comp.icon size={20} className="md:w-7 md:h-7" strokeWidth={2.5} />
                  </div>
                  <h3 className={`text-lg md:text-3xl font-bold uppercase tracking-tighter leading-tight transition-colors ${comp.iconColor} md:text-slate-900 md:dark:text-white ${comp.hoverText}`}>
                    {comp.title}
                  </h3>
                </div>

                <div className="flex-grow flex flex-col">
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-medium">
                    {comp.description}
                  </p>

                  <div className="space-y-6 pt-6 md:pt-10 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {comp.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center space-x-3 group/item">
                          <CheckCircle2 size={16} className={`${comp.iconColor} shrink-0`} />
                          <span className="text-slate-700 dark:text-slate-300 text-[10px] md:text-sm font-bold tracking-wide uppercase group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
                            {benefit}
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

        {/* CTA Section */}
        <div className="mb-24">
          <ScrollReveal>
            <div className="bg-slate-900 dark:bg-emerald-600 rounded-3xl md:rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 transition-transform duration-700 group-hover:scale-110"></div>
              <div className="relative z-10 grid lg:grid-cols-12 gap-8 md:gap-12 items-center">
                <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
                  <h3 className="text-3xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Engineering <span className="text-emerald-500 dark:text-slate-900">Excellence</span> Awaits.</h3>
                  <p className="text-slate-400 dark:text-emerald-50 text-sm md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Leverage our institutional-grade technical capabilities for your next industrial or commercial landmark.
                  </p>
                </div>
                <div className="lg:col-span-4 flex justify-center lg:justify-end">
                  <Link href="/contact" className="inline-flex items-center gap-3 bg-emerald-600 dark:bg-slate-950 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-white hover:text-emerald-600 transition-all shadow-xl active:scale-95 group">
                    Connect with our Experts
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
