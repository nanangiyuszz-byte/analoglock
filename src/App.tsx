import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Cek apakah user sudah pernah "login" sebelumnya
  useEffect(() => {
    const savedName = localStorage.getItem("user-name");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length >= 2) {
      localStorage.setItem("user-name", inputValue.trim());
      setUserName(inputValue.trim());
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <AnimatePresence mode="wait">
          {!userName ? (
            /* TAMPILAN LOGIN / INPUT NAMA AWAL */
            <motion.div 
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6"
            >
              <div className="w-full max-w-md space-y-8 text-center">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black text-primary italic tracking-tighter">
                    FUN CLOCK ⏰
                  </h1>
                  <p className="text-muted-foreground font-medium">
                    Masukkan namamu untuk memulai petualangan kuis!
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ketik namamu di sini..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-primary/20 focus:border-primary outline-none text-center text-xl font-bold transition-all shadow-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={inputValue.trim().length < 2}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    MASUK SEKARANG 🚀
                  </button>
                </form>
                
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  © 2026 analogstudywebb2
                </p>
              </div>
            </motion.div>
          ) : (
            /* TAMPILAN UTAMA APLIKASI */
            <motion.div 
              key="app"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-screen bg-background"
            >
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </motion.div>
          )}
        </AnimatePresence>

      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
