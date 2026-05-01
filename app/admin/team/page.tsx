"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Shield, 
  Edit, 
  Trash2,
  Search,
  X,
  Save,
  Loader2,
  Upload,
  RefreshCcw,
  Linkedin,
  Github,
  ChevronDown
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertContext";
import { onboardMemberAction, updateMemberAction, deleteMemberAction } from "./actions";
import NextImage from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export default function AdminTeam() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    job_role_id: "",
    bio: "",
    image_url: "",
    linkedin_url: "",
    github_url: "",
    status_id: "1"
  });

  useEffect(() => {
    fetchMembers();
    fetchRoles();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*, job_role(title), member_profile(path)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (err: any) {
      console.error("Error fetching members:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRoles() {
    const { data } = await supabase.from('job_role').select('*').order('title');
    if (data) setRoles(data);
  }

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      fname: "", lname: "", email: "", mobile: "", job_role_id: "",
      bio: "", image_url: "", linkedin_url: "", github_url: "", status_id: "1"
    });
    setShowModal(true);
  };

  const openEditModal = (member: any) => {
    setEditingId(member.id);
    setFormData({
      fname: member.fname || "",
      lname: member.lname || "",
      email: member.email || "",
      mobile: member.mobile || "",
      job_role_id: member.job_role_id?.toString() || "",
      bio: member.bio || "",
      image_url: member.member_profile?.[0]?.path || "",
      linkedin_url: member.linkedin_url || "",
      github_url: member.github_url || "",
      status_id: member.status_id?.toString() || "1"
    });
    setShowModal(true);
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitting(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `team/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
      if (data) setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (err: any) {
      showAlert("Upload Failed: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.fname || !formData.job_role_id) { 
        showAlert("Name and Designation are required", "error"); 
        return; 
    }

    // Sri Lanka Mobile Validation
    const slPhoneRegex = /^(?:0|94|\+94)?(?:7(0|1|2|4|5|6|7|8)\d{7}|(?:11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)\d{7})$/;
    const cleanMobile = formData.mobile.replace(/\s/g, "");
    if (formData.mobile && !slPhoneRegex.test(cleanMobile)) {
      showAlert("Invalid Sri Lanka mobile or landline number format.", "error");
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        mobile: formData.mobile,
        job_role_id: Number(formData.job_role_id),
        bio: formData.bio,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        status_id: Number(formData.status_id)
      };

      const result = editingId 
        ? await updateMemberAction(editingId, payload, formData.image_url)
        : await onboardMemberAction(payload, formData.image_url);

      if (!result || result.error) throw new Error(result?.error || "Server failed to respond");
      
      setShowModal(false);
      showAlert(editingId ? "Personnel updated" : "Personnel onboarded", "success");
      fetchMembers();
    } catch (err: any) { 
        showAlert("Error: " + err.message, "error"); 
    } finally { 
        setSubmitting(false); 
    }
  }

  async function deleteMember(id: string) {
    if (!confirm("Permanently purge this personnel record?")) return;
    try {
      const result = await deleteMemberAction(id);
      if (result.error) throw new Error(result.error);
      setMembers(members.filter(m => m.id !== id));
      showAlert("Personnel record purged", "success");
    } catch (err: any) { 
        showAlert("Error: " + err.message, "error"); 
    }
  }

  const filteredMembers = members.filter(m => 
    `${m.fname} ${m.lname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.job_role?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20 font-sans">
      <ScrollReveal>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-[2.5px] bg-emerald-600"></div>
                  <h4 className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[11px]">Human Capital</h4>
              </div>
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Team <span className="text-emerald-600">Master.</span></h1>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium mt-4 max-w-2xl leading-relaxed">Manage engineering specialists and executive leadership profiles for public distribution.</p>
            </div>
            <button 
              onClick={openAddModal}
              className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-emerald-700 transition-all shadow-xl active:scale-[0.98] flex flex-col items-center justify-center gap-1.5 min-w-[140px]"
            >
              <UserPlus size={18} />
              <span>Onboard Member</span>
            </button>
        </header>
      </ScrollReveal>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="FILTER PERSONNEL..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 text-[11px] font-black uppercase tracking-wider transition-all shadow-sm"
              />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">{filteredMembers.length} Units Registered</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
                Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="h-64 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] animate-pulse" />
                ))
            ) : filteredMembers.length === 0 ? (
                <div className="col-span-full py-32 text-center flex flex-col items-center gap-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-3xl flex items-center justify-center text-slate-200"><Users size={40} /></div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">No Records Found</p>
                </div>
            ) : (
                filteredMembers.map((member, idx) => (
                    <motion.div 
                        key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-lg group-hover:scale-105 transition-transform">
                                <NextImage src={member.member_profile?.[0]?.path || 'https://via.placeholder.com/150'} alt="" fill className="object-cover" />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditModal(member)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"><Edit size={16} /></button>
                                <button onClick={() => deleteMember(member.id)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2">{member.fname} {member.lname}</h3>
                                <div className="flex items-center gap-2">
                                    <Shield size={12} className="text-emerald-600" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{member.job_role?.title || "Specialist"}</span>
                                </div>
                            </div>
                            <div className="py-4 border-t border-slate-50 dark:border-slate-800 space-y-3">
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold"><Mail size={14} className="text-slate-300" /><span className="truncate">{member.email}</span></div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold"><Phone size={14} className="text-slate-300" /><span>{member.mobile}</span></div>
                            </div>
                            <div className={`text-right px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border w-max ml-auto ${member.status_id === 1 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                {member.status_id === 1 ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 p-6 flex justify-center items-center w-full h-full z-[1000] backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-full h-full bg-slate-950/40" onClick={() => !submitting && setShowModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-5xl bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar">
                <button onClick={() => setShowModal(false)} className="absolute right-10 top-10 w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all z-20"><X size={24} /></button>
                <div className="relative z-10 space-y-12">
                  <header>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2.5px] bg-emerald-600"></div>
                        <h4 className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[11px]">{editingId ? 'Refine' : 'New'} Enrollment</h4>
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Personnel <span className="text-emerald-600">{editingId ? 'Optimization.' : 'Registration.'}</span></h2>
                  </header>

                  <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4 space-y-8">
                            <div className="flex flex-col items-center gap-6 p-10 bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-inner">
                                <label className="relative w-40 h-40 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl cursor-pointer group bg-slate-200 dark:bg-slate-800 flex items-center justify-center transition-all hover:scale-105">
                                    {formData.image_url ? <img src={formData.image_url} alt="" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" /> : <Upload className="text-slate-400" size={40} />}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"><RefreshCcw className="text-white" size={32} /></div>
                                </label>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Profile Capture</span>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Biography</label>
                                <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-[13px] font-medium leading-relaxed min-h-[180px]" placeholder="Brief professional overview..." />
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-10">
                            <div className="grid sm:grid-cols-2 gap-8">
                                {["fname", "lname"].map(f => (
                                    <div key={f} className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{f === "fname" ? "Legal First Name" : "Legal Last Name"}</label>
                                        <input required type="text" value={formData[f as keyof typeof formData]} onChange={(e) => setFormData({...formData, [f]: e.target.value})} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider" />
                                    </div>
                                ))}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Designation</label>
                                    <div className="relative group/select">
                                        <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" size={18} />
                                        <select 
                                          required value={formData.job_role_id} onChange={(e) => setFormData({...formData, job_role_id: e.target.value})}
                                          className="w-full pl-14 pr-10 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider appearance-none cursor-pointer"
                                        >
                                          <option value="">SELECT ROLE...</option>
                                          {roles.map(role => <option key={role.id} value={role.id}>{role.title}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Corporate Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                        <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-bold" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Terminal</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                                        <input required type="text" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Registry Status</label>
                                    <div className="relative group/select">
                                        <RefreshCcw className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" size={18} />
                                        <select 
                                          required value={formData.status_id} onChange={(e) => setFormData({...formData, status_id: e.target.value})}
                                          className="w-full pl-14 pr-10 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider appearance-none cursor-pointer"
                                        >
                                          <option value="1">ACTIVE</option>
                                          <option value="2">INACTIVE</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-6">
                      <button type="submit" disabled={submitting} className="flex items-center justify-center gap-4 bg-emerald-600 text-white px-14 py-6 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl disabled:opacity-50 active:scale-[0.98]">
                        {submitting ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                        {editingId ? 'Update Personnel' : 'Confirm Enrollment'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
