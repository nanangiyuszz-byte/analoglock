import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalogClock from './AnalogClock';
import { generateQuizQuestions, QuizQuestion, saveQuizResult } from '@/lib/quizUtils';
import { formatTime } from '@/lib/clockUtils';
import { playCorrectSound, playWrongSound, playStartSound } from '@/lib/soundUtils';
import { Trophy, ArrowRight, RotateCcw, Home, Puzzle } from 'lucide-react';
import ClockPuzzle from './ClockPuzzle';

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
  const [mode, setMode] = useState<'quiz' | 'puzzle'>('quiz');

  // Load 10 soal saja sesuai permintaan
  useEffect(() => {
    setQuestions(generateQuizQuestions(10));
  }, []);

  const q = questions[currentIdx];

  const handleAnswer = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === q.correctAnswer) {
      setCorrect((prev) => prev + 1);
      playCorrectSound();
    } else {
      setWrong((prev) => prev + 1);
      playWrongSound();
    }
  };

  const handleDragSubmit = () => {
    if (answered) return;
    const isCorrect = dragHours === q.targetHours && dragMinutes === q.targetMinutes;
    setSelectedAnswer(isCorrect ? 'correct' : 'wrong');
    setAnswered(true);

    if (isCorrect) {
      setCorrect((prev) => prev + 1);
      playCorrectSound();
    } else {
      setWrong((prev) => prev + 1);
      playWrongSound();
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setDragHours(12);
      setDragMinutes(0);
    } else {
      setFinished(true);
      saveQuizResult({
        date: new Date().toLocaleDateString(),
        correct,
        wrong,
        total: questions.length,
        score: Math.round((correct / questions.length) * 100),
      });
    }
  };

  const restart = () => {
    setQuestions(generateQuizQuestions(10));
    setCurrentIdx(0);
    setCorrect(0);
    setWrong(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setFinished(false);
    setStarted(true);
  };

  if (mode === 'puzzle') {
    return (
      <div className="space-y-6">
        <button onClick={() => setMode('quiz')} className="flex items-center gap-2 text-primary font-bold">
          <ArrowRight className="rotate-180" /> Kembali ke Kuis
        </button>
        <ClockPuzzle />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Siap Bermain?</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Selesaikan 10 Tantangan Waktu</p>
        </div>
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={() => { setStarted(true); playStartSound(); }}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-[0_4px_0_rgb(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all uppercase"
          >
            Mulai Kuis 🚀
          </button>
          <button 
            onClick={() => setMode('puzzle')}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-[0_4px_0_rgb(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all uppercase flex items-center justify-center gap-2"
          >
            <Puzzle size={20} /> Mode Puzzle
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center space-y-6 py-8">
        <Trophy className="w-20 h-20 text-yellow-500 animate-bounce" />
        <h2 className="text-3xl font-black uppercase italic">Kuis Selesai!</h2>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-green-100 p-4 rounded-2xl text-center">
            <p className="text-xs font-bold text-green-600 uppercase">Benar</p>
            <p className="text-3xl font-black text-green-700">{correct}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-2xl text-center">
            <p className="text-xs font-bold text-red-600 uppercase">Salah</p>
            <p className="text-3xl font-black text-red-700">{wrong}</p>
          </div>
        </div>
        <div className="flex flex-col w-full gap-3 mt-4">
          <button onClick={restart} className="w-full bg-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"><RotateCcw size={20}/> Main Lagi</button>
          <button onClick={onBack} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2"><Home size={20}/> Menu Utama</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: questions.length }).map((_, i) => (
            <div key={i} className={`h-2 w-6 rounded-full ${i <= currentIdx ? 'bg-primary' : 'bg-slate-200'}`} />
          ))}
        </div>
        <span className="font-black text-primary">{currentIdx + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-slate-100 flex flex-col items-center">
            <p className="text-center font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-4">{q.questionText}</p>
            <AnalogClock 
              size={220} 
              interactive={q.type === 'drag' && !answered} 
              hours={q.type === 'drag' ? dragHours : q.targetHours} 
              minutes={q.type === 'drag' ? dragMinutes : q.targetMinutes} 
              onTimeChange={(h, m) => { setDragHours(h); setDragMinutes(m); }} 
            />
          </div>

          {q.type === 'multiple-choice' ? (
            <div className="grid grid-cols-2 gap-3">
              {q.options?.map((opt, i) => (
                <button
                  key={i}
                  disabled={answered}
                  onClick={() => handleAnswer(opt)}
                  className={`py-4 rounded-2xl font-black text-xl border-b-4 transition-all ${
                    answered && opt === q.correctAnswer ? 'bg-green-500 border-green-700 text-white translate-y-1 border-b-0' : 
                    answered && opt === selectedAnswer ? 'bg-red-500 border-red-700 text-white translate-y-1 border-b-0' : 
                    'bg-white border-slate-200 text-slate-700 active:translate-y-1 active:border-b-0'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : q.type === 'true-false' ? (
            <div className="grid grid-cols-2 gap-4">
              {['Benar', 'Salah'].map((opt) => (
                <button
                  key={opt}
                  disabled={answered}
                  onClick={() => handleAnswer(opt)}
                  className={`py-6 rounded-2xl font-black text-2xl border-b-4 transition-all ${
                    answered && opt === q.correctAnswer ? 'bg-green-500 border-green-700 text-white' : 
                    answered && opt === selectedAnswer ? 'bg-red-500 border-red-700 text-white' : 
                    opt === 'Benar' ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-rose-100 border-rose-300 text-rose-700'
                  }`}
                >
                  {opt === 'Benar' ? '✅ BENAR' : '❌ SALAH'}
                </button>
              ))}
            </div>
          ) : (
            <div className="w-full">
              {!answered ? (
                <button onClick={handleDragSubmit} className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg uppercase tracking-widest active:scale-95 transition-all">
                  Kunci Jawaban 🔒
                </button>
              ) : (
                <div className={`w-full py-4 rounded-2xl text-center font-black ${selectedAnswer === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedAnswer === 'correct' ? '🎉 BENAR!' : `❌ JAWABAN: ${formatTime(q.targetHours, q.targetMinutes)}`}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <button onClick={nextQuestion} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl uppercase tracking-widest text-sm">
          {currentIdx === questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya'} <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
};

export default QuizSystem;
