"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Building2, 
  Construction, 
  Award, 
  CheckCircle2,
  Target,
  History,
  PencilRuler,
  Waves,
  Waypoints,
  Building,
  BoxSelect,
  MapPin,
  Eye,
  Settings,
  Zap,
  Home as HomeIcon
} from "lucide-react";

import { supabase } from "@/lib/supabase";

const carouselSlides = [
  {
    image: "https://maximalengineer.com/wp-content/uploads/2026/01/pjh.jpeg",
    subtitle: "Built on Integrity",
    title: "Engineering Excellence Since 2002",
    description: "Leading the way in national infrastructure development with unmatched technical mastery."
  },
  {
    image: "/Industrial_Solutions.jpg",
    subtitle: "ICTAD C4 Graded",
    title: "Strategic Industrial Solutions",
    description: "Multi-million rupee projects delivered with precision and financial robustness."
  },
  {
    image: "/Modern_Architectural_Landmarks.jpg",
    subtitle: "Quality Assured",
    title: "Modern Architectural Landmarks",
    description: "From large-span steel structures to premium commercial showrooms."
  }
];

const clients = [
  "Brandix Apparel Solutions", 
  "Lanka Tiles PLC", 
  "HDFC Bank", 
  "Mahaweli Authority", 
  "Noritake Porcelain", 
  "Ansell Lanka", 
  "CCS Lanka", 
  "NWSDB", 
  "Lanka Walltiles PLC", 
  "Ceylon Beverage", 
  "DSI Tyres",
  "Shiratha Garments",
  "Yuk Ryong Threads",
  "Grand Gain Industrial",
  "Elsuma (Pvt) Ltd",
  "Legends Trading"
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dynamicPartners, setDynamicPartners] = useState<string[]>([]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    fetchPartners();
    return () => clearInterval(timer);
  }, []);

  async function fetchPartners() {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('name')
        .eq('status_id', 1);
      
      if (error) throw error;
      if (data && data.length > 0) {
        setDynamicPartners(data.map(p => p.name));
      }
    } catch (err) {
      console.error("Error fetching partners:", err);
    }
  }

  const partnersToDisplay = dynamicPartners.length > 0 ? dynamicPartners : clients;

  return (
    <main className="bg-white dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden">
      
      {/* 1. HERO CAROUSEL WITH INTEGRATED STATS */}
      <div id="default-carousel" className="relative w-full h-screen min-h-[700px] mt-0" data-carousel="slide">
        <div className="relative h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {carouselSlides.map((slide, index) => (
              index === currentSlide && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 z-0"
                >
                  <Image 
                    src={slide.image} 
                    fill 
                    className="block w-full h-full object-cover" 
                    alt="Project Image" 
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-slate-950/50"></div>
                  
                  <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 relative z-10 h-full flex flex-col justify-center text-center md:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="max-w-7xl"
                    >
                      <span className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-[11px] sm:text-sm mb-4 sm:mb-6 block">
                        {slide.subtitle}
                      </span>
                      <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white uppercase tracking-tight leading-[1.1] mb-8 sm:mb-10">
                        {slide.title.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="inline text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                          {slide.title.split(' ').pop()}
                        </span>
                      </h1>

                      {/* MINIFIED HERO STATS */}
                      <div className="hidden md:grid grid-cols-4 gap-4 mb-10 max-w-4xl">
                        {[
                          { label: "Years Mastery", value: "22+", icon: History },
                          { label: "Projects Done", value: "500+", icon: Construction },
                          { label: "ICTAD Ranking", value: "C4", icon: Award },
                          { label: "Success Rate", value: "100%", icon: Target },
                        ].map((stat, i) => (
                          <div key={i} className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center group/hstat transition-all hover:bg-white/10">
                            <div className="text-4xl font-bold text-white tracking-tighter mb-1">{stat.value}</div>
                            <div className="text-[12px] font-bold text-emerald-400 uppercase tracking-widest">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <Link href="/projects" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[9px] sm:text-[10px] tracking-widest px-8 sm:px-10 py-4 rounded-xl transition-all flex items-center gap-2 group shadow-2xl no-underline">
                          <span>Explore Portfolio</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold uppercase text-[9px] sm:text-[10px] tracking-widest px-8 sm:px-10 py-4 rounded-xl transition-all border border-white/10 no-underline">
                          Consultation
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. COMPACT CLIENT CAROUSEL (Right to Left) */}
      <div className="bg-white dark:bg-slate-950 py-16 border-y border-slate-100 dark:border-slate-900 relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-3 justify-center">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[9px]">Institutional Trust</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">
              Strategic <span className="text-emerald-600">Partnerships.</span>
            </h2>
          </div>
        </div>

        <div className="relative z-10 pause-on-hover">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-slate-950 via-white dark:via-slate-950/80 to-transparent z-20"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-slate-950 via-white dark:via-slate-950/80 to-transparent z-20"></div>

          <div className="flex overflow-hidden py-10">
            <div 
              className="flex items-center animate-infinite-scroll"
              style={{ width: "max-content" }}
            >
               {[...Array(2)].map((_, i) => (
                 <div key={i} className="flex items-center">
                   {clients.map((client, index) => (
                     <div key={`${client}-${i}-${index}`} className="flex items-center group/item mx-4">
                       <div className="relative px-8 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-emerald-500/30 hover:-translate-y-1 flex items-center gap-4">
                         <div className="w-1 h-5 rounded-full bg-emerald-500/10 group-hover/item:bg-emerald-500 transition-all duration-500"></div>
                         <span className="text-slate-700 dark:text-slate-300 group-hover/item:text-slate-950 dark:group-hover/item:text-white font-bold text-xs md:text-[13px] tracking-[0.2em] whitespace-nowrap uppercase transition-colors">
                           {client}
                         </span>
                       </div>
                       <div className="ml-8 w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                     </div>
                   ))}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ABOUT SECTION (Side-by-Side) */}
      <section className="py-24 sm:py-32 px-6 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 sm:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[10px]">Institutional Authority</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.9]">
                Engineered <br/> for <span className="">Permanence.</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
                Tracing our origins back to 2002, Civitech Constructions has evolved into a premier engineering force in Sri Lanka. We specialize in complex industrial and national infrastructure projects delivered with clinical precision.
              </p>
              <Link href="/about" className="inline-flex items-center gap-3 text-emerald-600 font-bold uppercase text-xs tracking-widest group no-underline">
                Discover Our Journey 
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-slate-900">
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter">C4</div>
                    <div className="px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">ICTAD Graded</div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    Officially registered and recognized for large-scale national infrastructure works.
                  </p>
               </div>
               <div className="space-y-3 sm:border-l sm:border-slate-100 sm:dark:border-slate-900 sm:pl-8">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter">ISO</div>
                    <div className="px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">9001:2015</div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    Committed to international quality standards and systematic project management.
                  </p>
               </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
             <div className="absolute -inset-4 border border-emerald-500/10 rounded-[3rem] sm:rounded-[4rem] pointer-events-none"></div>
             <div className="relative rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden aspect-[4/3] shadow-2xl border border-gray-100 dark:border-slate-800">
                <Image 
                  src="https://media.bizj.us/view/img/13036653/wf2476150cmlnativearticleheaderconstruction1600x900*1200xx900-900-350-0.jpg" 
                  fill 
                  className="w-full h-full object-cover" 
                  alt="Legacy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 3.1 SPECIALIZATIONS SECTION */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <div className="max-w-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[10px]">Strategic Pillars</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                Specialized <span className="text-emerald-600">Sectors.</span>
              </h2>
            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "Commercial & Industrial", 
                icon: PencilRuler, 
                borderColor: "border-blue-600",
                iconColor: "text-blue-600",
                hoverTextColor: "group-hover:text-blue-600",
                iconBorder: "border-blue-600",
                desc: "High-capacity factories, warehouses, and extensions for world-renowned industrial groups.",
                href: "/specializations#commercial-and-industrial-buildings" 
              },
              { 
                title: "Institutional Projects", 
                icon: Award, 
                borderColor: "border-emerald-600",
                iconColor: "text-emerald-600",
                hoverTextColor: "group-hover:text-emerald-600",
                iconBorder: "border-emerald-600",
                desc: "Strategic infrastructure for government and national authorities, ensuring functional excellence.",
                href: "/specializations#institutional-projects" 
              },
              { 
                title: "Steel Structures", 
                icon: BoxSelect, 
                borderColor: "border-emerald-500",
                iconColor: "text-emerald-500",
                hoverTextColor: "group-hover:text-emerald-500",
                iconBorder: "border-emerald-500",
                desc: "Large-span industrial buildings, complex steel frameworks, and high-rise structural foundations.",
                href: "/specializations#steel-structures" 
              },
              { 
                title: "Road Projects", 
                icon: Waypoints, 
                borderColor: "border-amber-500",
                iconColor: "text-amber-500",
                hoverTextColor: "group-hover:text-amber-500",
                iconBorder: "border-amber-500",
                desc: "Developing robust road networks and internal complex infrastructure for industrial zones.",
                href: "/specializations#road-projects" 
              },
              { 
                title: "Water Projects", 
                icon: Waves, 
                borderColor: "border-sky-600",
                iconColor: "text-sky-600",
                hoverTextColor: "group-hover:text-sky-600",
                iconBorder: "border-sky-600",
                desc: "Engineering sophisticated distribution systems and storage solutions for national water authorities.",
                href: "/specializations#water-projects" 
              },
              { 
                title: "Residential Projects", 
                icon: Building, 
                borderColor: "border-rose-600",
                iconColor: "text-rose-600",
                hoverTextColor: "group-hover:text-rose-600",
                iconBorder: "border-rose-600",
                desc: "Luxury residential developments and high-end corporate refurbishments with premium finishes.",
                href: "/specializations#residential-projects" 
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: [0.21, 0.45, 0.32, 0.9] }}
                viewport={{ once: true }}
              >
                <Link href={item.href} className={`group block relative p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 ${item.borderColor} transition-all duration-500 h-full flex flex-col items-start text-left no-underline`}>
                  <div className="flex items-center gap-4 mb-6 sm:mb-8 w-full">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 ${item.iconBorder} ${item.iconColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                      <item.icon size={24} className="sm:w-[26px] sm:h-[26px]" />
                    </div>
                    <h3 className={`text-lg sm:text-2xl font-bold uppercase tracking-tighter ${item.iconColor} sm:text-slate-900 sm:dark:text-white ${item.hoverTextColor} transition-colors leading-tight`}>{item.title}</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-8 flex-grow">{item.desc}</p>
                  <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ${item.iconColor}`}>
                    Explore More <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 flex justify-end">
          <Link href="/specializations" className="text-slate-500 hover:text-emerald-600 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2 group transition-colors no-underline">
            View All Sectors <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 3.2 CORE COMPETENCIES PREVIEW */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="max-w-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[10px]">Strategic Performance</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                Core <span className="text-emerald-600">Competencies.</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Civil Engineering & Turnkey",
                icon: Construction,
                desc: "Diverse civil engineering constructions and specialized turnkey projects from concept to completion.",
                borderColor: "border-blue-600",
                iconColor: "text-blue-600",
                hoverTextColor: "group-hover:text-blue-600",
                iconBorder: "border-blue-600",
                href: "/competencies#civil-engineering-turnkey"
              },
              {
                title: "Industrial & Commercial",
                icon: Building2,
                desc: "Design and construction of high-performance factories, warehouses, and multi-storied buildings.",
                borderColor: "border-emerald-600",
                iconColor: "text-emerald-600",
                hoverTextColor: "group-hover:text-emerald-600",
                iconBorder: "border-emerald-600",
                href: "/competencies#industrial-commercial"
              },
              {
                title: "Residential & Housing",
                icon: HomeIcon,
                desc: "Professional house planning and construction for custom housing projects across the island.",
                borderColor: "border-cyan-600",
                iconColor: "text-cyan-600",
                hoverTextColor: "group-hover:text-cyan-600",
                iconBorder: "border-cyan-600",
                href: "/competencies#residential-housing"
              },
              {
                title: "Structural & Architectural",
                icon: PencilRuler,
                desc: "Comprehensive structural design and architectural services tailored to meet modern engineering standards.",
                borderColor: "border-purple-600",
                iconColor: "text-purple-600",
                hoverTextColor: "group-hover:text-purple-600",
                iconBorder: "border-purple-600",
                href: "/competencies#structural-architectural"
              },
              {
                title: "Steel Fabrication",
                icon: Settings,
                desc: "Precision steel fabrication and erection for industrial applications, machinery, and structural roofing.",
                borderColor: "border-amber-500",
                iconColor: "text-amber-500",
                hoverTextColor: "group-hover:text-amber-500",
                iconBorder: "border-amber-500",
                href: "/competencies#steel-fabrication"
              },
              {
                title: "Infrastructure & Utilities",
                icon: Zap,
                desc: "Road construction, water projects, land development, and irrigation & drainage.",
                borderColor: "border-rose-600",
                iconColor: "text-rose-600",
                hoverTextColor: "group-hover:text-rose-600",
                iconBorder: "border-rose-600",
                href: "/competencies#infrastructure-utilities"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.21, 0.45, 0.32, 0.9] }}
                viewport={{ once: true }}
              >
                <Link href={item.href} className={`group block relative p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 ${item.borderColor} transition-all duration-500 h-full flex flex-col items-start text-left no-underline`}>
                  <div className="flex items-center gap-4 mb-6 sm:mb-8 w-full">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 ${item.iconBorder} ${item.iconColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                      <item.icon size={24} className="sm:w-[26px] sm:h-[26px]" />
                    </div>
                    <h3 className={`text-lg sm:text-2xl font-bold uppercase tracking-tighter ${item.iconColor} sm:text-slate-900 sm:dark:text-white ${item.hoverTextColor} transition-colors leading-tight`}>{item.title}</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-8 flex-grow">{item.desc}</p>
                  <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 ${item.iconColor}`}>
                    Explore More <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-end">
            <Link href="/competencies" className="text-slate-500 hover:text-emerald-600 font-bold uppercase text-xs tracking-[0.2em] flex items-center gap-2 group transition-colors no-underline">
              Explore All Competencies <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* FINAL CTA */}
      <section className="py-24 sm:py-32 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tighter mb-8 leading-[1]">Ready to Build Your <span className="text-emerald-500">Vision?</span></h2>
          <Link href="/contact" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-xs sm:text-sm tracking-[0.2em] px-12 sm:px-16 py-5 sm:py-6 rounded-2xl transition-all shadow-xl active:scale-95 no-underline">Request Consultation</Link>
        </div>
      </section>

    </main>
  );
}
