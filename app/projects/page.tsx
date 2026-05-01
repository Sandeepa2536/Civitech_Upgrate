"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NextImage from "next/image";
import { useSearchParams } from "next/navigation";

interface Project {
  id: string;
  name: string;
  location: string;
  category: string;
  status: string;
  image: string;
}
import { MapPin, Eye, CheckCircle2, Clock, Briefcase, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";

import { supabase } from "@/lib/supabase";

const statuses = ["All Status", "Completed", "Ongoing"];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMetadata();
    fetchProjects();
  }, []);

  async function fetchMetadata() {
    try {
      const { data, error } = await supabase
        .from('category')
        .select('category')
        .eq('status_id', 1)
        .order('category');
      
      if (error) throw error;
      if (data) {
        // Use Set to ensure unique category names
        const uniqueCatNames = Array.from(new Set(data.map(c => c.category)));
        setDynamicCategories(["All", ...uniqueCatNames]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_summary')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      const mappedProjects = (data || []).map(p => ({
        id: p.id.toString(),
        name: p.title,
        location: p.location_name,
        category: p.category || "Uncategorized",
        status: p.status || "Unknown",
        image: p.cover_image || "/projects/image1.png"
      }));
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const cat = searchParams.get("cat");
    const status = searchParams.get("status");

    if (cat && dynamicCategories.includes(cat)) {
      setFilter(cat);
    }
    if (status && statuses.includes(status)) {
      setStatusFilter(status);
    }
  }, [searchParams, dynamicCategories]);

  const filteredProjects = projects.filter(p => {
    const categoryMatch = filter === "All" || p.category === filter;
    const statusMatch = statusFilter === "All Status" || p.status === statusFilter;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && statusMatch && searchMatch;
  });

  const completedCount = projects.filter(p => p.status === "Completed").length;

  return (
    <main className="pb-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <PageHeader
        subtitle="Engineering Portfolio"
        title="Our"
        highlightedTitle="Landmarks."
        description="Explore our diverse range of successfully completed engineering and construction projects across Sri Lanka."
        backgroundImage="https://www.secsl.gov.lk/wp-content/uploads/2023/01/img-bg.jpg"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 md:mt-16"
      >
        <ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 md:mb-16">
            {[
              { label: "All Projects", value: projects.length, icon: <Briefcase size={20} className="md:w-[22px] md:h-[22px]" />, color: "blue", bg: "from-blue-50 to-white", border: "border-blue-100", iconBg: "bg-blue-600 text-white shadow-blue-200" },
              { label: "Completed Projects", value: projects.filter((p: any) => p.status === "Completed").length, icon: <CheckCircle2 size={20} className="md:w-[22px] md:h-[22px]" />, color: "emerald", bg: "from-emerald-50 to-white", border: "border-emerald-100", iconBg: "bg-emerald-600 text-white shadow-emerald-200" },
              { label: "On-Time Delivery", value: "100%", icon: <Clock size={20} className="md:w-[22px] md:h-[22px]" />, color: "amber", bg: "from-amber-50 to-white", border: "border-amber-100", iconBg: "bg-amber-600 text-white shadow-amber-200" }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.bg} dark:from-slate-900 dark:to-slate-950 border ${stat.border} dark:border-slate-800 p-4 w-36 h-36 md:w-52 md:h-52 rounded-2xl md:rounded-[2.5rem] shadow-lg shadow-slate-200/40 dark:shadow-none flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-all duration-500 aspect-square`}
              >
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl mb-2 md:mb-4 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-md ${stat.iconBg}`}>
                  {stat.icon}
                </div>
                <h4 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tighter mb-0.5 md:mb-1">
                  {stat.value}
                </h4>
                <p className={`text-[10px] md:text-[12px] font-bold uppercase tracking-widest px-2 ${
                  stat.color === 'blue' ? 'text-blue-600/70' :
                  stat.color === 'emerald' ? 'text-emerald-600/70' :
                  'text-amber-600/70'
                }`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="border-b border-gray-100 dark:border-slate-800 pb-6 md:pb-8 mb-8 md:mb-10 text-center">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
              {dynamicCategories.map((cat) => {
                const isActive = filter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold uppercase tracking-tight md:tracking-widest transition-all duration-300 border ${
                      isActive
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none -translate-y-0.5"
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/30 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="relative group w-full max-w-[280px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 md:h-5 md:w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search landmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-[11px] md:text-sm font-bold shadow-sm"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Status:</span>
            <div className="flex bg-gray-50 dark:bg-slate-900 p-1 rounded-lg md:rounded-xl border border-gray-100 dark:border-slate-800">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 md:px-6 py-1.5 md:py-2 rounded-md md:rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    statusFilter === status
                      ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center mb-10 md:mb-12">
            <div className="px-5 py-2 md:py-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-100 dark:border-emerald-800/50">
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                Showing <span className="text-slate-900 dark:text-white mx-1 text-xs md:text-sm">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'Project' : 'Projects'}
              </p>
            </div>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-24">
            {filteredProjects.map((project, idx) => (
              <ScrollReveal key={project.id} delay={idx * 0.05} className="h-full">
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow w-full rounded-2xl overflow-hidden mx-auto h-full flex flex-col"
                >
                  <div className="aspect-[3/2] p-3 md:p-4 shrink-0 relative">
                    <NextImage
                      src={project.image}
                      alt={project.name}
                      fill
                      className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                    />
                  </div>

                  <div className="p-5 md:p-6 flex flex-col flex-grow">
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4 min-h-[60px] md:min-h-[32px]">
                      <span className="px-2.5 py-1 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-md shadow-sm text-center">
                        {project.category}
                      </span>
                      <div className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 border-2 ${
                        project.status === "Completed"
                          ? "bg-white text-emerald-700 border-emerald-600 dark:bg-slate-800 dark:text-emerald-400"
                          : "bg-white text-amber-700 border-amber-500 dark:bg-slate-800 dark:text-amber-400"
                      }`}>
                        {project.status === "Completed" ? <CheckCircle2 size={12} strokeWidth={3} /> : <Clock size={12} strokeWidth={3} />}
                        {project.status}
                      </div>
                    </div>

                    <h3 className="text-lg md:text-xl text-slate-900 dark:text-white font-bold leading-tight h-14 line-clamp-2 mb-4 md:mb-2 text-center flex items-center justify-center">
                      {project.name}
                    </h3>

                    <div className="mt-auto flex items-center border-t border-slate-50 dark:border-slate-800 pt-5 md:pt-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                          <MapPin size={12} className="text-emerald-600" />
                          <span className="truncate">{project.location}</span>
                        </div>
                      </div>
                      <Link href={`/projects/${project.id}?backCat=${filter}&backStatus=${statusFilter}`} className="bg-emerald-100 dark:bg-emerald-900/50 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-emerald-600 transition-all group/btn">
                        <Eye size={18} className="text-emerald-600 group-hover/btn:text-white transition-colors" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No projects found in this category.</p>
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
