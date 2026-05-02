"use client";

import { Suspense } from "react";
import NextImage from "next/image";
import { 
  Linkedin, 
  Mail, 
  Github,
  ArrowUpRight,
  Loader2,
  Users
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface VisionContent {
  title: string;
  message: string;
  image: string;
}

interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  linkedin?: string;
  github?: string;
}

interface SiteContentItem {
  key: string;
  value: string;
}

function TeamContent() {
  const [owners, setOwners] = useState<TeamMember[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [familyPhoto, setFamilyPhoto] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Purely dynamic state - no local hardcoding
  const [visionContent, setVisionContent] = useState<VisionContent | null>(null);
  const [visionContent2, setVisionContent2] = useState<VisionContent | null>(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  async function fetchTeamData() {
    try {
      setLoading(true);
      
      const { data: contentData } = await supabase
        .from('site_content')
        .select('*');

      const contentMap: any = {};
      (contentData as SiteContentItem[] | null)?.forEach(item => {
        contentMap[item.key] = item.value;
      });
      
      if (contentMap.family_photo) {
        setFamilyPhoto(contentMap.family_photo);
      }

      const { data: members, error } = await supabase
        .from('members')
        .select('*, job_role(title), member_profile(path)')
        .order('id', { ascending: true });

      if (error) throw error;

      if (members) {
        const leaders: TeamMember[] = [];
        
        // Managing Director (job_role_id: 2)
        const md = members.find(m => m.job_role_id === 2);
        if (md) {
            leaders.push({
                id: md.id,
                name: `${md.fname} ${md.lname}`,
                role: "MANAGING DIRECTOR",
                bio: contentMap.managing_director_message || md.bio || "Visionary Leader",
                image: contentMap.managing_director_image || md.member_profile?.[0]?.path || "https://via.placeholder.com/150",
                email: md.email || ""
            });
        }
        
        // Director (job_role_id: 3)
        const dir = members.find(m => m.job_role_id === 3);
        if (dir) {
            leaders.push({
                id: dir.id,
                name: `${dir.fname} ${dir.lname}`,
                role: "DIRECTOR",
                bio: contentMap.director_message || dir.bio || "Strategic Director",
                image: contentMap.director_image || dir.member_profile?.[0]?.path || "https://via.placeholder.com/150",
                email: dir.email || ""
            });
        }
        setOwners(leaders);

        const others = members.filter(m => m.job_role_id !== 2 && m.job_role_id !== 3).map(m => ({
          id: m.id,
          name: `${m.fname} ${m.lname}`,
          role: m.job_role?.title || "Team Member",
          bio: m.bio || "Dedicated professional.",
          image: m.member_profile?.[0]?.path || "https://via.placeholder.com/150",
          email: m.email || ""
        }));
        setTeamMembers(others);
      }
    } catch (err) {
      console.error("Error fetching team data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <main className="bg-white dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden text-slate-900 dark:text-white">
      <PageHeader
        subtitle="Meet the Professionals"
        title="Our"
        highlightedTitle="Team Members."
        description="The dedicated team of experts driving Civitech&apos;s commitment to quality, safety, and innovation in every project."
        backgroundImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000"
      />

      {/* Leadership Section - Shows up to 2 Primary Directors */}
      {owners.length > 0 && (
        <section className="py-16 md:py-24 space-y-24 md:space-y-48">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <ScrollReveal>
              <div className="text-center mb-12 md:mb-24">
                <h4 className="text-emerald-600 dark:text-emerald-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] mb-3 md:mb-4">Executive Leadership</h4>
                <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Leadership</h2>
              </div>
            </ScrollReveal>

            <div className="space-y-16 md:space-y-48">
              {owners.map((owner: TeamMember, idx: number) => {
                const content = idx === 0 ? visionContent : visionContent2;
                return (
                  <ScrollReveal key={owner.id}>
                    <div className={`grid lg:grid-cols-2 items-center gap-x-16 gap-y-8 md:gap-y-16`}>
                      <div className={`relative max-lg:order-1 ${idx % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div className="relative aspect-[4/5] rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl group border border-slate-100 dark:border-white/5 max-w-md mx-auto">
                          <NextImage 
                            src={content?.image || owner.image} 
                            fill
                            className="object-cover" 
                            alt={owner.name} 
                          />
                        </div>
                      </div>
                      <div className={`max-lg:order-2 max-lg:text-center ${idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                        <p className="text-[9px] md:text-sm font-bold text-emerald-600 mb-3 md:mb-6 uppercase tracking-widest flex items-center max-lg:justify-center">
                          <span className="rotate-90 inline-block mr-3 h-3 md:h-4 w-[2px] bg-emerald-600"></span> Director&apos;s Vision
                        </p>
                        <h3 className="text-xl sm:text-2xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter mb-4 md:mb-8 leading-[1.1] italic">
                          {content?.title || owner.role}
                        </h3>
                        <p className="text-sm md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-6 md:mb-12">
                          &quot;{content?.message || owner.bio}&quot;
                        </p>
                        <div className="flex flex-wrap gap-4 md:gap-6 max-lg:justify-center">
                          <a href={`mailto:${owner.email}`} className="flex items-center gap-3 text-slate-900 dark:text-white font-bold uppercase tracking-widest text-[8px] md:text-[10px] group">
                            <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all border border-slate-100 dark:border-white/10">
                              <Mail className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 group-hover:text-white" />
                            </span>
                            Contact Director
                          </a>
                          {owner.linkedin && (
                            <a href={owner.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-900 dark:text-white font-bold uppercase tracking-widest text-[8px] md:text-[10px] group">
                                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-100 dark:border-white/10">
                                <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-blue-600 group-hover:text-white" />
                                </span>
                                Professional Profile
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Specialists Section - Everyone else in the database */}
      <section className="py-16 md:py-32 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollReveal>
            <div className="text-center mb-16 md:mb-32">
              <h4 className="text-emerald-600 dark:text-emerald-500 font-bold text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] mb-3 md:mb-4">Our Specialists</h4>
              <h2 className="text-2xl md:text-6xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Meet Our Team</h2>
            </div>
          </ScrollReveal>

          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 md:gap-y-24">
              {teamMembers.map((member: TeamMember, idx: number) => (
                <ScrollReveal key={member.id} delay={idx * 0.1} className="h-full">
                  <div className="bg-white dark:bg-slate-900 relative rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 pt-12 md:pt-20 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-500 group text-center h-full flex flex-col">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-[3px] md:border-4 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 overflow-hidden absolute -top-10 md:-top-16 left-1/2 -translate-x-1/2 shadow-xl transition-transform duration-500 shrink-0">
                      <NextImage
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-all duration-700"
                      />
                    </div>

                    <div className="flex-1 flex flex-col pt-4">
                      <h4 className="text-slate-900 dark:text-white font-bold text-lg md:text-xl uppercase tracking-tighter leading-none mb-2 min-h-[2.5rem] flex items-center justify-center">{member.name}</h4>
                      <p className="text-emerald-600 font-bold uppercase tracking-widest text-[8px] md:text-[9px] mb-4 md:mb-6 min-h-[1.5rem] flex items-center justify-center">{member.role}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-medium mb-6 md:mb-8 flex-1 line-clamp-4">
                        {member.bio}
                      </p>
                      <div className="flex justify-center gap-3 pt-5 md:pt-6 border-t border-slate-50 dark:border-white/5 mt-auto">
                        <a href={`mailto:${member.email}`} className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all border border-slate-100 dark:border-white/10"><Mail size={14} /></a>
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-100 dark:border-white/10"><Github size={14} /></a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-blue-700 transition-all border border-slate-100 dark:border-white/10"><Linkedin size={14} /></a>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-950/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                <Users className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No Additional Personnel Records Found</p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Group Photo Section */}
      <section className="py-20 md:py-40 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <ScrollReveal>
            <div className="mb-12 md:mb-20">
              <h4 className="text-emerald-600 dark:text-emerald-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4">Unity in Excellence</h4>
              <h2 className="text-3xl md:text-6xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">The Civitech Family</h2>
            </div>

            <div className="relative rounded-3xl md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/5 h-[600px] w-full px-4 md:px-16">
              <NextImage
                src={familyPhoto || "https://166photography.co.uk/wp-content/uploads/2021/10/JODIE-LIAM-404.jpg"}
                alt="The Civitech Family"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-slate-950/10"></div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-4 bg-slate-50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="bg-emerald-600 rounded-3xl md:rounded-[4rem] p-10 md:p-24 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-white/10 transition-all duration-700"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-[0.9] mb-6 md:mb-8">Join Our <br/> Excellence.</h2>
                <p className="text-emerald-100 text-base md:text-xl font-medium opacity-80 max-w-xl">We&apos;re always looking for talented professionals to join our growing team. Make your mark with Civitech.</p>   
              </div>
              <div className="relative z-10">
                <a href="/careers" className="inline-flex items-center gap-4 px-8 md:px-12 py-5 md:py-6 bg-white text-emerald-600 font-bold text-[10px] md:text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-2xl group/btn">
                  Explore Careers
                  <ArrowUpRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

export default function TeamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    }>
      <TeamContent />
    </Suspense>
  );
}
