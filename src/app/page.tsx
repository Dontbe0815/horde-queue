'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CharacterPanel } from '@/components/game/CharacterPanel';
import { QueueStatus } from '@/components/game/QueueStatus';
import { AchievementsPanel } from '@/components/game/AchievementsPanel';
import { RudeEmoteGame, SharpenAxeGame, MiniGameSelector } from '@/components/game/MiniGames';
import { 
  GameState, 
  Rank, 
  Achievement, 
  MiniGameType, 
  Quote,
  QUEUE_STATUS_MESSAGES, 
  SPY_ALERT_MESSAGES, 
  PAUSE_REASONS, 
  WARCHIEF_QUOTES,
  ACHIEVEMENTS,
  RANKS,
  RANK_XP_REQUIREMENTS,
  getRandomItem
} from '@/lib/game-data';
import { soundManager } from '@/lib/sound-manager';

const STORAGE_KEY = 'horde-hopeful-save';
const INITIAL_QUEUE = 1337;

// Initial state with deterministic values for SSR
const INITIAL_STATUS_MESSAGE = QUEUE_STATUS_MESSAGES[0];

function getInitialState(): GameState {
  return {
    queuePosition: INITIAL_QUEUE,
    queuePaused: false,
    queuePauseReason: '',
    queueStartedAt: 0, // Will be set on client
    rank: 'Lowly Waiter',
    xp: 0,
    totalXp: 0,
    hypePoints: 0,
    battleReadiness: 0,
    clicks: 0,
    totalClicks: 0,
    timeWaited: 0,
    spyAttacksSurvived: 0,
    collectedQuotes: [],
    unlockedAchievements: [],
    currentMiniGame: 'rude-emote',
    axeTimingScore: 0,
    axeIndicatorPosition: 0,
    isAxeSwinging: false,
    showSpyAlert: false,
    showAchievementPopup: false,
    latestAchievement: null,
    screenShake: false,
    lastStatusMessage: INITIAL_STATUS_MESSAGE,
  };
}

function loadState(): GameState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...getInitialState(), ...parsed };
    }
  } catch {
    console.error('Failed to load save state');
  }
  return null;
}

