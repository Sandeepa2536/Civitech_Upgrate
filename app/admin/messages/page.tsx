"use client";

import { useState, useEffect } from "react";
import { 
  Mail, 
  Phone, 
  Clock
} from "lucide-react";
import { getInquiries, updateInquiryStatus } from "./actions";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | string;
  created_at: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const result = await getInquiries();
      if (result.error) throw new Error(result.error);
      setMessages(result.data || []);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error fetching messages:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: number) {
    const result = await updateInquiryStatus(id, 'Read');
    
    if (result.success) {
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'Read' } : m));
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h4 className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-[9px] md:text-[10px] mb-1.5 md:mb-2">Communication Center</h4>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Inbound <span className="text-emerald-600">Messages.</span></h1>
        </div>
        {selectedMessage && (
          <button 
            onClick={() => setSelectedMessage(null)}
            className="lg:hidden p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black uppercase text-[10px] tracking-widest border border-slate-200 dark:border-slate-700"
          >
            Back
          </button>
        )}
      </header>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Messages List - Hidden on mobile if a message is selected */}
        <div className={`lg:col-span-1 space-y-4 ${selectedMessage ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl p-3 md:p-4 max-h-[60vh] lg:max-h-[700px] overflow-y-auto shadow-sm custom-scrollbar">
            {loading ? (
              <div className="p-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-10 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No messages</div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (msg.status !== 'Read') markAsRead(msg.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl md:rounded-2xl transition-all border ${
                      selectedMessage?.id === msg.id 
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                      : "bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-transparent hover:border-emerald-500/20"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedMessage?.id === msg.id ? "text-emerald-100" : "text-emerald-600"}`}>
                        {msg.subject || "General Inquiry"}
                      </span>
                      {msg.status === 'New' && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      )}
                    </div>
                    <h4 className={`text-sm font-bold truncate ${selectedMessage?.id === msg.id ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {msg.name}
                    </h4>
                    <p className={`text-[10px] truncate ${selectedMessage?.id === msg.id ? "text-emerald-50/70" : "text-slate-500 dark:text-slate-400"}`}>
                      {msg.message}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail View - Shown full width on mobile if a message is selected */}
        <div className={`lg:col-span-2 ${selectedMessage ? 'block' : 'hidden lg:block'}`}>
          {selectedMessage ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] p-6 md:p-12 space-y-8 md:space-y-10 shadow-sm shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xl md:text-2xl border border-emerald-500/10 shrink-0">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tighter truncate">{selectedMessage.name}</h2>
                    <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      <Clock size={12} className="shrink-0" />
                      <span className="truncate">{new Date(selectedMessage.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                   <span className={`flex-1 sm:flex-none text-center px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border ${
                     selectedMessage.status === 'Read' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                   }`}>
                     {selectedMessage.status === 'Read' ? "Processed" : "New Message"}
                   </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 md:gap-8 py-6 md:py-8 border-y border-slate-100 dark:border-slate-800">
                <div className="space-y-1 min-w-0">
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email Address</span>
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 text-sm break-all">
                    <Mail size={16} className="text-emerald-600 shrink-0" />
                    {selectedMessage.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Phone Number</span>
                  <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300 text-sm">
                    <Phone size={16} className="text-emerald-600 shrink-0" />
                    {selectedMessage.phone || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Message Content</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-5 md:p-6 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-800 italic text-sm md:text-base">
                  &quot;{selectedMessage.message}&quot;
                </p>
              </div>

              <div className="pt-4 md:pt-6">
                <a 
                  href={`mailto:${selectedMessage.email}`}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
                >
                  <Mail size={16} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 md:p-20 bg-white dark:bg-slate-950/30 rounded-2xl md:rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 border border-slate-100 dark:border-slate-800">
                <Mail size={32} className="md:w-10 md:h-10" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-500 uppercase tracking-tighter">Select a message to view details</h3>
              <p className="text-[10px] md:text-xs text-slate-400 mt-2 max-w-xs uppercase tracking-widest font-bold">Your inbound inquiries will appear here after users submit the contact form.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
