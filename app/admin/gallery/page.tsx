"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  X, 
  Upload, 
  Loader2, 
  Calendar, 
  MapPin, 
  Tag,
  Save,
  ChevronRight,
  ChevronLeft,
  Search,
  RefreshCcw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/components/AlertContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  createGalleryEventAction, 
  addGalleryImagesAction, 
  deleteGalleryEventAction, 
  deleteGalleryImageAction 
} from "./actions";

const categories = [
  "Celebrations", "Team Get-Togethers", "CSR Projects", "Annual Milestones", "Site Events"
];

export default function AdminGalleryManagement() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    category: categories[0],
    cover_image: ""
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [eventImages, setEventImages] = useState<any[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('gallery_events')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      showAlert("Error fetching events: " + error.message, "error");
    } finally {
      setFetching(false);
    }
  }

  async function fetchEventImages(eventId: number) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setEventImages(data || []);
    } catch (error: any) {
      showAlert("Error fetching event images: " + error.message, "error");
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

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.location || !formData.date || (!coverFile && !formData.cover_image)) {
      showAlert("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      let coverImageUrl = formData.cover_image;
      if (coverFile) {
        coverImageUrl = await uploadFile(coverFile, 'gallery');
      }

      const result = await createGalleryEventAction({
        ...formData,
        cover_image: coverImageUrl
      });

      if (result.error) throw new Error(result.error);
      
      showAlert("Event created successfully", "success");
      setIsAddingEvent(false);
      resetForm();
      // Update local state instead of full fetch
      setEvents(prev => [result.data, ...prev]);
    } catch (error: any) {
      showAlert("Error creating event: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(id: number) {
    if (!confirm("Are you sure you want to delete this event and all its images? This will permanently purge the media collection.")) return;
    setLoading(true);
    try {
      const result = await deleteGalleryEventAction(id);
      if (result.error) throw new Error(result.error);
      
      showAlert("Event purged successfully", "success");
      if (selectedEvent?.id === id) setSelectedEvent(null);
      // Update local state instead of full fetch
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (error: any) {
      showAlert("System Error: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedEvent) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const imageUrl = await uploadFile(file, `gallery/${selectedEvent.id}`);
        return {
          event_id: selectedEvent.id,
          image_url: imageUrl
        };
      });

      const newImagesData = await Promise.all(uploadPromises);
      const result = await addGalleryImagesAction(newImagesData);
      
      if (result.error) throw new Error(result.error);

      showAlert(`Successfully uploaded ${files.length} images`, "success");
      // Update local state instead of re-fetching from DB
      setEventImages(prev => [...(prev || []), ...(result.data || [])]);
    } catch (error: any) {
      showAlert("Error uploading images: " + error.message, "error");
    } finally {
      setUploadingImages(false);
    }
  }

  async function handleDeleteImage(id: number) {
    try {
      const result = await deleteGalleryImageAction(id);
      if (result.error) throw new Error(result.error);
      
      setEventImages(prev => prev.filter(img => img.id !== id));
      showAlert("Visual asset removed", "success");
    } catch (error: any) {
      showAlert("Error deleting image: " + error.message, "error");
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      location: "",
      date: "",
      category: categories[0],
      cover_image: ""
    });
    setCoverFile(null);
    setCoverPreview("");
  }

  if (fetching) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-400 font-sans">Loading Media Engine...</div>;

  return (
    <div className="space-y-8 md:space-y-12 pb-10 md:pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
              <div className="w-8 md:w-10 h-[2px] md:h-[2.5px] bg-emerald-600"></div>
              <h4 className="text-emerald-600 font-black uppercase tracking-[0.3em] text-[9px] md:text-[11px]">Media Management</h4>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Gallery <span className="text-emerald-600">Events.</span></h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-[13px] font-medium max-w-2xl leading-relaxed">Archive and showcase company milestones, site celebrations, and community impact projects through visual storytelling.</p>
        </div>
        <button 
          onClick={() => { setIsAddingEvent(true); setSelectedEvent(null); }}
          className="flex items-center justify-center gap-3 px-6 md:px-8 py-3.5 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-[11px] transition-all shadow-xl shadow-emerald-600/25 shrink-0 active:scale-[0.98]"
        >
          <Plus size={18} />
          Create New Event
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-6 md:gap-10 items-start">
        {/* Events List - Responsive Toggle */}
        <div className={`lg:col-span-4 space-y-6 ${selectedEvent || isAddingEvent ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-[10px] md:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center gap-3">
                    <Calendar size={18} className="text-emerald-600" />
                    Archive Directory
                </h2>
                <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100 dark:border-slate-700">{events.length}</span>
            </div>
            <div className="space-y-3 md:space-y-4 max-h-[50vh] lg:max-h-[650px] overflow-y-auto pr-1 custom-scrollbar">
              {events.map(event => (
                <div 
                  key={event.id}
                  onClick={() => { setSelectedEvent(event); setIsAddingEvent(false); fetchEventImages(event.id); }}
                  className={`group flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-xl md:rounded-[1.5rem] border transition-all cursor-pointer ${
                    selectedEvent?.id === event.id 
                      ? 'bg-emerald-600 border-emerald-600 shadow-xl shadow-emerald-600/20' 
                      : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${selectedEvent?.id === event.id ? 'border-white/40 scale-105' : 'border-white dark:border-slate-800 shadow-sm'}`}>
                    <img src={event.cover_image} alt={event.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-[11px] md:text-[12px] font-black uppercase truncate tracking-tight ${selectedEvent?.id === event.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <MapPin size={10} className={selectedEvent?.id === event.id ? 'text-emerald-200' : 'text-emerald-600'} />
                        <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest truncate ${selectedEvent?.id === event.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {event.location}
                        </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                    className={`p-2 rounded-lg transition-all ${selectedEvent?.id === event.id ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-500/10'}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {events.length === 0 && (
                <div className="py-16 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-slate-200 border border-slate-100 dark:border-slate-800">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Repository Empty</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Area - Responsive Toggle */}
        <div className={`lg:col-span-8 ${selectedEvent || isAddingEvent ? 'block' : 'hidden lg:block'}`}>
          <AnimatePresence mode="wait">
            {isAddingEvent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-[3rem] p-6 md:p-14 shadow-sm"
              >
                <div className="flex items-center justify-between mb-8 md:mb-12">
                  <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/10">
                        <Plus size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Register Event</h2>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection parameters</p>
                      </div>
                  </div>
                  <button onClick={() => setIsAddingEvent(false)} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all"><X size={20} /></button>
                </div>

                <form onSubmit={handleAddEvent} className="space-y-8 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Identification</label>
                      <input 
                        type="text" required value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Annual Summit 2024"
                        className="w-full px-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-[1.5rem] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold uppercase tracking-wider font-sans"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Geographic Location</label>
                      <div className="relative group">
                        <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input 
                          type="text" required value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="e.g. Colombo, Sri Lanka"
                          className="w-full pl-14 pr-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-[1.5rem] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold uppercase tracking-wider font-sans"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Temporal Data</label>
                      <div className="relative group">
                        <Calendar size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                        <input 
                          type="date" required value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="w-full pl-14 pr-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-[1.5rem] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold uppercase tracking-wider font-sans"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Classification</label>
                      <div className="relative group/select">
                        <Tag size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full pl-14 pr-10 py-4 md:py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-[1.5rem] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold uppercase tracking-wider font-sans appearance-none"
                        >
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Anchor (Cover Image)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <label className="cursor-pointer group">
                        <div className="h-40 md:h-48 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center gap-3 md:gap-4 hover:border-emerald-500 transition-all bg-slate-50/50 dark:bg-slate-950/30 overflow-hidden shadow-inner">
                          {coverPreview ? (
                            <img src={coverPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <>
                              <div className="p-3 md:p-4 bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl shadow-sm text-slate-300 group-hover:text-emerald-600 group-hover:scale-110 transition-all border border-slate-100 dark:border-slate-700">
                                <Upload size={20} className="md:w-6 md:h-6" />
                              </div>
                              <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-emerald-600 transition-colors">Select Visual</span>
                            </>
                          )}
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)); } }} />
                      </label>
                      <div className="flex flex-col justify-center gap-4 md:gap-6">
                        <div className="relative group">
                          <ImageIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                          <input 
                            type="text" value={formData.cover_image}
                            onChange={(e) => { setFormData({...formData, cover_image: e.target.value}); if (e.target.value) setCoverPreview(e.target.value); }}
                            placeholder="Direct URL Link..."
                            className="w-full pl-14 pr-6 py-4 md:py-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-[1.5rem] outline-none focus:border-emerald-500 transition-all text-sm font-bold font-sans"
                          />
                        </div>
                        <div className="p-5 md:p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl md:rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30">
                            <p className="text-[8px] md:text-[10px] text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-widest leading-relaxed">
                                Standard Aspect Ratio: 3:2 or 16:9 recommended for optimal distribution across terminal interfaces.
                            </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit" disabled={loading}
                      className="w-full sm:w-auto flex items-center justify-center gap-4 px-10 md:px-12 py-4 md:py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[11px] md:text-[12px] transition-all shadow-[0_20px_40px_-10px_rgba(5,150,105,0.3)] disabled:opacity-50 active:scale-[0.98]"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Commit Entry
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : selectedEvent ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 md:space-y-10">
                {/* Event Summary Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-sm">
                  <div className="relative h-56 md:h-80 group">
                    <img src={selectedEvent.cover_image} alt={selectedEvent.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-14 w-full">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <span className="px-4 py-1.5 bg-emerald-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-full shadow-lg">
                          {selectedEvent.category}
                        </span>
                        <span className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] flex items-center gap-2">
                            <Calendar size={12} className="text-emerald-500" />
                            {selectedEvent.date}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-5xl font-bold text-white uppercase tracking-tighter leading-none mb-3 md:mb-4">{selectedEvent.name}</h2>
                      <div className="flex items-center gap-2.5 text-white/80 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em]">
                        <MapPin size={14} className="text-emerald-500 md:w-4 md:h-4" />
                        {selectedEvent.location}
                      </div>
                    </div>
                    {/* Back Button for mobile focused view */}
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-xl transition-all border border-white/10 flex items-center justify-center lg:hidden"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  </div>

                  <div className="p-6 md:p-14">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12">
                      <div>
                        <h3 className="text-[11px] md:text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-3 md:gap-4">
                            <ImageIcon size={20} className="text-emerald-600" />
                            IMAGE REPOSITORY
                        </h3>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 md:mt-2">{eventImages.length} Artifacts encrypted</p>
                      </div>
                      <label className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-slate-900 dark:bg-emerald-600 hover:bg-black dark:hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] transition-all cursor-pointer shadow-lg active:scale-[0.98]">
                        <Upload size={18} />
                        Inject Images
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleUploadImages} />
                      </label>
                    </div>

                    {uploadingImages && (
                      <div className="mb-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-4">
                        <Loader2 className="animate-spin text-emerald-600" size={18} />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">SYNCHRONIZING ASSETS...</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                      {eventImages.map(img => (
                        <div key={img.id} className="group relative aspect-square rounded-xl md:rounded-[1.5rem] overflow-hidden border-2 border-slate-50 dark:border-slate-800 shadow-sm transition-all hover:scale-105 hover:z-10 hover:shadow-xl">
                          <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                            <button 
                              onClick={() => handleDeleteImage(img.id)}
                              className="w-10 h-10 md:w-12 md:h-12 bg-white text-rose-500 rounded-xl md:rounded-2xl shadow-xl hover:scale-110 transition-all flex items-center justify-center active:scale-90"
                            >
                              <Trash2 size={18} className="md:w-5 md:h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {eventImages.length === 0 && !uploadingImages && (
                        <div className="col-span-full py-16 md:py-24 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-[3rem] flex flex-col items-center justify-center text-slate-300 gap-4 md:gap-6 bg-slate-50/30">
                          <ImageIcon size={40} className="md:w-12 md:h-12" strokeWidth={1} />
                          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">NO ASSETS DETECTED</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] md:min-h-[500px] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-2xl md:rounded-[3.5rem] flex flex-col items-center justify-center text-slate-400 gap-6 md:gap-8 p-8 md:p-12 text-center shadow-inner">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center shadow-xl md:shadow-2xl">
                  <ImageIcon size={32} className="md:w-12 md:h-12 text-emerald-600" strokeWidth={1.5} />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Command & Control</h3>
                  <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mt-2 max-w-sm leading-relaxed text-slate-500">Select an archive or initialize a new record to manage terminal content.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
