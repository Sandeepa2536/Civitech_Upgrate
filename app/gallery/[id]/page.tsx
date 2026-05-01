"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, Suspense, useCallback } from "react";
import Preloader from "@/components/Preloader";
import { supabase } from "@/lib/supabase";

function GalleryDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const backCat = searchParams.get("cat") || "All";
  
  const [event, setEvent] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchEventDetails();
  }, [params.id]);

  async function fetchEventDetails() {
    if (!params.id) return;
    setLoading(true);
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('gallery_events')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (eventError) throw eventError;
      setEvent(eventData);

      const { data: imageData, error: imageError } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('event_id', params.id)
        .order('created_at', { ascending: true });
      
      if (imageError) throw imageError;
      setImages(imageData.map(img => img.image_url));
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  }

  const nextImage = useCallback(() => {
    if (lightboxIndex !== null && lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  }, [lightboxIndex, images]);

  const prevImage = useCallback(() => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage]);

  if (loading) return <Preloader />;
  if (!event) return <div className="p-20 text-center font-bold uppercase tracking-widest text-slate-400">Event not found</div>;

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300 pb-20 overflow-hidden">
      <PageHeader subtitle={`Event: ${event.category}`} title={event.name} backgroundImage={event.cover_image}>
        <div className="flex flex-col md:items-start items-center mt-8">
          <button onClick={() => router.push(`/gallery?cat=${backCat}`)} className="bg-white dark:bg-slate-900 px-6 py-2.5 rounded-full border border-gray-100 dark:border-slate-800 shadow-md flex items-center text-slate-900 dark:text-white hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-4 mr-2.5" /> Gallery
          </button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} onClick={() => setLightboxIndex(i)} className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg cursor-pointer relative group">
              <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-emerald-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="text-white" size={32} />
              </div>
            </motion.div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No images in this gallery</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/98 flex items-center justify-center p-4 backdrop-blur-2xl"
          >
            <button className="absolute top-6 right-6 md:top-10 md:right-10 z-[1010] w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-red-600 transition-all" onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}>
              <X size={24} />
            </button>
            
            <div className="relative flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
                {/* Arrows */}
                <div className="absolute inset-y-0 left-0 hidden md:flex items-center -ml-20 z-[1010]">
                    {lightboxIndex > 0 && (
                        <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all" onClick={prevImage}>
                            <ChevronLeft size={40} />
                        </button>
                    )}
                </div>
                <div className="absolute inset-y-0 right-0 hidden md:flex items-center -mr-20 z-[1010]">
                    {lightboxIndex < images.length - 1 && (
                        <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all" onClick={nextImage}>
                            <ChevronRight size={40} />
                        </button>
                    )}
                </div>

                <motion.img 
                  key={lightboxIndex} 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ duration: 0.3 }} 
                  src={images[lightboxIndex]} 
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10" 
                />

                <div className="flex flex-col items-center gap-4 z-[1010]">
                    <div className="flex items-center gap-6 md:hidden">
                        <button disabled={lightboxIndex === 0} className={`w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all ${lightboxIndex === 0 ? 'opacity-20' : 'opacity-100 hover:bg-white/20'}`} onClick={prevImage}><ChevronLeft size={32} /></button>
                        <button disabled={lightboxIndex === images.length - 1} className={`w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all ${lightboxIndex === images.length - 1 ? 'opacity-20' : 'opacity-100 hover:bg-white/20'}`} onClick={nextImage}><ChevronRight size={32} /></button>
                    </div>
                    <div className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                        {lightboxIndex + 1} / {images.length}
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function GalleryDetail() {
  return (
    <Suspense fallback={<Preloader />}>
      <GalleryDetailContent />
    </Suspense>
  );
}
