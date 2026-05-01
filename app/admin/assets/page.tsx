"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { 
  Plus,
  Loader2,
  LayoutGrid,
  Briefcase,
  Users,
  RefreshCcw,
  Image as ImageIcon,
  X,
  Edit2,
  Check,
  Search,
  LucideIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertContext";
import ScrollReveal from "@/components/ScrollReveal";
import { 
  addCategoryAction, 
  addScopeAction, 
  addClientAction, 
  addPartnerAction, 
  renameAssetAction, 
  updateAssetStatusAction,
  updateAssetLogoAction
} from "./actions";

interface Category {
  id: number;
  category: string;
  status_id: number;
}

interface ProjectScope {
  id: number;
  scope: string;
  status_id: number;
}

interface Client {
  id: number;
  name: string;
  logo: string | null;
  status_id: number;
}

interface Partner {
  id: number;
  name: string;
  logo: string | null;
  status_id: number;
}

export default function AdminMetadataManagement() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [scopes, setScopes] = useState<ProjectScope[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const [newCategory, setNewCategory] = useState("");
  const [newScope, setNewScope] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newClientLogo, setNewClientLogo] = useState<File | null>(null);
  const [newClientLogoPreview, setNewClientLogoPreview] = useState("");

  const [newPartner, setNewPartner] = useState("");
  const [newPartnerLogo, setNewPartnerLogo] = useState<File | null>(null);
  const [newPartnerLogoPreview, setNewPartnerLogoPreview] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<{table: string, id: number} | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchMetadata();
  }, []);

  async function fetchMetadata() {
    setFetching(true);
    try {
      const { data: catData } = await supabase.from('category').select('*').order('category');
      const { data: scopeDataRaw } = await supabase.from('project_scope').select('*').order('scope');
      const { data: clientData } = await supabase.from('clients').select('*').order('id', { ascending: false });
      const { data: partnerData } = await supabase.from('partners').select('*').order('id', { ascending: false });

      if (catData) setCategories(catData as Category[]);
      
      if (scopeDataRaw) {
        const normalizedScopes = scopeDataRaw.map(s => ({
          id: s.id,
          scope: s.scope,
          status_id: s.status_id || (s as Record<string, unknown>).Status_id || 1
        }));
        setScopes(normalizedScopes as ProjectScope[]);
      }

      if (clientData) setClients(clientData as Client[]);
      if (partnerData) setPartners(partnerData as Partner[]);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setFetching(false);
    }
  }

  async function uploadFile(file: File, folder: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('project-images').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(filePath);
    return publicUrl;
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      const result = await addCategoryAction(newCategory.trim());
      if (result.error) throw new Error(result.error);
      setNewCategory("");
      fetchMetadata();
      showAlert("Category added successfully", "success");
    } catch (error: any) {
      showAlert("Error adding category: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function addScope() {
    if (!newScope.trim()) return;
    setLoading(true);
    try {
      const result = await addScopeAction(newScope.trim());
      if (result.error) throw new Error(result.error);
      setNewScope("");
      fetchMetadata();
      showAlert("Project scope added successfully", "success");
    } catch (error: any) {
      showAlert("Error adding scope: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function addClient() {
    if (!newClient.trim()) return;
    setLoading(true);
    try {
      let logoUrl = null;
      if (newClientLogo) {
        logoUrl = await uploadFile(newClientLogo, 'clients');
      }
      const result = await addClientAction(newClient.trim(), logoUrl);
      if (result.error) throw new Error(result.error);
      setNewClient("");
      setNewClientLogo(null);
      setNewClientLogoPreview("");
      fetchMetadata();
      showAlert("Client added successfully", "success");
    } catch (error: any) {
      showAlert("Error adding client: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function addPartner() {
    if (!newPartner.trim()) return;
    setLoading(true);
    try {
      let logoUrl = null;
      if (newPartnerLogo) {
        logoUrl = await uploadFile(newPartnerLogo, 'partners');
      }
      const result = await addPartnerAction(newPartner.trim(), logoUrl);
      if (result.error) throw new Error(result.error);
      setNewPartner("");
      setNewPartnerLogo(null);
      setNewPartnerLogoPreview("");
      showAlert("Partner added successfully", "success");
      fetchMetadata();
    } catch (error: any) {
      showAlert("Error adding partner: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRename(table: string, id: number) {
    if (!editValue.trim() || loading) return;
    setLoading(true);
    try {
      const result = await renameAssetAction(table, id, editValue.trim());
      if (result.error) throw new Error(result.error);
      setEditingId(null);
      setEditValue("");
      fetchMetadata();
      showAlert("Item renamed successfully", "success");
    } catch (error: any) {
      showAlert("Error renaming item: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(table: string, id: number, currentStatus: number) {
    if (loading) return;
    setLoading(true);
    try {
      const newStatus = currentStatus === 1 ? 2 : 1; 
      const result = await updateAssetStatusAction(table, id, newStatus);
      if (result.error) throw new Error(result.error);
      fetchMetadata();
      showAlert(`Item ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`, "success");
    } catch (error: any) {
      showAlert("Error updating status: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleClientLogoUpdate(clientId: number, file: File) {
    if (loading) return;
    setLoading(true);
    try {
      const logoUrl = await uploadFile(file, 'clients');
      const result = await updateAssetLogoAction('clients', clientId, logoUrl);
      if (result.error) throw new Error(result.error);
      
      fetchMetadata();
      showAlert("Client logo updated", "success");
    } catch (error: any) {
      showAlert("Error updating client logo: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePartnerLogoUpdate(partnerId: number, file: File) {
    if (loading) return;
    setLoading(true);
    try {
      const logoUrl = await uploadFile(file, 'partners');
      const result = await updateAssetLogoAction('partners', partnerId, logoUrl);
      if (result.error) throw new Error(result.error);
      
      fetchMetadata();
      showAlert("Partner logo updated", "success");
    } catch (error: any) {
      showAlert("Error updating partner logo: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="p-20 text-center font-bold uppercase tracking-widest text-slate-400">Loading Metadata...</div>;

  const getStats = (items: { status_id: number }[]) => {
    const active = items.filter(i => i.status_id === 1).length;
    const deactivated = items.length - active;
    return { total: items.length, active, deactivated };
  };

  const SectionHeader = ({ icon: Icon, title, items, colorClass }: { icon: LucideIcon, title: string, items: { status_id: number }[], colorClass: string }) => {
    const stats = getStats(items);
    return (
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[1.25rem] ${colorClass.replace('text-', 'bg-')}/10 flex items-center justify-center ${colorClass} border ${colorClass.replace('text-', 'border-')}/10 shadow-sm`}>
              <Icon size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800/50 p-3 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center transition-all hover:border-emerald-500/20">
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Assets</span>
            <span className="text-base font-black text-slate-900 dark:text-slate-100 tabular-nums leading-none">{stats.total}</span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm flex flex-col items-center justify-center transition-all hover:bg-emerald-100 dark:hover:bg-emerald-500/20">
            <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Functional</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">{stats.active}</span>
          </div>
          <div className="bg-rose-50 dark:bg-rose-500/10 p-3 rounded-2xl border border-rose-100 dark:border-rose-500/20 shadow-sm flex flex-col items-center justify-center transition-all hover:bg-rose-100 dark:hover:bg-rose-500/20">
            <span className="text-[8px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-1">Archived</span>
            <span className="text-base font-black text-rose-500 dark:text-rose-400 tabular-nums leading-none">{stats.deactivated}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 pb-20">
      <ScrollReveal>
        <header>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-[2px] bg-emerald-600"></div>
            <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[10px]">Registry Management</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">System <span className="text-emerald-600">Assets.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 max-w-3xl leading-relaxed font-medium italic">Configure core architectural metadata, corporate clients, and strategic partnerships across the platform ecosystem.</p>
        </header>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
        {/* Categories Section */}
        <ScrollReveal delay={0.1}>
          <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col min-h-[600px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <SectionHeader icon={LayoutGrid} title="Categories" items={categories} colorClass="text-emerald-600" />

            <div className="relative flex gap-3 mb-8 z-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                  disabled={loading}
                  placeholder="NEW CATEGORY NAME..."
                  className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 rounded-2xl outline-none transition-all shadow-sm text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                />
              </div>
              <button 
                onClick={addCategory}
                disabled={loading || !newCategory.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 active:scale-95 flex items-center justify-center shrink-0"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar z-10">
              {categories.map(cat => (
                <div key={cat.id} className="group/item p-5 bg-white dark:bg-slate-950/40 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    {editingId?.table === 'category' && editingId?.id === cat.id ? (
                      <div className="flex-1 flex gap-2">
                        <input 
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename('category', cat.id)}
                          disabled={loading}
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-500 rounded-xl outline-none text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                        />
                        <button disabled={loading} onClick={() => handleRename('category', cat.id)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors disabled:opacity-50">{loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}</button>
                        <button disabled={loading} onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-lg transition-colors disabled:opacity-50"><X size={18} /></button>
                      </div>
                    ) : (
                      <>
                        <span className={`text-[12px] font-black uppercase tracking-wide leading-tight flex-1 ${cat.status_id === 1 ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}`}>{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            disabled={loading}
                            onClick={() => { setEditingId({table: 'category', id: cat.id}); setEditValue(cat.category); }}
                            className="opacity-0 group-hover/item:opacity-100 p-2 text-slate-400 hover:text-emerald-600 transition-all bg-slate-50 dark:bg-slate-800 rounded-xl disabled:opacity-0"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            disabled={loading}
                            onClick={() => updateStatus('category', cat.id, cat.status_id)}
                            className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border transition-all disabled:opacity-50 ${cat.status_id === 1 ? 'border-rose-100 text-rose-500 bg-rose-50/50 hover:bg-rose-500/10' : 'border-emerald-100 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-500/10'}`}
                          >
                            {cat.status_id === 1 ? 'DEACTIVATE' : 'ACTIVATE'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Project Scopes Section */}
        <ScrollReveal delay={0.2}>
          <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col min-h-[600px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <SectionHeader icon={Briefcase} title="Project Scopes" items={scopes} colorClass="text-blue-600" />

            <div className="relative flex gap-3 mb-8 z-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input 
                  type="text" 
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addScope()}
                  disabled={loading}
                  placeholder="NEW SCOPE TYPE..."
                  className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 rounded-2xl outline-none transition-all shadow-sm text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                />
              </div>
              <button 
                onClick={addScope}
                disabled={loading || !newScope.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95 flex items-center justify-center shrink-0"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar z-10">
              {scopes.map(s => (
                <div key={s.id} className="group/item p-5 bg-white dark:bg-slate-950/40 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    {editingId?.table === 'project_scope' && editingId?.id === s.id ? (
                      <div className="flex-1 flex gap-2">
                        <input 
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename('project_scope', s.id)}
                          disabled={loading}
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-blue-500 rounded-xl outline-none text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                        />
                        <button disabled={loading} onClick={() => handleRename('project_scope', s.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors disabled:opacity-50">{loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}</button>
                        <button disabled={loading} onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-lg transition-colors disabled:opacity-50"><X size={18} /></button>
                      </div>
                    ) : (
                      <>
                        <span className={`text-[12px] font-black uppercase tracking-wide leading-tight flex-1 ${s.status_id === 1 ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}`}>{s.scope}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            disabled={loading}
                            onClick={() => { setEditingId({table: 'project_scope', id: s.id}); setEditValue(s.scope); }}
                            className="opacity-0 group-hover/item:opacity-100 p-2 text-slate-400 hover:text-blue-600 transition-all bg-slate-50 dark:bg-slate-800 rounded-xl disabled:opacity-0"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            disabled={loading}
                            onClick={() => updateStatus('project_scope', s.id, s.status_id)}
                            className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border transition-all disabled:opacity-50 ${s.status_id === 1 ? 'border-rose-100 text-rose-500 bg-rose-50/50 hover:bg-rose-500/10' : 'border-emerald-100 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-500/10'}`}
                          >
                            {s.status_id === 1 ? 'DEACTIVATE' : 'ACTIVATE'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Clients Section */}
        <ScrollReveal delay={0.3}>
          <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col min-h-[600px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <SectionHeader icon={Users} title="Corporate Clients" items={clients} colorClass="text-amber-600" />

            <div className="space-y-4 mb-8 z-10">
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors" size={16} />
                  <input 
                    type="text" 
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addClient()}
                    disabled={loading}
                    placeholder="ENTER CLIENT NAME..."
                    className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 rounded-2xl outline-none transition-all shadow-sm text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                  />
                </div>
                <button 
                  onClick={addClient}
                  disabled={loading || !newClient.trim()}
                  className="bg-amber-600 hover:bg-amber-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 active:scale-95 flex items-center justify-center shrink-0"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer group/upload">
                  <div className="flex items-center gap-3 px-5 py-3 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl group-hover/upload:border-amber-500 group-hover/upload:bg-amber-50/30 dark:group-hover/upload:bg-amber-500/5 transition-all">
                    {newClientLogoPreview ? (
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-200">
                        <NextImage src={newClientLogoPreview} alt="Client Logo Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/upload:bg-amber-500/10 transition-colors">
                        <ImageIcon size={18} className="text-slate-400 group-hover/upload:text-amber-600" />
                      </div>
                    )}
                    <span className="text-[10px] font-black text-slate-500 group-hover/upload:text-amber-600 uppercase tracking-widest">
                      {newClientLogo ? 'IMAGE STAGED' : 'ATTACH OPTIONAL LOGO'}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={loading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewClientLogo(file);
                        setNewClientLogoPreview(URL.createObjectURL(file));
                      }
                    }} 
                  />
                </label>
                {newClientLogo && (
                  <button disabled={loading} onClick={() => {setNewClientLogo(null); setNewClientLogoPreview("");}} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"><X size={18} /></button>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[380px] pr-2 custom-scrollbar z-10">
              {clients.map(c => (
                <div key={c.id} className="group/item p-5 bg-white dark:bg-slate-950/40 rounded-[2rem] border border-gray-100 dark:border-slate-800 hover:border-amber-500/30 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5 flex-1">
                      <label className={`relative w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 group/logo shadow-sm transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-amber-500'}`}>
                        {c.logo ? (
                          <NextImage src={c.logo} alt={c.name} fill className="object-cover transition-transform duration-500 group-hover/logo:scale-110" />
                        ) : (
                          <ImageIcon size={22} className="text-slate-300 group-hover/logo:text-amber-400 transition-colors" />
                        )}
                        <div className="absolute inset-0 bg-amber-600/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <RefreshCcw size={16} className="text-white animate-spin-slow" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          disabled={loading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleClientLogoUpdate(c.id, file);
                          }} 
                        />
                      </label>

                      {editingId?.table === 'clients' && editingId?.id === c.id ? (
                        <div className="flex-1 flex gap-2">
                          <input 
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename('clients', c.id)}
                            disabled={loading}
                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-amber-500 rounded-xl outline-none text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                          />
                          <button disabled={loading} onClick={() => handleRename('clients', c.id)} className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-colors disabled:opacity-50">{loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}</button>
                          <button disabled={loading} onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-lg transition-colors disabled:opacity-50"><X size={18} /></button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col gap-1">
                          <span className={`text-[12px] font-black uppercase tracking-wide leading-tight ${c.status_id === 1 ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}`}>{c.name}</span>
                          <div className="flex items-center gap-3">
                             <button 
                               disabled={loading}
                               onClick={() => { setEditingId({table: 'clients', id: c.id}); setEditValue(c.name); }}
                               className="opacity-0 group-hover/item:opacity-100 text-[9px] font-black text-slate-400 hover:text-amber-600 uppercase tracking-widest flex items-center gap-1 transition-all disabled:opacity-0"
                             >
                               <Edit2 size={10} /> RENAME
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      disabled={loading}
                      onClick={() => updateStatus('clients', c.id, c.status_id)}
                      className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border transition-all disabled:opacity-50 ${c.status_id === 1 ? 'border-rose-100 text-rose-500 bg-rose-50/50 hover:bg-rose-500/10' : 'border-emerald-100 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-500/10'}`}
                    >
                      {c.status_id === 1 ? 'DEACTIVATE' : 'ACTIVATE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Partners Section */}
        <ScrollReveal delay={0.4}>
          <section className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col min-h-[600px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
            <SectionHeader icon={LayoutGrid} title="Strategic Partners" items={partners} colorClass="text-emerald-600" />

            <div className="space-y-4 mb-8 z-10">
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
                  <input 
                    type="text" 
                    value={newPartner}
                    onChange={(e) => setNewPartner(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPartner()}
                    disabled={loading}
                    placeholder="ENTER PARTNER NAME..."
                    className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 rounded-2xl outline-none transition-all shadow-sm text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                  />
                </div>
                <button 
                  onClick={addPartner}
                  disabled={loading || !newPartner.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 active:scale-95 flex items-center justify-center shrink-0"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer group/upload">
                  <div className="flex items-center gap-3 px-5 py-3 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl group-hover/upload:border-emerald-500 group-hover/upload:bg-emerald-50/30 dark:group-hover/upload:bg-emerald-500/5 transition-all">
                    {newPartnerLogoPreview ? (
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-200">
                        <NextImage src={newPartnerLogoPreview} alt="Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/upload:bg-emerald-500/10 transition-colors">
                        <ImageIcon size={18} className="text-slate-400 group-hover/upload:text-emerald-600" />
                      </div>
                    )}
                    <span className="text-[10px] font-black text-slate-500 group-hover/upload:text-emerald-600 uppercase tracking-widest">
                      {newPartnerLogo ? 'IMAGE STAGED' : 'ATTACH OPTIONAL LOGO'}
                    </span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={loading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewPartnerLogo(file);
                        setNewPartnerLogoPreview(URL.createObjectURL(file));
                      }
                    }} 
                  />
                </label>
                {newPartnerLogo && (
                  <button disabled={loading} onClick={() => {setNewPartnerLogo(null); setNewPartnerLogoPreview("");}} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"><X size={18} /></button>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[380px] pr-2 custom-scrollbar z-10">
              {partners.map(p => (
                <div key={p.id} className="group/item p-5 bg-white dark:bg-slate-950/40 rounded-[2rem] border border-gray-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5 flex-1">
                      <label className={`relative w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 group/logo shadow-sm transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-emerald-500'}`}>
                        {p.logo ? (
                          <NextImage src={p.logo} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover/logo:scale-110" />
                        ) : (
                          <ImageIcon size={22} className="text-slate-300 group-hover/logo:text-emerald-400 transition-colors" />
                        )}
                        <div className="absolute inset-0 bg-emerald-600/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <RefreshCcw size={16} className="text-white animate-spin-slow" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          disabled={loading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePartnerLogoUpdate(p.id, file);
                          }} 
                        />
                      </label>

                      {editingId?.table === 'partners' && editingId?.id === p.id ? (
                        <div className="flex-1 flex gap-2">
                          <input 
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename('partners', p.id)}
                            disabled={loading}
                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-500 rounded-xl outline-none text-[11px] font-black uppercase tracking-wider disabled:opacity-50"
                          />
                          <button disabled={loading} onClick={() => handleRename('partners', p.id)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors disabled:opacity-50">{loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}</button>
                          <button disabled={loading} onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-50 p-2 rounded-lg transition-colors disabled:opacity-50"><X size={18} /></button>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col gap-1">
                          <span className={`text-[12px] font-black uppercase tracking-wide leading-tight ${p.status_id === 1 ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}`}>{p.name}</span>
                          <div className="flex items-center gap-3">
                             <button 
                               disabled={loading}
                               onClick={() => { setEditingId({table: 'partners', id: p.id}); setEditValue(p.name); }}
                               className="opacity-0 group-hover/item:opacity-100 text-[9px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-1 transition-all disabled:opacity-0"
                             >
                               <Edit2 size={10} /> RENAME
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <button 
                      disabled={loading}
                      onClick={() => updateStatus('partners', p.id, p.status_id)}
                      className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border transition-all disabled:opacity-50 ${p.status_id === 1 ? 'border-rose-100 text-rose-500 bg-rose-50/50 hover:bg-rose-500/10' : 'border-emerald-100 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-500/10'}`}
                    >
                      {p.status_id === 1 ? 'DEACTIVATE' : 'ACTIVATE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
