"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Image as ImageIcon,
  CheckCircle2,
  RefreshCcw,
  Upload,
  Loader2,
  Mail,
  Target,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Phone
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertContext";
import { changePassword, updateSiteContentAction } from "./actions";
import { updateDirectorBio } from "../actions";
import { motion } from "framer-motion";
import NextImage from "next/image";

export default function AdminSettings() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [director, setDirector] = useState<{ name: string, bio: string, image: string, email: string } | null>(null);
  const [secDirector, setSecDirector] = useState<{ name: string, bio: string, image: string, email: string } | null>(null);
  const [content, setContent] = useState<{ [key: string]: string }>({
    office_address: "",
    office_phone: "",
    office_email: "",
    office_line: "",
    mobile_connect: "",
    yard_address: "",
    about_vision: "",
    about_mission: "",
    director_title: "",
    director_message: "",
    director_image: "",
    director_email: "",
    director2_title: "",
    director2_image: "",
    director2_email: "",
    family_photo: "",
  });

  useEffect(() => {
    fetchContent();
    fetchDirector();
    fetchSecDirector();
  }, []);

    async function fetchDirector() {
      try {
        const { data, error } = await supabase
          .from('members')
          .select(`fname, lname, bio, email, member_profile(path)`)
          .eq('job_role_id', 2)
          .single();
        if (data) {
          setDirector({
            name: `${data.fname} ${data.lname}`,
            bio: data.bio || "",
            email: data.email || "",
            image: data.member_profile?.[0]?.path || ""
          });
        }
      } catch (error: any) {
        console.error("Error fetching MD:", error);
      }
    }

    async function fetchSecDirector() {
      try {
        const { data, error } = await supabase
          .from('members')
          .select(`fname, lname, bio, email, member_profile(path)`)
          .eq('job_role_id', 3)
          .limit(1)
          .single();
        if (data) {
          setSecDirector({
            name: `${data.fname} ${data.lname}`,
            bio: data.bio || "",
            email: data.email || "",
            image: data.member_profile?.[0]?.path || ""
          });
        }
      } catch (error: any) {
        console.error("Error fetching Director:", error);
      }
    }

  async function handleUpdateDirectorBio(newBio: string, newEmail: string) {
    setLoading(true);
    try {
      const result = await updateDirectorBio(newBio, newEmail);
      if (result.error) throw new Error(result.error);
      setDirector(prev => prev ? {...prev, bio: newBio, email: newEmail} : null);
      showAlert("Managing Director Profile Updated!", "success");
    } catch (error: any) {
      showAlert("Error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchContent() {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) throw error;
      const contentMap: any = { ...content };
      data?.forEach(item => { contentMap[item.key] = item.value; });
      setContent(contentMap);
    } catch (error: any) {
      console.error("Error fetching content:", error.message || error);
    } finally {
      setFetching(false);
    }
  }

  async function handleSave(key: string, value: string) {
    setLoading(true);
    try {
      const result = await updateSiteContentAction(key, value);
      if (result.error) throw new Error(result.error);
    } catch (error: any) {
      showAlert("Error updating content: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `site_content/${key}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
      if (data) {
        setContent(prev => ({ ...prev, [key]: data.publicUrl }));
        await handleSave(key, data.publicUrl);
      }
    } catch (error: any) {
      showAlert("Error uploading image: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-400 font-sans">Initializing Configuration...</div>;

  return (
    <div className="space-y-16 pb-32 font-sans">
      <header>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2.5px] bg-emerald-600"></div>
            <h4 className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[11px]">Configuration Terminal</h4>
        </div>
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Site <span className="text-emerald-600">Content.</span></h1>
        <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium mt-4 max-w-2xl leading-relaxed">Modify global site parameters, corporate philosophies, and corporate contact gateways from a unified interface.</p>
      </header>

      {/* Executive Leadership Vision Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3.5rem] p-10 md:p-16 shadow-sm space-y-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/10 shadow-inner">
              <Target size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Executive Vision</h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Personal directives and visual anchors for board members</p>
            </div>
          </div>

          <button 
            onClick={async () => {
              const keys = ['director_title', 'director_message', 'director_email', 'director2_title', 'director2_message', 'director2_email'];
              let hasError = false;
              for (const k of keys) {
                const res = await updateSiteContentAction(k, content[k]);
                if (res.error) {
                    showAlert("Sync Error for " + k + ": " + res.error, "error");
                    hasError = true;
                    break;
                }
              }
              if (!hasError) showAlert("Executive Vision Synchronized!", "success");
            }}
            disabled={loading}
            className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Commit Directives
          </button>
        </div>

        <div className="grid xl:grid-cols-2 gap-16">
          {/* Owner 1 & 2 */}
          {[1, 2].map((num) => {
            const prefix = num === 1 ? 'director' : 'director2';
            return (
              <div key={num} className="space-y-10 bg-slate-50/50 dark:bg-slate-950/30 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-inner">
                <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <span className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-[14px] font-black border border-slate-200 dark:border-slate-700 shadow-sm">{num}</span>
                    <h3 className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.3em]">{num === 1 ? 'MANAGING DIRECTOR' : 'DIRECTOR'}</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-10">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <label className="relative w-44 h-56 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl cursor-pointer group bg-slate-200 dark:bg-slate-900 flex items-center justify-center transition-all hover:scale-[1.02]">
                      {num === 1 ? (
                        content.managing_director_image ? (
                           <NextImage src={content.managing_director_image} alt="Managing Director" fill sizes="100vw" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                        ) : (
                           <Upload className="text-slate-400" size={32} />
                        )
                      ) : (
                        content.director_image ? (
                           <NextImage src={content.director_image} alt="Director" fill sizes="100vw" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                        ) : (
                           <Upload className="text-slate-400" size={32} />
                        )
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, num === 1 ? 'managing_director_image' : 'director_image')} disabled={loading} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"><RefreshCcw className="text-white" size={32} /></div>
                    </label>
                  </div>
                  <div className="flex-1 space-y-8 w-full">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Leadership Designation</label>
                      <input 
                        type="text" 
                        value={num === 1 ? "MANAGING DIRECTOR" : "DIRECTOR"} 
                        readOnly
                        className="w-full px-6 py-5 border rounded-[1.5rem] outline-none transition-all text-[13px] font-black uppercase tracking-tight bg-slate-100 dark:bg-slate-800 text-slate-500" 
                      />
                    </div>
                    {num === 1 && (
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">NAME</label>
                        <input 
                          type="text" 
                          value={director?.name || ""} 
                          readOnly
                          className="w-full px-6 py-5 border rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 text-slate-500 text-[13px] font-black uppercase tracking-tight" 
                        />
                      </div>
                    )}
                    {num === 2 && (
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">NAME</label>
                        <input 
                          type="text" 
                          value={secDirector?.name || ""} 
                          readOnly
                          className="w-full px-6 py-5 border rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 text-slate-500 text-[13px] font-black uppercase tracking-tight" 
                        />
                      </div>
                    )}
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">CONTACT DIRECTOR EMAIL</label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                        <input 
                          type="email" 
                          value={num === 1 ? (director?.email || "") : (secDirector?.email || "")} 
                          readOnly
                          className="w-full pl-14 pr-6 py-5 bg-slate-100 dark:bg-slate-800 border-none rounded-[1.5rem] text-sm font-bold text-slate-500 dark:text-slate-400" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">MISSION MANDATE (VISION MESSAGE)</label>
                  <textarea 
                    value={num === 1 ? (content.managing_director_message || "") : (content.director_message || "")} 
                    onChange={(e) => {
                       if (num === 1) setContent({...content, managing_director_message: e.target.value});
                       else setContent({...content, director_message: e.target.value});
                    }}
                    className="w-full px-8 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[2rem] outline-none transition-all text-[15px] min-h-[160px] font-medium leading-relaxed text-slate-700 dark:text-slate-300 shadow-inner" 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Corporate Philosophy Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3.5rem] p-10 md:p-16 shadow-sm space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/10 shadow-inner">
              <RefreshCcw size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Corporate Philosophy</h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Core foundational values and long-term strategic mission</p>
            </div>
          </div>
          <button 
            onClick={async () => { 
                await handleSave('about_vision', content.about_vision); 
                await handleSave('about_mission', content.about_mission); 
                showAlert("Philosophy Updated!", "success"); 
            }}
            disabled={loading}
            className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} strokeWidth={3} /> : <Save size={18} strokeWidth={3} />}
            Commit Core Values
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950/30 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <label className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] ml-1 flex items-center gap-3"><Target size={14} /> Corporate Vision</label>
            <textarea value={content.about_vision} onChange={(e) => setContent({...content, about_vision: e.target.value})} className="w-full px-8 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-[15px] min-h-[140px] font-medium leading-relaxed text-slate-700 dark:text-slate-300" />
          </div>
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950/30 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <label className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] ml-1 flex items-center gap-3"><RefreshCcw size={14} /> Strategic Mission</label>
            <textarea value={content.about_mission} onChange={(e) => setContent({...content, about_mission: e.target.value})} className="w-full px-8 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-[15px] min-h-[140px] font-medium leading-relaxed text-slate-700 dark:text-slate-300" />
          </div>
        </div>
      </section>

      {/* Company Contact Information */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3.5rem] p-10 md:p-16 shadow-sm space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/10 shadow-inner">
              <Mail size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Terminal Data</h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Geographic coordinates and corporate contact gateways</p>
            </div>
          </div>
          <button 
            onClick={async () => { 
                const keys = ['office_address', 'yard_address', 'office_phone', 'office_line', 'mobile_connect', 'office_email']; 
                for (const k of keys) await handleSave(k, content[k]); 
                showAlert("Terminal Data Updated!", "success"); 
            }}
            disabled={loading}
            className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Commit Data Assets
          </button>
        </div>
        <div className="grid xl:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-3"><MapPin size={14} className="text-emerald-600" /> Headquarters Terminal</label>
              <textarea value={content.office_address} onChange={(e) => setContent({...content, office_address: e.target.value})} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-[14px] font-bold text-slate-900 dark:text-white min-h-[120px]" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-3"><MapPin size={14} className="text-emerald-600" /> Industrial Yard</label>
              <textarea value={content.yard_address} onChange={(e) => setContent({...content, yard_address: e.target.value})} className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-[14px] font-bold text-slate-900 dark:text-white min-h-[120px]" />
            </div>
          </div>
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Office Line</label>
                <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600" size={18} />
                    <input type="text" value={content.office_line} onChange={(e) => setContent({...content, office_line: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm text-slate-900 dark:text-white font-black" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Uplink</label>
                <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600" size={18} />
                    <input type="text" value={content.mobile_connect} onChange={(e) => setContent({...content, mobile_connect: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm text-slate-900 dark:text-white font-black" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Global Mail Server</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600" size={18} />
                <input type="email" value={content.office_email} onChange={(e) => setContent({...content, office_email: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black text-slate-900 dark:text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Media Assets Section */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3.5rem] p-10 md:p-16 shadow-sm space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/10 shadow-inner">
              <ImageIcon size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Media Assets</h2>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Manage high-impact visual content across the platform</p>
            </div>
          </div>
          <button 
            onClick={async () => { await handleSave('family_photo', content.family_photo); showAlert("Media Assets Synchronized!", "success"); }}
            disabled={loading}
            className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} strokeWidth={3} /> : <Save size={18} strokeWidth={3} />}
            Commit Media Assets
          </button>
        </div>

        <div className="max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-emerald-600"></div>
              <label className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">The Civitech Family (Group Photo)</label>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <label className="relative aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl cursor-pointer group bg-slate-100 dark:bg-slate-950 flex items-center justify-center transition-all hover:scale-[1.02]">
                {content.family_photo ? (
                  <NextImage src={content.family_photo} alt="Civitech Family" fill sizes="100vw" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center mx-auto shadow-lg">
                       <Upload className="text-slate-400" size={32} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Deploy Family Asset</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'family_photo')} disabled={loading} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                   <div className="flex flex-col items-center gap-2">
                      <RefreshCcw className="text-white" size={32} />
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace Asset</span>
                   </div>
                </div>
              </label>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-950/30 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Technical Specifications</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Recommended Aspect Ratio: 16:9 (Landscape)
                    </li>
                    <li className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Minimum Resolution: 1920 x 1080 px
                    </li>
                    <li className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Maximum File Size: 5MB (Optimized JPEG/PNG)
                    </li>
                  </ul>
                </div>
                <div className="relative group">
                  <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={content.family_photo} 
                    onChange={(e) => setContent({...content, family_photo: e.target.value})} 
                    placeholder="EXTERNAL ASSET URL..."
                    className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
