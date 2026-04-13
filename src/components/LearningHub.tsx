import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const subjects = [
  { id: 'ipa', name: 'IPA', emoji: '🔬', color: 'from-green-400 to-emerald-600', desc: 'Ilmu Pengetahuan Alam' },
  { id: 'mtk', name: 'MTK', emoji: '🔢', color: 'from-blue-400 to-indigo-600', desc: 'Matematika' },
  { id: 'bindo', name: 'B. INDO', emoji: '📖', color: 'from-orange-400 to-red-500', desc: 'Bahasa Indonesia' },
  { id: 'ips', name: 'IPS', emoji: '🌍', color: 'from-purple-400 to-pink-500', desc: 'Ilmu Pengetahuan Sosial' },
];

const subjectContent: Record<string, { title: string; topics: string[] }> = {
  ipa: { title: 'IPA - Ilmu Pengetahuan Alam', topics: ['Sifat Cahaya', 'Makhluk Hidup', 'Energi', 'Gaya & Gerak'] },
  mtk: { title: 'MTK - Matematika', topics: ['Bilangan Bulat', 'Pecahan', 'Bangun Ruang', 'Pengukuran Waktu'] },
  bindo: { title: 'Bahasa Indonesia', topics: ['Membaca', 'Menulis Cerita', 'Puisi', 'Tata Bahasa'] },
  ips: { title: 'IPS - Ilmu Pengetahuan Sosial', topics: ['Peta & Globe', 'Sejarah Nasional', 'Kegiatan Ekonomi'] },
};

const LearningHub: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  if (activeSubject) {
    const content = subjectContent[activeSubject];
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <button onClick={() => setActiveSubject(null)} className="flex items-center gap-2 text-primary font-bold">
          <ArrowLeft size={20} /> Kembali
        </button>
        <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-100">
          <h2 className="text-2xl font-black text-purple-600 mb-4">{content.title}</h2>
          <div className="grid gap-3">
            {content.topics.map((topic, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-xl font-bold text-gray-700 shadow-sm border-l-4 border-blue-400">
                📌 {topic}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {subjects.map((s) => (
        <motion.button
          key={s.id}
          onClick={() => setActiveSubject(s.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-gradient-to-br ${s.color} rounded-3xl p-6 text-white shadow-lg text-center flex flex-col items-center gap-2`}
        >
          <span className="text-4xl">{s.emoji}</span>
          <span className="font-black text-lg tracking-tight">{s.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default LearningHub;
