import React from 'react';
import { motion } from 'framer-motion';
import { getQuizResults } from '@/lib/quizUtils';

const ProgressHistory: React.FC = () => {
  const results = getQuizResults();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-primary text-center">📊 Riwayat Progress</h2>
      {results.length === 0 ? (
        <p className="text-center text-muted-foreground">Belum ada hasil quiz. Coba quiz dulu ya!</p>
      ) : (
        <>
          {/* Comparison */}
          {results.length >= 2 && (
            <div className="bg-card rounded-2xl p-4 shadow-lg text-center">
              <h3 className="font-semibold text-foreground mb-2">📈 Perbandingan Progress</h3>
              <div className="flex justify-center gap-4 items-end">
                <div>
                  <p className="text-sm text-muted-foreground">Sebelumnya</p>
                  <p className="text-2xl font-bold text-secondary">{results[results.length - 2].score}%</p>
                </div>
                <span className="text-2xl">→</span>
                <div>
                  <p className="text-sm text-muted-foreground">Terakhir</p>
                  <p className="text-2xl font-bold text-primary">{results[results.length - 1].score}%</p>
                </div>
                {results[results.length - 1].score > results[results.length - 2].score && (
                  <span className="text-quiz-correct text-xl">⬆️</span>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Hasil Sebelumnya</h3>
            {[...results].reverse().map((r, i) => (
              <div key={i} className="bg-card rounded-xl p-4 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{new Date(r.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                  <p className="font-semibold text-foreground">✅ {r.correct} Benar / ❌ {r.wrong} Salah</p>
                </div>
                <div className="text-2xl font-bold text-primary">{r.score}%</div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ProgressHistory;
