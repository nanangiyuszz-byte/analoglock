import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ClockPuzzle = () => {
  const [placed, setPlaced] = useState<number[]>([]);
  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const handlePlace = (num: number) => {
    if (!placed.includes(num)) setPlaced([...placed, num]);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-black text-primary uppercase">🧩 Rakit Jam!</h2>
        <p className="text-sm font-bold text-gray-500">Klik angka untuk memasangnya ke jam</p>
      </div>

      <div className="relative w-64 h-64 border-4 border-dashed border-gray-300 rounded-full bg-white/50 flex items-center justify-center shadow-inner">
        {placed.length === 0 && <span className="text-gray-400 font-bold">Jam masih kosong...</span>}
        
        {placed.map((num) => {
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * 105;
          const y = Math.sin(angle) * 105;

          return (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={num} 
              className="absolute font-black text-xl w-8 h-8 flex items-center justify-center text-purple-600"
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              {num}
            </motion.div>
          );
        })}
        {/* Titik Tengah */}
        <div className="w-3 h-3 bg-slate-800 rounded-full absolute z-10" />
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-xs">
        {numbers.map((num) => (
          <button
            key={num}
            disabled={placed.includes(num)}
            onClick={() => handlePlace(num)}
            className={`w-14 h-14 text-xl font-black rounded-2xl border-b-4 transition-all ${
              placed.includes(num) ? 'bg-slate-100 border-slate-200 text-slate-300' : 'bg-white border-blue-200 text-blue-600 active:translate-y-1 active:border-b-0 shadow-sm'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {placed.length === 12 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
          <p className="text-xl font-black text-green-500 mb-3">HEBAT! Jam Selesai Dirakit! 🎉</p>
          <button onClick={() => setPlaced([])} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
            Bongkar & Main Lagi
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ClockPuzzle;
