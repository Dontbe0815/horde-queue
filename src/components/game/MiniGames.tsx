'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniGameType, RUDE_EMOTES, AXE_TIMING_MESSAGES } from '@/lib/game-data';
import { useState, useEffect, useMemo } from 'react';

interface RudeEmoteGameProps {
  clicks: number;
  hypePoints: number;
  onClick: () => void;
}

export function RudeEmoteGame({ clicks, hypePoints, onClick }: RudeEmoteGameProps) {
  const [showEmote, setShowEmote] = useState(false);
  const [lastClickPoints, setLastClickPoints] = useState(0);

  // Compute current emote index based on clicks (memoized)
  const currentEmoteIndex = useMemo(() => {
    for (let i = RUDE_EMOTES.length - 1; i >= 0; i--) {
      if (clicks >= RUDE_EMOTES[i].threshold) {
        return i;
      }
    }
    return 0;
  }, [clicks]);

  const currentEmote = RUDE_EMOTES[currentEmoteIndex];

  const handleClick = () => {
    onClick();
    setLastClickPoints(currentEmote.points);
    setShowEmote(true);
    setTimeout(() => setShowEmote(false), 800);
  };

  const progressToNextEmote = currentEmoteIndex < RUDE_EMOTES.length - 1
    ? ((clicks - currentEmote.threshold) / (RUDE_EMOTES[currentEmoteIndex + 1].threshold - currentEmote.threshold)) * 100
    : 100;

  return (
    <div className="minigame-container">
      <h3 className="text-lg font-bold gold-text text-center mb-4">
        😤 Practice Your /Rude Emote 😤
      </h3>

      {/* Progress to next emote */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Next Emote Unlock</span>
          <span className="gold-text">
            {currentEmoteIndex < RUDE_EMOTES.length - 1 
              ? `${RUDE_EMOTES[currentEmoteIndex + 1].threshold - clicks} clicks away`
              : 'All unlocked!'}
          </span>
        </div>
        <div className="xp-bar h-2">
          <div 
            className="xp-fill transition-all duration-300"
            style={{ width: `${Math.min(progressToNextEmote, 100)}%` }}
          />
        </div>
      </div>

      {/* Current emote */}
      <div className="text-center mb-4 min-h-[60px]">
        <AnimatePresence mode="wait">
          {showEmote ? (
            <motion.div
              key="emote"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-lg italic text-yellow-300"
            >
              {currentEmote.text}
              <motion.span
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -30, opacity: 0 }}
                className="ml-2 text-green-400 font-bold"
              >
                +{lastClickPoints}
              </motion.span>
            </motion.div>
          ) : (
            <motion.p
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground"
            >
              Click to practice your rude emote!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Click Button */}
      <div className="flex justify-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="horde-button px-8 py-4 text-lg horde-glow"
        >
          <span className="flex items-center gap-2">
            <span>😤</span>
            <span>/RUDE</span>
            <span>😤</span>
          </span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Total Clicks: </span>
          <span className="gold-text font-bold">{clicks}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Hype Points: </span>
          <span className="text-orange-400 font-bold">{hypePoints}</span>
        </div>
      </div>

      {/* Unlocked emotes */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Unlocked Emotes:</p>
        <div className="flex flex-wrap gap-1">
          {RUDE_EMOTES.map((emote, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded ${
                index <= currentEmoteIndex 
                  ? 'bg-green-900/50 text-green-300' 
                  : 'bg-gray-800/50 text-gray-500'
              }`}
            >
              Level {index + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SharpenAxeGameProps {
  battleReadiness: number;
  sweetSpotHits: number;
  onHit: (quality: 'perfect' | 'good' | 'miss' | 'bad') => void;
}

export function SharpenAxeGame({ battleReadiness, sweetSpotHits, onHit }: SharpenAxeGameProps) {
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [isSwinging, setIsSwinging] = useState(false);
  const [speed, setSpeed] = useState(2);

  // Sweet spot is in the center (45-55%)
  const sweetSpotStart = 45;
  const sweetSpotEnd = 55;
  const goodRange = 35;
  const goodRangeEnd = 65;

  useEffect(() => {
    if (!isMoving) return;

    const interval = setInterval(() => {
      setIndicatorPosition(prev => {
        const next = prev + (direction * speed);
        if (next >= 100 || next <= 0) {
          setDirection(d => d * -1);
          return Math.max(0, Math.min(100, next));
        }
        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isMoving, direction, speed]);

  const startGame = () => {
    setIsMoving(true);
    setMessage(null);
    setIndicatorPosition(0);
    setDirection(1);
    // Increase speed slightly with each game
    setSpeed(s => Math.min(s + 0.1, 5));
  };

  const handleSwing = () => {
    if (!isMoving) {
      startGame();
      return;
    }

    setIsMoving(false);
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 300);

    let quality: 'perfect' | 'good' | 'miss' | 'bad';
    const pos = indicatorPosition;

    if (pos >= sweetSpotStart && pos <= sweetSpotEnd) {
      quality = 'perfect';
      setMessage(AXE_TIMING_MESSAGES.perfect);
    } else if (pos >= goodRange && pos <= goodRangeEnd) {
      quality = 'good';
      setMessage(AXE_TIMING_MESSAGES.good);
    } else if (pos >= 20 && pos <= 80) {
      quality = 'miss';
      setMessage(AXE_TIMING_MESSAGES.miss);
    } else {
      quality = 'bad';
      setMessage(AXE_TIMING_MESSAGES.bad);
    }

    onHit(quality);

    // Show message and restart
    setTimeout(() => {
      setMessage(null);
      startGame();
    }, 1500);
  };

  return (
    <div className="minigame-container">
      <h3 className="text-lg font-bold gold-text text-center mb-4">
        🪓 Sharpen Your Axe 🪓
      </h3>

      {/* Axe display */}
      <div className="flex justify-center mb-4">
        <motion.div
          animate={isSwinging ? { rotate: [0, -30, 30, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="w-20 h-20 relative"
        >
          <Image
            src="/assets/images/axe-icon.png"
            alt="Axe"
            fill
            className="object-contain"
            style={{ filter: `drop-shadow(0 0 ${battleReadiness / 5}px rgba(201, 163, 53, 0.5))` }}
          />
        </motion.div>
      </div>

      {/* Timing bar */}
      <div className="axe-timing-bar mb-4 relative">
        {/* Sweet spot zone */}
        <div 
          className="sweet-spot"
          style={{ left: `${sweetSpotStart}%`, width: `${sweetSpotEnd - sweetSpotStart}%` }}
        />
        
        {/* Good range indicators */}
        <div 
          className="absolute top-0 h-full border-l border-dashed border-yellow-600/50"
          style={{ left: `${goodRange}%` }}
        />
        <div 
          className="absolute top-0 h-full border-r border-dashed border-yellow-600/50"
          style={{ left: `${goodRangeEnd}%` }}
        />
        
        {/* Moving indicator */}
        <motion.div
          className="axe-indicator"
          style={{ left: `${indicatorPosition}%` }}
          animate={{ 
            boxShadow: indicatorPosition >= sweetSpotStart && indicatorPosition <= sweetSpotEnd 
              ? '0 0 20px #C9A335' 
              : '0 0 10px #f5e6d3'
          }}
        />
      </div>

      {/* Message */}
      <div className="text-center min-h-[24px] mb-4">
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`font-bold ${
                message.includes('PERFECT') ? 'text-green-400' :
                message.includes('Good') ? 'text-yellow-400' :
                'text-red-400'
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Swing button */}
      <div className="flex justify-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSwing}
          className="horde-button px-8 py-4 text-lg horde-glow"
        >
          <span className="flex items-center gap-2">
            <span>⚡</span>
            <span>{isMoving ? 'SWING!' : 'START'}</span>
            <span>⚡</span>
          </span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Battle Readiness: </span>
          <span className="text-red-400 font-bold">{Math.min(battleReadiness, 100)}%</span>
        </div>
        <div>
          <span className="text-muted-foreground">Sweet Spot Hits: </span>
          <span className="text-green-400 font-bold">{sweetSpotHits}</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-xs text-center text-muted-foreground mt-4">
        Click SWING when the indicator is in the golden zone!
      </p>
    </div>
  );
}

interface MiniGameSelectorProps {
  currentGame: MiniGameType;
  onGameChange: (game: MiniGameType) => void;
}

export function MiniGameSelector({ currentGame, onGameChange }: MiniGameSelectorProps) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      {[
        { type: 'rude-emote' as MiniGameType, label: '😤 Rude Emote', icon: '😤' },
        { type: 'sharpen-axe' as MiniGameType, label: '🪓 Sharpen Axe', icon: '🪓' },
      ].map((game) => (
        <motion.button
          key={game.type}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onGameChange(game.type)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            currentGame === game.type
              ? 'bg-gradient-to-b from-red-800 to-red-900 border-2 border-yellow-500 text-white'
              : 'bg-gray-800/50 border border-gray-600 text-gray-400 hover:text-white'
          }`}
        >
          {game.label}
        </motion.button>
      ))}
    </div>
  );
}
