import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import AnalogClock from './AnalogClock';
import { formatTime, generateRandomTime } from '@/lib/clockUtils';

const THEMES = [
  { name: 'White', class: 'theme-bg-white' },
  { name: 'Black', class: 'theme-bg-black' },
  { name: 'Blue', class: 'theme-bg-blue' },
  { name: 'Pink', class: 'theme-bg-pink' },
  { name: 'Purple', class: 'theme-bg-purple' },
];

interface ClockPlaygroundProps {
  onStartQuiz: () => void;
}

const ClockPlayground: React.FC<ClockPlaygroundProps> = ({ onStartQuiz }) => {
  const [isRealtime, setIsRealtime] = useState(true);
  const [manualHours, setManualHours] = useState(12);
  const [manualMinutes, setManualMinutes] = useState(0);
  const [showDigital, setShowDigital] = useState(true);
  const [theme, setTheme] = useState('theme-bg-white');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (isRealtime) {
      const i = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(i);
    }
  }, [isRealtime]);

  const handleRandomTime = () => {
    const { hours, minutes } = generateRandomTime();
    setManualHours(hours);
    setManualMinutes(minutes);
    setIsRealtime(false);
  };

  const handleTimeChange = useCallback((h: number, m: number) => {
    setManualHours(h);
    setManualMinutes(m);
    setIsRealtime(false);
  }, []);

  const displayH = isRealtime ? now.getHours() : manualHours;
  const displayM = isRealtime ? now.getMinutes() : manualMinutes;
  const displayS = isRealtime ? now.getSeconds() : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto pb-6"
    >
      <div className="text-center text-base font-bold text-foreground">
        Legenda: <span className="text-[hsl(0,80%,50%)]">🔴 Jam</span> | <span className="text-[hsl(216,100%,50%)]">🔵 Menit</span>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {THEMES.map(t => (
          <button key={t.name} onClick={() => setTheme(t.class)}
            className={`w-8 h-8 rounded-full border-2 ${t.class} ${theme === t.class ? 'border-primary ring-2 ring-primary' : 'border-border'}`}
            title={t.name} />
        ))}
      </div>

      <div className={`${theme} rounded-3xl p-4 sm:p-6 shadow-xl transition-colors duration-300 w-full flex justify-center`}>
        <AnalogClock
          size={280}
          interactive={!isRealtime}
          hours={displayH}
          minutes={displayM}
          seconds={displayS}
          onTimeChange={handleTimeChange}
          showLabels={false} 
        />
      </div>

      {showDigital && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary rounded-2xl px-10 py-3 shadow-lg"
        >
          <span className="text-primary-foreground text-4xl font-bold font-display tracking-wider">
            {formatTime(displayH, displayM)}
          </span>
        </motion.div>
      )}

      {/* Update teks tombol agar lebih deskriptif */}
      <div className="flex flex-col gap-3 justify-center w-full px-4">
        <div className="flex gap-3 justify-center w-full">
          <button onClick={handleRandomTime}
            className="flex-1 bg-accent text-accent-foreground px-4 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition text-sm">
            🎲 Waktu Acak
          </button>
          <button onClick={() => setShowDigital(!showDigital)}
            className="flex-1 bg-secondary text-secondary-foreground px-2 py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition text-sm text-center">
            {showDigital ? '🙈 Sembunyikan Jam Digital' : '👁 Tampilkan Jam Digital'}
          </button>
        </div>

        <button onClick={() => setIsRealtime(true)}
          className="w-full bg-muted text-foreground px-5 py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition text-sm">
          🕐 Waktu Nyata
        </button>
      </div>

      <button onClick={onStartQuiz}
        className="w-full max-w-xs bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition animate-pulse-glow mt-2">
        Selanjutnya ➡️
      </button>
    </motion.div>
  );
};

export default ClockPlayground;
