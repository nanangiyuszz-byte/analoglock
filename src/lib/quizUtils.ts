import { generateRandomTime, formatTime } from './clockUtils';

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'drag' | 'true-false'; // Ditambah tipe true-false
  targetHours: number;
  targetMinutes: number;
  options?: string[];
  correctAnswer?: string;
  questionText: string;
  displayTimeText?: string; // Tambahan untuk teks true-false
}

// 1. UBAH LIMIT JADI 10 SOAL DI SINI (count = 10)
export function generateQuizQuestions(count = 10): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const { hours, minutes } = generateRandomTime();
    
    // 2. KITA BAGI JADI 3 TIPE SOAL BIAR TIDAK BOSAN
    const questionTypeRandom = i % 3; 

    if (questionTypeRandom === 0) {
      const correct = formatTime(hours, minutes);
      const opts = new Set<string>([correct]);
      while (opts.size < 4) {
        const r = generateRandomTime();
        opts.add(formatTime(r.hours, r.minutes));
      }
      const shuffled = Array.from(opts).sort(() => Math.random() - 0.5);
      questions.push({
        id: i + 1,
        type: 'multiple-choice',
        targetHours: hours,
        targetMinutes: minutes,
        options: shuffled,
        correctAnswer: correct,
        questionText: `Pukul berapa yang ditunjukkan jam di atas?`,
      });
    } else if (questionTypeRandom === 1) {
      questions.push({
        id: i + 1,
        type: 'drag',
        targetHours: hours,
        targetMinutes: minutes,
        questionText: `Atur jarum jam agar menunjukkan pukul ${formatTime(hours, minutes)}`,
      });
    } else {
      // INI TIPE SOAL BARU: BENAR / SALAH
      const isCorrectStatement = Math.random() > 0.5;
      const r = generateRandomTime();
      const displayStr = isCorrectStatement ? formatTime(hours, minutes) : formatTime(r.hours, r.minutes);
      
      questions.push({
        id: i + 1,
        type: 'true-false',
        targetHours: hours,
        targetMinutes: minutes,
        correctAnswer: isCorrectStatement ? "Benar" : "Salah",
        displayTimeText: displayStr,
        questionText: `Apakah jam ini menunjukkan pukul ${displayStr}?`,
      });
    }
  }
  return questions;
}

export interface QuizResult {
  date: string;
  correct: number;
  wrong: number;
  total: number;
  score: number;
}

export function getQuizResults(): QuizResult[] {
  const data = localStorage.getItem('quizHistory');
  return data ? JSON.parse(data) : [];
}

export function saveQuizResult(result: QuizResult) {
  const existing = getQuizResults();
  existing.push(result);
  localStorage.setItem('quizHistory', JSON.stringify(existing));
}
