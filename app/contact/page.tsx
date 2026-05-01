"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Smartphone, Send, Building2, Warehouse, ChevronDown, Loader2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingContact from "@/components/FloatingContact";
import { contactData } from "@/app/data/siteData";
import { submitInquiry } from "./actions";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [activeRef, setActiveRef] = useState("office");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [terminalData, setTerminalData] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    fetchTerminalData();
  }, []);

  async function fetchTerminalData() {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) throw error;
      const contentMap: any = {};
      data?.forEach(item => { contentMap[item.key] = item.value; });
      
      setTerminalData({
        office: {
          title: "Primary Headquarters",
          address: contentMap.office_address || contactData.office.address,
          tele: contentMap.office_line || contactData.office.tele,
          mobile: contentMap.mobile_connect || contactData.office.mobile,
          email: contentMap.office_email || contactData.office.email,
          mapSrc: contactData.office.mapSrc
        },
        yard: {
          title: "Machinery Yard",
          address: contentMap.yard_address || contactData.yard.address,
          mapSrc: contactData.yard.mapSrc
        }
      });
    } catch (err) {
      console.error("Error fetching terminal data:", err);
      setTerminalData({
        office: contactData.office,
        yard: contactData.yard
      });
    }
  }

  async function fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('category')
        .select('category')
        .eq('status_id', 1)
        .order('category');
      
      if (error) throw error;
      if (data) {
        const uniqueCatNames = Array.from(new Set(data.map(c => c.category)));
        setCategories(uniqueCatNames);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    // Validation
    if (name.length < 3) {
      setError("Name must be at least 3 characters long");
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Sri Lankan Mobile Validation
    // Matches: 07XXXXXXXX, +947XXXXXXXX, 947XXXXXXXX
    const slMobileRegex = /^(?:0|94|\+94)?7(0|1|2|4|5|6|7|8)\d{7}$/;
    if (!slMobileRegex.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid Sri Lankan mobile number (e.g., 077 123 4567)");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await submitInquiry(formData);

      if (result.error) {
        setError(result.error);
        return;
      }
      
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to send inquiry:", err);
      setError("Failed to send inquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const locationData = terminalData ? {
    ...terminalData,
    hours: contactData.hours // Ensure hours are always present
  } : contactData;

  return (
    <main className="pb-24 bg-white dark:bg-slate-950 transition-colors duration-300 font-sans">
      <PageHeader
        subtitle="Global Connect"
        title="Contact"
        highlightedTitle="Hub."
        description="Whether you're planning a multi-million rupee industrial complex or a strategic institutional landmark, we're ready to engineer your vision."
        backgroundImage="https://www.buildforce.ca/wp-content/uploads/2024/03/Contact-Banner-1536x864.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 md:mt-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12 md:mb-24">
          <div className="lg:col-span-7 order-1">
            <ScrollReveal>
              <div className="h-full p-6 md:p-12 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl md:rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/5 dark:bg-emerald-500/[0.02] blur-[80px] md:blur-[120px] rounded-full -mr-32 -mt-32 md:-mr-48 md:-mt-48"></div>
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-8 md:w-10 h-[2px] bg-emerald-600"></div>
                    <span className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px]">Project Inquiry</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter mb-4 md:mb-6 text-center md:text-left">Get In <span className="text-emerald-600">Touch</span></h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg leading-relaxed mb-6 md:mb-10 max-w-xl text-center md:text-left">Have a specific engineering requirement? Our experienced technical team is ready to engage with you.</p>

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Full Name</label>
                        <input name="name" type="text" placeholder="John Doe" required className="w-full px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-sm md:text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-emerald-500 outline-none transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Phone Number</label>
                        <input name="phone" type="text" placeholder="+94 77 XXX XXXX" required className="w-full px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-sm md:text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-emerald-500 outline-none transition-all shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Email Address</label>
                      <input name="email" type="email" placeholder="name@company.com" required className="w-full px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-sm md:text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-emerald-500 outline-none transition-all shadow-sm" />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 ml-1">Subject</label>
                      <div className="relative group/select">
                        <select name="subject" defaultValue="" required className="w-full px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-sm md:text-base text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-all shadow-sm appearance-none cursor-pointer">
                          <option value="" disabled className="text-slate-500 dark:text-slate-400">Select Project Type</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat} className="text-slate-900 dark:text-white bg-white dark:bg-slate-900">{cat}</option>
                          ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-emerald-500 transition-colors"><ChevronDown size={18} /></div>
                      </div>
                    </div>
                    <div className="space-y-1.5 md:space-y-2 flex-1">
                      <textarea name="message" rows={5} placeholder="Describe your technical requirements..." required className="w-full px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-sm md:text-base text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-emerald-500 outline-none transition-all resize-none shadow-sm min-h-[120px] md:min-h-[150px]"></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-3 md:gap-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase text-[9px] md:text-xs tracking-[0.2em] py-4 md:py-6 rounded-xl md:rounded-2xl transition-all shadow-xl shadow-emerald-500/20 group active:scale-[0.98]">
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><span>Dispatch Inquiry</span><Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                    </button>
                    {success && <p className="text-emerald-600 font-bold text-[10px] md:text-xs uppercase text-center mt-4 italic">Inquiry dispatched successfully! Our team will contact you soon.</p>}
                    {error && <p className="text-rose-500 font-bold text-[10px] md:text-xs uppercase text-center mt-4 italic">{error}</p>}
                  </form>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 space-y-6 order-2">
            <ScrollReveal delay={0.1}>
              <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl md:rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full -mr-24 -mt-24"></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter mb-6 relative z-10">Corporate Directory</h3>
                <div className="space-y-6 md:space-y-8 relative z-10">
                  <div className="group/loc">
                    <div className="flex items-start gap-3 md:gap-4 mb-2">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 shadow-sm"><Building2 size={18} /></div>
                      <div>
                        <span className="text-[8px] md:text-[9px] font-bold text-emerald-600 uppercase tracking-[0.3em] block">Headquarters</span>
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs md:text-sm tracking-tight">{locationData.office.title}</h4>
                      </div>
                    </div>
                    <p className="text-[11px] md:text-[13px] font-bold text-slate-600 dark:text-slate-400 uppercase leading-relaxed tracking-wide whitespace-pre-line pl-12 md:pl-14">{locationData.office.address}</p>
                  </div>
                  <div className="group/loc">
                    <div className="flex items-start gap-3 md:gap-4 mb-2">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 shadow-sm"><Warehouse size={18} /></div>
                      <div>
                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] block">Logistics Hub</span>
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs md:text-sm tracking-tight">{locationData.yard.title}</h4>
                      </div>
                    </div>
                    <p className="text-[11px] md:text-[13px] font-bold text-slate-600 dark:text-slate-400 uppercase leading-relaxed tracking-wide whitespace-pre-line pl-12 md:pl-14">{locationData.yard.address}</p>
                  </div>
                  <div className="h-px bg-gray-100 dark:bg-slate-800 w-full"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-6 md:gap-y-8">
                    <div className="group/loc">
                      <div className="flex items-start gap-3 md:gap-4 mb-2">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 shadow-sm"><Phone size={18} /></div>
                        <div>
                          <span className="text-[8px] md:text-[9px] font-bold text-emerald-600 uppercase tracking-[0.3em] block">Voice Connect</span>
                          <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs md:text-sm tracking-tight">Office Line</h4>
                        </div>
                      </div>
                      <div className="pl-12 md:pl-14 space-y-1">
                        <p className="text-slate-900 dark:text-white text-xs md:text-[14px] font-bold tracking-tight">{locationData.office.tele}</p>
                      </div>
                    </div>
                    <div className="group/loc">
                      <div className="flex items-start gap-3 md:gap-4 mb-2">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 shadow-sm"><Smartphone size={18} /></div>
                        <div>
                          <span className="text-[8px] md:text-[9px] font-bold text-emerald-600 uppercase tracking-[0.3em] block">Instant Support</span>
                          <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs md:text-sm tracking-tight">Mobile Connect</h4>
                        </div>
                      </div>
                      <div className="pl-12 md:pl-14 space-y-1">
                        <p className="text-slate-900 dark:text-white text-xs md:text-[14px] font-bold tracking-tight">{locationData.office.mobile}</p>
                      </div>
                    </div>
                  </div>
                  <div className="group/loc">
                    <div className="flex items-start gap-3 md:gap-4 mb-2">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 shadow-sm"><Mail size={18} /></div>
                      <div>
                        <span className="text-[8px] md:text-[9px] font-bold text-emerald-600 uppercase tracking-[0.3em] block">Digital Inquiry</span>
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs md:text-sm tracking-tight">Email Address</h4>
                      </div>
                    </div>
                    <p className="text-slate-900 dark:text-white text-xs md:text-[14px] font-bold lowercase tracking-tight pl-12 md:pl-14 truncate">{locationData.office.email}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="p-8 md:p-10 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl md:rounded-[3rem] shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter mb-8 md:mb-10 relative z-10">Business Operations</h3>
                <div className="space-y-4 relative z-10">
                  {locationData.hours.map((row: { day: string; hours: string; isClosed?: boolean }, i: number) => (
                    <div key={i} className={`flex justify-between items-center ${i < locationData.hours.length - 1 ? 'border-b border-gray-50 dark:border-slate-800/50 pb-4' : ''}`}>
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-slate-300">{row.day}</span>
                      <span className={`text-xs md:text-sm font-bold uppercase tracking-tight ${row.isClosed ? 'text-rose-500' : 'text-emerald-600'}`}>{row.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal>
          <div className="relative rounded-3xl md:rounded-[3.5rem] overflow-hidden border border-gray-100 dark:border-slate-800 shadow-2xl group h-[400px] md:h-[500px] lg:h-[600px]">
            <iframe
              src={activeRef === "office" ? locationData.office.mapSrc : locationData.yard.mapSrc}
              className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-1000"
              frameBorder="0"
              allowFullScreen
              title="Location Map"
            ></iframe>
            <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 flex flex-wrap gap-2 md:gap-4 pointer-events-none">
              <div
                className={`px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border backdrop-blur-md shadow-xl flex items-center gap-2 md:gap-3 pointer-events-auto cursor-pointer transition-all duration-500 ${activeRef === 'office' ? 'bg-emerald-600 border-emerald-500 text-white scale-105 shadow-emerald-500/20' : 'bg-white/95 dark:bg-slate-900/95 border-white/20 text-slate-900 dark:text-white'}`}
                onClick={() => setActiveRef("office")}
              >
                <Building2 className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeRef === 'office' ? 'text-white' : 'text-emerald-600'}`} />
                <div>
                  <p className={`text-[7px] md:text-[9px] font-bold uppercase tracking-widest ${activeRef === 'office' ? 'text-emerald-100' : 'text-emerald-600'}`}>Headquarters</p>
                  <p className="text-[9px] md:text-xs font-bold uppercase tracking-tight">Main Office</p>
                </div>
              </div>
              <div 
                className={`px-3 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border backdrop-blur-md shadow-xl flex items-center gap-2 md:gap-3 pointer-events-auto cursor-pointer transition-all duration-500 ${activeRef === 'yard' ? 'bg-emerald-600 border-emerald-500 text-white scale-105 shadow-emerald-500/20' : 'bg-white/95 dark:bg-slate-900/95 border-white/20 text-slate-900 dark:text-white'}`}
                onClick={() => setActiveRef("yard")}
              >
                <Warehouse className={`w-3.5 h-3.5 md:w-4 md:h-4 ${activeRef === 'yard' ? 'text-white' : 'text-emerald-600'}`} />
                <div>
                  <p className={`text-[7px] md:text-[9px] font-bold uppercase tracking-widest ${activeRef === 'yard' ? 'text-emerald-100' : 'text-emerald-600'}`}>Logistics Hub</p>
                  <p className="text-[9px] md:text-xs font-bold uppercase tracking-tight">Machinery Yard</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
      <FloatingContact />
    </main>
  );
}
