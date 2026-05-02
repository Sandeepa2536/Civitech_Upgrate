"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  MapPin, 
  Type,
  User,
  Youtube,
  Upload,
  Loader2,
  RefreshCcw,
  Plus,
  X,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertContext";
import ScrollReveal from "@/components/ScrollReveal";
import { createProject } from "../actions";
import { getYouTubeId } from "@/lib/utils";

export default function NewProject() {
  const { showAlert } = useAlert();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [scopes, setScopes] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // Toggles for adding new items
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [isAddingNewScope, setIsAddingNewScope] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    new_category: "",
    status_id: "",
    project_scope_id: "",
    new_project_scope: "",
    location: "",
    client_id: "",
    video_url: "",
    started_at: "",
    end_at: ""
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null, null, null, null]);
  const [previews, setPreviews] = useState<{cover: string, gallery: string[]}>({
    cover: "",
    gallery: ["", "", "", "", "", ""]
  });

  const isCompleted = statuses.find(s => s.id.toString() === formData.status_id)?.status === 'Completed';

  useEffect(() => {
    fetchMetadata();
  }, []);

  async function fetchMetadata() {
    const { data: catData } = await supabase.from('category').select('*').eq('status_id', 1).order('category');
    const { data: statData } = await supabase.from('status').select('*').in('status', ['Ongoing', 'Completed']).order('status');
    const { data: clientData } = await supabase.from('clients').select('*').eq('status_id', 1).order('name');
    const { data: scopeData } = await supabase.from('project_scope').select('*').order('scope');

    if (catData) setCategories(catData);
    if (statData) setStatuses(statData);
    if (clientData) setClients(clientData);
    if (scopeData) setScopes(scopeData);
  }

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setPreviews(prev => ({ ...prev, cover: URL.createObjectURL(file) }));
    }
  };

  const handleGallerySelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFiles = [...galleryFiles];
      newFiles[index] = file;
      setGalleryFiles(newFiles);
      const newPreviews = [...previews.gallery];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, gallery: newPreviews }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!coverFile) {
      showAlert("Please upload a cover image.", "error");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload Cover Image
      let coverUrl = null;
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `covers/${Date.now()}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, coverFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName);
        coverUrl = publicUrl;
      }

      // 2. Upload Gallery Images
      const activeGalleryFiles = galleryFiles.filter(f => f !== null);
      const galleryUrls = await Promise.all(
        activeGalleryFiles.map(async (f) => {
          const fileExt = f!.name.split('.').pop();
          const fileName = `gallery/${Date.now()}-${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, f!);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName);
          return { path: publicUrl };
        })
      );

      // 3. Call Server Action (Handles Category, Scope, and Project securely)
      const cleanVideoId = getYouTubeId(formData.video_url) || formData.video_url;

      const result = await createProject({
        ...formData,
        cover_image: coverUrl
      }, galleryUrls, cleanVideoId);

      if (result.error) throw new Error(result.error);

      router.push("/admin/projects");
    } catch (error: any) {
      showAlert("Error saving project: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10 pb-20">
      <ScrollReveal>
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm"><ArrowLeft size={20} /></Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-[2px] bg-emerald-600"></div>
              <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[9px]">Administrative Console</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Add <span className="text-emerald-600">Project.</span></h1>
          </div>
        </div>
      </ScrollReveal>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-8 space-y-8">
          <ScrollReveal delay={0.1}>
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Project Title</label>
                  <input required type="text" placeholder="Project Name" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Category</label>
                    <div className="relative group/select">
                      <select 
                        required 
                        value={formData.category_id} 
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})} 
                        className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium appearance-none cursor-pointer shadow-sm text-slate-900 dark:text-white"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900">{cat.category}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-emerald-500 transition-colors"><ChevronDown size={18} /></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Current Status</label>
                    <div className="relative group/select">
                      <select required value={formData.status_id} onChange={(e) => setFormData({...formData, status_id: e.target.value})} className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium appearance-none cursor-pointer shadow-sm text-slate-900 dark:text-white">
                        <option value="">Select Status</option>
                        {statuses.map(stat => <option key={stat.id} value={stat.id} className="bg-white dark:bg-slate-900">{stat.status}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-emerald-500 transition-colors"><ChevronDown size={18} /></div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Project Scope</label>
                    <div className="relative group/select">
                      <select 
                        required 
                        value={formData.project_scope_id} 
                        onChange={(e) => setFormData({...formData, project_scope_id: e.target.value})} 
                        className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium appearance-none cursor-pointer shadow-sm text-slate-900 dark:text-white"
                      >
                        <option value="">Select Scope</option>
                        {scopes.map(s => <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900">{s.scope}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-emerald-500 transition-colors"><ChevronDown size={18} /></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Client Entity</label>
                    <div className="relative group/select">
                      <select required value={formData.client_id} onChange={(e) => setFormData({...formData, client_id: e.target.value})} className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium appearance-none cursor-pointer shadow-sm text-slate-900 dark:text-white">
                        <option value="">Select Client</option>
                        {clients.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900">{c.name}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-emerald-500 transition-colors"><ChevronDown size={18} /></div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Start Date</label>
                    <input 
                      type="date" 
                      value={formData.started_at} 
                      onChange={(e) => setFormData({...formData, started_at: e.target.value})} 
                      className="w-full px-6 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium shadow-sm text-slate-900 dark:text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${!isCompleted ? 'text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>End Date (Only for Completed)</label>
                    <input 
                      type="date" 
                      disabled={!isCompleted}
                      value={isCompleted ? formData.end_at : ""} 
                      onChange={(e) => setFormData({...formData, end_at: e.target.value})} 
                      className={`w-full px-6 py-4 border rounded-2xl outline-none transition-all font-medium shadow-sm ${!isCompleted ? 'bg-slate-100 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 cursor-not-allowed opacity-50' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 focus:border-emerald-500 text-slate-900 dark:text-white'}`} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                    <input required type="text" placeholder="Project Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tighter border-l-4 border-emerald-600 pl-6 relative z-10">Local Image Gallery</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl pl-6 relative z-10">Upload up to 6 images to showcase project details.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
                {galleryFiles.map((_, idx) => (
                  <div key={idx} className="group/gallery">
                    <label className={`relative aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${previews.gallery[idx] ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5' : 'border-gray-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                      {previews.gallery[idx] ? (
                        <>
                          <img src={previews.gallery[idx]} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/gallery:scale-110" />
                          <div className="absolute inset-0 bg-emerald-600/40 opacity-0 group-hover/gallery:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"><RefreshCcw className="text-white animate-spin-slow" size={28} /></div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover/gallery:bg-emerald-500/10 transition-colors">
                            <Upload size={20} className="text-slate-400 group-hover/gallery:text-emerald-500" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 group-hover/gallery:text-emerald-600 uppercase tracking-widest">Image {idx + 1}</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGallerySelect(idx, e)} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <ScrollReveal delay={0.3}>
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 shadow-sm hover:shadow-xl transition-all duration-500">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tighter border-l-4 border-emerald-600 pl-6">Cover Image</h3>
              <label className={`relative aspect-[4/3] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden group/cover ${previews.cover ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-500/5' : 'border-gray-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                {previews.cover ? (
                  <>
                    <img src={previews.cover} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-110" />
                    <div className="absolute inset-0 bg-emerald-600/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"><RefreshCcw className="text-white animate-spin-slow" size={32} /></div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover/cover:bg-emerald-500/10 transition-colors">
                      <Upload size={32} className="text-slate-400 group-hover/cover:text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover/cover:text-emerald-600 uppercase tracking-widest text-center px-6">Upload Master <br/> Cover Image</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
              </label>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1 flex items-center gap-2">
                  <Youtube size={16} className="text-rose-600" />
                  Video Integration
                </label>
                <input type="text" placeholder="YouTube Video ID" value={formData.video_url} onChange={(e) => setFormData({...formData, video_url: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border border-gray-100 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 transition-all font-mono text-xs text-slate-900 dark:text-white" />
              </div>
              
              <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[11px] tracking-[0.2em] py-6 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] disabled:opacity-50 group">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} className="group-hover:rotate-12 transition-transform" /> <span>Establish Project</span></>}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </form>
    </div>
  );
}
