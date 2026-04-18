import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User, Clock, CheckCircle2, XCircle, BarChart3, ChevronRight, X } from 'lucide-react';

interface QuizResult {
  date: string;
  correct: number;
  wrong: number;
  score: number;
  playerName?: string;
  total?: number;
}

const ProgressHistory: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [currentName, setCurrentName] = useState("");

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    setResults(savedResults);
    const name = localStorage.getItem('user-name') || 'Pelajar';
    setCurrentName(name);
  }, []);

  const clear = () => {
    if(confirm("Hapus semua riwayat kuis?")) {
      localStorage.removeItem('quiz-results');
      setResults([]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto space-y-6 px-4">
      <div className="flex items-center justify-between mt-4">
        <div>
          <h2 className="text-2xl font-black text-primary italic tracking-tight">📊 PROGRESS DASHBOARD</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Cek detail pencapaianmu di sini</p>
        </div>
        {results.length > 0 && (
          <button onClick={clear} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl transition-all shadow-sm">
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
           <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-4xl">📭</div>
           <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Belum ada riwayat kuis yang tercatat</p>
        </div>
      ) : (
        <div className="grid gap-4 pb-20">
          {[...results].reverse().map((r, i) => (
            <motion.div 
              key={i} 
              initial={{ x: -20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedResult(r)}
              className="bg-white rounded-[1.5rem] p-4 shadow-sm border-2 border-slate-100 flex items-center gap-4 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${r.score >= 80 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {r.score}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  {new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </p>
                <p className="font-extrabold text-slate-800 truncate capitalize">{r.playerName || currentName}</p>
                <div className="flex gap-3 mt-1">
                   <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                     <CheckCircle2 size={10} /> {r.correct}
                   </span>
                   <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                     <XCircle size={10} /> {r.wrong}
                   </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </div>
      )}

      {/* --- MODAL DETAIL (POPOUP) --- */}
      <AnimatePresence>
        {selectedResult && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedResult(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              {/* Dekorasi Atas */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
              
              <button 
                onClick={() => setSelectedResult(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>

              <div className="text-center space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-800 uppercase italic">Quiz Report</h3>
                  <p className="text-sm font-bold text-muted-foreground">Detail Skor & Statistik</p>
                </div>

                {/* Score Circle */}
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * selectedResult.score) / 100}
                      className="text-primary transition-all duration-1000" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800">{selectedResult.score}%</span>
                  </div>
                </div>

                {/* Info List */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <DetailItem icon={<User size={16}/>} label="Peserta" value={selectedResult.playerName || currentName} />
                  <DetailItem icon={<Clock size={16}/>} label="Waktu" value={new Date(selectedResult.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} />
                  <DetailItem icon={<CheckCircle2 size={16} className="text-green-500"/>} label="Benar" value={`${selectedResult.correct} Soal`} />
                  <DetailItem icon={<XCircle size={16} className="text-red-500"/>} label="Salah" value={`${selectedResult.wrong} Soal`} />
                  <DetailItem icon={<BarChart3 size={16}/>} label="Total" value={`${(selectedResult.total || 20)} Soal`} />
                  <DetailItem icon={<div className="w-2 h-2 rounded-full bg-primary" />} label="Status" value={selectedResult.score >= 70 ? "Lulus" : "Remedial"} />
                </div>

                <button 
                  onClick={() => setSelectedResult(null)}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all uppercase tracking-widest text-sm"
                >
                  Tutup Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Sub-component untuk item detail agar rapi
const DetailItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
    <div className="text-slate-400">{icon}</div>
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <p className="text-xs font-black text-slate-700 truncate capitalize">{value}</p>
    </div>
  </div>
);

export default ProgressHistory;
