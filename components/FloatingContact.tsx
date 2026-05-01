"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, X, Headset } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TerminalData {
  mobile_connect?: string;
  office_line?: string;
  office_email?: string;
  [key: string]: string | undefined;
}

interface Action {
  icon: React.ReactNode;
  href: string;
  label: string;
  target?: string;
  bgColor: string;
}

const FloatingContact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [terminalData, setTerminalData] = useState<TerminalData | null>(null);

  useEffect(() => {
    fetchTerminalData();
  }, []);

  async function fetchTerminalData() {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) throw error;
      const contentMap: TerminalData = {};
      data?.forEach(item => { contentMap[item.key] = item.value; });
      setTerminalData(contentMap);
    } catch (err) {
      console.error("Error fetching terminal data for floating contact:", err);
    }
  }

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const actions: Action[] = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.411 0 .01 5.403.007 12.04c0 2.12.552 4.188 1.598 6.06L0 24l6.105-1.595a11.793 11.793 0 005.936 1.598h.005c6.637 0 12.038-5.404 12.04-12.04.002-3.218-1.252-6.243-3.522-8.513z" />
        </svg>
      ),
      href: `https://wa.me/${(terminalData?.mobile_connect || "0703747474").replace(/\D/g, "")}`,
      label: "WhatsApp",
      target: "_blank",
      bgColor: "bg-[#25D366] hover:bg-[#20bd5c]"
    },
    {
      icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: `tel:${(terminalData?.office_line || "0332263059").replace(/\D/g, "")}`,
      label: "Landline",
      target: undefined,
      bgColor: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white"
    },
    {
      icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: `mailto:${terminalData?.office_email || "civitec@sltnet.lk"}`,
      label: "Email",
      target: undefined,
      bgColor: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-22 right-6 sm:bottom-22 sm:right-8 z-50 flex flex-col items-end gap-1.5 sm:gap-3">
          {/* Hidden Actions */}
          <AnimatePresence>
            {isOpen && (
              <div className="flex flex-col gap-1.5 sm:gap-3 mb-1 sm:mb-2">
                {actions.map((action, index) => (
                  <motion.a
                    key={index}
                    href={action.href}
                    target={action.target}
                    rel={action.target ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 10 }}
                    transition={{ delay: (actions.length - 1 - index) * 0.05 }}
                    className={`p-2 sm:p-3 rounded-full text-white shadow-xl flex items-center justify-center group relative ${action.bgColor} transition-colors duration-300`}
                  >
                    {action.icon}
                    <span className="absolute right-full mr-3 sm:mr-4 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-900 text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none border border-white/10 shadow-2xl">
                      {action.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className={`p-2 sm:p-3 rounded-full text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 flex items-center justify-center relative ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            aria-label="Contact options"
          >
            {isOpen ? <X className="w-4 h-4 sm:w-6 sm:h-6" /> : <Headset className="w-4 h-4 sm:w-6 sm:h-6" />}
            
            {/* Notification pulse when closed */}
            {!isOpen && (
              <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping pointer-events-none"></span>
            )}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FloatingContact;
