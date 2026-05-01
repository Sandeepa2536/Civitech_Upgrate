"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Construction,
  Search,
  User,
  Activity,
  LayoutGrid,
  Lock,
  Eye,
  EyeOff,
  RefreshCcw,
  Save,
  Loader2,
  Upload,
  Mail,
  Bell
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { getCurrentUser, updateProfile } from "./actions";
import { changePassword } from "./settings/actions";
import { logout } from "@/app/login/actions";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/components/AlertContext";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Projects", icon: Construction, href: "/admin/projects" },
  { name: "Asset Management", icon: LayoutGrid, href: "/admin/assets" },
  { name: "Gallery", icon: ImageIcon, href: "/admin/gallery" },
  { name: "Site Content", icon: Settings, href: "/admin/settings" },
  { name: "System Audit", icon: Activity, href: "/admin/audit" },
  { name: "Careers", icon: Briefcase, href: "/admin/careers" },
  { name: "Team Members", icon: Users, href: "/admin/team" },
  { name: "Messages", icon: MessageSquare, href: "/admin/messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { showAlert } = useAlert();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const pathname = usePathname();

  const [profileForm, setProfileForm] = useState({
    fname: "",
    lname: "",
    email: "",
    image_url: ""
  });

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const userData = await getCurrentUser();
    if (userData) {
      setUser(userData);
      setProfileForm({
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        image_url: userData.image || ""
      });
    }
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await updateProfile(profileForm);
      if (result.error) throw new Error(result.error);
      showAlert("Profile updated successfully!", "success");
      fetchUser();
      setShowProfileModal(false);
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubmitting(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `admin_profiles/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
      if (data) setProfileForm(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (err: any) {
      showAlert("Error uploading image: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 flex overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden lg:flex ${
          isSidebarOpen ? "w-72" : "w-24"
        } bg-[#0F172A] border-r border-slate-800 transition-all duration-500 flex-col fixed h-full z-50`}
      >
        <div className="p-8 flex items-center justify-between h-24 border-b border-slate-800/50">
          {isSidebarOpen && (
            <Link href="/" className="flex items-center gap-3 group/logo">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 ring-2 ring-emerald-500/20 group-hover/logo:scale-105 transition-transform duration-500">
                <Construction className="text-white" size={22} />
              </div>
              <div className="flex items-center gap-3 h-10">
                <div className="w-[1.5px] h-full bg-slate-700 dark:bg-slate-800 rounded-full"></div>
                <div className="flex flex-col justify-center min-w-[120px]">
                  <div className="flex justify-between w-full">
                    {"CIVITECH".split("").map((char, i) => (
                      <span key={i} className="text-white font-bold tracking-tighter text-xl uppercase leading-[0.7] font-sans">{char}</span>
                    ))}
                  </div>
                  <div className="flex justify-between w-full mt-2">
                    {"CONSTRUCTIONS".split("").map((char, i) => (
                      <span key={i} className="text-emerald-500/80 font-black text-[7px] uppercase leading-none">{char}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white transition-all p-2.5 hover:bg-slate-800 rounded-xl"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={24} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 px-5 py-8 space-y-2.5 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative ${
                  isActive 
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 ring-1 ring-emerald-500/50" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700/50"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-white" : "group-hover:text-emerald-400 transition-colors duration-300"} />
                {isSidebarOpen && (
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] font-sans">{item.name}</span>
                )}
                {isActive && isSidebarOpen && (
                  <div className="absolute right-4 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={async () => {
              await logout();
            }}
            className="w-full flex items-center gap-4 px-5 py-4 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all group border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={22} />
            {isSidebarOpen && (
              <span className="text-[11px] font-black uppercase tracking-[0.2em] font-sans">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ${isSidebarOpen ? "lg:ml-72" : "lg:ml-24"} flex flex-col min-w-0 w-full`}>
        {/* Top Header */}
        <header className="h-20 md:h-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 md:px-10 flex items-center justify-between gap-4 md:gap-6 shadow-sm">
          <div className="flex items-center gap-3 md:gap-6 flex-1">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="lg:hidden p-2.5 text-slate-600 hover:text-emerald-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700"
             >
               <Menu size={22} className="md:w-6 md:h-6" />
             </button>
             <div className="relative w-full max-w-lg hidden md:block group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH CONSOLE..." 
                  className="w-full pl-14 pr-6 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl outline-none text-[10px] font-black uppercase tracking-[0.15em] transition-all placeholder:text-slate-400 font-sans"
                />
             </div>
             {/* Mobile Logo Visibility */}
             <div className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Construction className="text-white" size={16} />
                </div>
                <span className="text-slate-900 dark:text-white font-bold tracking-tighter text-sm uppercase">CIVI<span className="text-emerald-600">TECH</span></span>
             </div>
          </div>

          <div className="flex items-center gap-2 md:gap-8">
            <div className="hidden xs:flex items-center gap-3">
              <button className="relative p-2.5 text-slate-500 hover:text-emerald-600 transition-all bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl shadow-sm hover:shadow-md">
                <Bell size={20} className="md:w-[22px] md:h-[22px]" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-[3px] border-white dark:border-slate-900 shadow-sm animate-bounce"></span>
              </button>
            </div>
            
            <div className="h-10 w-[1.5px] bg-slate-200 dark:bg-slate-800 hidden xs:block"></div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <ThemeSwitcher />
              <div onClick={() => setShowProfileModal(true)} className="flex items-center gap-2 md:gap-4 group cursor-pointer bg-white dark:bg-slate-800/50 pl-1.5 md:pl-2 pr-1.5 md:pr-5 py-1.5 md:py-2 rounded-xl md:rounded-[1.25rem] border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
                <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 border-2 border-white dark:border-slate-900 group-hover:scale-105 transition-transform overflow-hidden flex-shrink-0">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} className="md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] md:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.1em] font-sans leading-none mb-1 md:mb-1.5">{user?.name || "Super Admin"}</p>
                  <p className="text-[8px] md:text-[9px] text-emerald-600 font-black uppercase tracking-[0.2em] font-sans leading-none">{user?.role || "Administrator"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-8 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 p-6 flex justify-center items-center w-full h-full z-[1000] backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-full h-full bg-slate-950/40" onClick={() => !submitting && setShowProfileModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-3xl bg-white dark:bg-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] rounded-[3rem] relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar">
                <button onClick={() => setShowProfileModal(false)} className="absolute right-10 top-10 w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all z-20"><X size={24} /></button>
                <div className="relative z-10 space-y-12">
                  <header>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-emerald-600"></div>
                        <h4 className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[11px]">Personal Account</h4>
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Account <span className="text-emerald-600">Settings.</span></h2>
                  </header>
                  <div className="flex gap-8 border-b border-slate-100 dark:border-slate-800 pb-2">
                    {["General Info", "Security & Password"].map((tab) => (
                      <button key={tab} onClick={() => setIsEditingPass(tab === "Security & Password")} className={`text-[11px] font-black uppercase tracking-[0.2em] pb-4 transition-all relative ${ (tab === "Security & Password" ? isEditingPass : !isEditingPass) ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        {tab}
                        {(tab === "Security & Password" ? isEditingPass : !isEditingPass) && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-emerald-600 rounded-full" />}
                      </button>
                    ))}
                  </div>
                  {isEditingPass ? (
                    <form action={async (fd) => { setSubmitting(true); try { const r = await changePassword(fd); if (r.error) showAlert(r.error, "error"); else { showAlert("Updated!", "success"); setIsEditingPass(false); } } catch { showAlert("Error", "error"); } finally { setSubmitting(false); } }} className="grid gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                          <input name="currentPassword" type={showPass.current ? "text" : "password"} required className="w-full pl-14 pr-14 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-sm font-bold font-sans" placeholder="••••••••" />
                          <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">{showPass.current ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-8">
                        {["newPassword", "confirmPassword"].map((n) => (
                          <div key={n} className="space-y-3">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{n === "newPassword" ? "New Password" : "Confirm New Password"}</label>
                            <div className="relative group">
                              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                              <input name={n} type={showPass[n === "newPassword" ? "new" : "confirm" as keyof typeof showPass] ? "text" : "password"} required className="w-full pl-14 pr-14 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-sm font-bold font-sans" placeholder="••••••••" />
                              <button type="button" onClick={() => setShowPass({...showPass, [n === "newPassword" ? "new" : "confirm"]: !showPass[n === "newPassword" ? "new" : "confirm" as keyof typeof showPass]})} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">{showPass[n === "newPassword" ? "new" : "confirm" as keyof typeof showPass] ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/30 disabled:opacity-50 mt-6 hover:scale-[1.02] active:scale-[0.98]">
                        {submitting ? <Loader2 className="animate-spin" size={18} strokeWidth={3} /> : <RefreshCcw size={18} strokeWidth={3} />}
                        Update Access Credentials
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleProfileUpdate} className="space-y-10">
                      <div className="flex flex-col items-center gap-6">
                        <label className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-2xl cursor-pointer group bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-all hover:scale-105">
                          {profileForm.image_url ? <img src={profileForm.image_url} alt="Profile" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" /> : <Upload className="text-slate-300" size={40} />}
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                             <RefreshCcw className="text-white" size={32} />
                          </div>
                        </label>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Administrator Avatar</span>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        {["fname", "lname"].map((f) => (
                          <div key={f} className="space-y-3">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{f === "fname" ? "First Name" : "Last Name"}</label>
                            <input required type="text" value={profileForm[f as keyof typeof profileForm]} onChange={(e) => setProfileForm({...profileForm, [f]: e.target.value})} className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-sm font-black uppercase tracking-wider font-sans" />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Verified Email Address</label>
                        <div className="relative group">
                           <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                           <input required type="email" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 rounded-[1.5rem] outline-none transition-all text-sm font-bold font-sans" />
                        </div>
                      </div>
                      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/30 disabled:opacity-50 mt-6 hover:scale-[1.02] active:scale-[0.98]">
                        {submitting ? <Loader2 className="animate-spin" size={18} strokeWidth={3} /> : <Save size={18} strokeWidth={3} />}
                        Save Account Changes
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute left-0 top-0 bottom-0 w-80 bg-[#0F172A] border-r border-slate-800 flex flex-col shadow-2xl">
                <div className="p-8 flex items-center justify-between h-24 border-b border-slate-800/50">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <Construction className="text-white" size={22} />
                        </div>
                        <span className="text-white font-bold tracking-tighter text-2xl uppercase font-sans">CIVI<span className="text-emerald-500">TECH</span></span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-2.5 hover:bg-slate-800 rounded-xl transition-all"><X size={26} /></button>
                </div>
                <nav className="flex-1 px-5 py-8 space-y-3 overflow-y-auto custom-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
                        return (
                            <Link key={item.name} href={item.href} className={`flex items-center gap-5 px-6 py-5 rounded-2xl transition-all ${isActive ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                                <item.icon size={24} />
                                <span className="text-[13px] font-black uppercase tracking-[0.2em] font-sans">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6 border-t border-slate-800">
                    <button onClick={async () => { await logout(); }} className="w-full flex items-center gap-5 px-6 py-5 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all group border border-transparent hover:border-rose-500/20">
                        <LogOut size={24} />
                        <span className="text-[13px] font-black uppercase tracking-[0.2em] font-sans">Sign Out</span>
                    </button>
                </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
