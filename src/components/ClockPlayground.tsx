import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Eye, EyeOff, Zap } from 'lucide-react';

interface ClockPlaygroundProps {
  onStartQuiz: () => void;
}

const ClockPlayground: React.FC<ClockPlaygroundProps> = ({ onStartQuiz }) => {
  const [time, setTime] = useState(new Date());
  const [showDigital, setShowDigital] = useState(true);
  const [isRealTime, setIsRealTime] = useState(true);

  // Update waktu setiap detik jika mode "Waktu Nyata" aktif
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

  // Kalkulasi rotasi jarum
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minDeg = minutes * 6;
  const secDeg = seconds * 6;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Container Jam Analog */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center border-8 border-white">
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
          {/* Lingkaran Luar */}
          <circle cx="100" cy="100" r="95" fill="none" stroke="#F1F5F9" strokeWidth="2" />
          
          {/* Titik-titik Menit */}
          {[...Array(60)].map((_, i) => (
            <line
              key={i}
              x1="100" y1="10" x2="100" y2={i % 5 === 0 ? "18" : "14"}
              transform={`rotate(${i * 6} 100 100)`}
              stroke={i % 5 === 0 ? "#9D64FA" : "#CBD5E1"}
              strokeWidth={i % 5 === 0 ? "2" : "1"}
            />
          ))}

          {/* Angka Jam */}
          {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x = 100 + 72 * Math.sin(angle);
            const y = 100 - 72 * Math.cos(angle);
            return (
              <text key={num} x={x} y={y} textAnchor="middle" dominantBaseline="middle" 
                className="fill-purple-700 font-black text-sm sm:text-base">
                {num}
              </text>
            );
          })}

          {/* JARUM JAM */}
          <motion.line x1="100" y1="100" x2="100" y2="55" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round"
            animate={{ rotate: hourDeg }} transition={{ type: 'spring', stiffness: 50 }} style={{ originX: '100px', originY: '100px' }} />
          
          {/* JARUM MENIT */}
          <motion.line x1="100" y1="100" x2="100" y2="35" stroke="#64748B" strokeWidth="4" strokeLinecap="round"
            animate={{ rotate: minDeg }} transition={{ type: 'spring', stiffness: 50 }} style={{ originX: '100px', originY: '100px' }} />
          
          {/* JARUM DETIK */}
          <motion.line x1="100" y1="100" x2="100" y2="25" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"
            animate={{ rotate: secDeg }} style={{ originX: '100px', originY: '100px' }} />

          {/* Titik Tengah */}
          <circle cx="100" cy="100" r="4" fill="#F59E0B" />
        </svg>

        {/* Floating Digital Clock */}
        {showDigital && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="absolute -bottom-4 bg-purple-500 text-white px-8 py-3 rounded-2xl shadow-xl font-black text-2xl tracking-widest border-4 border-white"
          >
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </motion.div>
        )}
      </div>

      {/* Grid Tombol Kontrol */}
      <div className="grid grid-cols-2 gap-4 w-full px-4">
        <button 
          onClick={generateRandomTime}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95"
        >
          🎲 Waktu Acak
        </button>
        
        <button 
          onClick={() => setShowDigital(!showDigital)}
          className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg active:scale-95"
        >
          {showDigital ? "🙈 Sembunyikan Jam Digital" : "👀 Tampilkan Jam Digital"}
        </button>

        <button 
          onClick={setNow}
          className="col-span-2 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95"
        >
          ⌚ Waktu Nyata
        </button>
      </div>

      {/* Tombol Selanjutnya */}
      <button 
        onClick={onStartQuiz}
        className="w-[90%] bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-[0_10px_30px_rgba(157,100,250,0.3)] flex items-center justify-center gap-3 group transition-all"
      >
        Selanjutnya <Zap size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default ClockPlayground;
