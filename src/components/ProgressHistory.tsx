import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, User } from 'lucide-react';

interface QuizResult {
  date: string;
  correct: number;
  wrong: number;
  score: number;
  playerName?: string;
}

const ProgressHistory: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    setResults(saved);
  }, []);

  const clear = () => {
    if(confirm("Hapus semua riwayat?")) {
      localStorage.removeItem('quiz-results');
      setResults([]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-primary italic">📊 RIWAYAT BELAJAR</h2>
        {results.length > 0 && (
          <button onClick={clear} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
            <Trash2 size={22} />
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
           <span className="text-5xl block mb-2">📭</span>
           <p className="text-muted-foreground font-bold uppercase text-[12px] tracking-widest">Belum ada riwayat kuis</p>
        </div>
      ) : (
        <div className="space-y-4 pb-10">
          {[...results].reverse().map((r, i) => (
            <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border-2 border-slate-100 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
                    MATH QUIZ
                  </span>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    {new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                {/* TAMPILAN NAMA DI HISTORY */}
                <div className="flex items-center gap-1.5 text-slate-800 font-extrabold mb-1">
                  <User size={16} className="text-primary" />
                  <span>{r.playerName || 'Siswa'}</span>
                </div>
                <p className="font-bold text-slate-500 text-xs">
                  ✅ {r.correct} Benar | ❌ {r.wrong} Salah
                </p>
              </div>
              <div className="text-3xl font-black text-primary">{r.score}%</div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProgressHistory;
