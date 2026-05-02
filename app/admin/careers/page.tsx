"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  FileText, 
  Search, 
  Filter, 
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Plus,
  X,
  Save,
  Loader2,
  Type,
  MapPin,
  GraduationCap,
  Linkedin,
  Github,
  Trash2,
  Edit2,
  ChevronDown
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertContext";
import { getApplications, deleteApplication, publishVacancyAction, updateVacancyAction, deleteVacancy, toggleVacancyStatus } from "./actions";

interface RoleCategory {
  id: number;
  category: string;
}

interface Location {
  id: number;
  location: string;
}

interface JobRole {
  id: number;
  title: string;
  status_id?: number;
  role_category_id?: number;
  location_id?: number;
  employment_type_id?: number;
  experience?: string;
}

export default function AdminCareers() {
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<'applications' | 'vacancies'>('applications');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modals
  const [showVacancyModal, setShowVacancyModal] = useState(false);
  const [showAppDetail, setShowAppAppDetail] = useState<any>(null);
  const [editingVacancy, setEditingVacancy] = useState<any>(null);

  // Data
  const [applications, setApplications] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [categories, setCategories] = useState<RoleCategory[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  
  // Filters
  const [appSearch, setAppSearch] = useState("");
  const [appStatus, setAppStatus] = useState("all");

  // New Vacancy Form
  const [isAddingNewRole, setIsAddingNewRole] = useState(false);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [isAddingNewLocation, setIsAddingNewLocation] = useState(false);
  
  const [newVacancy, setNewVacancy] = useState({
    job_role_id: "",
    new_job_title: "",
    category_id: "",
    new_category: "",
    location_id: "",
    new_location: "",
    type: "Full-Time",
    experience: "",
    qualifications: ["", "", "", ""],
    closing_date: ""
  });

  useEffect(() => {
    fetchApplications();
    fetchVacancies();
    fetchMetadata();
    fetchJobRoles();
  }, []);

  async function fetchApplications() {
    const res = await getApplications();
    if (res.data) setApplications(res.data);
    setLoading(false);
  }

  async function fetchVacancies() {
    const { data, error } = await supabase
      .from('vacancies')
      .select(`
        *, 
        job_role(
          id, 
          title, 
          role_category_id, 
          location_id, 
          employment_type_id,
          role_category(id, category), 
          location(id, location),
          job_requirements(requirement),
          qualifications(experience)
        )
      `)
      .order('open_date', { ascending: false });
    if (error) console.error("Error fetching vacancies:", error);
    if (data) setVacancies(data);
  }

  async function fetchMetadata() {
    const { data: cat } = await supabase.from('role_category').select('*').order('category');
    const { data: loc } = await supabase.from('location').select('*').order('location');
    if (cat) setCategories(cat);
    if (loc) setLocations(loc);
  }

  async function fetchJobRoles() {
    const { data } = await supabase.from('job_role').select('*').order('title');
    if (data) setJobRoles(data);
  }

  // Filtered Job Roles based on selected category
  const filteredJobRoles = useMemo(() => {
    if (!newVacancy.category_id) return jobRoles;
    return jobRoles.filter(role => role.role_category_id === Number(newVacancy.category_id));
  }, [newVacancy.category_id, jobRoles]);

  // Logic: When category changes, reset job role
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewVacancy(prev => ({ 
        ...prev, 
        category_id: e.target.value,
        job_role_id: "" // Reset role selection when category changes
    }));
  };

  const handleAddQualification = () => {
    if (newVacancy.qualifications.length < 8) {
      setNewVacancy({
        ...newVacancy,
        qualifications: [...newVacancy.qualifications, ""]
      });
    }
  };

  const handleQualChange = (index: number, val: string) => {
    const updated = [...newVacancy.qualifications];
    updated[index] = val;
    setNewVacancy({ ...newVacancy, qualifications: updated });
  };

  const removeQual = (index: number) => {
    if (newVacancy.qualifications.length > 3) {
      const updated = newVacancy.qualifications.filter((_, i) => i !== index);
      setNewVacancy({ ...newVacancy, qualifications: updated });
    }
  };

  const handleEditVacancy = (vacancy: any) => {
    console.log("Editing vacancy raw data:", vacancy);
    const role = vacancy.job_role || {};
    
    // Requirements might be directly on vacancy or nested in role
    const reqs = role.job_requirements || vacancy.job_requirements || [];
    const qualList = reqs.map((r: any) => r.requirement);
    
    // Ensure at least 4 spots for UX
    while (qualList.length < 4) qualList.push("");

    const categoryId = role.role_category_id || role.role_category?.id || "";
    const locationId = role.location_id || role.location?.id || "";
    
    // Experience might be in qualifications table
    const experience = role.qualifications?.[0]?.experience || vacancy.experience || role.experience || "";

    setEditingVacancy(vacancy);
    setNewVacancy({
        job_role_id: role.id?.toString() || "",
        new_job_title: "",
        category_id: categoryId.toString(),
        new_category: "",
        location_id: locationId.toString(),
        new_location: "",
        type: role.employment_type_id === 1 ? "Full-Time" : role.employment_type_id === 2 ? "Contract" : "Internship",
        experience: experience,
        qualifications: qualList,
        closing_date: vacancy.closing_date ? new Date(vacancy.closing_date).toISOString().split('T')[0] : ""
    });
    
    setIsAddingNewRole(false);
    setIsAddingNewCategory(false);
    setIsAddingNewLocation(false);
    setShowVacancyModal(true);
  };

  async function handleToggleStatus(id: number, currentStatusId: number, closingDate: string) {
    // If trying to activate an expired vacancy, warn the user
    const isExpired = new Date(closingDate) < new Date();
    if (currentStatusId !== 1 && isExpired) {
        showAlert("Cannot activate an expired vacancy. Please update the closing date first.", "error");
        return;
    }

    const res = await toggleVacancyStatus(id, currentStatusId);
    if (res.success) {
      setVacancies(vacancies.map(v => v.id === id ? { ...v, status_id: res.newStatus } : v));
      showAlert(`Vacancy ${res.newStatus === 1 ? 'Activated' : 'Deactivated'}`, "success");
    } else {
      showAlert("Error: " + res.error, "error");
    }
  }

  async function handleDeleteVacancy(id: number) {
    if (!confirm("Permanently delete this vacancy?")) return;
    const res = await deleteVacancy(id);
    if (res.success) {
      setVacancies(vacancies.filter(v => v.id !== id));
      showAlert("Vacancy removed", "success");
    } else {
        showAlert("Error: " + res.error, "error");
    }
  }

  const handleCloseModal = () => {
    setShowVacancyModal(false);
    setEditingVacancy(null);
    setNewVacancy({
      job_role_id: "",
      new_job_title: "",
      category_id: "",
      new_category: "",
      location_id: "",
      new_location: "",
      type: "Full-Time",
      experience: "",
      qualifications: ["", "", "", ""],
      closing_date: ""
    });
    setIsAddingNewRole(false);
    setIsAddingNewCategory(false);
    setIsAddingNewLocation(false);
  };

  useEffect(() => {
    if (showVacancyModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showVacancyModal]);

  async function publishVacancy() {
    const filledQualifications = newVacancy.qualifications.filter(q => q.trim() !== "");
    if (filledQualifications.length < 3) {
      showAlert("Please provide at least 3 mandatory qualifications.", "error");
      return;
    }

    if (!newVacancy.closing_date) {
        showAlert("Please select a closing date.", "error");
        return;
    }

    setSubmitting(true);
    try {
      const payload = {
        job_role_id: isAddingNewRole ? undefined : newVacancy.job_role_id,
        new_job_title: isAddingNewRole ? newVacancy.new_job_title : undefined,
        category_id: isAddingNewCategory ? undefined : newVacancy.category_id,
        new_category: isAddingNewCategory ? newVacancy.new_category : undefined,
        location_id: isAddingNewLocation ? undefined : newVacancy.location_id,
        new_location: isAddingNewLocation ? newVacancy.new_location : undefined,
        employment_type_id: newVacancy.type === "Full-Time" ? 1 : newVacancy.type === "Contract" ? 2 : 3,
        experience: newVacancy.experience,
        qualifications: filledQualifications,
        closing_date: new Date(newVacancy.closing_date).toISOString()
      };

      console.log("Submitting Vacancy Payload:", payload);
      console.log("isAddingNewRole:", isAddingNewRole);
      console.log("editingVacancy ID:", editingVacancy?.id);

      const result = editingVacancy 
        ? await updateVacancyAction(editingVacancy.id, payload)
        : await publishVacancyAction(payload);

      if (result.error) throw new Error(result.error);

      showAlert(editingVacancy ? "Vacancy updated successfully!" : "Vacancy published successfully!", "success");
      handleCloseModal();
      
      fetchJobRoles();
      fetchMetadata();
      fetchVacancies();
    } catch (err: any) {
      console.error("Error publishing/updating vacancy:", err.message);
      showAlert("Error: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteApplication(id: number) {
    if (!confirm("Permanently delete this application?")) return;
    const res = await deleteApplication(id);
    if (res.success) {
      setApplications(applications.filter(a => a.id !== id));
      showAlert("Application removed", "success");
    }
  }

  return (
    <div className="space-y-12 pb-20 font-sans">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-[2.5px] bg-emerald-600"></div>
            <h4 className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[11px]">Human Resources</h4>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Career <span className="text-emerald-600">Engine.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium mt-4 max-w-2xl leading-relaxed">Oversee recruitment pipelines, manage incoming talent applications, and publish strategic engineering vacancies.</p>
        </div>

        <button 
          onClick={() => setShowVacancyModal(true)}
          className="px-8 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/25 flex items-center gap-3 active:scale-[0.98]"
        >
          <Plus size={20} />
          Post New Vacancy
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-max border border-slate-200 dark:border-slate-800">
        <button onClick={() => setActiveTab('applications')} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Applications</button>
        <button onClick={() => setActiveTab('vacancies')} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'vacancies' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Active Vacancies</button>
      </div>

      {activeTab === 'applications' ? (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                    <input 
                        type="text" placeholder="FILTER APPLICATIONS..." 
                        value={appSearch} onChange={(e) => setAppSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-emerald-500 text-[11px] font-black uppercase tracking-wider transition-all shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">{applications.length} Submissions Received</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {applications.filter(a => (a.name || "").toLowerCase().includes(appSearch.toLowerCase())).map((app, idx) => {
                    const nameParts = (app.name || "Anonymous").split(" ");
                    const initials = nameParts.length > 1 
                        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
                        : nameParts[0][0];

                    return (
                        <motion.div 
                            key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xl uppercase">{initials}</div>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowAppAppDetail(app)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-xl transition-all"><FileText size={16} /></button>
                                    <button onClick={() => handleDeleteApplication(app.id)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl transition-all"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2">{app.name}</h3>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><Briefcase size={12} /> {app.job_role?.title}</span>
                                </div>
                            <div className="py-4 border-t border-slate-50 dark:border-slate-800 space-y-3">
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold font-sans"><Mail size={14} className="text-slate-300" /><span className="truncate">{app.email}</span></div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold font-sans"><Phone size={14} className="text-slate-300" /><span>{app.mobile}</span></div>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> {new Date(app.applied_at).toLocaleDateString()}</span>
                                <div className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-500/20">Pending Review</div>
                            </div>
                        </div>
                    </motion.div>
                )})}
            </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {vacancies.map((vacancy, idx) => (
                <motion.div key={vacancy.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 flex items-center justify-between group shadow-sm hover:shadow-xl transition-all">
                    <div className="flex items-center gap-8">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all"><Briefcase size={24} /></div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-2">{vacancy.job_role?.title}</h3>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{vacancy.job_role?.role_category?.category}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={10} /> {vacancy.job_role?.location?.location}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-3">
                        <div className="flex gap-2 mb-1">
                            <button 
                                onClick={() => handleToggleStatus(vacancy.id, vacancy.status_id, vacancy.closing_date)} 
                                title={vacancy.status_id === 1 ? "Deactivate" : "Activate"}
                                className={`p-2.5 rounded-xl transition-all border ${vacancy.status_id === 1 ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'}`}
                            >
                                {vacancy.status_id === 1 ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                            </button>
                            <button onClick={() => handleEditVacancy(vacancy)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 rounded-xl transition-all border border-slate-100 dark:border-slate-700"><Edit2 size={14} /></button>
                        </div>
                        {(() => {
                            const isExpired = new Date(vacancy.closing_date) < new Date();
                            if (isExpired && vacancy.status_id === 1) {
                                return <div className="px-4 py-1.5 bg-rose-500/10 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-500/20">Expired</div>;
                            }
                            return (
                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${vacancy.status_id === 1 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                                    {vacancy.status_id === 1 ? 'Active Hiring' : 'Inactive'}
                                </div>
                            );
                        })()}
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Clock size={12} /> Posted {new Date(vacancy.open_date).toLocaleDateString()}</span>
                    </div>
                </motion.div>
            ))}
        </div>
      )}

      {/* Vacancy Modal */}
      <AnimatePresence>
        {showVacancyModal && (
          <div className="fixed inset-0 p-6 flex justify-center items-center w-full h-full z-[1000] backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-full h-full bg-slate-950/40" onClick={() => !submitting && handleCloseModal()} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="w-full max-w-6xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3.5rem] relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar">
                <button onClick={() => handleCloseModal()} className="absolute right-10 top-10 w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-rose-500 transition-all z-20"><X size={24} /></button>
                <div className="relative z-10 space-y-12">
                  <header>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-[2.5px] bg-emerald-600"></div>
                        <h4 className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[11px]">Internal Recruitment</h4>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{editingVacancy ? 'Edit' : 'Post New'} <span className="text-emerald-600">Vacancy.</span></h2>
                  </header>

                  <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-10">
                        {/* 1. Category First */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Category</label>
                                {!editingVacancy && (
                                    <button onClick={() => { setIsAddingNewCategory(!isAddingNewCategory); setIsAddingNewRole(true); }} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2">
                                        {isAddingNewCategory ? <X size={10} /> : <Plus size={10} />}
                                        {isAddingNewCategory ? 'Cancel' : 'Add New'}
                                    </button>
                                )}
                            </div>
                            {isAddingNewCategory ? (
                                <div className="relative group">
                                    <Type className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                    <input required type="text" placeholder="ENTER NEW CATEGORY NAME..." value={newVacancy.new_category} onChange={(e) => setNewVacancy({...newVacancy, new_category: e.target.value})} className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-900 border-2 border-emerald-500/20 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white" />
                                </div>
                            ) : (
                                <div className="relative group/select">
                                    <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" size={20} />
                                    <select required disabled={!!editingVacancy} value={newVacancy.category_id} onChange={handleCategoryChange} className="w-full pl-16 pr-10 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider appearance-none cursor-pointer text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                                        <option value="">SELECT CATEGORY...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.category}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            )}
                        </div>

                        {/* 2. Job Title based on Category */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Job Title</label>
                                {!isAddingNewCategory && !editingVacancy && (
                                    <button onClick={() => setIsAddingNewRole(!isAddingNewRole)} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2">
                                        {isAddingNewRole ? <X size={10} /> : <Plus size={10} />}
                                        {isAddingNewRole ? 'Cancel' : 'Add New'}
                                    </button>
                                )}
                            </div>
                            {(isAddingNewRole || isAddingNewCategory) ? (
                                <div className="relative group">
                                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                    <input required type="text" placeholder="ENTER NEW JOB ROLE TITLE..." value={newVacancy.new_job_title} onChange={(e) => setNewVacancy({...newVacancy, new_job_title: e.target.value})} className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-900 border-2 border-emerald-500/20 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white" />
                                </div>
                            ) : (
                                <div className="relative group/select">
                                    <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" size={20} />
                                    <select required disabled={!newVacancy.category_id || !!editingVacancy} value={newVacancy.job_role_id} onChange={(e) => setNewVacancy({...newVacancy, job_role_id: e.target.value})} className="w-full pl-16 pr-10 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white">
                                        <option value="">{newVacancy.category_id ? 'SELECT JOB ROLE...' : 'SELECT CATEGORY FIRST...'}</option>
                                        {filteredJobRoles.map(role => <option key={role.id} value={role.id}>{role.title}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Job Type</label>
                                <select value={newVacancy.type} onChange={(e) => setNewVacancy({...newVacancy, type: e.target.value})} className="w-full px-6 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    <option>Full-Time</option>
                                    <option>Contract</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Location</label>
                                <select required value={newVacancy.location_id} onChange={(e) => setNewVacancy({...newVacancy, location_id: e.target.value})} className="w-full px-6 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    <option value="">SELECT LOCATION...</option>
                                    {locations.map(l => <option key={l.id} value={l.id}>{l.location}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* 3. Add Closing Date */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Closing Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input required type="date" value={newVacancy.closing_date} onChange={(e) => setNewVacancy({...newVacancy, closing_date: e.target.value})} className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white" min={new Date().toISOString().split('T')[0]} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Required Experience</label>
                            <div className="relative group">
                                <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input required type="text" placeholder="E.G. 8+ YEARS EXPERIENCE REQUIRED..." value={newVacancy.experience} onChange={(e) => setNewVacancy({...newVacancy, experience: e.target.value})} className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Mandatory Qualifications</label>
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">Bullet Points</span>
                            </div>
                            <div className="space-y-4">
                                {newVacancy.qualifications.map((q, idx) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-7 shrink-0"></div>
                                        <div className="flex-1 relative">
                                            <input 
                                                type="text" placeholder={`QUALIFICATION ${idx + 1}...`} 
                                                value={q} onChange={(e) => handleQualChange(idx, e.target.value)}
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 rounded-2xl outline-none transition-all text-[13px] font-medium text-slate-900 dark:text-white"
                                            />
                                            {newVacancy.qualifications.length > 3 && (
                                                <button onClick={() => removeQual(idx)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><XCircle size={18} /></button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {newVacancy.qualifications.length < 8 && (
                                    <button 
                                        onClick={handleAddQualification}
                                        className="w-full py-4 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Plus size={14} /> Add Another Point
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="pt-10 border-t border-slate-100 dark:border-slate-900">
                             <button 
                                onClick={publishVacancy}
                                disabled={submitting}
                                className="w-full py-7 bg-emerald-600 text-white rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                             >
                                {submitting ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                                Publish Vacancy
                             </button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showAppDetail && (
            <div className="fixed inset-0 p-6 flex justify-center items-center w-full h-full z-[1001] backdrop-blur-xl">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-full h-full bg-slate-950/60" onClick={() => setShowAppAppDetail(null)} />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-3xl bg-white dark:bg-slate-900 shadow-2xl rounded-[3.5rem] relative overflow-hidden flex flex-col">
                    <div className="p-12 space-y-12">
                        <button onClick={() => setShowAppAppDetail(null)} className="absolute right-10 top-10 w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all z-20"><X size={20} /></button>
                        
                        <header className="flex items-center gap-8">
                             <div className="w-24 h-24 rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-3xl font-black shadow-2xl shadow-emerald-500/40 uppercase">
                                {(() => {
                                    const nameParts = (showAppDetail.name || "Anonymous").split(" ");
                                    return nameParts.length > 1 
                                        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
                                        : nameParts[0][0];
                                })()}
                             </div>
                             <div>
                                <h2 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none mb-3">{showAppDetail.name}</h2>
                                <p className="text-emerald-600 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2"><Briefcase size={14} /> {showAppDetail.job_role?.title}</p>
                             </div>
                        </header>

                        <div className="grid sm:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Identity</label>
                                    <div className="space-y-3 pt-2">
                                        <a href={`mailto:${showAppDetail.email}`} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition-colors"><Mail size={16} className="text-slate-300" /> {showAppDetail.email}</a>
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><Phone size={16} className="text-slate-300" /> {showAppDetail.mobile}</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Presence</label>
                                    <div className="flex gap-4 pt-3">
                                        {showAppDetail.linkedin && <a href={showAppDetail.linkedin} target="_blank" rel="noopener" className="w-12 h-12 rounded-2xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:scale-110 transition-all"><Linkedin size={20} /></a>}
                                        {showAppDetail.github && <a href={showAppDetail.github} target="_blank" rel="noopener" className="w-12 h-12 rounded-2xl bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white flex items-center justify-center hover:scale-110 transition-all"><Github size={20} /></a>}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resume Document</label>
                                    <div className="pt-3">
                                        <a href={showAppDetail.cv} target="_blank" rel="noopener" className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-emerald-500 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center text-rose-500 shadow-sm"><FileText size={20} /></div>
                                                <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">RESUME.PDF</span>
                                            </div>
                                            <Download size={18} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Application Phase</label>
                                    <div className="pt-3 flex items-center gap-3 text-amber-600 bg-amber-500/10 px-5 py-3 rounded-2xl w-max border border-amber-500/10">
                                        <Clock size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Initial Screening</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex justify-end gap-4 border-t border-slate-50 dark:border-slate-800">
                             <button onClick={() => setShowAppAppDetail(null)} className="px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-900 transition-all">Close Entry</button>
                             <button className="px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">Mark as Reviewed</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
