"use client";

import { motion } from "framer-motion";
import { 
  PencilRuler, 
  Waves, 
  Waypoints, 
  Building, 
  BoxSelect, 
  Award, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";

const specializationSectors = [
  {
    title: "Commercial and Industrial Buildings",
    icon: PencilRuler,
    iconColor: "text-blue-600",
    borderColor: "border-blue-600",
    hoverBorder: "hover:border-blue-600",
    hoverText: "group-hover:text-blue-600",
    description: "Our portfolio in the industrial sector includes several millions worth of high-capacity factories, warehouses, and extensions for world-renowned groups like Brandix and Ansell Lanka. We specialize in creating functional, scalable environments designed for heavy-duty industrial processes and large-scale commercial operations.",
    highlights: ["Factory Extensions", "Large-scale Warehousing", "Industrial Showrooms", "High-capacity Sheds"],
    image: "https://havitsteelstructure.com/wp-content/uploads/2024/11/Large-span-steel-warehouse.jpg"
  },
  {
    title: "Institutional Projects",
    icon: Award,
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-600",
    hoverBorder: "hover:border-emerald-600",
    hoverText: "group-hover:text-emerald-600",
    description: "We deliver strategic infrastructure for government and national authorities, ensuring durability and functional excellence for public use. From educational complexes to administrative landmarks, our institutional projects are built to serve the community while maintaining the highest standards of safety and architectural integrity.",
    highlights: ["Government Buildings", "Public Infrastructure", "Educational Facilities", "National Monuments"],
    image: "http://island.lk/wp-content/uploads/2025/03/1738491968-construction-6.jpg"
  },
  {
    title: "Steel Structures",
    icon: BoxSelect,
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-600",
    hoverBorder: "hover:border-emerald-600",
    hoverText: "group-hover:text-emerald-600",
    description: "Specialized in large-span industrial buildings and complex steel frameworks, including showrooms and high-rise structural foundations. Our expertise in precision fabrication and heavy erection allows us to execute sophisticated structural designs that provide maximum space efficiency and long-term structural reliability.",
    highlights: ["Precision Fabrication", "Industrial Showrooms", "Complex Frameworks", "Heavy Erection"],
    image: "https://www.metlspan.com/wp-content/uploads/2023/05/Modern-Industrial-Building-Ideas.jpg"
  },
  {
    title: "Road Projects",
    icon: Waypoints,
    iconColor: "text-amber-500",
    borderColor: "border-amber-500",
    hoverBorder: "hover:border-amber-500",
    hoverText: "group-hover:text-amber-500",
    description: "Developing robust road networks and internal complex infrastructure for industrial zones and major commercial landmarks across Sri Lanka. We focus on engineering durable surfaces and efficient logistics layouts that facilitate smooth transportation and integrate seamlessly with existing provincial and national road systems.",
    highlights: ["Factory Access Roads", "Internal Industrial Grids", "Logistics Infrastructure", "Strategic Roadlinks"],
    image: "https://maximalengineer.com/wp-content/uploads/2026/01/pjh.jpeg"
  },
  {
    title: "Water Projects",
    icon: Waves,
    iconColor: "text-sky-600",
    borderColor: "border-sky-600",
    hoverBorder: "hover:border-sky-600",
    hoverText: "group-hover:text-sky-600",
    description: "Engineering sophisticated distribution systems, reservoirs, and storage solutions for national water authorities and major utility boards. Our water projects focus on sustainability and technical precision, ensuring reliable clean water access through high-capacity ground reservoirs and optimized utility extension networks.",
    highlights: ["Ground Reservoirs", "Distribution Systems", "Utility Extensions", "Storage Solutions"],
    image: "https://www.nwsdb.lk/web/images/news/2023/Project_opening_Kataragama/Project_opening_Kataragama_01.jpg"
  },
  {
    title: "Residential Projects",
    icon: Building,
    iconColor: "text-rose-600",
    borderColor: "border-rose-600",
    hoverBorder: "hover:border-rose-600",
    hoverText: "group-hover:text-rose-600",
    description: "Delivering luxury residential developments and high-end corporate refurbishments with a focus on engineering longevity and premium finishes. We combine modern aesthetics with robust construction techniques to create living spaces that offer comfort, sophistication, and a superior return on investment for our clients.",
    highlights: ["Luxury Custom Builds", "Apartment Modernization", "Corporate Housing", "High-end Finishes"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&q=80"
  }
];

export default function SpecializationsPage() {
  return (
    <main className="bg-white dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden text-slate-900 dark:text-white">
      <PageHeader
        subtitle="Sector Specific Excellence"
        title="Multi-Sector"
        highlightedTitle="Expertise."
        description="Our strategic focus spans six specialized engineering paths, each defined by technical mastery and proven execution."
        backgroundImage="https://www.austintec.com/wp-content/uploads/2024/02/construction-majors.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-24">
        {/* Section Title */}
        <ScrollReveal>
          <div className="mb-10 md:mb-20 text-center px-2">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <div className="w-8 md:w-10 h-[2px] bg-emerald-600"></div>
              <span className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-[8px] md:text-xs">Strategic Pillars</span>
              <div className="w-8 md:w-10 h-[2px] bg-emerald-600"></div>
            </div>
            <h2 className="text-3xl md:text-6xl font-bold uppercase tracking-tighter leading-none">Six Paths of <span className="text-emerald-600">Mastery.</span></h2>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {specializationSectors.map((sector, index) => (
            <ScrollReveal key={sector.title} delay={index % 2 * 0.1} className="h-full">
              <motion.div
                id={sector.title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}
                className={`group relative flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl md:rounded-[3rem] border-2 ${sector.borderColor} p-6 md:p-14 hover:shadow-2xl transition-all duration-500 scroll-mt-32 min-h-[400px] md:min-h-[600px]`}
              >
                {/* Header Block */}
                <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-10">
                  <div className={`flex-none p-3 md:p-4 rounded-xl md:rounded-2xl border-2 ${sector.borderColor} ${sector.iconColor} shadow-sm transition-transform duration-500 group-hover:scale-110`}>
                    <sector.icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
                  </div>
                  <h3 className={`text-lg md:text-3xl font-bold uppercase tracking-tighter leading-tight transition-colors ${sector.iconColor} md:text-slate-900 md:dark:text-white ${sector.hoverText}`}>
                    {sector.title}
                  </h3>
                </div>


                <div className="flex-grow flex flex-col">
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 font-medium min-h-[100px] md:min-h-[160px]">
                    {sector.description}
                  </p>

                  <div className="space-y-6 pt-6 md:pt-10 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {sector.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-center space-x-3 group/item">
                          <CheckCircle2 size={16} className={`${sector.iconColor} shrink-0 md:w-[18px] md:h-[18px]`} />
                          <span className={`text-slate-700 dark:text-slate-300 text-[10px] md:text-sm font-bold tracking-wide uppercase group-hover/item:${sector.iconColor.split(' ')[0]} transition-colors`}>
                            {highlight}
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

        {/* Footer Authority Section */}
        <div className="mb-24">
          <ScrollReveal>
            <div className="mt-12 md:mt-24 p-8 md:p-24 rounded-3xl md:rounded-[4rem] bg-emerald-600 text-center relative overflow-hidden group shadow-2xl shadow-emerald-600/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-7xl font-bold text-white uppercase tracking-tighter leading-none mb-6 md:mb-8">Ready to <br className="md:hidden"/><span className="text-slate-950">Build?</span></h3>
                <p className="text-emerald-50 max-w-2xl mx-auto text-base md:text-xl leading-relaxed mb-8 md:mb-12 font-medium opacity-90">
                  Experience the Civitech difference in every square inch of your industrial or institutional landmark.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-3 md:gap-4 bg-slate-950 text-white px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] hover:bg-white hover:text-emerald-600 transition-all shadow-2xl active:scale-95">
                  Dispatch Inquiry
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
