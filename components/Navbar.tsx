"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { name: 'HOME', href: '/' },
  { 
    name: 'ABOUT', 
    href: '/about',
    items: [
      { name: 'COMPANY PROFILE', href: '/about' },
      { name: 'OFFICIAL HISTORY', href: '/about#history' },
      { name: 'QUALITY POLICY', href: '/about#quality-policy' },
      { name: 'TEAM MEMBERS', href: '/about/team' },
    ]
  },
  { name: 'SPECIALIZATIONS', href: '/specializations' },
  { name: 'CORE COMPETENCIES', href: '/competencies' },
  { name: 'PROJECTS', href: '/projects' },
  { name: 'GALLERY', href: '/gallery' },
  { name: 'CAREERS', href: '/careers' },
  { name: 'CONTACTS', href: '/contact' },
];

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdminPage = pathname?.startsWith('/admin');
  const isProjectDetailPage = pathname?.startsWith('/projects/') && pathname.split('/').length > 2;
  const isUnderConstruction = pathname === '/under-construction';

  const toggleMenu = () => setIsOpen(!isOpen);

  if (!mounted || isProjectDetailPage || isUnderConstruction || isAdminPage) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-[100] transition-all duration-300">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-white/5 shadow-sm py-3 px-4 sm:px-6 relative z-[110]">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-sm transition-all group-hover:shadow-md">
                <Image 
                  src="/logo.png" 
                  alt="Civitech Logo" 
                  width={32}
                  height={32}
                  className="h-6 sm:h-7 md:h-8 w-auto object-contain" 
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg md:text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-100 uppercase leading-none">Civitech</span>
                <span className="text-emerald-600 dark:text-emerald-500 text-[7px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-0.5 sm:mt-1">Constructions</span>
              </div>
            </div>
          </Link>

          <nav className="hidden min-[1500px]:flex items-center flex-1 justify-center px-8">
            <ul className="flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.items?.some(item => pathname === item.href));
                const hasItems = link.items && link.items.length > 0;
                
                return (
                  <li key={link.name} className="relative group/nav"
                      onMouseEnter={() => hasItems && setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}>
                    {hasItems ? (
                      <div className={`px-3 py-2 font-bold flex items-center gap-1 text-[10px] xl:text-xs tracking-widest transition-all cursor-pointer uppercase ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
                        {link.name}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-emerald-600 dark:bg-emerald-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover/nav:w-full'}`}></span>
                      </div>
                    ) : (
                      <Link href={link.href} className={`px-3 py-2 font-bold block text-[10px] xl:text-xs tracking-widest transition-all relative group uppercase ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'}`}>
                        {link.name}
                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-emerald-600 dark:bg-emerald-400 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                      </Link>
                    )}

                    {hasItems && (
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-white/5 rounded-2xl mt-1 py-2 overflow-hidden"
                          >
                            {link.items?.map((item) => (
                              <Link 
                                key={item.name} 
                                href={item.href}
                                className={`block px-5 py-3 text-[10px] font-bold tracking-[0.1em] uppercase transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${pathname === item.href ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeSwitcher />
            <button onClick={toggleMenu} className="min-[1500px]:hidden p-2 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative w-10 h-10">
              <AnimatePresence mode="wait">
                {isOpen ? <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex items-center justify-center"><X size={24} /></motion.div> : <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex items-center justify-center"><Menu size={24} /></motion.div>}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[90] min-[1500px]:hidden" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-2xl border-b border-slate-100 dark:border-white/5 z-[100] overflow-hidden min-[1500px]:hidden origin-top rounded-b-[2rem]" >
              <div className="max-w-7xl mx-auto">
                <nav className="p-6 md:p-10">
                  <ul className="flex flex-col gap-2">
                    {navLinks.map((link, idx) => {
                      const isActive = pathname === link.href || (link.items?.some(item => pathname === item.href));
                      const hasItems = link.items && link.items.length > 0;
                      const isDropdownOpen = mobileDropdown === link.name;

                      return (
                        <motion.li key={link.name} initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1 + (idx * 0.04), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                          {hasItems ? (
                            <div className="flex flex-col">
                              <button 
                                onClick={() => setMobileDropdown(isDropdownOpen ? null : link.name)}
                                className={`flex items-center justify-center gap-2 p-4 transition-all font-bold text-xs tracking-[0.25em] uppercase group relative w-full ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'}`}
                              >
                                <span className="relative py-1">
                                  {link.name}
                                  {isActive && <motion.div layoutId="mobile-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                                </span>
                                <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>
                              <AnimatePresence>
                                {isDropdownOpen && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-slate-50 dark:bg-slate-800 rounded-3xl mx-2"
                                  >
                                    <ul className="py-2">
                                      {link.items?.map((item) => (
                                        <li key={item.name}>
                                          <Link 
                                            href={item.href} 
                                            onClick={() => setIsOpen(false)} 
                                            className={`flex items-center justify-center p-4 text-[10px] font-bold tracking-[0.15em] uppercase transition-all ${pathname === item.href ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300'}`}
                                          >
                                            {item.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <Link href={link.href} onClick={() => setIsOpen(false)} className={`flex flex-col items-center justify-center p-4 transition-all font-bold text-xs tracking-[0.25em] uppercase group relative ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'}`}>
                              <span className="relative py-1">
                                {link.name}
                                {isActive && <motion.div layoutId="mobile-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                              </span>
                            </Link>
                          )}
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
