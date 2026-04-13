import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

const MathChallenge: React.FC = () => {
  const [score, setScore] = useState(0);
  const [num1, setNum1] = useState(Math.floor(Math.random() * 50) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 50) + 1);
  const [op, setOp] = useState<'+' | '-'>(Math.random() > 0.5 ? '+' : '-');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const correctAnswer = op === '+' ? num1 + num2 : num1 - num2;

  const generateNew = () => {
    const n1 = Math.floor(Math.random() * 50) + 1;
    const n2 = Math.floor(Math.random() * 50) + 1;
    const newOp: '+' | '-' = Math.random() > 0.5 ? '+' : '-';
    setNum1(newOp === '-' ? Math.max(n1, n2) : n1);
    setNum2(newOp === '-' ? Math.min(n1, n2) : n2);
    setOp(newOp);
    setAnswer('');
    setFeedback('');
  };

  const checkAnswer = () => {
    if (parseInt(answer) === correctAnswer) {
      setScore(s => s + 1);
      setFeedback('🎉 Benar!');
      setTimeout(generateNew, 800);
    } else {
      setFeedback(`❌ Salah! Jawaban: ${correctAnswer}`);
      setTimeout(generateNew, 1500);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg text-center space-y-4">
      <h3 className="text-xl font-bold text-primary">⚡ Math Challenge</h3>
      <p className="text-sm text-muted-foreground">Skor: {score}</p>
      <p className="text-4xl font-bold text-foreground">{num1} {op} {num2} = ?</p>
      <input type="number" value={answer} onChange={e => setAnswer(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && checkAnswer()}
        className="w-32 text-center text-2xl border-2 border-border rounded-xl p-2 bg-background text-foreground"
        placeholder="?" />
      <div>
        <button onClick={checkAnswer} className="bg-accent text-accent-foreground px-6 py-2 rounded-xl font-semibold">Jawab</button>
      </div>
      {feedback && <p className="text-lg font-bold">{feedback}</p>}
    </div>
  );
};

const LearningHub: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  if (activeSubject) {
    const content = subjectContent[activeSubject];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto space-y-6">
        <button onClick={() => setActiveSubject(null)} className="text-muted-foreground hover:text-foreground">← Kembali ke Hub</button>
        <h2 className="text-2xl font-bold text-primary">{content.title}</h2>
        <div className="space-y-3">
          {content.topics.map((topic, i) => (
            <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 shadow-sm border border-border">
              <p className="font-semibold text-foreground">📌 {topic}</p>
            </motion.div>
          ))}
        </div>
        {activeSubject === 'mtk' && <MathChallenge />}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-primary text-center">📚 Learning Hub</h2>
      <div className="grid grid-cols-2 gap-4">
        {subjects.map((s, i) => (
          <motion.button key={s.id} onClick={() => setActiveSubject(s.id)}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 text-center shadow-lg`}>
            <span className="text-4xl">{s.emoji}</span>
            <p className="text-lg font-bold mt-2" style={{ color: 'white' }}>{s.name}</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{s.desc}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default LearningHub;
