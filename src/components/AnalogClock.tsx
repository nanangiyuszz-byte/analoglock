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
  size = 300,
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
      const angles = getAngleFromTime(propHours!, propMinutes!, propSeconds ?? 0);
      setHourAngle(angles.hourAngle);
      setMinuteAngle(angles.minuteAngle);
      setSecondAngle(angles.secondAngle);
    } else if (!interactive) {
      const angles = getAngleFromTime(liveTime.getHours(), liveTime.getMinutes(), liveTime.getSeconds());
      setHourAngle(angles.hourAngle);
      setMinuteAngle(angles.minuteAngle);
      setSecondAngle(angles.secondAngle);
    }
  }, [isControlled, propHours, propMinutes, propSeconds, liveTime, interactive]);

  const getPointerPos = useCallback((e: React.PointerEvent | PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handlePointerDown = useCallback((hand: 'hour' | 'minute') => (e: React.PointerEvent) => {
    if (!interactive) return;
    e.preventDefault();
    setDragging(hand);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, [interactive]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || !interactive) return;
    const { x, y } = getPointerPos(e);
    const cx = size / 2;
    const cy = size / 2;
    const angle = getAngleFromPoint(cx, cy, x, y);
    if (dragging === 'hour') {
      setHourAngle(angle);
      const { hours, minutes } = getTimeFromAngles(angle, minuteAngle);
      onTimeChange?.(hours, minutes);
    } else {
      const snapped = Math.round(angle / 6) * 6;
      setMinuteAngle(snapped);
      const { hours, minutes } = getTimeFromAngles(hourAngle, snapped);
      onTimeChange?.(hours, minutes);
    }
  }, [dragging, interactive, getPointerPos, size, minuteAngle, hourAngle, onTimeChange]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const padding = 35;
  const totalSize = size + padding * 2;
  const cx = totalSize / 2;
  const cy = totalSize / 2;
  const r = size / 2 - 10;

  const minuteNumbers = Array.from({ length: 12 }, (_, i) => {
    const num = i * 5;
    const angle = (num * 6 - 90) * (Math.PI / 180);
    const nr = r + 22;
    return { num, x: cx + nr * Math.cos(angle), y: cy + nr * Math.sin(angle) };
  });

  const hourNumbers = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = (num * 30 - 90) * (Math.PI / 180);
    const nr = r - 28;
    return { num, x: cx + nr * Math.cos(angle), y: cy + nr * Math.sin(angle) };
  });

  const minuteDots = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const dr = r - 8;
    const isHour = i % 5 === 0;
    return { x: cx + dr * Math.cos(angle), y: cy + dr * Math.sin(angle), isHour };
  });

  const hourHandLen = r * 0.48;
  const minuteHandLen = r * 0.68;
  const secondHandLen = r * 0.75;

  const handEnd = (angle: number, len: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: cx + len * Math.cos(rad), y: cy + len * Math.sin(rad) };
  };

  const hEnd = handEnd(hourAngle, hourHandLen);
  const mEnd = handEnd(minuteAngle, minuteHandLen);
  const sEnd = handEnd(secondAngle, secondHandLen);

  return (
    <svg
      ref={svgRef}
      width={totalSize}
      height={totalSize}
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="select-none touch-none"
    >
      {minuteNumbers.map(({ num, x, y }) => (
        <text key={`m${num}`} x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fill="hsl(0, 0%, 40%)" fontSize={size > 200 ? 13 : 10} fontWeight="bold" fontFamily="Fredoka">
          {num}
        </text>
      ))}

      <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(45, 100%, 60%)" strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r - 12} fill="hsl(0, 0%, 100%)" stroke="hsl(250, 20%, 88%)" strokeWidth={1} />

      {minuteDots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.isHour ? 3.5 : 1.5} fill={d.isHour ? 'hsl(145, 63%, 45%)' : 'hsl(145, 63%, 50%)'} />
      ))}

      {hourNumbers.map(({ num, x, y }) => (
        <text key={num} x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fill="hsl(266, 93%, 55%)" fontSize={size > 200 ? 20 : 14} fontWeight="bold" fontFamily="Fredoka">
          {num}
        </text>
      ))}

      <line x1={cx} y1={cy} x2={hEnd.x} y2={hEnd.y}
        stroke="hsl(0, 80%, 50%)" strokeWidth={7} strokeLinecap="round"
        onPointerDown={handlePointerDown('hour')}
        className={interactive ? 'cursor-grab active:cursor-grabbing' : ''} />

      <line x1={cx} y1={cy} x2={mEnd.x} y2={mEnd.y}
        stroke="hsl(216, 100%, 50%)" strokeWidth={5} strokeLinecap="round"
        onPointerDown={handlePointerDown('minute')}
        className={interactive ? 'cursor-grab active:cursor-grabbing' : ''} />

      {!hideSeconds && (
        <line x1={cx} y1={cy} x2={sEnd.x} y2={sEnd.y}
          stroke="hsl(0, 0%, 30%)" strokeWidth={1.5} strokeLinecap="round" />
      )}

      <circle cx={cx} cy={cy} r={6} fill="hsl(45, 100%, 55%)" stroke="hsl(45, 80%, 40%)" strokeWidth={1} />
    </svg>
  );
};

export default AnalogClock;
