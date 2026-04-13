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
  size = 400,
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
      const angles = getAngleFromTime(liveTime.getHours(), liveTime.getMinutes(), liveTime.getSeconds());
      setHourAngle(angles.hour);
      setMinuteAngle(angles.minute);
      setSecondAngle(angles.second);
    }
  }, [liveTime, propHours, propMinutes, propSeconds, isControlled, interactive]);

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

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative flex items-center justify-center p-6 bg-white rounded-[50px] shadow-2xl border-[12px] border-purple-50">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
        className="touch-none"
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="150%" height="150%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Plat Jam Utama */}
        <circle cx={cx} cy={cy} r={size / 2 - 10} fill="white" stroke="#9D64FA" strokeWidth="6" />
        <circle cx={cx} cy={cy} r={size / 2 - 30} fill="none" stroke="#F3E8FF" strokeWidth="1" strokeDasharray="5,5" />

        {/* Angka Jam */}
        {[...Array(12)].map((_, i) => {
          const angle = (i + 1) * 30;
          const x = cx + (size / 2 - 65) * Math.sin((angle * Math.PI) / 180);
          const y = cy - (size / 2 - 65) * Math.cos((angle * Math.PI) / 180);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" 
                  className="fill-purple-900 font-black" style={{ fontSize: size * 0.09 }}>
              {i + 1}
            </text>
          );
        })}

        {/* Jarum Jam (Merah - Tebal) */}
        <line
          x1={cx} y1={cy}
          x2={cx + (size * 0.25) * Math.sin((hourAngle * Math.PI) / 180)}
          y2={cy - (size * 0.25) * Math.cos((hourAngle * Math.PI) / 180)}
          stroke="#EF4444" strokeWidth="12" strokeLinecap="round" filter="url(#shadow)"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => { e.stopPropagation(); setDragging('hour'); }}
        />

        {/* Jarum Menit (Biru - Sedang) */}
        <line
          x1={cx} y1={cy}
          x2={cx + (size * 0.38) * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={cy - (size * 0.38) * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" filter="url(#shadow)"
          className="cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => { e.stopPropagation(); setDragging('minute'); }}
        />

        {/* Jarum Detik (Kuning - Tipis) */}
        {!hideSeconds && (
          <line
            x1={cx} y1={cy}
            x2={cx + (size * 0.42) * Math.sin((secondAngle * Math.PI) / 180)}
            y2={cy - (size * 0.42) * Math.cos((secondAngle * Math.PI) / 180)}
            stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"
          />
        )}

        {/* Poros Tengah Emas */}
        <circle cx={cx} cy={cy} r={8} fill="#F59E0B" stroke="white" strokeWidth="3" />
      </svg>
    </div>
  );
};

export default AnalogClock;
