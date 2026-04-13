import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Calculator, Globe, FlaskConical } from 'lucide-react';

const subjects = [
  { id: 'ipa', name: 'IPA', emoji: '🔬', icon: FlaskConical, color: 'from-green-400 to-emerald-600', desc: 'Sains & Alam' },
  { id: 'mtk', name: 'MTK', emoji: '🔢', icon: Calculator, color: 'from-blue-400 to-indigo-600', desc: 'Berhitung' },
  { id: 'bindo', name: 'B. INDO', emoji: '📖', icon: BookOpen, color: 'from-orange-400 to-red-500', desc: 'Literasi' },
  { id: 'ips', name: 'IPS', emoji: '🌍', icon: Globe, color: 'from-purple-400 to-pink-500', desc: 'Sosial & Dunia' },
];

const subjectContent: Record<string, { title: string; topics: string[] }> = {
  ipa: { title: 'Belajar IPA', topics: ['Sifat Cahaya', 'Makhluk Hidup', 'Energi & Listrik', 'Daur Air'] },
  mtk: { title: 'Belajar Matematika', topics: ['Bilangan Bulat', 'Pecahan', 'Bangun Ruang', 'Satuan Waktu'] },
  bindo: { title: 'Bahasa Indonesia', topics: ['Membaca Puisi', 'Menulis Cerita', 'Kalimat Efektif', 'Pantun'] },
  ips: { title: 'Belajar IPS', topics: ['Peta & Globe', 'Kegiatan Ekonomi', 'Sejarah Pahlawan', 'Budaya'] },
};

const LearningHub: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  if (activeSubject) {
    const content = subjectContent[activeSubject];
    return (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <button 
          onClick={() => setActiveSubject(null)} 
          className="flex items-center gap-2 text-purple-600 font-bold bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors"
        >
          <ArrowLeft size={20} /> Kembali ke Menu
        </button>
        <div className="bg-white rounded-[32px] p-8 shadow-xl border-4 border-purple-100">
          <h2 className="text-3xl font-black text-gray-800 mb-6">{content.title}</h2>
          <div className="grid gap-4">
            {content.topics.map((topic, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 p-5 rounded-2xl font-bold text-gray-700 shadow-sm border-l-8 border-purple-400 flex items-center gap-3"
              >
                <span className="text-xl">📌</span> {topic}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-gray-800">📚 Learning Hub</h2>
        <p className="text-gray-500 font-medium">Pilih materi yang ingin kamu pelajari hari ini!</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {subjects.map((s) => (
          <motion.button
            key={s.id}
            onClick={() => setActiveSubject(s.id)}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative overflow-hidden bg-gradient-to-br ${s.color} rounded-[32px] p-8 text-white shadow-xl flex flex-col items-center gap-3 group`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
              <s.icon size={80} />
            </div>
            <span className="text-5xl mb-2">{s.emoji}</span>
            <span className="font-black text-xl tracking-wide">{s.name}</span>
            <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full uppercase">{s.desc}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LearningHub;
