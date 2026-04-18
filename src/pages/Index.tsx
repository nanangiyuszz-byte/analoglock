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

  const handleLogout = () => {
    if (confirm("Apakah kamu yakin ingin keluar? Semua data nama akan dihapus dari sesi ini.")) {
      localStorage.removeItem('user-name');
      window.location.reload(); // Paksa reload untuk kembali ke input nama
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <AppSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentPage={page} 
        onNavigate={setPage} 
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-muted transition">
            <Menu size={24} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#9D64FA' }}>Fun Clock Playground</h1>
            <div className="flex flex-col mt-0.5">
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tight">
                Oleh: <span className="text-purple-600">Ladyus Azalea M. S.</span> (Dyzz_SMPN 31 SBY)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 pb-12 pt-4">
        <motion.div 
          key={page} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          {page === 'home' && (
            <div className="space-y-6">
              <ClockPlayground onStartQuiz={() => setPage('quiz')} />
              
              {/* Tombol Logout ditambahkan di bawah menu utama */}
              <div className="flex justify-center pt-4">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
                >
                  <LogOut size={16} /> Keluar / Ganti Nama
                </button>
              </div>
            </div>
          )}
          {page === 'quiz' && <QuizSystem onBack={() => setPage('home')} />}
          {page === 'learning' && <LearningHub />}
          {page === 'progress' && (
            <div className="space-y-6">
              <ProgressHistory />
              <button 
                onClick={() => setPage('home')}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm"
              >
                Kembali ke Menu
              </button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer info branding Bayu/iboycloud */}
      <footer className="py-6 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
          2026 analogstudywebb2
        </p>
      </footer>
    </div>
  );
};

export default Index;
