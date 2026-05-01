"use client";

import { motion } from "framer-motion";
import { 
  Construction, 
  MessageSquare, 
  Users, 
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Image as ImageIcon,
  Clock,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getDashboardStats } from "./messages/actions";
import { supabase } from "@/lib/supabase";

function timeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [counts, setCounts] = useState({
    projects: "...",
    messages: "...",
    jobs: "...",
    gallery: "..."
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await getDashboardStats();
      if ('error' in data) throw new Error(data.error);
      const { count: galleryCount } = await supabase.from('gallery_events').select('*', { count: 'exact', head: true });
      setCounts({
        projects: data.projects?.toString() || "0",
        messages: data.inquiries?.toString() || "0",
        jobs: data.jobs?.toString() || "0",
        gallery: galleryCount?.toString() || "0"
      });
      setRecentInquiries(data.recentInquiries || []);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }

  if (!mounted) return null;

  const stats = [
    { label: "Total Projects", value: counts.projects, icon: Construction, color: "emerald", href: "/admin/projects", desc: "Active structural units" },
    { label: "Total Inquiries", value: counts.messages, icon: MessageSquare, color: "blue", href: "/admin/messages", desc: "Incoming communications" },
    { label: "Gallery Events", value: counts.gallery, icon: ImageIcon, color: "amber", href: "/admin/gallery", desc: "Visual documentation" },
    { label: "Active Jobs", value: counts.jobs, icon: Briefcase, color: "rose", href: "/admin/careers", desc: "Personnel requirements" },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 md:w-10 h-[2px] md:h-[2.5px] bg-emerald-600"></div>
            <h4 className="text-emerald-600 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[11px]">System Overview</h4>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Command <span className="text-emerald-600">Dashboard.</span></h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Link href={stat.href} className="block p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl md:rounded-[2.5rem] hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group no-underline relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-20 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150" />
              <div className="flex items-center justify-between mb-6 md:mb-8 relative z-10">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner ${
                  stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/10' :
                  stat.color === 'blue' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/10' :
                  stat.color === 'amber' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/10' :
                  'bg-rose-500/10 text-rose-600 border border-rose-500/10'
                }`}>
                  <stat.icon size={24} className="md:w-7 md:h-7" />
                </div>
                <ArrowUpRight className="text-slate-300 group-hover:text-emerald-500 transition-colors md:w-6 md:h-6" size={20} />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</h3>
                <p className="text-[10px] md:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{stat.label}</p>
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 md:mt-3">{stat.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 md:gap-10">
        {/* Recent Messages Preview */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-14 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-12 relative z-10">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Recent Inquiries</h2>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Direct communication artifacts</p>
            </div>
            <Link href="/admin/messages" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all group/btn border border-slate-100 dark:border-slate-700">
                EXPLORE ALL <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-4 relative z-10">
            {recentInquiries.length === 0 ? (
              <div className="py-16 md:py-24 text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-3xl flex items-center justify-center text-slate-200"><MessageSquare size={32} /></div>
                <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Transmission Buffer Empty</p>
              </div>
            ) : (
              recentInquiries.map((inquiry, i) => (
                <div key={inquiry.id} className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-900 transition-all group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald-500/10 flex items-center justify-center font-black text-emerald-600 border border-emerald-500/10 shadow-inner group-hover:scale-110 transition-transform flex-shrink-0 text-sm md:text-base">
                    {inquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs md:text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 truncate">{inquiry.name}</h4>
                    <p className="text-[9px] md:text-[10px] text-slate-400 truncate uppercase tracking-widest font-black flex items-center gap-2">
                        <Activity size={10} className="text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{inquiry.subject || "General System Inquiry"}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0 hidden xs:block">
                    <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 bg-white dark:bg-slate-800 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Clock size={10} className="text-emerald-500 flex-shrink-0" />
                        {timeAgo(inquiry.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="bg-[#0F172A] rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden group shadow-2xl shadow-slate-950/20">
              <TrendingUp className="absolute -right-8 -bottom-8 w-48 md:w-64 h-48 md:h-64 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000" />
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tighter mb-8 md:mb-10 relative z-10 border-b border-white/10 pb-6">Operations</h2>
              <div className="space-y-3 md:space-y-4 relative z-10">
                {[
                  { label: "New Infrastructure", icon: Construction, href: "/admin/projects/new" },
                  { label: "Archive Visuals", icon: ImageIcon, href: "/admin/gallery" },
                  { label: "Personnel Posting", icon: Briefcase, href: "/admin/careers/new" }
                ].map((action) => (
                  <Link key={action.label} href={action.href} className="flex items-center justify-between w-full p-4 md:p-5 rounded-xl md:rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all no-underline group/item">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform"><action.icon size={18} className="md:w-5 md:h-5" /></div>
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em]">{action.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover/item:translate-x-1 transition-transform md:w-4 md:h-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-emerald-600 rounded-3xl md:rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-emerald-900/20">
                <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-bold uppercase tracking-tighter mb-2 italic">Engineering Excellence</h3>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-80 leading-relaxed">Integrated terminal for Civitech management operations and tactical data distribution.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 md:w-32 h-24 md:h-32 bg-white/10 rounded-full blur-2xl" />
            </div>
        </div>
      </div>
    </div>
  );
}
