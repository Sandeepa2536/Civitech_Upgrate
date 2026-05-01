"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Shield, 
  User, 
  Clock, 
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  Info,
  Database,
  Terminal,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  DatabaseZap
} from "lucide-react";
import { getAuditLogs, getAuditStats } from "./actions";
import ScrollReveal from "@/components/ScrollReveal";

export default function SystemAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalEvents: 0, uniqueTables: 0, activeAdmins: 1 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 15;

  useEffect(() => {
    fetchData();
  }, [page]);

  async function fetchData() {
    setLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        getAuditLogs(page, pageSize),
        getAuditStats()
      ]);

      if (logsRes.success) {
        setLogs(logsRes.logs);
        setTotal(logsRes.total);
      }
      if (statsRes.success) {
        setStats({
          totalEvents: statsRes.totalEvents,
          uniqueTables: statsRes.uniqueTables,
          activeAdmins: statsRes.activeAdmins
        });
      }
    } catch (error) {
      console.error("Audit load error:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = logs.filter(log => 
    log.table_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.record_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case 'INSERT': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10';
      case 'UPDATE': return 'bg-blue-500/10 text-blue-600 border-blue-500/10';
      case 'DELETE': return 'bg-rose-500/10 text-rose-600 border-rose-500/10';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/10';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'INSERT': return <Plus className="w-3 h-3" />;
      case 'UPDATE': return <RefreshCcw className="w-3 h-3" />;
      case 'DELETE': return <X className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-10 font-sans pb-20">
      <ScrollReveal>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-[2px] bg-emerald-600"></div>
                <h4 className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-[10px]">Data Integrity & Forensic Logs</h4>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                System <span className="text-emerald-600">Audit.</span>
                <Activity className="text-emerald-600" size={32} />
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium max-w-xl">Cryptographically signed logs tracking every transaction within the Civitech platform ecosystem.</p>
            </div>

            <div className="flex items-center gap-3">
            <button className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-emerald-500 transition-all flex items-center gap-2 shadow-sm active:scale-95">
                <Download size={14} />
                Export Archive
            </button>
            </div>
        </header>
      </ScrollReveal>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Transactions", value: stats.totalEvents, color: "blue", icon: DatabaseZap },
          { label: "Tracked Entities", value: stats.uniqueTables, color: "emerald", icon: Database },
          { label: "System Nodes", value: "02", color: "rose", icon: Terminal },
        ].map((stat, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[2.5rem] shadow-sm shadow-slate-200/50 dark:shadow-none transition-all hover:shadow-xl group relative overflow-hidden h-full">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`} />
                <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`p-4 rounded-2xl bg-${stat.color === 'emerald' ? 'emerald' : stat.color === 'blue' ? 'blue' : 'rose'}-500/10 text-${stat.color === 'emerald' ? 'emerald' : stat.color === 'blue' ? 'blue' : 'rose'}-600 border border-${stat.color === 'emerald' ? 'emerald' : stat.color === 'blue' ? 'blue' : 'rose'}-500/10 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} strokeWidth={2.5} />
                </div>
                </div>
                <div className="relative z-10">
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{stat.value}</h3>
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search system transactions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-sm font-black uppercase tracking-tight transition-all shadow-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
                <th className="px-8 py-7 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Timestamp [UTC]</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Event Protocol</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Data Entity</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Transaction Trace</th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-right">State Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Registry...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center text-slate-400 font-black uppercase tracking-[0.3em] italic">No transaction records found in specified index.</td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => {
                  const date = new Date(log.created_at);
                  return (
                    <motion.tr 
                      key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-950/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                            {date.toLocaleDateString()}
                          </span>
                          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                            <Clock size={10} className="text-emerald-500" />
                            {date.toLocaleTimeString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border shadow-inner ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-emerald-600 transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            <Database size={16} strokeWidth={2.5} />
                          </div>
                          <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{log.table_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">ID: {log.record_id}</span>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-[300px] truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                {log.action === 'INSERT' ? 'Registry initialization' : `Modification of record ${log.record_id}`}
                            </p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="inline-flex items-center gap-2 text-[9px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-[0.2em] transition-all bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                            Inspect Payload
                            <ExternalLink size={12} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-10 py-10 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">Registry Index: {page * pageSize + 1} - {Math.min((page + 1) * pageSize, total)} of {total} operations</p>
          <div className="flex items-center gap-4 font-mono">
            <button 
                disabled={page === 0}
                onClick={() => setPage(prev => prev - 1)}
                className="px-6 py-4 border border-slate-300 dark:border-slate-800 rounded-xl text-[10px] font-black hover:border-emerald-500 hover:text-emerald-600 transition-all uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm disabled:opacity-30 flex items-center gap-2"
            >
                <ChevronLeft size={16} /> Previous
            </button>
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-2xl text-[12px] font-black shadow-xl shadow-emerald-600/30 border-2 border-emerald-500">
                {page + 1}
            </div>
            <button 
                disabled={(page + 1) * pageSize >= total}
                onClick={() => setPage(prev => prev + 1)}
                className="px-6 py-4 border border-slate-300 dark:border-slate-800 rounded-xl text-[10px] font-black hover:border-emerald-500 hover:text-emerald-600 transition-all uppercase tracking-widest text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm disabled:opacity-30 flex items-center gap-2"
            >
                Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dummy components for icons that might be missing in original import but used in template logic
function Plus(props: any) { return <Activity {...props} /> }
function RefreshCcw(props: any) { return <Activity {...props} /> }
function X(props: any) { return <Activity {...props} /> }