function saveState(state: GameState) {
  if (typeof window === 'undefined') return;
  
  try {
    const toSave = {
      queuePosition: state.queuePosition,
      rank: state.rank,
      xp: state.xp,
      totalXp: state.totalXp,
      hypePoints: state.hypePoints,
      battleReadiness: state.battleReadiness,
      clicks: state.clicks,
      totalClicks: state.totalClicks,
      timeWaited: state.timeWaited,
      spyAttacksSurvived: state.spyAttacksSurvived,
      collectedQuotes: state.collectedQuotes,
      unlockedAchievements: state.unlockedAchievements,
      axeTimingScore: state.axeTimingScore,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    console.error('Failed to save state');
  }
}

export default function Home() {
  // Always start with deterministic initial state for SSR consistency
  const [state, setState] = useState<GameState>(getInitialState);
  const [muted, setMuted] = useState(false);
  const [spyAlertMessage, setSpyAlertMessage] = useState('');
  const [sweetSpotHits, setSweetSpotHits] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queueTimerRef = useRef<NodeJS.Timeout | null>(null);
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eventTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  // Load saved state after hydration
  // This is a legitimate use case for setState in effect - syncing with localStorage
  useEffect(() => {
    const saved = loadState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(prev => ({
      ...prev,
      ...(saved || {}),
      queueStartedAt: Date.now(),
      lastStatusMessage: saved ? getRandomItem(QUEUE_STATUS_MESSAGES) : prev.lastStatusMessage,
    }));
    setIsHydrated(true);
  }, []);

  // Initialize sounds once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    soundManager.init();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (queueTimerRef.current) clearInterval(queueTimerRef.current);
      if (statusTimerRef.current) clearInterval(statusTimerRef.current);
      if (eventTimerRef.current) clearInterval(eventTimerRef.current);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setState(prev => {
        const newState = {
          ...prev,
          timeWaited: prev.timeWaited + 1,
        };
        saveState(newState);
        return newState;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Queue countdown
  useEffect(() => {
    queueTimerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.queuePaused || prev.queuePosition <= 0 || prev.showSpyAlert) {
          return prev;
        }

        // Random chance for queue to go UP (Alliance spy attack)
        if (Math.random() < 0.02 && prev.queuePosition > 50) {
          const increase = Math.floor(Math.random() * 100) + 50;
          const newMessage = getRandomItem(SPY_ALERT_MESSAGES);
          setSpyAlertMessage(newMessage);
          soundManager.playAlert();
          
          return {
            ...prev,
            queuePosition: prev.queuePosition + increase,
            showSpyAlert: true,
            spyAttacksSurvived: prev.spyAttacksSurvived + 1,
            screenShake: true,
          };
        }

        // Normal countdown
        const decrease = Math.random() < 0.1 ? 2 : 1;
        const newPosition = Math.max(0, prev.queuePosition - decrease);
        
        // No sound for normal queue updates

        return {
          ...prev,
          queuePosition: newPosition,
          screenShake: false,
        };
      });
    }, 500);

    return () => {
      if (queueTimerRef.current) clearInterval(queueTimerRef.current);
    };
  }, []);

  // Status message rotation
  useEffect(() => {
    statusTimerRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        lastStatusMessage: getRandomItem(QUEUE_STATUS_MESSAGES),
      }));
    }, 5000);

    return () => {
      if (statusTimerRef.current) clearInterval(statusTimerRef.current);
    };
  }, []);

  // Random events (pause, quotes)
  useEffect(() => {
    eventTimerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.showSpyAlert || prev.queuePaused) return prev;

        // Random pause event
        if (Math.random() < 0.03) {
          return {
            ...prev,
            queuePaused: true,
            queuePauseReason: getRandomItem(PAUSE_REASONS),
          };
        }

        // Random quote collection
        if (Math.random() < 0.05) {
          const newQuote = getRandomItem(WARCHIEF_QUOTES);
          if (!prev.collectedQuotes.find(q => q.text === newQuote.text)) {
            soundManager.playSuccess();
            return {
              ...prev,
              collectedQuotes: [...prev.collectedQuotes, newQuote],
            };
          }
        }

        return prev;
      });
    }, 3000);

    return () => {
      if (eventTimerRef.current) clearInterval(eventTimerRef.current);
    };
  }, []);

  // Handle spy alert timeout
  useEffect(() => {
    if (state.showSpyAlert) {
      const timeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          showSpyAlert: false,
          screenShake: false,
        }));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [state.showSpyAlert]);

  // Handle pause timeout
  useEffect(() => {
    if (state.queuePaused) {
      const timeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          queuePaused: false,
          queuePauseReason: '',
        }));
      }, 5000 + Math.random() * 5000);
      return () => clearTimeout(timeout);
    }
  }, [state.queuePaused]);

  // Check achievements
  const checkAchievements = useCallback((newState: GameState) => {
    const newAchievements: Achievement[] = [];

    // Professional Waiter - 5 minutes
    if (newState.timeWaited >= 300 && !newState.unlockedAchievements.includes('professional-waiter')) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'professional-waiter')!);
    }

    // Clicks For Days - 100 clicks
    if (newState.totalClicks >= 100 && !newState.unlockedAchievements.includes('clicks-for-days')) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'clicks-for-days')!);
    }

    // Spy Hunter - 3 spy attacks
    if (newState.spyAttacksSurvived >= 3 && !newState.unlockedAchievements.includes('spy-hunter')) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'spy-hunter')!);
    }

    // True Horde - Max rank
    if (newState.rank === 'Horde Champion' && !newState.unlockedAchievements.includes('true-horde')) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'true-horde')!);
    }

    // Quote Collector - 5 quotes
    if (newState.collectedQuotes.length >= 5 && !newState.unlockedAchievements.includes('quote-collector')) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'quote-collector')!);
    }

    // Queue Dweller - 10 minutes
    if (newState.timeWaited >= 600 && !newState.unlockedAchievements.includes('queue-dweller')) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'queue-dweller')!);
    }

    // Axe Sharpener - 10 sweet spots
    if (sweetSpotHits >= 10 && !newState.unlockedAchievements.includes('axe-sharpener')) {
      newAchievements.push(ACHIEVEMENTS.find(a => a.id === 'axe-sharpener')!);
    }

    return newAchievements;
  }, [sweetSpotHits]);

  // Compute rank from XP (helper function)
  const getRankFromXP = useCallback((xp: number): Rank => {
    let newRank: Rank = 'Lowly Waiter';
    for (const rank of RANKS) {
      if (xp >= RANK_XP_REQUIREMENTS[rank]) {
        newRank = rank;
      }
    }
    return newRank;
  }, []);

  // Check achievements and unlock new ones (using effect for state sync)
  const unlockNewAchievements = useCallback((currentState: GameState) => {
    const newAchievements = checkAchievements(currentState);
    if (newAchievements.length > 0) {
      const latest = newAchievements[0];
      soundManager.playSuccess();
      setState(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, ...newAchievements.map(a => a.id)],
        showAchievementPopup: true,
        latestAchievement: latest,
      }));

      setTimeout(() => {
        setState(prev => ({
          ...prev,
          showAchievementPopup: false,
          latestAchievement: null,
        }));
      }, 3000);
    }
  }, [checkAchievements]);

  // Track previous values for achievement checking using ref
  const achievementCheckKey = `${state.timeWaited}-${state.totalClicks}-${state.spyAttacksSurvived}-${state.collectedQuotes.length}-${sweetSpotHits}`;
  const lastAchievementCheckRef = useRef(achievementCheckKey);

  // Check achievements when relevant metrics change
  // This effect synchronizes game state with achievement unlocks
  useEffect(() => {
    if (lastAchievementCheckRef.current === achievementCheckKey) return;
    lastAchievementCheckRef.current = achievementCheckKey;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    unlockNewAchievements(state);
  }, [achievementCheckKey, state, unlockNewAchievements]);

  // Handle rude emote click
  const handleRudeEmoteClick = () => {
    soundManager.playClick();
    const points = Math.floor(Math.random() * 3) + 1;
    
    setState(prev => {
      const newTotalXp = prev.totalXp + 1;
      const newXp = prev.xp + 1;
      const newRank = getRankFromXP(newTotalXp);
      
      if (newRank !== prev.rank) {
        soundManager.playSuccess();
      }
      
      return {
        ...prev,
        clicks: prev.clicks + 1,
        totalClicks: prev.totalClicks + 1,
        hypePoints: prev.hypePoints + points,
        totalXp: newTotalXp,
        xp: newXp,
        rank: newRank,
      };
    });
  };

  // Handle axe swing
  const handleAxeSwing = (quality: 'perfect' | 'good' | 'miss' | 'bad') => {
    soundManager.playClick();
    
    let xpGain = 0;
    let readinessGain = 0;
    
    switch (quality) {
      case 'perfect':
        xpGain = 5;
        readinessGain = 10;
        setSweetSpotHits(prev => prev + 1);
        soundManager.playSuccess();
        break;
      case 'good':
        xpGain = 2;
        readinessGain = 5;
        break;
      case 'miss':
        xpGain = 1;
        readinessGain = 1;
        break;
      case 'bad':
        readinessGain = -2;
        break;
    }

    setState(prev => {
      const newTotalXp = prev.totalXp + xpGain;
      const newRank = getRankFromXP(newTotalXp);
      
      if (newRank !== prev.rank) {
        soundManager.playSuccess();
      }
      
      return {
        ...prev,
        totalXp: newTotalXp,
        xp: prev.xp + xpGain,
        battleReadiness: Math.max(0, Math.min(100, prev.battleReadiness + readinessGain)),
        rank: newRank,
      };
    });
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
    soundManager.setMuted(!muted);
  };

  // Reset game
  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(getInitialState());
    setSweetSpotHits(0);
  };

  return (
    <div 
      className={`min-h-screen w-full overflow-hidden relative ${state.screenShake ? 'shake-animation' : ''}`}
      style={{
        backgroundImage: 'url(/assets/images/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4">
        {/* Header */}
        <header className="text-center mb-4">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="w-16 h-16 relative">
              <Image
                src="/assets/images/horde-logo.png"
                alt="Horde"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gold-text" style={{ textShadow: '0 0 20px rgba(201, 163, 53, 0.5)' }}>
                HORDE HOPEFUL
              </h1>
              <p className="text-sm text-muted-foreground italic">The Queue Waiting Game</p>
            </div>
            <div className="w-16 h-16 relative">
              <Image
                src="/assets/images/horde-logo.png"
                alt="Horde"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </header>

        {/* Main game area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-7xl mx-auto w-full">
          {/* Left Panel - Character */}
          <div className="lg:col-span-1">
            <CharacterPanel
              rank={state.rank}
              xp={state.xp}
              totalXp={state.totalXp}
              hypePoints={state.hypePoints}
              battleReadiness={state.battleReadiness}
              timeWaited={state.timeWaited}
            />
          </div>

          {/* Center Panel - Queue & Mini Games */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Queue Status */}
            <QueueStatus
              queuePosition={state.queuePosition}
              queuePaused={state.queuePaused}
              queuePauseReason={state.queuePauseReason}
              statusMessage={state.lastStatusMessage}
              showSpyAlert={state.showSpyAlert}
              spyAlertMessage={spyAlertMessage}
            />

            {/* Mini Game Selector */}
            <MiniGameSelector
              currentGame={state.currentMiniGame}
              onGameChange={(game) => setState(prev => ({ ...prev, currentMiniGame: game }))}
            />

            {/* Mini Game Area */}
            <div className="flex-1">
              {state.currentMiniGame === 'rude-emote' && (
                <RudeEmoteGame
                  clicks={state.clicks}
                  hypePoints={state.hypePoints}
                  onClick={handleRudeEmoteClick}
                />
              )}
              {state.currentMiniGame === 'sharpen-axe' && (
                <SharpenAxeGame
                  battleReadiness={state.battleReadiness}
                  sweetSpotHits={sweetSpotHits}
                  onHit={handleAxeSwing}
                />
              )}
            </div>
          </div>

          {/* Right Panel - Achievements */}
          <div className="lg:col-span-1">
            <AchievementsPanel
              unlockedAchievements={state.unlockedAchievements}
              collectedQuotes={state.collectedQuotes}
              latestAchievement={state.latestAchievement}
              showAchievementPopup={state.showAchievementPopup}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggleMute}
              className="horde-button px-4 py-2 text-sm"
            >
              {muted ? '🔇 Unmute' : '🔊 Mute'}
            </button>
            
            <button
              onClick={resetGame}
              className="horde-button px-4 py-2 text-sm opacity-50 hover:opacity-100"
            >
              🔄 Reset Progress
            </button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            A satirical game for WoW players waiting in queue. Not affiliated with Blizzard Entertainment.
          </p>
          <p className="text-xs text-muted-foreground">
            &quot;For the Horde!&quot; - Every Horde player, probably
          </p>
        </footer>
      </div>

      {/* Particle effects container */}
      <div id="particles" className="particles-container" />
    </div>
  );
}
