import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playCorrectSound, playWrongSound } from '@/lib/soundUtils';

const subjects = [
  { id: 'ipa', name: 'IPA', emoji: '🔬', color: 'from-green-400 to-emerald-600', desc: 'Ilmu Pengetahuan Alam' },
  { id: 'mtk', name: 'MTK', emoji: '🔢', color: 'from-blue-400 to-indigo-600', desc: 'Matematika' },
  { id: 'bindo', name: 'B. INDO', emoji: '📖', color: 'from-orange-400 to-red-500', desc: 'Bahasa Indonesia' },
  { id: 'ips', name: 'IPS', emoji: '🌍', color: 'from-purple-400 to-pink-500', desc: 'Ilmu Pengetahuan Sosial' },
];

const subjectContent: Record<string, { title: string; topics: string[] }> = {
  ipa: { title: 'IPA - Ilmu Pengetahuan Alam', topics: ['Sifat Cahaya & Bayangan', 'Makhluk Hidup & Lingkungan', 'Energi & Perubahannya', 'Gaya & Gerak', 'Daur Air'] },
  mtk: { title: 'MTK - Matematika', topics: ['Bilangan Bulat', 'Pecahan', 'Bangun Datar & Ruang', 'Pengukuran Waktu', 'Statistika Dasar'] },
  bindo: { title: 'Bahasa Indonesia', topics: ['Membaca Pemahaman', 'Menulis Cerita', 'Puisi & Pantun', 'Tata Bahasa', 'Kalimat Efektif'] },
  ips: { title: 'IPS - Ilmu Pengetahuan Sosial', topics: ['Keragaman Budaya', 'Peta & Globe', 'Sejarah Indonesia', 'Kegiatan Ekonomi', 'Lembaga Pemerintahan'] },
};

const MathChallenge: React.FC<{ onFinish: (correct: number, total: number) => void }> = ({ onFinish }) => {
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [count, setCount] = useState(1);
  const maxQuestions = 10;
  const [num1, setNum1] = useState(Math.floor(Math.random() * 20) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 20) + 1);
  const [op, setOp] = useState<'+' | '-'>(Math.random() > 0.5 ? '+' : '-');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const correctAnswer = op === '+' ? num1 + num2 : num1 - num2;

  const generateNew = () => {
    if (count >= maxQuestions) {
      onFinish(score, maxQuestions);
      return;
    }
    const n1 = Math.floor(Math.random() * 20) + 1;
    const n2 = Math.floor(Math.random() * 20) + 1;
    const newOp: '+' | '-' = Math.random() > 0.5 ? '+' : '-';
    setNum1(newOp === '-' ? Math.max(n1, n2) : n1);
    setNum2(newOp === '-' ? Math.min(n1, n2) : n2);
    setOp(newOp);
    setAnswer('');
    setFeedback('');
    setCount(c => c + 1);
  };

  const checkAnswer = () => {
    if (parseInt(answer) === correctAnswer) {
      setScore(s => s + 1);
      setFeedback('🎉 Benar!');
      playCorrectSound();
      setTimeout(generateNew, 800);
    } else {
      setWrong(w => w + 1);
      setFeedback(`❌ Salah! Jawaban: ${correctAnswer}`);
      playWrongSound();
      setTimeout(generateNew, 1500);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg text-center space-y-4 border-2 border-primary/20">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
        <span>Soal: {count} / {maxQuestions}</span>
        <span>Skor: {score}</span>
      </div>
      <h3 className="text-xl font-bold text-primary">⚡ Math Challenge</h3>
      <p className="text-4xl font-black text-foreground">{num1} {op} {num2} = ?</p>
      <input type="number" value={answer} onChange={e => setAnswer(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && checkAnswer()}
        className="w-32 text-center text-2xl border-2 border-primary rounded-xl p-2 bg-background"
        placeholder="?" autoFocus />
      <div>
        <button onClick={checkAnswer} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition">JAWAB</button>
      </div>
      {feedback && <motion.p initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-lg font-bold">{feedback}</motion.p>}
    </div>
  );
};

const LearningHub: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [showFinished, setShowFinished] = useState(false);
  const [lastResult, setLastResult] = useState({ correct: 0, total: 0 });

  const handleFinish = (correct: number, total: number) => {
    const scorePercentage = Math.round((correct / total) * 100);
    const newResult = {
      date: new Date().toISOString(),
      correct,
      wrong: total - correct,
      score: scorePercentage,
      subject: activeSubject?.toUpperCase()
    };

    // Simpan ke localStorage agar dibaca ProgressHistory.tsx
    const existing = JSON.parse(localStorage.getItem('quiz-results') || '[]');
    localStorage.setItem('quiz-results', JSON.stringify([...existing, newResult]));

    setLastResult({ correct, total });
    setShowFinished(true);
  };

  if (showFinished) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 py-10">
        <span className="text-7xl">🏆</span>
        <h2 className="text-3xl font-black text-primary">MANTAP, BANG!</h2>
        <p className="text-lg text-muted-foreground font-medium">Abang berhasil menjawab <span className="text-foreground font-bold">{lastResult.correct}</span> dari <span className="text-foreground font-bold">{lastResult.total}</span> soal.</p>
        <button onClick={() => { setShowFinished(false); setActiveSubject(null); }} 
          className="bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl">KEMBALI KE MENU</button>
      </motion.div>
    );
  }

  if (activeSubject) {
    const content = subjectContent[activeSubject];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto space-y-6">
        <button onClick={() => setActiveSubject(null)} className="text-muted-foreground hover:text-foreground font-bold">← KEMBALI</button>
        <h2 className="text-2xl font-black text-primary uppercase">{content.title}</h2>
        <div className="space-y-3">
          {content.topics.map((topic, i) => (
            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <p className="font-semibold text-foreground">📌 {topic}</p>
            </motion.div>
          ))}
        </div>
        {activeSubject === 'mtk' && <MathChallenge onFinish={handleFinish} />}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-black text-primary text-center uppercase tracking-widest">📚 Learning Hub</h2>
      <div className="grid grid-cols-2 gap-4">
        {subjects.map((s, i) => (
          <motion.button key={s.id} onClick={() => setActiveSubject(s.id)}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-br ${s.color} rounded-3xl p-6 text-center shadow-lg border-b-4 border-black/20`}>
            <span className="text-4xl">{s.emoji}</span>
            <p className="text-lg font-black mt-2 text-white uppercase">{s.name}</p>
            <p className="text-[10px] mt-1 text-white/80 font-bold leading-tight">{s.desc}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default LearningHub;
