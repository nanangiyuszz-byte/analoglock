export function getAngleFromTime(hours: number, minutes: number, seconds: number) {
  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;
  return { hourAngle, minuteAngle, secondAngle };
}

export function getTimeFromAngles(hourAngle: number, minuteAngle: number) {
  let hours = Math.round(hourAngle / 30) % 12;
  if (hours === 0) hours = 12;
  let minutes = Math.round(minuteAngle / 6) % 60;
  return { hours, minutes };
}

export function getAngleFromPoint(cx: number, cy: number, x: number, y: number) {
  const dx = x - cx;
  const dy = y - cy;
  let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  return angle;
}

export function formatTime(h: number, m: number, s?: number) {
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  if (s !== undefined) {
    const ss = String(s).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
  return `${hh}:${mm}`;
}

export function generateRandomTime() {
  const hours = Math.floor(Math.random() * 12) + 1;
  const minutes = Math.floor(Math.random() * 12) * 5;
  return { hours, minutes };
}
