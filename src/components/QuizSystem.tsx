import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalogClock from './AnalogClock';
import { generateQuizQuestions, QuizQuestion, saveQuizResult } from '@/lib/quizUtils';
import { formatTime } from '@/lib/clockUtils';
import { playCorrectSound, playWrongSound, playStartSound } from '@/lib/soundUtils';
import { Trophy, ArrowRight, RotateCcw, Home } from 'lucide-react';

interface QuizSystemProps {
  onBack: () => void;
}

const QuizSystem: React.FC<QuizSystemProps> = ({ onBack }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [dragHours, setDragHours] = useState(12);
  const [dragMinutes, setDragMinutes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  // Load pertanyaan saat komponen dipasang
  useEffect(() => {
    setQuestions(generateQuizQuestions(20));
  }, []);

  const q = questions[currentIdx];

  const startQuiz = () => {
    playStartSound();
    setStarted(true);
  };

  const handleMCAnswer = (ans: string) => {
    if (answered) return;
    setSelectedAnswer(ans);
    setAnswered(true);
    if (ans === q.correctAnswer) {
      playCorrectSound();
      setCorrect(c => c + 1);
    } else {
      playWrongSound();
      setWrong(w => w + 1);
    }
  };

  const handleDragSubmit = () => {
    if (answered) return;
    setAnswered(true);
    // Toleransi 2 menit untuk input drag
    const hDiff = Math.abs(dragHours - q.targetHours) % 12;
    const mDiff = Math.abs(dragMinutes - q.targetMinutes);
    if (hDiff === 0 && mDiff <= 2) {
      playCorrectSound();
      setCorrect(c => c + 1);
      setSelectedAnswer('correct');
    } else {
      playWrongSound();
      setWrong(w => w + 1);
      setSelectedAnswer('wrong');
    }
  };

  const handleDragTimeChange = useCallback((h: number, m: number) => {
    setDragHours(h);
    setDragMinutes(m);
  }, []);

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      // PROSES SIMPAN DATA KE HISTORY
      const savedName = localStorage.getItem('user-name') || 'Pelajar';
      const result = { 
        date: new Date().toISOString(), 
        correct, 
        wrong, 
        total: questions.length, 
        score: Math.round((correct / questions.length) * 100),
        playerName: savedName // Menyimpan nama ke record history
      };
      saveQuizResult(result);
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setDragHours(12);
      setDragMinutes(0);
    }
  };

  // Tampilan Awal (Start Screen)
  if (!started) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 py-12 px-6 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Trophy size={48} className="text-primary" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 italic uppercase">Siap Uji Nyali?</h2>
        <p className="text-muted-foreground font-medium max-w-xs">Selesaikan 20 soal kuis jam untuk mendapatkan skor terbaik!</p>
        <button onClick={startQuiz} className="w-full max-w-xs bg-primary text-white px-8 py-4 rounded-2xl text-xl font-black shadow-xl hover:scale-105 transition-all uppercase tracking-widest">
          Mulai Kuis 🚀
        </button>
        <button onClick={onBack} className="text-slate-400 font-bold hover:text-primary transition-colors">← Kembali</button>
      </motion.div>
    );
  }

  // Tampilan Selesai (Result Screen)
  if (finished) {
    const score = Math.round((correct / questions.length) * 100);
    const savedName = localStorage.getItem('user-name') || 'Sobat';
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6 py-12 px-6">
        <h2 className="text-3xl font-black text-slate-800 text-center uppercase italic">Hebat, {savedName}!</h2>
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 border-slate-50 text-center space-y-6 w-full max-w-sm">
          <div className="relative inline-flex items-center justify-center">
             <div className="text-6xl font-black text-primary">{score}%</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-2xl">
              <span className="text-2xl font-black text-green-600">{correct}</span>
              <p className="text-[10px] font-bold text-green-700/60 uppercase">Benar</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl">
              <span className="text-2xl font-black text-red-500">{wrong}</span>
              <p className="text-[10px] font-bold text-red-600/60 uppercase">Salah</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => { setQuestions(generateQuizQuestions(20)); setCurrentIdx(0); setCorrect(0); setWrong(0); setAnswered(false); setSelectedAnswer(null); setFinished(false); }}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg uppercase tracking-widest text-sm">
            <RotateCcw size={18} /> Ulangi Kuis
          </button>
          <button onClick={onBack} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm">
            <Home size={18} /> Menu Utama
          </button>
        </div>
      </motion.div>
    );
  }

  if (!q) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 pb-10">
      {/* Top Header & Progress */}
      <div className="w-full space-y-3">
        <div className="flex justify-between items-end">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            Soal {currentIdx + 1} / {questions.length}
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-bold text-green-600">✅ {correct}</span>
            <span className="text-xs font-bold text-red-500">❌ {wrong}</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            className="bg-primary h-full rounded-full" 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
          className="w-full flex flex-col items-center gap-6">
          
          <h3 className="text-xl font-extrabold text-center text-slate-800 leading-tight">
            {q.questionText}
          </h3>

          {q.type === 'multiple-choice' ? (
            <div className="w-full space-y-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 flex justify-center border border-slate-50">
                <AnalogClock size={200} hours={q.targetHours} minutes={q.targetMinutes} seconds={0} showLabels={false} hideSeconds />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {q.options!.map(opt => {
                  let styles = "bg-white border-slate-200 text-slate-700 hover:border-primary hover:bg-primary/5";
                  if (answered) {
                    if (opt === q.correctAnswer) styles = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200";
                    else if (opt === selectedAnswer) styles = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200";
                    else styles = "bg-slate-50 border-slate-100 text-slate-300 opacity-50";
                  }
                  return (
                    <button key={opt} onClick={() => handleMCAnswer(opt)} disabled={answered}
                      className={`${styles} border-2 rounded-2xl py-4 text-lg font-black transition-all transform active:scale-95`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
                <AnalogClock size={240} interactive={!answered} hours={dragHours} minutes={dragMinutes} seconds={0}
                  onTimeChange={handleDragTimeChange} showLabels={false} hideSeconds />
              </div>
              
              {!answered ? (
                <button onClick={handleDragSubmit}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 uppercase tracking-widest transform active:scale-95">
                  Kunci Jawaban 🔒
                </button>
              ) : (
                <div className={`w-full p-4 rounded-2xl text-center font-black ${selectedAnswer === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedAnswer === 'correct' ? '✨ LUAR BIASA! BENAR!' : `⚠️ KURANG TEPAT! (${formatTime(q.targetHours, q.targetMinutes)})`}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <motion.button 
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
          onClick={nextQuestion}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest"
        >
          {currentIdx + 1 < questions.length ? 'Soal Selanjutnya' : 'Lihat Skor Akhir'}
          <ArrowRight size={20} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default QuizSystem;
