'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface QueueStatusProps {
  queuePosition: number;
  queuePaused: boolean;
  queuePauseReason: string;
  statusMessage: string;
  showSpyAlert: boolean;
  spyAlertMessage: string;
}

export function QueueStatus({
  queuePosition,
  queuePaused,
  queuePauseReason,
  statusMessage,
  showSpyAlert,
  spyAlertMessage,
}: QueueStatusProps) {
  return (
    <div className={`game-panel p-6 h-full relative overflow-hidden ${showSpyAlert ? 'danger-overlay' : ''}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-900 to-transparent" />
      </div>

      {/* Main Queue Display */}
      <div className="text-center relative z-10">
        <h2 className="text-xl font-bold gold-text mb-2">Queue Position</h2>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={queuePosition}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`queue-display ${queuePaused ? 'opacity-50' : ''}`}
            >
              {queuePosition > 0 ? queuePosition.toLocaleString() : '✓'}
            </motion.div>
          </AnimatePresence>
          
          {queuePosition === 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-green-400 text-xl font-bold mt-2"
            >
              YOUR TURN!
            </motion.div>
          )}
        </div>

        {/* Pause Status */}
        <AnimatePresence>
          {queuePaused && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="animate-pulse">⚠️</span>
                <span className="text-yellow-400 font-bold">QUEUE PAUSED</span>
              </div>
              <p className="text-sm text-yellow-200 mt-1">{queuePauseReason}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Message */}
        <div className="status-message mt-4 min-h-[60px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm"
            >
              {statusMessage}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Spy Alert Overlay */}
      <AnimatePresence>
        {showSpyAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 spy-alert flex flex-col items-center justify-center z-20 rounded-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/assets/images/goblin-spy.png"
                alt="Goblin Spy"
                width={100}
                height={100}
                className="mb-4"
              />
            </motion.div>
            
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-red-400 mb-2"
            >
              🚨 ALERT! 🚨
            </motion.h3>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center px-4 text-yellow-200"
            >
              {spyAlertMessage}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 flex items-center gap-2"
            >
              <Image
                src="/assets/images/alliance-logo.png"
                alt="Alliance"
                width={40}
                height={40}
                className="opacity-50"
              />
              <span className="text-sm text-red-300">Alliance Scum!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estimated Time (fake) */}
      <div className="mt-6 text-center relative z-10">
        <p className="text-xs text-muted-foreground">
          Estimated wait: {queuePosition > 0 ? `~${Math.ceil(queuePosition / 10)} minutes` : 'Now!'}
        </p>
        <p className="text-xs text-muted-foreground mt-1 italic">
          (This is not a real estimate)
        </p>
      </div>
    </div>
  );
}
