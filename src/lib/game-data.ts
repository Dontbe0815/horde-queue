// Game Types and Constants for HORDE HOPEFUL

export interface GameState {
  // Queue
  queuePosition: number;
  queuePaused: boolean;
  queuePauseReason: string;
  queueStartedAt: number;
  
  // Player
  rank: Rank;
  xp: number;
  totalXp: number;
  hypePoints: number;
  battleReadiness: number;
  clicks: number;
  totalClicks: number;
  timeWaited: number; // in seconds
  
  // Spy Attacks
  spyAttacksSurvived: number;
  
  // Quotes
  collectedQuotes: Quote[];
  
  // Achievements
  unlockedAchievements: string[];
  
  // Mini-games
  currentMiniGame: MiniGameType;
  axeTimingScore: number;
  axeIndicatorPosition: number;
  isAxeSwinging: boolean;
  
  // UI State
  showSpyAlert: boolean;
  showAchievementPopup: boolean;
  latestAchievement: Achievement | null;
  screenShake: boolean;
  lastStatusMessage: string;
}

export type Rank = 
  | 'Lowly Waiter'
  | 'Impatient Grunt'
  | 'Hopeful Raider'
  | 'Dedicated Fan'
  | 'Horde Champion';

export type MiniGameType = 'none' | 'rude-emote' | 'sharpen-axe';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Quote {
  text: string;
  author: string;
}

// Constants
export const RANKS: Rank[] = [
  'Lowly Waiter',
  'Impatient Grunt',
  'Hopeful Raider',
  'Dedicated Fan',
  'Horde Champion'
];

export const RANK_XP_REQUIREMENTS: Record<Rank, number> = {
  'Lowly Waiter': 0,
  'Impatient Grunt': 100,
  'Hopeful Raider': 300,
  'Dedicated Fan': 600,
  'Horde Champion': 1000
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'professional-waiter',
    name: 'Professional Waiter',
    description: 'Wait 5 minutes in queue',
    icon: '⏰',
    unlocked: false
  },
  {
    id: 'clicks-for-days',
    name: 'Clicks For Days',
    description: 'Click 100 times',
    icon: '👆',
    unlocked: false
  },
  {
    id: 'spy-hunter',
    name: 'Spy Hunter',
    description: 'Survive 3 spy attacks',
    icon: '🗡️',
    unlocked: false
  },
  {
    id: 'true-horde',
    name: 'True Horde',
    description: 'Reach max rank',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'emote-master',
    name: 'Emote Master',
    description: 'Unlock all rude emotes',
    icon: '😤',
    unlocked: false
  },
  {
    id: 'axe-sharpener',
    name: 'Axe Sharpener',
    description: 'Hit the sweet spot 10 times',
    icon: '🪓',
    unlocked: false
  },
  {
    id: 'quote-collector',
    name: 'Quote Collector',
    description: 'Collect 5 Warchief quotes',
    icon: '📜',
    unlocked: false
  },
  {
    id: 'queue-dweller',
    name: 'Queue Dweller',
    description: 'Wait 10 minutes total',
    icon: '🏠',
    unlocked: false
  }
];

export const QUEUE_STATUS_MESSAGES = [
  "Processing your application to the Horde...",
  "Thrall is reviewing applications personally...",
  "Sylvanas is having a bad hair day...",
  "Vol'jin is consulting the loa...",
  "Baine is finishing his tea break...",
  "Lor'themar forgot his reading glasses...",
  "Gallywix is counting gold... ALL of it...",
  "A goblin sneezed near the server rack...",
  "Murloc mating season is causing delays...",
  "The zeppelin is stuck in traffic...",
  "A kobold stole some server cables...",
  "Orgrimmar's elevator is out of order...",
  "Someone dropped their popcorn in the server room...",
  "The Maelstrom is experiencing technical difficulties...",
  "A tauren sat on the keyboard...",
  "Peons are on strike for better wages...",
  "Saurfang is telling war stories (very long ones)...",
  "The Dark Portal needs a firmware update...",
  "Grom Hellscream's ghost is haunting the login server...",
  "A murloc army is demanding fish tribute...",
  "The zeppelin captain got lost again...",
  "Someone summoned too many infernals...",
  "Garrosh's spirit is arguing with Thrall...",
  "The Horde fleet got stuck in a cutscene...",
  "Rexxar found a new pet and is showing everyone...",
  "Auction House goblins are on break...",
  "Forsaken servers need more blinky lights...",
  "Blood elves are touching up their hair...",
  "Orcs are having a peon appreciation day...",
  "GM coffee break in progress...",
  "Server restart in 3... 2... 1... just kidding!",
  "Almost there! Plot twist: database error!",
  "Queue jump detected! Just kidding, we hate you.",
  "Your place is saved. In our hearts. Not the server.",
  "Recalculating... recalculating... still calculating...",
  "The server hamsters need a nap..."
];

