import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getAngleFromTime, getAngleFromPoint, getTimeFromAngles } from '@/lib/clockUtils';

interface AnalogClockProps {
  size?: number;
  interactive?: boolean;
  hours?: number;
  minutes?: number;
  seconds?: number;
  onTimeChange?: (hours: number, minutes: number) => void;
  showLabels?: boolean;
  hideSeconds?: boolean;
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  size = 400, // Ukuran default diperbesar sesuai permintaan klien
  interactive = false,
  hours: propHours,
  minutes: propMinutes,
  seconds: propSeconds,
  onTimeChange,
  showLabels = true,
  hideSeconds = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<'hour' | 'minute' | null>(null);
  const [hourAngle, setHourAngle] = useState(0);
  const [minuteAngle, setMinuteAngle] = useState(0);
  const [secondAngle, setSecondAngle] = useState(0);
  const [liveTime, setLiveTime] = useState(new Date());

  const isControlled = propHours !== undefined && propMinutes !== undefined;

  useEffect(() => {
    if (!isControlled && !interactive) {
      const interval = setInterval(() => setLiveTime(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [isControlled, interactive]);

  useEffect(() => {
    if (isControlled) {
      const angles = getAngleFromTime(propHours!, propMinutes!, propSeconds || 0);
      setHourAngle(angles.hour);
      setMinuteAngle(angles.minute);
      setSecondAngle(angles.second);
    } else if (!interactive) {
      const angles = getAngleFromTime(
        liveTime.getHours(),
        liveTime.getMinutes(),
        liveTime.getSeconds()
      );
      setHourAngle(angles.hour);
      setMinuteAngle(angles.minute);
      setSecondAngle(angles.second);
    }
  }, [liveTime, propHours, propMinutes, propSeconds, isControlled, interactive]);

  const handlePointerDown = (hand: 'hour' | 'minute') => (e: React.PointerEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    setDragging(hand);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !svgRef.current || !onTimeChange) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const angle = getAngleFromPoint(x, y);

    if (dragging === 'hour') {
      setHourAngle(angle);
    } else {
      setMinuteAngle(angle);
    }

    const { hours, minutes } = getTimeFromAngles(
      dragging === 'hour' ? angle : hourAngle,
      dragging === 'minute' ? angle : minuteAngle
    );
    
    onTimeChange(hours, minutes);
  }, [dragging, hourAngle, minuteAngle, size, onTimeChange]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const hourHandLen = size * 0.25;
  const minuteHandLen = size * 0.38;
  const secondHandLen = size * 0.42;

  const handEnd = (angle: number, length: number) => ({
    x: cx + length * Math.sin((angle * Math.PI) / 180),
    y: cy - length * Math.cos((angle * Math.PI) / 180),
  });

  const hEnd = handEnd(hourAngle, hourHandLen);
  const mEnd = handEnd(minuteAngle, minuteHandLen);
  const sEnd = handEnd(secondAngle, secondHandLen);

  return (
    <div className="relative flex items-center justify-center p-4 bg-white rounded-[40px] shadow-2xl border-8 border-purple-50">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="touch-none drop-shadow-xl"
      >
        {/* Plat Jam Outer */}
        <circle cx={cx} cy={cy} r={size / 2 - 5} fill="white" stroke="#9D64FA" strokeWidth="8" />
        
        {/* Plat Jam Inner */}
        <circle cx={cx} cy={cy} r={size / 2 - 20} fill="#FBF9FF" stroke="#E5D5FF" strokeWidth="2" strokeDasharray="4 4" />

        {/* Titik-titik Menit */}
        {[...Array(60)].map((_, i) => {
          const angle = i * 6;
          const isMajor = i % 5 === 0;
          const length = isMajor ? 12 : 6;
          const p1 = handEnd(angle, size / 2 - 25);
          const p2 = handEnd(angle, size / 2 - 25 - length);
          return (
            <line
              key={i}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke={isMajor ? "#9D64FA" : "#D1B3FF"}
              strokeWidth={isMajor ? 3 : 1.5}
            />
          );
        })}

        {/* Angka-angka Jam */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          const pos = handEnd(angle, size / 2 - 55);
          return (
            <text
              key={i}
              x={pos.x} y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-2xl font-black fill-purple-700 select-none"
              style={{ fontSize: size * 0.08 }}
            >
              {i + 1}
            </text>
          );
        })}

        {/* Bayangan Jarum (Biar Lebih Bagus) */}
        <line x1={cx} y1={cy} x2={hEnd.x + 2} y2={hEnd.y + 2} stroke="rgba(0,0,0,0.1)" strokeWidth={10} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={mEnd.x + 2} y2={mEnd.y + 2} stroke="rgba(0,0,0,0.1)" strokeWidth={7} strokeLinecap="round" />

        {/* Jarum Jam (Ungu/Merah) */}
        <line
          x1={cx} y1={cy} x2={hEnd.x} y2={hEnd.y}
          stroke="#FF4D4D" strokeWidth={10} strokeLinecap="round"
          onPointerDown={handlePointerDown('hour')}
          className={interactive ? 'cursor-grab active:cursor-grabbing shadow-lg' : ''}
        />

        {/* Jarum Menit (Biru) */}
        <line
          x1={cx} y1={cy} x2={mEnd.x} y2={mEnd.y}
          stroke="#4D79FF" strokeWidth={7} strokeLinecap="round"
          onPointerDown={handlePointerDown('minute')}
          className={interactive ? 'cursor-grab active:cursor-grabbing shadow-lg' : ''}
        />

        {/* Jarum Detik (Tipis) */}
        {!hideSeconds && (
          <line x1={cx} y1={cy} x2={sEnd.x} y2={sEnd.y} stroke="#FFB800" strokeWidth={3} strokeLinecap="round" />
        )}

        {/* Poros Tengah */}
        <circle cx={cx} cy={cy} r={8} fill="#333" stroke="white" strokeWidth={2} />
        
        {/* Label Interaktif (Jika On) */}
        {showLabels && interactive && (
           <g opacity="0.8">
             <rect x={hEnd.x - 15} y={hEnd.y - 25} width="30" height="15" rx="4" fill="#FF4D4D" />
             <text x={hEnd.x} y={hEnd.y - 14} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">JAM</text>
           </g>
        )}
      </svg>
    </div>
  );
};

export default AnalogClock;
