import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Eye, EyeOff, Zap, ArrowRight, Clock } from 'lucide-react';

interface ClockPlaygroundProps {
  onStartQuiz: () => void;
}

const ClockPlayground: React.FC<ClockPlaygroundProps> = ({ onStartQuiz }) => {
  const [time, setTime] = useState(new Date());
  const [showDigital, setShowDigital] = useState(true);
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    if (!isRealTime) return;
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isRealTime]);

  const generateRandomTime = () => {
    setIsRealTime(false);
    const randomHour = Math.floor(Math.random() * 12);
    const randomMinute = Math.floor(Math.random() * 60);
    const newTime = new Date();
    newTime.setHours(randomHour, randomMinute);
    setTime(newTime);
  };

  const setNow = () => {
    setIsRealTime(true);
    setTime(new Date());
  };

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minDeg = minutes * 6;
  const secDeg = seconds * 6;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto gap-6 px-2">
      {/* AREA JAM ANALOG PREMIUM */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] flex items-center justify-center border-[12px] border-white overflow-visible mt-4">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm overflow-visible">
          {/* Ring Kuning Luar (Seperti di screenshot) */}
          <circle cx="100" cy="100" r="92" fill="none" stroke="#F5BC1D" strokeWidth="6" />
          
          {/* Titik-titik Menit Hijau */}
          {[...Array(60)].map((_, i) => {
            const angle = (i * 6) * (Math.PI / 180);
            const r = 85;
            const x = 100 + r * Math.sin(angle);
            const y = 100 - r * Math.cos(angle);
            return (
              <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? "1.5" : "0.8"} 
                fill={i % 5 === 0 ? "#22C55E" : "#CBD5E1"} />
            );
          })}

          {/* Label Menit (0, 5, 10... 55) */}
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((min) => {
            const angle = (min * 6) * (Math.PI / 180);
            const x = 100 + 105 * Math.sin(angle);
            const y = 100 - 105 * Math.cos(angle);
            return (
              <text key={min} x={x} y={y} textAnchor="middle" dominantBaseline="middle" 
                className="fill-gray-600 font-bold text-[8px] sm:text-[10px]">
                {min}
              </text>
            );
          })}

          {/* Angka Jam Utama (Ungu) */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x = 100 + 70 * Math.sin(angle);
            const y = 100 - 70 * Math.cos(angle);
            return (
              <text key={num} x={x} y={y} textAnchor="middle" dominantBaseline="middle" 
                className="fill-[#9D64FA] font-black text-lg">
                {num}
              </text>
            );
          })}

          {/* JARUM JAM (Biru) */}
          <motion.line x1="100" y1="100" x2="100" y2="58" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round"
            animate={{ rotate: hourDeg }} transition={{ type: 'spring', stiffness: 60 }} style={{ originX: '100px', originY: '100px' }} />
          
          {/* JARUM MENIT (Abu-abu Gelap) */}
          <motion.line x1="100" y1="100" x2="100" y2="35" stroke="#475569" strokeWidth="4" strokeLinecap="round"
            animate={{ rotate: minDeg }} transition={{ type: 'spring', stiffness: 60 }} style={{ originX: '100px', originY: '100px' }} />
          
          {/* JARUM DETIK (Merah) */}
          <motion.line x1="100" y1="100" x2="100" y2="25" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"
            animate={{ rotate: secDeg }} style={{ originX: '100px', originY: '100px' }} />

          {/* Titik Tengah */}
          <circle cx="100" cy="100" r="5" fill="#F59E0B" />
        </svg>

        {/* JAM DIGITAL (Style Ungu Terang) */}
        {showDigital && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="absolute -bottom-8 bg-[#9D64FA] text-white px-10 py-3 rounded-2xl shadow-[0_10px_25px_rgba(157,100,250,0.4)] font-black text-3xl tracking-wider border-4 border-white"
          >
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')}
          </motion.div>
        )}
      </div>

      {/* TATA LETAK TOMBOL (Sesuai Screenshot 18:48) */}
      <div className="flex flex-col gap-3 w-full mt-10">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={generateRandomTime}
            className="flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-emerald-600 text-white py-4 rounded-xl font-bold uppercase tracking-tight text-[11px] transition-all shadow-md active:scale-95"
          >
            🎲 Waktu Acak
          </button>
          
          <button 
            onClick={() => setShowDigital(!showDigital)}
            className="flex items-center justify-center gap-2 bg-[#60A5FA] hover:bg-blue-500 text-white py-4 rounded-xl font-bold uppercase tracking-tight text-[11px] transition-all shadow-md active:scale-95 text-center px-2"
          >
            {showDigital ? "🙈 Sembunyikan Jam Digital" : "👀 Tampilkan Jam Digital"}
          </button>
        </div>

        <button 
          onClick={setNow}
          className="w-full flex items-center justify-center gap-2 bg-[#F1F5F9] hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all"
        >
          <Clock size={14} /> Waktu Nyata
        </button>

        <button 
          onClick={onStartQuiz}
          className="w-full bg-[#9D64FA] hover:bg-purple-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.15em] text-sm shadow-[0_10px_20px_rgba(157,100,250,0.3)] flex items-center justify-center gap-2 mt-2 transition-all group"
        >
          Selanjutnya <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Opsi Tambahan Bawah */}
      <div className="mt-4 opacity-70">
         <button className="text-[10px] font-bold text-red-500 uppercase tracking-tighter flex items-center gap-1">
           ↪ KELUAR / GANTI NAMA
         </button>
      </div>
    </div>
  );
};

export default ClockPlayground;
