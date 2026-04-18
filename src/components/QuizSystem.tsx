import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalogClock from './AnalogClock';
import { generateQuizQuestions, QuizQuestion, saveQuizResult } from '@/lib/quizUtils';
import { formatTime } from '@/lib/clockUtils';
import { playCorrectSound, playWrongSound, playStartSound } from '@/lib/soundUtils';
import { Trophy, ArrowRight, RotateCcw, Home, AlertCircle } from 'lucide-react';

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

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      // --- LOGIKA SIMPAN YANG DIPERKETAT ---
      const savedName = localStorage.getItem('user-name') || 'Pelajar';
      const finalCorrect = correct; // Gunakan variabel lokal agar lebih akurat
      const finalScore = Math.round((finalCorrect / questions.length) * 100);
      
      const resultData = { 
        date: new Date().toISOString(), 
        correct: finalCorrect, 
        wrong: questions.length - finalCorrect, 
        total: questions.length, 
        score: finalScore,
        playerName: savedName
      };

      // Simpan ke localStorage secara manual untuk memastikan
      try {
        const existingResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
        existingResults.push(resultData);
        localStorage.setItem('quiz-results', JSON.stringify(existingResults));
        console.log("Data berhasil disimpan ke history");
      } catch (e) {
        console.error("Gagal menyimpan ke history", e);
      }
      
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setDragHours(12);
      setDragMinutes(0);
    }
  };

  if (!started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 py-12 px-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-2">
          <Trophy size={40} className="text-primary" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 italic uppercase leading-tight">Siap Raih Skor Tertinggi?</h2>
        <p className="text-sm text-muted-foreground font-medium max-w-[250px]">Namamu akan tercatat di dashboard setiap kali kamu menyelesaikan kuis.</p>
        <button onClick={startQuiz} className="w-full max-w-xs bg-primary text-white py-4 rounded-2xl text-lg font-black shadow-lg shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest">
          Mulai Kuis 🚀
        </button>
        <button onClick={onBack} className="text-slate-400 font-bold text-sm">← Kembali</button>
      </motion.div>
    );
  }

  if (finished) {
    const score = Math.round((correct / questions.length) * 100);
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6 py-12 px-6">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 border-slate-50 text-center space-y-6 w-full max-w-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          <h2 className="text-2xl font-black text-slate-800 uppercase italic">Kuis Selesai!</h2>
          <div className="text-7xl font-black text-primary my-4">{score}%</div>
          <div className="flex justify-center gap-4">
            <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100">
              <span className="block text-xl font-black text-green-600">{correct}</span>
              <span className="text-[10px] font-bold text-green-700/50 uppercase">Benar</span>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
              <span className="block text-xl font-black text-red-500">{wrong}</span>
              <span className="text-[10px] font-bold text-red-600/50 uppercase">Salah</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 py-2 rounded-xl border border-blue-100">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-blue-800">Tersimpan di Riwayat</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => window.location.reload()} className="bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <RotateCcw size={18} /> Ulangi Kuis
          </button>
          <button onClick={onBack} className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <Home size={18} /> Dashboard Utama
          </button>
        </div>
      </motion.div>
    );
  }

  if (!q) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 pb-10">
      <div className="w-full space-y-3">
        <div className="flex justify-between items-end px-1">
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
            Soal {currentIdx + 1} / {questions.length}
          </span>
          <div className="flex gap-3">
             <span className="text-xs font-bold text-green-600">✅ {correct}</span>
             <span className="text-xs font-bold text-red-500">❌ {wrong}</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-50">
          <motion.div animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} className="bg-primary h-full rounded-full" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} className="w-full flex flex-col items-center gap-6">
          <h3 className="text-xl font-extrabold text-center text-slate-800 px-2">{q.questionText}</h3>

          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-50 flex justify-center w-full">
            <AnalogClock size={220} interactive={!answered && q.type === 'drag'} hours={q.type === 'drag' ? dragHours : q.targetHours} minutes={q.type === 'drag' ? dragMinutes : q.targetMinutes} seconds={0} showLabels={false} hideSeconds />
          </div>

          {q.type === 'multiple-choice' ? (
            <div className="grid grid-cols-2 gap-3 w-full">
              {q.options!.map(opt => {
                let styles = "bg-white border-slate-200 text-slate-700";
                if (answered) {
                  if (opt === q.correctAnswer) styles = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200 scale-105 z-10";
                  else if (opt === selectedAnswer) styles = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200 opacity-80";
                  else styles = "bg-slate-50 border-slate-100 text-slate-300 opacity-40";
                }
                return (
                  <button key={opt} onClick={() => handleMCAnswer(opt)} disabled={answered} className={`${styles} border-2 rounded-2xl py-4 text-lg font-black transition-all active:scale-95`}>
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="w-full space-y-4">
              {!answered ? (
                <button onClick={handleDragSubmit} className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 uppercase tracking-widest active:scale-95 transition-all">
                  Kunci Jawaban 🔒
                </button>
              ) : (
                <div className={`w-full py-4 rounded-2xl text-center font-black ${selectedAnswer === 'correct' ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-red-100 text-red-700 border-2 border-red-200'}`}>
                  {selectedAnswer === 'correct' ? '✨ BENAR SEKALI!' : `❌ JAWABAN: ${formatTime(q.targetHours, q.targetMinutes)}`}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={nextQuestion} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all uppercase tracking-widest text-sm">
          {currentIdx + 1 < questions.length ? 'Lanjut Soal' : 'Lihat Hasil'} <ArrowRight size={18} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default QuizSystem;
