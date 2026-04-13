import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrectSound, playWrongSound } from '@/lib/soundUtils';

// Bank Soal untuk masing-masing Mapel
const quizData: Record<string, { question: string; options: string[]; answer: number }[]> = {
  ipa: [
    { question: "Alat pernapasan pada ikan adalah...", options: ["Paru-paru", "Insang", "Trakea", "Kulit"], answer: 1 },
    { question: "Planet terdekat dari matahari adalah...", options: ["Venus", "Mars", "Merkurius", "Bumi"], answer: 2 },
  ],
  mtk: [
    { question: "25 + 15 x 2 = ...", options: ["80", "55", "40", "65"], answer: 1 },
    { question: "Bangun datar yang memiliki 3 sisi adalah...", options: ["Persegi", "Segitiga", "Lingkaran", "Trapesium"], answer: 1 },
  ],
  bindo: [
    { question: "Antonim dari kata 'Besar' adalah...", options: ["Luas", "Tinggi", "Kecil", "Lebar"], answer: 2 },
    { question: "Ibu memasak di...", options: ["Kamar", "Halaman", "Dapur", "Ruang Tamu"], answer: 2 },
  ],
  ips: [
    { question: "Ibukota negara Indonesia saat ini adalah...", options: ["Bandung", "Surabaya", "Jakarta", "Medan"], answer: 2 },
    { question: "Candi Borobudur terletak di provinsi...", options: ["Jawa Barat", "Jawa Tengah", "Jawa Timur", "Bali"], answer: 1 },
  ]
};

const LearningHub: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const subjects = [
    { id: 'ipa', name: 'IPA', emoji: '🔬', color: 'from-green-400 to-emerald-600', desc: 'Ilmu Pengetahuan Alam' },
    { id: 'mtk', name: 'MTK', emoji: '🔢', color: 'from-blue-400 to-indigo-600', desc: 'Matematika' },
    { id: 'bindo', name: 'B. INDO', emoji: '📖', color: 'from-orange-400 to-red-500', desc: 'Bahasa Indonesia' },
    { id: 'ips', name: 'IPS', emoji: '🌍', color: 'from-purple-400 to-pink-500', desc: 'Ilmu Pengetahuan Sosial' },
  ];

  const handleNext = () => {
    if (activeSubject && selectedAnswer !== null) {
      // Cek jawaban
      if (selectedAnswer === quizData[activeSubject][currentStep].answer) {
        setScore(prev => prev + 1);
        playCorrectSound();
      } else {
        playWrongSound();
      }

      // Lanjut ke soal berikutnya atau selesai
      if (currentStep < quizData[activeSubject].length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }
  };

  const resetQuiz = () => {
    setActiveSubject(null);
    setCurrentStep(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  // 1. Tampilan Hasil Akhir
  if (showResult) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-8 bg-card rounded-3xl shadow-xl border-4 border-primary">
        <h2 className="text-3xl font-bold text-primary mb-4">Hasil Kuis 🎉</h2>
        <p className="text-xl mb-6">Kamu berhasil menjawab <span className="font-bold text-green-500">{score}</span> dari <span className="font-bold">{activeSubject ? quizData[activeSubject].length : 0}</span> soal!</p>
        <button onClick={resetQuiz} className="w-full bg-primary text-white py-3 rounded-2xl font-bold text-lg shadow-lg hover:brightness-110 transition">Kembali ke Menu</button>
      </motion.div>
    );
  }

  // 2. Tampilan Halaman Per-Soal (Model Quizizz)
  if (activeSubject) {
    const questions = quizData[activeSubject];
    const currentQuestion = questions[currentStep];
    const isLastQuestion = currentStep === questions.length - 1;

    return (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="flex justify-between items-center text-sm font-bold text-muted-foreground uppercase">
          <span>{activeSubject} Quiz</span>
          <span>Soal {currentStep + 1} / {questions.length}</span>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button key={idx} onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-semibold ${
                  selectedAnswer === idx ? 'border-primary bg-primary/10 text-primary' : 'border-slate-100 hover:border-slate-300 bg-slate-50'
                }`}>
                {String.fromCharCode(65 + idx)}. {option}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleNext} 
          disabled={selectedAnswer === null}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
            selectedAnswer !== null ? 'bg-primary text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}>
          {isLastQuestion ? 'SUBMIT' : 'SELANJUTNYA'}
        </button>
      </div>
    );
  }

  // 3. Tampilan Menu Utama Learning Hub
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-center gap-3 mb-2">
         <span className="text-3xl">📚</span>
         <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Learning Hub</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {subjects.map((s, i) => (
          <motion.button key={s.id} onClick={() => setActiveSubject(s.id)}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-br ${s.color} rounded-3xl p-6 text-center shadow-lg border-b-8 border-black/10`}>
            <span className="text-4xl block mb-2">{s.emoji}</span>
            <p className="text-lg font-black text-white">{s.name}</p>
            <p className="text-[10px] text-white/80 leading-tight mt-1">{s.desc}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default LearningHub;
