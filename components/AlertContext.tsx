"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

type AlertType = "success" | "error" | "info" | "warning";

interface Alert {
  id: string;
  message: string;
  type: AlertType;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = useCallback((message: string, type: AlertType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  }, []);

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-4 p-4 rounded-2xl shadow-2xl border backdrop-blur-md
                ${alert.type === "success" ? "bg-emerald-500/90 border-emerald-400 text-white" : ""}
                ${alert.type === "error" ? "bg-rose-500/90 border-rose-400 text-white" : ""}
                ${alert.type === "warning" ? "bg-amber-500/90 border-amber-400 text-white" : ""}
                ${alert.type === "info" ? "bg-slate-900/90 border-slate-700 text-white" : ""}
              `}>
                <div className="shrink-0">
                  {alert.type === "success" && <CheckCircle2 size={24} />}
                  {alert.type === "error" && <AlertCircle size={24} />}
                  {alert.type === "warning" && <AlertTriangle size={24} />}
                  {alert.type === "info" && <Info size={24} />}
                </div>
                <p className="flex-1 text-sm font-bold uppercase tracking-widest leading-relaxed">
                  {alert.message}
                </p>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};
