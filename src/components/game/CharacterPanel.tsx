'use client';

import dynamic from 'next/dynamic';
import { Rank, RANK_XP_REQUIREMENTS, RANKS } from '@/lib/game-data';

// Dynamically import 3D component to avoid SSR issues
const Character3D = dynamic(() => import('./Character3D'), {
  ssr: false,
  loading: () => (
    <div className="w-32 h-40 flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  ),
});

interface CharacterPanelProps {
  rank: Rank;
  xp: number;
  totalXp: number;
  hypePoints: number;
  battleReadiness: number;
  timeWaited: number;
}

export function CharacterPanel({ 
  rank, 
  xp, 
  totalXp, 
  hypePoints, 
  battleReadiness, 
  timeWaited 
}: CharacterPanelProps) {
  const currentRankIndex = RANKS.indexOf(rank);
  const nextRank = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;
  const currentRankXp = RANK_XP_REQUIREMENTS[rank];
  const nextRankXp = nextRank ? RANK_XP_REQUIREMENTS[nextRank] : RANK_XP_REQUIREMENTS[rank];
  
  const xpProgress = nextRank 
    ? ((xp - currentRankXp) / (nextRankXp - currentRankXp)) * 100 
    : 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getRankIcon = (rank: Rank) => {
    switch (rank) {
      case 'Lowly Waiter': return '🪑';
      case 'Impatient Grunt': return '😤';
      case 'Hopeful Raider': return '⚔️';
      case 'Dedicated Fan': return '🎮';
      case 'Horde Champion': return '👑';
      default: return '🪑';
    }
  };

  return (
    <div className="game-panel p-4 flex flex-col items-center gap-4 h-full">
      <h2 className="text-lg font-bold gold-text">Your Character</h2>
      
      {/* 3D Character */}
      <div className="relative w-40 h-48 float-animation">
        <Character3D 
          modelPath="/assets/models/DancingMaraschinoStep.fbx"
          scale={0.008}
          className="w-full h-full"
        />
      </div>

      {/* Rank Badge */}
      <div className="rank-badge">
        <span className="text-lg">{getRankIcon(rank)}</span>
        <span className="font-bold">{rank}</span>
      </div>

      {/* XP Bar */}
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Experience</span>
          <span className="gold-text">{xp} / {nextRankXp}</span>
        </div>
        <div className="xp-bar h-4">
          <div 
            className="xp-fill transition-all duration-500 ease-out"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
        {nextRank && (
          <p className="text-xs text-center text-muted-foreground">
            {nextRankXp - xp} XP to {nextRank}
          </p>
        )}
        {!nextRank && (
          <p className="text-xs text-center text-green-500">
            Max Rank Achieved!
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="w-full space-y-3 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total XP</span>
          <span className="gold-text font-bold">{totalXp}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Hype Points</span>
          <span className="text-orange-400 font-bold">{hypePoints}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Battle Readiness</span>
          <span className="text-red-400 font-bold">{battleReadiness}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Time Waited</span>
          <span className="text-blue-400 font-bold">{formatTime(timeWaited)}</span>
        </div>
      </div>

      {/* Horde Logo */}
      <div className="mt-auto pt-4 text-center">
        <p className="text-xs text-muted-foreground italic">
          &quot;For the Horde!&quot;
        </p>
      </div>
    </div>
  );
}
