import { generateRandomTime, formatTime } from './clockUtils';

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'drag';
  targetHours: number;
  targetMinutes: number;
  options?: string[];
  correctAnswer?: string;
  questionText: string;
}

export function generateQuizQuestions(count = 20): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const { hours, minutes } = generateRandomTime();
    if (i % 2 === 0) {
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
    } else {
      questions.push({
        id: i + 1,
        type: 'drag',
        targetHours: hours,
        targetMinutes: minutes,
        questionText: `Atur jarum jam agar menunjukkan pukul ${formatTime(hours, minutes)}`,
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

export function saveQuizResult(result: QuizResult) {
  const existing = getQuizResults();
  existing.push(result);
  localStorage.setItem('quizResults', JSON.stringify(existing));
}

export function getQuizResults(): QuizResult[] {
  try {
    return JSON.parse(localStorage.getItem('quizResults') || '[]');
  } catch {
    return [];
  }
}
