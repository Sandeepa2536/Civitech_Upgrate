"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink,
  User,
  Construction
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertContext";
import { deleteProjectAction } from "./actions";

export default function AdminProjects() {
  const { showAlert } = useAlert();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_summary')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      const mappedProjects = data?.map(p => ({
        ...p,
        category: { category: p.category },
        clients: { name: p.client_name },
        location: p.location_name
      })) || [];
      
      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project? This will permanently remove all associated data and media.")) return;
    
    try {
      const result = await deleteProjectAction(id);

      if (result.error) throw new Error(result.error);

      setProjects(projects.filter(p => p.id !== id));
      showAlert("Project record purged successfully", "success");
    } catch (error: any) {
      showAlert("System Error: " + error.message, "error");
    }
  }

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Portfolio Management</h4>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Manage <span className="text-emerald-600">Projects.</span></h1>
        </div>
        <Link 
          href="/admin/projects/new" 
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 no-underline active:scale-95"
        >
          <Plus size={18} />
          Add New Project
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search projects by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-sm font-medium shadow-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-300 dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Project Identification</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Client Entity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Classification</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-right">Operational Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="inline-block w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synchronizing Database...</p>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">No matching project records found.</td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors border border-slate-200 dark:border-slate-700">
                          <Construction size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-slate-900 dark:text-white text-sm tracking-tight truncate max-w-[300px] uppercase">{project.title}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black mt-0.5 truncate flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                            {project.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                           <User size={12} strokeWidth={3} />
                        </div>
                        <span className="truncate max-w-[180px]">{project.clients?.name || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-[0.15em] rounded-lg border border-emerald-100 dark:border-emerald-500/20 shadow-sm whitespace-nowrap">
                        {project.category?.category || 'General Construction'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 md:gap-3">
                        <Link href={`/projects/${project.id}`} target="_blank" className="p-2.5 text-slate-400 hover:text-emerald-600 transition-all rounded-xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20">
                          <ExternalLink size={16} strokeWidth={2.5} />
                        </Link>
                        <Link href={`/admin/projects/${project.id}`} className="p-2.5 text-slate-400 hover:text-blue-600 transition-all rounded-xl hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20">
                          <Edit2 size={16} strokeWidth={2.5} />
                        </Link>
                        <button onClick={() => deleteProject(project.id)} className="p-2.5 text-slate-400 hover:text-rose-600 transition-all rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20">
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synchronizing...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs italic">No records found.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProjects.map((project) => (
                <div key={project.id} className="p-6 space-y-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                        <Construction size={20} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase leading-tight line-clamp-2">{project.title}</h3>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mt-1 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                          {project.location}
                        </div>
                      </div>
                    </div>
                    <Link href={`/projects/${project.id}`} target="_blank" className="p-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex-shrink-0">
                      <ExternalLink size={14} strokeWidth={3} />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Client</p>
                      <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase truncate">{project.clients?.name || "Unassigned"}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</p>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase truncate">{project.category?.category || 'General'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Link href={`/admin/projects/${project.id}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                      <Edit2 size={14} strokeWidth={3} />
                      Edit
                    </Link>
                    <button onClick={() => deleteProject(project.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                      <Trash2 size={14} strokeWidth={3} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
