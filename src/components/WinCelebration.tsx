import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  Star, 
  PartyPopper, 
  CheckCircle2, 
  TrendingUp, 
  RotateCcw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayPerformance } from '../types';

interface WinCelebrationProps {
  record: DayPerformance;
  dateFormatted: string;
  triggerKey: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'star';
  rotation: number;
  delay: number;
}

const PARTICLE_COLORS = [
  '#10B981', // Emerald
  '#34D399', // Mint
  '#F59E0B', // Amber
  '#FBBF24', // Gold
  '#A855F7', // Purple
  '#C084FC', // Light Purple
  '#06B6D4', // Cyan
  '#FFFFFF', // White
];

export const WinCelebration: React.FC<WinCelebrationProps> = ({
  record,
  dateFormatted,
  triggerKey,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showCelebration, setShowCelebration] = useState<boolean>(true);
  const [replayCount, setReplayCount] = useState<number>(0);

  // Trigger celebratory effects on mount or whenever triggerKey / replay changes
  useEffect(() => {
    setShowCelebration(true);

    // 1. Generate Framer-Motion floating particles
    const newParticles: Particle[] = Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = 70 + Math.random() * 110;
      return {
        id: i + Date.now(),
        x: 0,
        y: 0,
        targetX: Math.cos(angle) * distance,
        targetY: Math.sin(angle) * distance + (Math.random() * 30 - 15),
        size: 5 + Math.random() * 7,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        shape: i % 3 === 0 ? 'star' : i % 2 === 0 ? 'square' : 'circle',
        rotation: Math.random() * 360,
        delay: Math.random() * 0.15,
      };
    });
    setParticles(newParticles);

    // 2. Fire dual celebratory canvas confetti blast
    try {
      // First immediate burst
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.65, x: 0.5 },
        colors: ['#10B981', '#34D399', '#FBBF24', '#A855F7', '#06B6D4'],
        disableForReducedMotion: true,
      });

      // Second staggered cascade burst for high energy
      const timer = setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 55,
          origin: { x: 0.25, y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#C084FC'],
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 55,
          origin: { x: 0.75, y: 0.6 },
          colors: ['#10B981', '#FBBF24', '#06B6D4'],
        });
      }, 250);

      return () => clearTimeout(timer);
    } catch {
      // Fallback if canvas-confetti fails or in restricted iframe
    }
  }, [triggerKey, replayCount]);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReplayCount(prev => prev + 1);
  };

  const isCleanSweep = record.losses === 0;

  return (
    <div className="relative overflow-hidden my-1">
      {/* FLOATING MOTION PARTICLES (Burst from center) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden">
        <AnimatePresence>
          {showCelebration &&
            particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: p.targetX,
                  y: p.targetY,
                  scale: [0, 1.2, 0.9, 0],
                  opacity: [1, 1, 0.8, 0],
                  rotate: [0, p.rotation, p.rotation * 2],
                }}
                transition={{
                  duration: 1.6,
                  delay: p.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: 'absolute',
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : '1px',
                  boxShadow: `0 0 8px ${p.color}`,
                }}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* MAIN CELEBRATION HERO BANNER */}
      <motion.div
        key={`celebration-card-${triggerKey}-${replayCount}`}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 24,
        }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2218] via-[#11192e] to-[#1a0f2e] border border-emerald-500/50 p-4 shadow-xl shadow-emerald-950/40"
      >
        {/* Shimmering Animated Top Border */}
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'linear',
          }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80"
        />

        {/* Ambient Radial Glowing Halos */}
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left: Trophy and Winning Announcement */}
          <div className="flex items-center gap-3.5">
            {/* Animated Trophy Container */}
            <div className="relative shrink-0">
              {/* Rotating golden sunburst ring behind trophy */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                className="absolute -inset-1.5 rounded-full border border-dashed border-amber-400/40 opacity-70 pointer-events-none"
              />

              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{
                  scale: [0, 1.25, 1],
                  rotate: [-25, 12, 0],
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 18,
                  delay: 0.1,
                }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 font-black relative"
              >
                <Trophy className="w-6 h-6 stroke-[2.2] text-slate-950 fill-amber-200 drop-shadow-xs" />
                
                {/* Tiny Star Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.4, 1] }}
                  transition={{ delay: 0.35, duration: 0.3 }}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border border-slate-900"
                >
                  <Star className="w-2.5 h-2.5 fill-white" />
                </motion.div>
              </motion.div>
            </div>

            {/* Win Text Headlines */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs font-black tracking-wider text-emerald-400 uppercase flex items-center gap-1"
                >
                  <PartyPopper className="w-3.5 h-3.5 text-emerald-400" />
                  {isCleanSweep ? '100% CLEAN SWEEP WIN!' : 'OFFICIAL WINNING DAY!'}
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="px-2 py-0.2 rounded-full font-black text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                >
                  {record.winRate}% Strike Rate
                </motion.span>
              </div>

              <motion.h4
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm font-bold text-white mt-0.5"
              >
                {isCleanSweep
                  ? `Flawless Victory: All ${record.totalPicks} picks cashed in!`
                  : `${record.wins} of ${record.totalPicks} predictions landed successfully`}
              </motion.h4>
            </div>
          </div>

          {/* Right: Key Stats Pills & Replay Trigger */}
          <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end pt-1 sm:pt-0">
            {record.totalOddsWon && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>@{record.totalOddsWon} Total Odds</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReplay}
              title="Replay Celebration Animation"
              className="p-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] font-medium"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Celebrate</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
