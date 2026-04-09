/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RivalryData } from '../types';
import { Swords, Zap, ShieldAlert } from 'lucide-react';

interface RivalryViewProps {
  data: RivalryData;
}

export default function RivalryView({ data }: RivalryViewProps) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full">
      <div className="flex items-center gap-2 mb-6">
        <Swords className="w-5 h-5 text-blue-500" />
        <h3 className="text-zinc-400 text-xs uppercase tracking-widest font-mono">Historical Rivalry</h3>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/30">
            <span className="text-blue-400 font-bold">RS</span>
          </div>
          <p className="text-xs font-bold text-zinc-300">{data.batsman}</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-600 uppercase font-mono mb-1">vs</span>
          <div className="h-px w-16 bg-zinc-800" />
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-zinc-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-zinc-500/30">
            <span className="text-zinc-400 font-bold">MP</span>
          </div>
          <p className="text-xs font-bold text-zinc-300">{data.bowler}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-[10px] text-zinc-500 uppercase font-mono">Strike Rate</span>
          </div>
          <p className="text-xl font-bold text-zinc-200 font-mono">{data.strikeRate.toFixed(1)}</p>
        </div>
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-3 h-3 text-red-500" />
            <span className="text-[10px] text-zinc-500 uppercase font-mono">Dismissals</span>
          </div>
          <p className="text-xl font-bold text-red-400 font-mono">{data.dismissals}</p>
        </div>
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
          <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Runs Scored</span>
          <p className="text-xl font-bold text-zinc-200 font-mono">{data.runs}</p>
        </div>
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/50">
          <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Balls Faced</span>
          <p className="text-xl font-bold text-zinc-200 font-mono">{data.balls}</p>
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
        <p className="text-[10px] text-blue-400/80 leading-relaxed font-mono italic">
          "Pathirana has troubled Rohit with the yorker length, dismissing him twice in the last 3 encounters."
        </p>
      </div>
    </div>
  );
}
