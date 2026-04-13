import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import ClockPlayground from '@/components/ClockPlayground';
import QuizSystem from '@/components/QuizSystem';
import LearningHub from '@/components/LearningHub';
import ProgressHistory from '@/components/ProgressHistory';

type Page = 'home' | 'learning' | 'quiz' | 'progress';

const Index: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState<Page>('home');

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPage={page} onNavigate={setPage} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-muted transition">
            <Menu size={24} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#9D64FA' }}>Fun Clock Playground</h1>
            <div className="mt-1">
               <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider leading-tight">
                 Dikembangkan oleh: <span className="text-purple-600">Ladyus Azalea M. S.</span>
               </p>
               <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider leading-tight">
                 Tim Pendukung: <span className="text-blue-500">Hanifah Dinny A.</span>
               </p>
            </div>
          </div>
        </div>
      </header>


      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 pb-12 pt-6">
        <motion.div key={page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {page === 'home' && <ClockPlayground onStartQuiz={() => setPage('quiz')} />}
          {page === 'quiz' && <QuizSystem onBack={() => setPage('home')} />}
          {page === 'learning' && <LearningHub />}
          {page === 'progress' && <ProgressHistory />}
        </motion.div>
      </main>

      {/* Footer Bersih */}
      <footer className="border-t border-border py-4 px-4 text-center">
        <p className="text-xs text-muted-foreground font-medium">
          © 2026 analogstudywebb2 | Edukasi Jam Interaktif
        </p>
      </footer>
    </div>
  );
};

export default Index;
