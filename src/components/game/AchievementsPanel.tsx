'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, ACHIEVEMENTS, Quote } from '@/lib/game-data';

interface AchievementsPanelProps {
  unlockedAchievements: string[];
  collectedQuotes: Quote[];
  latestAchievement: Achievement | null;
  showAchievementPopup: boolean;
}

export function AchievementsPanel({
  unlockedAchievements,
  collectedQuotes,
  latestAchievement,
  showAchievementPopup,
}: AchievementsPanelProps) {
  const achievements = ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: unlockedAchievements.includes(a.id)
  }));

  return (
    <div className="game-panel p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold gold-text text-center mb-4">Achievements & Quotes</h2>
      
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievementPopup && latestAchievement && (
          <motion.div
            initial={{ scale: 0, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 achievement-pop"
          >
            <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 border-2 border-yellow-400 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 relative">
                  <Image
                    src="/assets/images/achievement-badge.png"
                    alt="Achievement"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs text-yellow-200">Achievement Unlocked!</p>
                  <p className="text-lg font-bold text-white">{latestAchievement.name}</p>
                  <p className="text-sm text-yellow-100">{latestAchievement.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements List */}
      <div className="flex-1 overflow-hidden mb-4">
        <h3 className="text-sm font-bold gold-text mb-2 flex items-center gap-2">
          <span>🏆</span> Achievements
          <span className="text-xs text-muted-foreground">
            ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </span>
        </h3>
        
        <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{achievement.icon}</span>
                <div>
                  <p className={`font-bold text-sm ${achievement.unlocked ? 'gold-text' : 'text-gray-500'}`}>
                    {achievement.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warchief's Wisdom Quotes */}
      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-bold gold-text mb-2 flex items-center gap-2">
          <span>📜</span> Warchief&apos;s Wisdom
          <span className="text-xs text-muted-foreground">
            ({collectedQuotes.length} collected)
          </span>
        </h3>
        
        <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
          {collectedQuotes.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-4">
              No quotes collected yet. Keep playing!
            </p>
          ) : (
            collectedQuotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-red-950/50 to-transparent p-2 rounded border-l-2 border-yellow-600"
              >
                <p className="text-xs italic text-gray-300">&quot;{quote.text}&quot;</p>
                <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Footer Badge */}
      <div className="mt-auto pt-4 text-center">
        <div className="w-12 h-12 mx-auto relative opacity-40">
          <Image
            src="/assets/images/scroll.png"
            alt="Scroll"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
