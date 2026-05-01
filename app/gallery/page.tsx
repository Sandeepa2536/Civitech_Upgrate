"use client";

import { useState, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import Preloader from "@/components/Preloader";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import NextImage from "next/image";

const categories = [
  "All", "Celebrations", "Team Get-Togethers", "CSR Projects", "Annual Milestones", "Site Events"
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get("cat") || "All";
    setFilter(cat);
    fetchEvents();
  }, [searchParams]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_events')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching gallery events:", error);
    } finally {
      setLoading(false);
    }
  }

  const galleryItems = events.filter(item =>
    (filter === "All" || item.category === filter) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300 pb-24 overflow-hidden">
      <PageHeader
        subtitle="Life at Civitech"
        title="Events &"
        highlightedTitle="Culture."
        description="Explore the moments that define our spirit—from team milestones and celebrations to community impact projects."
        backgroundImage="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 md:mt-16">
        <div className="flex flex-col items-center gap-6 md:gap-8 mb-12 md:mb-16 pb-8 border-b border-gray-100 dark:border-slate-800">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all border ${
                  filter === cat
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full flex justify-center md:justify-end">
            <div className="relative group w-full max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[3/2] bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {galleryItems.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.05} className="h-full">
                <Link href={`/gallery/${item.id}?cat=${filter}`} className="block h-full">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col hover:shadow-xl transition-all"
                  >
                    <div className="aspect-[3/2] p-3 md:p-4 shrink-0 relative">
                      <NextImage
                        src={item.cover_image}
                        alt={item.name}
                        fill
                        className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 md:p-6 flex flex-col flex-grow">
                      <span className="text-[9px] block mb-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-[0.2em]">{item.date}</span>
                      <h3 className="text-base md:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-4 line-clamp-2 h-12 md:h-14 flex items-center">{item.name}</h3>
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
                        <MapPin size={12} className="text-emerald-600 shrink-0" />
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">{item.location}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {!loading && galleryItems.length === 0 && (
          <div className="text-center py-24">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No events found in this category</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<Preloader />}>
      <GalleryContent />
    </Suspense>
  );
}
