import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalogClock from './AnalogClock';
import { generateQuizQuestions, QuizQuestion } from '@/lib/quizUtils';
import { formatTime } from '@/lib/clockUtils';
import { playCorrectSound, playWrongSound, playStartSound } from '@/lib/soundUtils';
import { Trophy, ArrowRight, RotateCcw, Home, Save, CheckCircle } from 'lucide-react';

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
  const [isManualSaved, setIsManualSaved] = useState(false);

  useEffect(() => {
    // Memanggil 10 Soal Sesuai Permintaan
    setQuestions(generateQuizQuestions(10));
  }, []);

  const q = questions[currentIdx];

  const forceSaveToHistory = () => {
    const savedName = localStorage.getItem('user-name') || 'Pelajar';
    const result = { 
      date: new Date().toISOString(), 
      correct: correct, 
      wrong: wrong, 
      total: questions.length, 
      score: Math.round((correct / questions.length) * 100),
      playerName: savedName
    };

    try {
      const history = JSON.parse(localStorage.getItem('quiz-results') || '[]');
      history.push(result);
      localStorage.setItem('quiz-results', JSON.stringify(history));
      setIsManualSaved(true);
      console.log("Data berhasil dipaksa simpan!");
    } catch (err) {
      console.error("Gagal simpan manual:", err);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      forceSaveToHistory(); 
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setDragHours(12);
      setDragMinutes(0);
    }
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
    // Toleransi agar drag tidak terlalu menyiksa
    if ((hDiff === 0 || hDiff === 12 || (dragHours === 12 && q.targetHours === 0) || (dragHours === 0 && q.targetHours === 12)) && mDiff <= 2) {
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

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 px-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-2">
          <Trophy size={40} className="text-primary" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 uppercase italic">Kuis Siap Dimulai</h2>
        <button 
          onClick={() => { playStartSound(); setStarted(true); }} 
          className="w-full max-w-xs bg-primary text-white py-4 rounded-2xl text-lg font-black shadow-lg uppercase tracking-widest active:scale-95 transition-all"
        >
          Mulai Sekarang 🚀
        </button>
      </div>
    );
  }

  if (finished) {
    const score = Math.round((correct / questions.length) * 100);
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6 py-12 px-6">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-2 border-slate-50 text-center space-y-6 w-full max-w-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          <h2 className="text-2xl font-black text-slate-800 uppercase italic">Hasil Akhir</h2>
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

          <div className="pt-4">
            {!isManualSaved ? (
              <button 
                onClick={forceSaveToHistory}
                className="flex items-center justify-center gap-2 w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-orange-600 transition-all animate-pulse"
              >
                <Save size={18} /> KLIK UNTUK SIMPAN DATA
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 rounded-xl border border-green-100 font-bold">
                <CheckCircle size={18} /> RIWAYAT BERHASIL DISIMPAN
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onClick={() => window.location.reload()} className="bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <RotateCcw size={18} /> Main Lagi
          </button>
          <button onClick={onBack} className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <Home size={18} /> Ke Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 pb-10">
      <div className="w-full space-y-3">
        <div className="flex justify-between items-end">
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
            Soal {currentIdx + 1} / {questions.length}
          </span>
          <div className="flex gap-3">
             <span className="text-xs font-bold text-green-600">✅ {correct}</span>
             <span className="text-xs font-bold text-red-500">❌ {wrong}</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <motion.div animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} className="bg-primary h-full rounded-full" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q?.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="w-full flex flex-col items-center gap-6">
          
          {/* Teks Pertanyaan (Berubah warna khusus untuk mode Puzzle) */}
          <h3 className={`text-xl font-extrabold text-center ${q?.type === 'drag' ? 'text-blue-600' : 'text-slate-800'}`}>
            {q?.questionText}
          </h3>

          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-50 flex justify-center w-full relative">
            
            {/* Indikator Mode Puzzle */}
            {q?.type === 'drag' && !answered && (
              <div className="absolute top-4 right-4 animate-pulse">
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Putar Jarum 👆</span>
              </div>
            )}
            
            <AnalogClock 
              size={220} 
              interactive={!answered && q?.type === 'drag'} 
              hours={q?.type === 'drag' ? dragHours : q?.targetHours} 
              minutes={q?.type === 'drag' ? dragMinutes : q?.targetMinutes} 
              onTimeChange={handleDragTimeChange}
              hideSeconds 
            />
          </div>

          {/* Render Tombol Jawaban (Dipakai untuk Pilihan Ganda & Benar/Salah) */}
          {q?.type === 'multiple-choice' || q?.type === 'true-false' ? (
            <div className="grid grid-cols-2 gap-3 w-full">
              {q.options?.map(opt => (
                <button 
                  key={opt} 
                  disabled={answered} 
                  onClick={() => handleMCAnswer(opt)}
                  className={`py-4 rounded-2xl text-lg font-black transition-all border-2 ${
                    answered && opt === q.correctAnswer ? 'bg-green-500 border-green-500 text-white shadow-lg' : 
                    answered && opt === selectedAnswer ? 'bg-red-500 border-red-500 text-white' : 
                    'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            // Render Mode Drag / Puzzle
            <div className="w-full">
              {!answered ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-400 text-center font-bold animate-bounce">
                    Arahkan dengan benar lalu kunci! 🕒
                  </p>
                  <button onClick={handleDragSubmit} className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black shadow-lg uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all">
                    Kunci Jawaban 🔒
                  </button>
                </div>
              ) : (
                <div className={`w-
