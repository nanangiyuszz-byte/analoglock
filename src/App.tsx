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
  // State baru untuk menyimpan pilihan jenjang sekolah
  const [schoolLevel, setSchoolLevel] = useState("");

  // Mengecek data login yang tersimpan di localStorage saat aplikasi dimuat
  useEffect(() => {
    const savedName = localStorage.getItem("user-name");
    const savedLevel = localStorage.getItem("user-school-level");
    if (savedName) {
      setUserName(savedName);
    }
    if (savedLevel) {
      setSchoolLevel(savedLevel);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi: Nama minimal 2 karakter DAN jenjang sekolah harus dipilih
    if (inputValue.trim().length >= 2 && schoolLevel !== "") {
      localStorage.setItem("user-name", inputValue.trim());
      localStorage.setItem("user-school-level", schoolLevel);
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
            /* TAMPILAN LOGIN / INPUT NAMA & SEKOLAH */
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
                    Masukkan namamu dan pilih jenjang sekolahmu!
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Input Nama */}
                  <input
                    type="text"
                    placeholder="Ketik namamu di sini..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-primary/20 focus:border-primary outline-none text-center text-xl font-bold transition-all shadow-sm bg-card"
                    autoFocus
                  />

                  {/* Dropdown Pilihan Sekolah (Kreatif & Clean) */}
                  <div className="relative group">
                    <select
                      value={schoolLevel}
                      onChange={(e) => setSchoolLevel(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-primary/20 focus:border-primary outline-none text-center text-lg font-bold transition-all shadow-sm bg-card appearance-none cursor-pointer text-foreground"
                    >
                      <option value="" disabled>--- Pilih Asal Sekolah ---</option>
                      <option value="SD">Sekolah Dasar (SD)</option>
                      <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                      <option value="SMA">Sekolah Menengah Atas (SMA)</option>
                    </select>
                    {/* Ikon panah kustom untuk estetika premium */}
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={inputValue.trim().length < 2 || schoolLevel === ""}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:scale-100"
                  >
                    MULAI BELAJAR 🚀
                  </button>
                </form>
                
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  © 2026 analogstudywebb2
                </p>
              </div>
            </motion.div>
          ) : (
            /* TAMPILAN UTAMA APLIKASI SETELAH LOGIN */
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
