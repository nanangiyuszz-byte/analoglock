import { generateRandomTime, formatTime } from './clockUtils';

export interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'drag' | 'true-false';
  targetHours: number;
  targetMinutes: number;
  options?: string[];
  correctAnswer?: string;
  questionText: string;
}

export function generateQuizQuestions(count = 10): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const { hours, minutes } = generateRandomTime();
    
    // Membagi 3 tipe soal secara bergantian (0: Pilihan Ganda, 1: Merakit/Drag, 2: Benar/Salah)
    const typePicker = i % 3;

    if (typePicker === 0) {
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
    } else if (typePicker === 1) {
      questions.push({
        id: i + 1,
        type: 'drag',
        targetHours: hours,
        targetMinutes: minutes,
        questionText: `Ayo Rakit Jam! Geser jarum jam agar menunjukkan pukul ${formatTime(hours, minutes)}`,
      });
    } else {
      // Tipe Soal Benar/Salah
      const isCorrectOption = Math.random() > 0.5;
      let displayTime = formatTime(hours, minutes);
      
      if (!isCorrectOption) {
        // Buat waktu pengecoh jika jawaban seharusnya 'Salah'
        let fakeHours = hours;
        let fakeMinutes = minutes;
        while (fakeHours === hours && fakeMinutes === minutes) {
          const fake = generateRandomTime();
          fakeHours = fake.hours;
          fakeMinutes = fake.minutes;
        }
        displayTime = formatTime(fakeHours, fakeMinutes);
      }

      questions.push({
        id: i + 1,
        type: 'true-false',
        targetHours: hours,
        targetMinutes: minutes,
        correctAnswer: isCorrectOption ? 'Benar' : 'Salah',
        options: ['Benar', 'Salah'],
        questionText: `Apakah jam di bawah ini menunjukkan pukul ${displayTime}?`,
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
