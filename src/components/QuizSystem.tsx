import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalogClock from './AnalogClock';
import { generateQuizQuestions, QuizQuestion, saveQuizResult } from '@/lib/quizUtils';
import { formatTime, getTimeFromAngles, getAngleFromTime } from '@/lib/clockUtils';
import { playCorrectSound, playWrongSound, playStartSound } from '@/lib/soundUtils';

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

  const handleDragTimeChange = useCallback((h: number, m: number) => {
    setDragHours(h);
    setDragMinutes(m);
  }, []);

  const nextQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      const result = { date: new Date().toISOString(), correct, wrong: wrong, total: questions.length, score: Math.round((correct / questions.length) * 100) };
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

  if (!started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 py-12">
        <h2 className="text-3xl font-bold text-primary">🎯 Waktunya Kuis!</h2>
        <p className="text-muted-foreground text-center max-w-md">20 pertanyaan acak tentang membaca dan mengatur jam. Siap?</p>
        <button onClick={startQuiz} className="bg-accent text-accent-foreground px-8 py-3 rounded-2xl text-xl font-bold shadow-lg hover:scale-105 transition-transform">
          Mulai Kuis! 🚀
        </button>
        <button onClick={onBack} className="text-muted-foreground underline">← Kembali</button>
      </motion.div>
    );
  }

  if (finished) {
    const score = Math.round((correct / questions.length) * 100);
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-6 py-12">
        <h2 className="text-3xl font-bold text-primary">🎉 Quiz Selesai!</h2>
        <div className="bg-card rounded-2xl p-8 shadow-xl text-center space-y-4">
          <div className="text-6xl font-bold text-primary">{score}%</div>
          <div className="flex gap-8 justify-center">
            <div><span className="text-2xl font-bold text-quiz-correct">{correct}</span><p className="text-sm text-muted-foreground">Benar ✅</p></div>
            <div><span className="text-2xl font-bold text-quiz-wrong">{wrong}</span><p className="text-sm text-muted-foreground">Salah ❌</p></div>
          </div>
          <p className="text-muted-foreground">Total: {questions.length} soal</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setQuestions(generateQuizQuestions(20)); setCurrentIdx(0); setCorrect(0); setWrong(0); setAnswered(false); setSelectedAnswer(null); setFinished(false); }}
            className="bg-accent text-accent-foreground px-6 py-2.5 rounded-xl font-semibold shadow-md">
            🔄 Ulangi Quiz
          </button>
          <button onClick={onBack} className="bg-muted text-foreground px-6 py-2.5 rounded-xl font-semibold shadow-md">← Kembali</button>
        </div>
      </motion.div>
    );
  }

  if (!q) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-3">
        <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>
      <div className="flex justify-between w-full text-sm text-muted-foreground">
        <span>Soal {currentIdx + 1}/{questions.length}</span>
        <span>✅ {correct} | ❌ {wrong}</span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
          className="w-full flex flex-col items-center gap-4">
          <h3 className="text-lg font-bold text-center text-foreground">{q.questionText}</h3>

          {q.type === 'multiple-choice' ? (
            <>
              <div className="bg-card rounded-2xl p-4 shadow-lg">
                <AnalogClock size={200} hours={q.targetHours} minutes={q.targetMinutes} seconds={0} showLabels={false} hideSeconds />
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {q.options!.map(opt => {
                  let bg = 'bg-card hover:bg-muted';
                  if (answered) {
                    if (opt === q.correctAnswer) bg = 'bg-quiz-correct/20 border-quiz-correct';
                    else if (opt === selectedAnswer) bg = 'bg-quiz-wrong/20 border-quiz-wrong';
                  }
                  return (
                    <button key={opt} onClick={() => handleMCAnswer(opt)}
                      className={`${bg} border-2 rounded-xl p-3 text-lg font-bold transition shadow-sm`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="bg-card rounded-2xl p-4 shadow-lg">
                <AnalogClock size={220} interactive={!answered} hours={dragHours} minutes={dragMinutes} seconds={0}
                  onTimeChange={handleDragTimeChange} showLabels hideSeconds />
              </div>
              <p className="text-sm text-muted-foreground">Seret jarum jam untuk mengatur waktu</p>
              {!answered && (
                <button onClick={handleDragSubmit}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold shadow-md">
                  ✅ Submit Jawaban
                </button>
              )}
              {answered && (
                <p className={`font-bold text-lg ${selectedAnswer === 'correct' ? 'text-quiz-correct' : 'text-quiz-wrong'}`}>
                  {selectedAnswer === 'correct' ? '🎉 Benar!' : `❌ Salah! Jawaban: ${formatTime(q.targetHours, q.targetMinutes)}`}
                </p>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {answered && (
        <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={nextQuestion}
          className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-xl font-semibold shadow-md">
          {currentIdx + 1 < questions.length ? 'Soal Berikutnya →' : 'Lihat Hasil 🏆'}
        </motion.button>
      )}
    </motion.div>
  );
};

export default QuizSystem;