export const SPY_ALERT_MESSAGES = [
  "ALLIANCE SPY DETECTED! Queue position increased!",
  "Goblin double-agent spotted! Going back in queue!",
  "Night Elf rogue found in the system! Resetting position!",
  "Gnome hacker attempt! Security protocols engaged!",
  "Human infiltrator identified! Extra screening required!",
  "Draenei crystal interference! Position scrambled!",
  "Worgen shed fur in the server! Queue disrupted!",
  "Dwarf drank all the mead! Staff on break!",
  "Pandaren brought Alliance food! Queue paused for inspection!",
  "Void Elf corrupted a database! Manual recovery needed!"
];

export const RUDE_EMOTES = [
  { threshold: 0, text: "You let out an exasperated sigh.", points: 1 },
  { threshold: 5, text: "You perfect aggressive finger pointing.", points: 2 },
  { threshold: 15, text: "You flip a table... mentally. Tables are expensive.", points: 3 },
  { threshold: 30, text: "You unleash a stream of Orcish profanity.", points: 4 },
  { threshold: 50, text: "You channel your inner Garrosh and scream 'DISMISSED!'", points: 5 },
  { threshold: 75, text: "You perform the legendary /rude so hard it crashes a nearby peon's cart.", points: 6 },
  { threshold: 100, text: "Your /rude is so powerful, Alliance players feel it IRL.", points: 8 },
  { threshold: 150, text: "Thrall himself calls to ask you to tone it down.", points: 10 },
  { threshold: 200, text: "You've ascended. The /rude is now art. Galleries weep.", points: 15 }
];

export const WARCHIEF_QUOTES: Quote[] = [
  { text: "Victory or death! But mostly waiting.", author: "Thrall, probably" },
  { text: "The queue is a test of patience. You are failing.", author: "Vol'jin" },
  { text: "What are we waiting for? NO ONE KNOWS!", author: "Garrosh Hellscream" },
  { text: "In the end, we all wait in the same queue.", author: "Sylvanas Windrunner" },
  { text: "The Horde waits together. Eventually.", author: "Baine Bloodhoof" },
  { text: "Time is money, and you're wasting both!", author: "Gallywix" },
  { text: "The spirits say: 'Please hold'.", author: "Drek'Thar" },
  { text: "Lok'tar Ogar! Victory or death! Or waiting...", author: "Saurfang" },
  { text: "The queue position is merely a suggestion.", author: "Lor'themar Theron" },
  { text: "We are the Horde. We do not wait in line. We ARE the line.", author: "Random Grunt" },
  { text: "Patience is a virtue. The queue is not virtuous.", author: "Liadrin" },
  { text: "A true Horde member waits... for the right moment to /spit!", author: "Rexxar" },
  { text: "The Earthmother sees all queues. She is not impressed.", author: "Magatha Grimtotem" },
  { text: "Blood and thunder! And waiting! So much waiting!", author: "Another Grunt" },
  { text: "The Dark Lady says: 'What is dead may never die... but the queue is eternal.'", author: "Nathanos Blightcaller" }
];

export const PAUSE_REASONS = [
  "GM coffee break in progress",
  "Murloc mating season causing server issues",
  "A tauren sat on the keyboard again",
  "Goblin engineers are 'fixing' things",
  "Server hamster needs a nap",
  "It's Tuesday. We don't know why that matters.",
  "The peons are on strike",
  "Zeppelin maintenance (again)",
  "The Dark Portal is buffering",
  "Lunch break! (For the server)",
  "A kobold stole some cables",
  "Sylvanas is doing her hair",
  "Thrall is meditating on the issue",
  "Someone spilled mana potion on the server",
  "The Maelstrom is in a meeting"
];

export const AXE_TIMING_MESSAGES = {
  perfect: "PERFECT! The axe gleams with Horde pride!",
  good: "Good hit! Your axe is adequately sharp!",
  miss: "Weak swing! Your axe remains dull...",
  bad: "You missed entirely! The axe mocks you."
};

// Helper functions
export function getRankFromXP(xp: number): Rank {
  let currentRank: Rank = 'Lowly Waiter';
  for (const rank of RANKS) {
    if (xp >= RANK_XP_REQUIREMENTS[rank]) {
      currentRank = rank;
    }
  }
  return currentRank;
}

export function getXPForNextRank(currentRank: Rank): number | null {
  const currentIndex = RANKS.indexOf(currentRank);
  if (currentIndex >= RANKS.length - 1) return null;
  return RANK_XP_REQUIREMENTS[RANKS[currentIndex + 1]];
}

export function getEmoteForClicks(clicks: number): typeof RUDE_EMOTES[0] {
  let currentEmote = RUDE_EMOTES[0];
  for (const emote of RUDE_EMOTES) {
    if (clicks >= emote.threshold) {
      currentEmote = emote;
    }
  }
  return currentEmote;
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
