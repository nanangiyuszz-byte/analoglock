import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, LogOut, Clock, Play, BarChart3, BookOpen } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import ClockPlayground from '@/components/ClockPlayground';
import QuizSystem from '@/components/QuizSystem';
import LearningHub from '@/components/LearningHub';
import ProgressHistory from '@/components/ProgressHistory';

type Page = 'home' | 'learning' | 'quiz' | 'progress';

const Index: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState<Page>('home');

  // Fungsi untuk Keluar dan Ganti Nama
  const handleLogout = () => {
    if (confirm("Apakah kamu yakin ingin keluar? Sesi nama kamu akan dihapus.")) {
      localStorage.removeItem('user-name');
      window.location.reload(); // Reload untuk memicu input nama kembali di App.tsx/Auth check
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Sidebar untuk Navigasi */}
      <AppSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentPage={page} 
        onNavigate={(newPage) => {
          setPage(newPage as Page);
          setSidebarOpen(false);
        }} 
      />

      {/* Header Section */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 rounded-xl hover:bg-muted transition"
          >
            <Menu size={24} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#9D64FA' }}>
              Fun Clock Playground
            </h1>
            <div className="flex flex-col mt-0.5">
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tight">
                Oleh: <span className="text-purple-600">Ladyus Azalea M. S.</span> (Dyzz_SMPN 31 SBY)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 pb-12 pt-4">
        <motion.div 
          key={page} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          {page === 'home' && (
            <div className="space-y-6 text-center">
              <ClockPlayground onStartQuiz={() => setPage('quiz')} />
              
              {/* Tombol Logout di Menu Utama */}
              <div className="flex justify-center pt-8">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 text-red-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 rounded-2xl transition-all"
                >
                  <LogOut size={14} /> Keluar / Ganti Nama
                </button>
              </div>
            </div>
          )}

          {page === 'quiz' && (
            <QuizSystem onBack={() => setPage('home')} />
          )}

          {page === 'learning' && (
            <LearningHub />
          )}

          {page === 'progress' && (
            <div className="space-y-6">
              <ProgressHistory />
              <button 
                onClick={() => setPage('home')}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm shadow-sm hover:bg-slate-200 transition-all"
              >
                Kembali ke Menu Utama
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="py-8 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">
          2026 analogstudywebb2
        </p>
      </footer>
    </div>
  );
};

export default Index;
