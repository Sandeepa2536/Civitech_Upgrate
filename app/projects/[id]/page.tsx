"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import { 
  ArrowLeft,
  MapPin,
  Tag,
  Calendar,
  Sparkles,
  Briefcase,
  Info,
  History as HistoryIcon,
  CheckCircle,
  Image as ImageIcon,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { getYouTubeId } from "@/lib/utils";

interface ProjectDetail {
  id: string;
  name: string;
  location: string;
  category: string;
  status: string;
  image: string;
}

function ProjectDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProjectDetails();
    }
  }, [params.id]);

  async function fetchProjectDetails() {
    try {
      setLoading(true);
      
      // 1. Fetch from optimized view for core data
      const { data: summary, error: summaryError } = await supabase
        .from('project_summary')
        .select('*')
        .eq('id', params.id)
        .single();

      if (summaryError) throw summaryError;

      if (summary) {
        setProject({
          id: summary.id.toString(),
          name: summary.title,
          location: summary.location_name,
          category: summary.category || "Uncategorized",
          status: summary.status || "Unknown",
          image: summary.cover_image || "/projects/image1.png"
        });

        // 2. Fetch related media separately (optimized)
        const [imgRes, vidRes] = await Promise.all([
          supabase.from('projects_image').select('path').eq('projects_id', params.id),
          supabase.from('projects_video').select('url').eq('projects_id', params.id)
        ]);

        if (imgRes.data) {
          setGalleryImages(imgRes.data.map(img => img.path));
        }

        if (vidRes.data?.[0]) {
          setVideoUrl(getYouTubeId(vidRes.data[0].url) || "");
        }
      }
    } catch (error: any) {
      console.error('Error fetching project details:', error.message);
    } finally {
      setLoading(false);
    }
  }

  // Get back category and status from URL
  const backCat = searchParams.get("backCat");
  const backStatus = searchParams.get("backStatus");

  // Lightbox state
  const [lightboxIndex, setLightboxImageIndex] = useState<number | null>(null);

  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < galleryImages.length - 1) {
      setLightboxImageIndex(lightboxIndex + 1);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxImageIndex(lightboxIndex - 1);
    }
  };

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-slate-800">
             <Briefcase size={32} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Project Archive Unreachable</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-widest mb-8">The requested project identification does not exist in our registry.</p>
          <Link href="/projects" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20">
            <ArrowLeft size={16} />
            Back to Landmarks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300 pb-20 overflow-hidden">

      {/* Stylized Header with Project Name */}
      <PageHeader
        subtitle={`Specialized ${project.category} Project`}
        title={project.name}
        backgroundImage={project.image}
      >
        <div className="flex flex-col md:items-start items-center mt-8">
          <ul className="bg-white dark:bg-slate-900 p-2 w-max flex items-center rounded-full border border-gray-100 dark:border-slate-800 shadow-md">
            <li 
              onClick={() => router.push(`/projects?cat=${backCat || 'All'}&status=${backStatus || 'All Status'}`)}
              className="text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800 px-6 py-2.5 rounded-full text-[10px] md:text-xs font-semibold cursor-pointer flex items-center transition-all"
            >
              <ArrowLeft className="w-4 mr-2.5" />
              Return to Gallery
            </li>
          </ul>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
        <section className="mb-12 md:mb-16">
          <div className="flex flex-col gap-8 md:gap-20 mb-16 md:mb-32">
            <ScrollReveal>
              <div className="flex items-center space-x-3 mb-6 md:mb-8">
                <div className="bg-emerald-700 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl shadow-emerald-950/20">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-emerald-700 dark:text-emerald-500 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-0.5 md:mb-1">Technical Brief</h4>
                  <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Quality Certified Delivery</h3>
                </div>
                <div className="flex-1 h-[1px] bg-gray-100 dark:bg-slate-800 ml-4"></div>
              </div>

              <div className="relative aspect-square md:aspect-video lg:aspect-[4/5] xl:aspect-video rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800 mb-8 mx-auto max-w-4xl">
                {videoUrl ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1&mute=1&rel=0`}
                    title="Project Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <Image src={project.image} alt={project.name} fill className="w-full h-full object-cover" priority />
                )}
                {!videoUrl && <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>}
                <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Briefcase size={14} className="text-emerald-400 md:w-4 md:h-4" />
                    <span className="text-white text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Project Ref: {project.id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8 md:space-y-10 pt-8 md:pt-10 border-t border-gray-100 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto text-start">
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Briefcase size={12} className="text-emerald-600 md:w-[14px] md:h-[14px]" />
                      <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">Project Scope</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{project.category}</p>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <MapPin size={12} className="text-emerald-600 md:w-[14px] md:h-[14px]" />
                      <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">Project Location</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{project.location}</p>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Tag size={12} className="text-emerald-600 md:w-[14px] md:h-[14px]" />
                      <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">Industry Sector</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{project.category}</p>
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Calendar size={12} className="text-emerald-600 md:w-[14px] md:h-[14px]" />
                      <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">Delivery Status</span>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">{project.status}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <ScrollReveal>
            <div className="flex items-center space-x-3 md:space-x-4 mb-8 md:mb-12">
              <div className="bg-emerald-700 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg"><ImageIcon className="w-5 h-5 md:w-6 md:h-6 text-white" /></div>
              <div>
                <h4 className="text-emerald-700 dark:text-emerald-500 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-0.5 md:mb-1">Visual Evidence</h4>
                <h3 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Project Gallery</h3>
              </div>
              <div className="flex-1 h-[1px] bg-gray-100 dark:bg-slate-800 ml-4"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
            {galleryImages.length > 0 ? (
              galleryImages.map((img, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div 
                    onClick={() => setLightboxImageIndex(index)}
                    className="relative aspect-[4/3] rounded-2xl md:rounded-[2rem] overflow-hidden border border-gray-100 dark:border-slate-800 group shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  >
                    <Image src={img} alt={`Project Gallery ${index + 1}`} fill className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-emerald-900/5 group-hover:bg-transparent transition-colors flex items-center justify-center">
                       <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 md:w-8 md:h-8" size={24} />
                    </div>
                  </div>
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full py-16 md:py-24 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] md:rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <ImageIcon className="text-slate-300 dark:text-slate-700" size={32} strokeWidth={1.5} />
                </div>
                <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-tight text-lg">No Visual Assets Found</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-widest mt-1">Images for this project haven't been uploaded yet</p>
              </div>
            )}
          </div>
        </section>

        <ScrollReveal>
          <div className="p-8 md:p-16 bg-gray-50 dark:bg-slate-900/50 rounded-3xl md:rounded-[4rem] border border-gray-100 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3 text-emerald-700 dark:text-emerald-500 font-bold"><CheckCircle size={18} className="md:w-5 md:h-5" /><span className="uppercase text-[10px] md:text-xs tracking-widest">Compliance</span></div>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">This project adheres to all ICTAD C4 grading standards and national safety protocols.</p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3 text-emerald-700 dark:text-emerald-500 font-bold"><HistoryIcon size={18} className="md:w-5 md:h-5" /><span className="uppercase text-[10px] md:text-xs tracking-widest">Experience</span></div>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">Delivered through 22+ years of combined engineering expertise in the Sri Lankan market.</p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center space-x-3 text-emerald-700 dark:text-emerald-500 font-bold"><Info size={18} className="md:w-5 md:h-5" /><span className="uppercase text-[10px] md:text-xs tracking-widest">Sustainability</span></div>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">Engineered with long-term structural durability and modern resource optimization.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/98 flex items-center justify-center p-4 md:p-20 backdrop-blur-2xl"
          >
            <div className="absolute top-6 right-6 md:top-10 md:right-10 z-[310]">
              <button className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-red-600 transition-all" onClick={() => setLightboxImageIndex(null)}>
                <X size={24} className="md:w-8 md:h-8" />
              </button>
            </div>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 md:px-10">
              <div className="pointer-events-auto">
                {lightboxIndex > 0 && (
                  <button 
                    className="hidden md:flex w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:bg-white/20 transition-all z-[310]" 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  >
                    <ChevronLeft className="w-10 h-10" />
                  </button>
                )}
              </div>
              <div className="pointer-events-auto">
                {lightboxIndex < galleryImages.length - 1 && (
                  <button 
                    className="hidden md:flex w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:bg-white/20 transition-all z-[310]" 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  >
                    <ChevronRight className="w-10 h-10" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Navigation Controls */}
            <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-8 z-[310]">
              <button 
                disabled={lightboxIndex === 0}
                className={`w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all ${lightboxIndex === 0 ? 'opacity-20' : 'opacity-100'}`}
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                disabled={lightboxIndex === galleryImages.length - 1}
                className={`w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center active:scale-95 transition-all ${lightboxIndex === galleryImages.length - 1 ? 'opacity-20' : 'opacity-100'}`}
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            
            {/* Image Counter for Mobile */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full z-[310]">
              <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                {lightboxIndex + 1} / {galleryImages.length}
              </p>
            </div>
            <motion.div 
              key={lightboxIndex} 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.3 }} 
              className="relative w-full h-full max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={galleryImages[lightboxIndex]} 
                alt="Lightbox View"
                fill
                className="object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ProjectDetailContent />
    </Suspense>
  );
}
