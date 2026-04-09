/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';

interface CommentaryViewProps {
  commentary: { ball: string; text: string; type: 'wicket' | 'boundary' | 'normal' }[];
}

export default function CommentaryView({ commentary }: CommentaryViewProps) {
  return (
    <div className="bg-zinc-900/30 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800/50 h-full flex flex-col shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-mono font-bold">Live Commentary</h3>
        </div>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
          <div className="w-1 h-1 bg-zinc-800 rounded-full" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar relative z-10 mask-fade-edges">
        <AnimatePresence initial={false}>
          {commentary.slice().reverse().map((item, index) => (
            <motion.div
              key={`${item.ball}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative pl-6 transition-all duration-500 group`}
            >
              {/* Timeline dot */}
              <div className={`absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                item.type === 'wicket' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                item.type === 'boundary' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                'bg-zinc-700 group-hover:bg-zinc-500'
              }`} />
              
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider">{item.ball}</span>
                {item.type === 'wicket' && <span className="text-[8px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Wicket</span>}
                {item.type === 'boundary' && <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Boundary</span>}
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed font-serif italic opacity-80 group-hover:opacity-100 transition-opacity">
                {item.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {commentary.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 italic text-xs font-serif">
            <p className="opacity-40">Waiting for the next delivery...</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .mask-fade-edges {
          mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
        }
      `}} />
    </div>
  );
}
