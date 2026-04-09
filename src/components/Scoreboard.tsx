/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MatchState } from '../types';

interface ScoreboardProps {
  state: MatchState;
}

export default function Scoreboard({ state }: ScoreboardProps) {
  return (
    <div className="bg-[var(--card)] backdrop-blur-xl rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl transition-colors duration-300">
      {/* Main Score Header */}
      <div className="p-8 border-b border-[var(--border)] bg-gradient-to-br from-[var(--muted)] to-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded border border-red-500/20 uppercase tracking-widest">Live</span>
              <h2 className="text-[var(--muted-foreground)] text-[10px] uppercase tracking-[0.2em] font-mono">Match Status</h2>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-7xl font-display font-black text-[var(--foreground)] tracking-tighter tabular-nums">
                {state.runs}<span className="text-zinc-400 dark:text-zinc-700 mx-1">/</span>{state.wickets}
              </span>
              <span className="text-2xl font-mono text-[var(--muted-foreground)] font-medium">({state.overs})</span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 bg-[var(--background)] px-4 py-2 rounded-xl border border-[var(--border)]">
              <div className="text-right">
                <p className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-wider mb-0.5">Batting</p>
                <p className="text-sm font-bold text-[var(--foreground)]">{state.battingTeam}</p>
              </div>
              <div className="w-px h-6 bg-[var(--border)]" />
              <div className="text-left">
                <p className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-wider mb-0.5">Bowling</p>
                <p className="text-sm font-bold text-[var(--muted-foreground)]">{state.bowlingTeam}</p>
              </div>
            </div>
            {state.target && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <span className="text-[10px] text-blue-400 font-mono uppercase tracking-widest">Target</span>
                <span className="text-sm font-bold text-blue-400 font-mono">{state.target}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
        {/* Batsmen Section */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-[0.2em]">Batting Stats</h3>
            <div className="flex gap-6 text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest">
              <span className="w-8 text-right">R</span>
              <span className="w-8 text-right">B</span>
              <span className="w-8 text-right">SR</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { p: state.batsman1, id: 'batsman1' },
              { p: state.batsman2, id: 'batsman2' }
            ].map(({ p, id }) => (
              <div key={p.name} className={`flex justify-between items-center p-3 rounded-xl transition-all duration-300 ${state.onStrike === id ? 'bg-emerald-500/5 border border-emerald-500/20' : 'border border-transparent'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${state.onStrike === id ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-[var(--border)]'}`} />
                  <span className={`text-sm font-medium ${state.onStrike === id ? 'text-emerald-400' : 'text-[var(--muted-foreground)]'}`}>
                    {p.name}{state.onStrike === id ? '*' : ''}
                  </span>
                </div>
                <div className="flex gap-6 font-mono text-sm">
                  <span className={`w-8 text-right font-bold ${state.onStrike === id ? 'text-emerald-400' : 'text-[var(--foreground)]'}`}>{p.runs}</span>
                  <span className="w-8 text-right text-[var(--muted-foreground)]">{p.balls}</span>
                  <span className="w-8 text-right text-[var(--muted-foreground)] text-xs">{p.strikeRate.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bowler Section */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-[0.2em]">Bowling Stats</h3>
            <div className="flex gap-6 text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest">
              <span className="w-8 text-right">O</span>
              <span className="w-8 text-right">M</span>
              <span className="w-8 text-right">R</span>
              <span className="w-8 text-right">W</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-[var(--muted-foreground)]">{state.currentBowler.name}</span>
              <div className="flex gap-6 font-mono text-sm">
                <span className="w-8 text-right text-[var(--muted-foreground)]">{state.currentBowler.overs}</span>
                <span className="w-8 text-right text-[var(--muted-foreground)]">{state.currentBowler.maidens}</span>
                <span className="w-8 text-right font-bold text-[var(--foreground)]">{state.currentBowler.runs}</span>
                <span className="w-8 text-right text-emerald-400 font-bold">{state.currentBowler.wickets}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Last Balls */}
      <div className="p-6 bg-[var(--muted)] border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-3">
          <h4 className="text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-[0.2em]">Recent Deliveries</h4>
          <div className="flex gap-2">
            {state.lastBalls.map((ball, i) => (
              <div 
                key={i} 
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold font-mono border transition-all duration-300
                  ${ball === 'W' ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 
                    ball === '4' || ball === '6' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 
                    'bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)]'}`}
              >
                {ball}
              </div>
            ))}
          </div>
        </div>
        
        {state.requiredRuns && (
          <div className="text-right bg-[var(--background)] px-6 py-4 rounded-2xl border border-[var(--border)]">
            <p className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-[0.2em] mb-1">Required Rate</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-black text-[var(--foreground)]">{state.requiredRuns}</span>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">runs in {state.requiredOvers} overs</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
