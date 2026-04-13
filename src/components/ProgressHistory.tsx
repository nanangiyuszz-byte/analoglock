import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface QuizResult {
  date: string;
  correct: number;
  wrong: number;
  score: number;
  subject?: string;
}

const ProgressHistory: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    // Membaca data yang disimpan oleh LearningHub atau QuizSystem
    const savedResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    setResults(savedResults);
  }, []);

  const clearHistory = () => {
    if(confirm("Hapus semua riwayat?")) {
      localStorage.removeItem('quiz-results');
      setResults([]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black text-primary uppercase italic">📊 Riwayat Progress</h2>
        {results.length > 0 && (
          <button onClick={clearHistory} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition">
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
           <span className="text-5xl block mb-4">📭</span>
           <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Belum ada hasil quiz. Coba quiz dulu ya!</p>
        </div>
      ) : (
        <>
          {/* Comparison Card */}
          {results.length >= 2 && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-6 shadow-xl text-white">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 opacity-80 text-center">📈 Perbandingan Progress</h3>
              <div className="flex justify-around items-center">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase opacity-70">Sebelumnya</p>
                  <p className="text-3xl font-black">{results[results.length - 2].score}%</p>
                </div>
                <span className="text-3xl font-black animate-pulse">→</span>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase opacity-70">Terakhir</p>
                  <p className="text-3xl font-black">{results[results.length - 1].score}%</p>
                </div>
              </div>
              {results[results.length - 1].score > results[results.length - 2].score && (
                <p className="text-center mt-4 text-xs font-bold bg-white/20 py-1 rounded-full italic">Keren! Progress kamu naik! 🔥</p>
              )}
            </motion.div>
          )}

          <div className="space-y-3">
            <h3 className="font-black text-xs text-muted-foreground uppercase tracking-widest px-2">Hasil Sebelumnya</h3>
            {[...results].reverse().map((r, i) => (
              <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm border-2 border-slate-100 flex justify-between items-center group hover:border-primary/50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">{r.subject || 'QUIZ'}</span>
                    <p className="text-[10px] font-bold text-muted-foreground">{new Date(r.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                  </div>
                  <p className="font-black text-slate-800 mt-1">✅ {r.correct} Benar / ❌ {r.wrong} Salah</p>
                </div>
                <div className="text-2xl font-black text-primary group-hover:scale-110 transition-transform">{r.score}%</div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ProgressHistory;
