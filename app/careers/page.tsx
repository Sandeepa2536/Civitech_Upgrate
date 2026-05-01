"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  MapPin,
  ArrowRight,
  X,
  Upload,
  User,
  Mail,
  Phone,
  Send,
  Linkedin,
  Globe,
  Briefcase,
  Loader2
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { useAlert } from "@/components/AlertContext";
import { submitApplication } from "./actions";
import NextImage from "next/image";

import { careersData } from "@/app/data/siteData";

const benefits = careersData.benefits;

import { supabase } from "@/lib/supabase";

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cvFileName, setCvFileName] = useState<string>("");

  const { showAlert } = useAlert();

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          id,
          job_role_id,
          closing_date,
          job_role:job_role_id (
            title,
            qualifications (experience),
            employment_type:employment_type_id (type),
            location:location_id (location),
            role_category:role_category_id (category),
            job_requirements (requirement)
          )
        `)
        .eq('status_id', 1)
        .gte('closing_date', new Date().toISOString());

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      if (data) {
        const mappedJobs = data.map(v => {
          const role = v.job_role as any;
          
          const qual = Array.isArray(role?.qualifications) ? role.qualifications[0] : role?.qualifications;
          let exp = qual?.experience || "N/A"; // Fallback to "N/A" if empty
          if (exp !== "N/A" && exp && !exp.toLowerCase().includes('year')) {
            exp = `${exp} years`;
          }

          return {
            id: v.id,
            job_role_id: v.job_role_id,
            tag: role?.role_category?.category || "General",
            title: role?.title,
            type: role?.employment_type?.type,
            location: role?.location?.location,
            experience: exp,
            qualifications: role?.job_requirements?.map((r: any) => r.requirement) || []
          };
        });
        setJobs(mappedJobs);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    // Validation
    if (name.length < 3) {
      showAlert("Name must be at least 3 characters long", "error");
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Please enter a valid email address", "error");
      setSubmitting(false);
      return;
    }

    const slPhoneRegex = /^(?:0|94|\+94)?(?:7(0|1|2|4|5|6|7|8)\d{7}|(?:11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)\d{7})$/;
    if (!slPhoneRegex.test(phone.replace(/\s/g, ""))) {
      showAlert("Please enter a valid Sri Lanka mobile or landline number (e.g., 077 123 4567 or 011 234 5678)", "error");
      setSubmitting(false);
      return;
    }

    const linkedin = formData.get("linkedin") as string;
    const portfolio = formData.get("portfolio") as string;
    const cvFile = formData.get("cv") as File;

    if (!linkedin.trim() && !portfolio.trim() && (!cvFile || cvFile.size === 0)) {
      showAlert("Please provide at least one: LinkedIn, Portfolio, or CV", "error");
      setSubmitting(false);
      return;
    }

    if (cvFile && cvFile.size > 0 && cvFile.type !== "application/pdf") {
      showAlert("Only PDF files are allowed for CV attachment", "error");
      setSubmitting(false);
      return;
    }
    
    try {
      const result = await submitApplication(formData, selectedJob.job_role_id);

      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess(true);
      showAlert("Application submitted successfully! Our HR team will review it.", "success");
      
      form.reset();
      setCvFileName("");

      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error applying:', error);
      showAlert(error.message || 'Failed to submit application. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openApplication = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const openRequirements = (job: any) => {
    setSelectedJob(job);
    setIsReqModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen || isReqModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isReqModalOpen]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return Rocket;
      case 'GraduationCap': return GraduationCap;
      case 'ShieldCheck': return ShieldCheck;
      default: return Briefcase;
    }
  };

  return (
    <main className="pb-24 bg-white dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-white">
      <PageHeader
        subtitle="Careers at Civitech"
        title="Join Our"
        highlightedTitle="Team"
        description="Build your legacy with Sri Lanka's premier engineering firm. We are looking for visionaries to help us reshape the national landscape."
        backgroundImage="https://media.istockphoto.com/id/1209265562/photo/construction-workers-discuss-the-building-plans.jpg?s=612x612&w=0&k=20&c=nAtseQhkklua9yPdK16ODerAADKeULUNxfvt2pGQV44="        
      />
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 md:mt-24">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24 md:mb-32">
          {benefits.map((benefit, i) => {
            const Icon = getIcon(benefit.icon);
            return (
              <div key={i} className="p-6 md:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all group text-center md:text-left">
                <Icon className="text-emerald-600 mb-4 md:mb-6 group-hover:scale-110 transition-transform mx-auto md:mx-0" size={28} />
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 md:mb-4 uppercase tracking-tight">{benefit.title}</h3>
                <p className="text-slate-50 dark:text-slate-400 text-xs md:text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 text-center md:text-left">Current Vacancies</h2>      
          <div className="space-y-8 md:space-y-10">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 md:p-12 rounded-3xl md:rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col group hover:border-emerald-500/40 transition-all gap-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-600 px-4 py-1.5 bg-emerald-500/10 rounded-full">{job.tag}</span>
                      <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock size={12} className="text-emerald-600" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-emerald-600 transition-colors text-center md:text-left leading-tight">{job.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pt-1 md:pt-2 justify-center md:justify-start">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-emerald-600" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap size={12} className="text-emerald-600" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
                    <button
                      onClick={() => openRequirements(job)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase text-[9px] md:text-[10px] tracking-widest border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:text-emerald-600 transition-all active:scale-95 group/req"
                    >
                      <Briefcase size={14} className="group-hover/req:scale-110 transition-transform" />
                      <span>Requirements</span>
                    </button>
                    <button
                      onClick={() => openApplication(job)}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 md:gap-4 bg-emerald-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase text-[10px] md:text-xs tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/10 active:scale-95 group/btn"
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!loading && jobs.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                <Briefcase className="text-slate-300" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Active Vacancies Detected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REQUIREMENTS MODAL */}
      <AnimatePresence>
        {isReqModalOpen && selectedJob && (
          <div className="fixed inset-0 p-4 md:p-6 flex justify-center items-center w-full h-full z-[1000]">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 w-full h-full bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsReqModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-2xl rounded-2xl md:rounded-[2.5rem] p-6 md:p-12 relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-emerald-500/5 rounded-full -mr-16 -mt-16"></div>

              <button onClick={() => setIsReqModalOpen(false)} className="absolute right-6 top-6 md:right-8 md:top-8 text-slate-400 hover:text-rose-500 transition-colors z-20">
                <X size={22} />
              </button>

              <div className="relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-600 px-3 py-1 bg-emerald-500/10 rounded-full">{selectedJob.tag}</span>
                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={12} className="text-emerald-600" />
                    <span>{selectedJob.type}</span>
                  </div>
                </div>

                <h3 className="text-xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-4 leading-tight">{selectedJob.title}</h3>

                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[9px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6 md:mb-10 pb-6 md:pb-10 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-600" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-emerald-600" />
                    <span>{selectedJob.experience}</span>
                  </div>
                </div>


                <div className="space-y-6 md:space-y-8">
                  <div>
                    <h4 className="text-[9px] md:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6 flex items-center gap-3">
                      <div className="w-6 md:w-8 h-px bg-emerald-600"></div>
                      Mandatory Qualifications
                    </h4>
                    <ul className="space-y-3 md:space-y-4">
                      {selectedJob.qualifications.map((q: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 md:gap-4 group/item">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                          <span className="text-slate-600 dark:text-slate-400 text-xs md:text-base leading-relaxed">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 text-center md:text-left">
                    <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
                      "At Civitech, we value precision, safety, and a commitment to engineering excellence. If you meet these standards, we invite you to build your future with us."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLICATION MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedJob && (
          <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] overflow-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 w-full h-full bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-6 md:p-8 relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="my-6 md:my-8 text-center">
                <h4 className="text-2xl md:text-3xl text-slate-900 dark:text-white font-bold uppercase tracking-tighter">Apply Now</h4>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-2 md:mt-4 font-bold uppercase tracking-widest">{selectedJob.title}</p>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block text-left">Full Name</label>
                  <div className="relative flex items-center">
                    <input name="name" required type="text" placeholder="John Doe"
                      className="px-4 py-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-white w-full text-sm border border-gray-300 dark:border-slate-800 focus:border-emerald-600 outline-none rounded-lg pr-8 transition-all" />
                    <User className="w-[18px] h-[18px] absolute right-4 text-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block text-left">Email Address</label>
                  <div className="relative flex items-center">
                    <input name="email" required type="email" placeholder="name@company.com"
                      className="px-4 py-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-white w-full text-sm border border-gray-300 dark:border-slate-800 focus:border-emerald-600 outline-none rounded-lg pr-8 transition-all" />
                    <Mail className="w-[18px] h-[18px] absolute right-4 text-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block text-left">Phone Number</label>
                  <div className="relative flex items-center">
                    <input name="phone" required type="text" placeholder="+94 77 XXX XXXX"
                      className="px-4 py-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-white w-full text-sm border border-gray-300 dark:border-slate-800 focus:border-emerald-600 outline-none rounded-lg pr-8 transition-all" />
                    <Phone className="w-[18px] h-[18px] absolute right-4 text-slate-300" />
                  </div>
                </div>

                <div className="pt-4 pb-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-emerald-600"></div>
                    <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[9px]">Professional Background</span>
                  </div>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center md:text-left">     
                    Note: Please provide <span className="text-emerald-600">at least one</span> of the following (LinkedIn, Portfolio, or CV) to complete your application.
                  </p>
                </div>

                <div>
                  <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block text-left">LinkedIn Profile</label>
                  <div className="relative flex items-center">
                    <input name="linkedin" type="text" placeholder="linkedin.com/in/..."
                      className="px-4 py-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-white w-full text-sm border border-gray-300 dark:border-slate-800 focus:border-emerald-600 outline-none rounded-lg pr-8 transition-all" />
                    <Linkedin className="w-[18px] h-[18px] absolute right-4 text-slate-300" />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block text-left">GitHub / Portfolio</label>
                  <div className="relative flex items-center">
                    <input name="portfolio" type="text" placeholder="github.com/..."
                      className="px-4 py-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-white w-full text-sm border border-gray-300 dark:border-slate-800 focus:border-emerald-600 outline-none rounded-lg pr-8 transition-all" />
                    <Globe className="w-[18px] h-[18px] absolute right-4 text-slate-300" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-2 block text-left">CV Attachment</label>
                  <div className="relative border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl p-4 md:p-6 text-center hover:border-emerald-500/50 transition-all cursor-pointer bg-gray-50 dark:bg-slate-950 group">
                    <input 
                      name="cv" 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept=".pdf" 
                      onChange={(e) => setCvFileName(e.target.files?.[0]?.name || "")}
                    />
                    <Upload className="mx-auto text-slate-400 group-hover:text-emerald-600 mb-2" size={20} />
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {cvFileName ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-emerald-600 truncate max-w-[200px]">{cvFileName}</span>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCvFileName("");
                              const input = document.querySelector('input[name="cv"]') as HTMLInputElement;
                              if (input) input.value = "";
                            }}
                            className="p-1 hover:bg-rose-500/10 rounded-full text-rose-500 transition-colors"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                        </span>
                      ) : "Upload CV (PDF)"}
                    </p>
                  </div>
                </div>

                <div className="!mt-8 md:!mt-10">
                  <button type="submit" disabled={submitting}
                    className="px-5 py-4 md:py-3 w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-widest rounded-lg transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50">
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : (success ? "Applied Successfully!" : <><span>Submit Application</span><Send size={16} /></>)}
                  </button>
                </div>
              </form>

              <hr className="my-6 border-gray-200 dark:border-slate-800" />

              <p className="text-[9px] md:text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                By submitting, you agree to our <br/>
                <span className="text-emerald-600 cursor-pointer hover:underline">Privacy Policy and Recruitment Terms</span>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
