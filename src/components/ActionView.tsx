/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shot } from '../types';

interface ActionViewProps {
  lastShot: Shot | null;
  strikerName: string;
  bowlerName: string;
}

export default function ActionView({ lastShot, strikerName, bowlerName }: ActionViewProps) {
  // Convert angle to x,y coordinates for animation
  const getShotCoordinates = (shot: Shot) => {
    const rad = (shot.angle - 90) * (Math.PI / 180);
    const distance = 140 * shot.distance; // Scale for view
    return {
      x: distance * Math.cos(rad),
      y: distance * Math.sin(rad)
    };
  };

  const shotCoords = lastShot ? getShotCoordinates(lastShot) : { x: 0, y: 0 };

  return (
    <div className="relative w-full aspect-[16/10] bg-[var(--background)] rounded-2xl border border-[var(--border)] overflow-hidden flex items-center justify-center shadow-inner transition-colors duration-300">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Radar Rings */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="absolute border border-[var(--border)] opacity-30 rounded-full"
            style={{ width: `${i * 33}%`, height: `${i * 33 * 1.6}%` }}
          />
        ))}
        {/* Sector Lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <div 
            key={angle}
            className="absolute w-full h-px bg-[var(--border)] opacity-20 origin-center"
            style={{ transform: `rotate(${angle}deg)` }}
          />
        ))}
      </div>

      {/* Cricket Pitch */}
      <div className="absolute w-1/5 h-full bg-[var(--muted)] border-x border-[var(--border)] flex flex-col justify-between py-16">
        <div className="w-full h-px bg-[var(--border)] opacity-50" />
        <div className="w-full h-px bg-[var(--border)] opacity-50" />
      </div>

      {/* Bowler */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="w-3 h-3 bg-[var(--muted-foreground)] rounded-full border border-[var(--border)] shadow-[0_0_10px_rgba(113,113,122,0.2)]" />
        <div className="w-px h-8 bg-gradient-to-t from-[var(--muted-foreground)] to-transparent" />
        <span className="text-[8px] text-[var(--muted-foreground)] font-mono uppercase mt-2 tracking-widest">{bowlerName}</span>
      </div>

      {/* Batsman */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[8px] text-blue-400 font-mono uppercase mb-2 tracking-widest">{strikerName}*</span>
        <div className="w-px h-8 bg-gradient-to-b from-blue-500 to-transparent" />
        <div className="w-3 h-3 bg-blue-500 rounded-full border border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
      </div>

      {/* Ball Animation */}
      <AnimatePresence mode="wait">
        {lastShot && (
          <motion.div 
            key={lastShot.id}
            className={`absolute w-2.5 h-2.5 rounded-full shadow-2xl z-20 ${lastShot.isWicket ? 'bg-[var(--foreground)]' : 'bg-red-500'}`}
            initial={{ y: 140, x: 0, opacity: 0, scale: 0.5 }}
            animate={{ 
              y: [140, -80, shotCoords.y],
              x: [0, 0, shotCoords.x],
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.5,
              times: [0, 0.2, 0.8, 1],
              ease: "circOut"
            }}
          />
        )}
      </AnimatePresence>

      {/* Shot Indicator */}
      <AnimatePresence>
        {lastShot && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 bg-[var(--card)] backdrop-blur-md border border-[var(--border)] p-3 rounded-xl flex flex-col items-end gap-1 shadow-2xl"
          >
            <span className="text-[8px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest">Last Delivery</span>
            <span className={`text-sm font-black font-mono tracking-tighter ${lastShot.isWicket ? 'text-[var(--foreground)]' : lastShot.runs >= 4 ? 'text-emerald-400' : 'text-[var(--muted-foreground)]'}`}>
              {lastShot.isWicket ? 'WICKET!' : lastShot.runs === 0 ? 'DOT BALL' : `${lastShot.runs} RUNS`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[var(--muted)] backdrop-blur-md rounded-full border border-[var(--border)]">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <span className="text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-[0.2em] font-bold">Simulating</span>
        </div>
      </div>
    </div>
  );
}
