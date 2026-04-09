/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Fixture } from '../types';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface FixturesViewProps {
  fixtures: Fixture[];
  teamName: string;
}

export default function FixturesView({ fixtures, teamName }: FixturesViewProps) {
  return (
    <div className="bg-[var(--card)] backdrop-blur-xl p-8 rounded-2xl border border-[var(--border)] h-full shadow-2xl relative overflow-hidden transition-colors duration-300">
      {/* Decorative background element */}
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-[var(--muted-foreground)] text-[10px] uppercase tracking-[0.2em] font-mono font-bold">Upcoming Fixtures</h3>
        </div>
        <span className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest">{teamName}</span>
      </div>

      <div className="space-y-4 relative z-10">
        {fixtures.map((f) => (
          <div key={f.id} className="group p-5 bg-[var(--muted)] rounded-2xl border border-[var(--border)] hover:border-emerald-500/30 transition-all duration-300 hover:bg-[var(--accent)]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded border border-emerald-500/20 uppercase tracking-widest">
                  {f.date}
                </span>
                <div className="h-px w-4 bg-[var(--border)]" />
                <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-mono font-bold tracking-tighter">{f.time}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--background)] flex items-center justify-center border border-[var(--border)] group-hover:border-emerald-500/30 transition-colors">
                <span className="text-xs font-black text-[var(--muted-foreground)]">{teamName.substring(0, 2).toUpperCase()}</span>
              </div>
              <span className="text-xs font-mono text-[var(--muted-foreground)] italic">vs</span>
              <div className="w-10 h-10 rounded-full bg-[var(--background)] flex items-center justify-center border border-[var(--border)] group-hover:border-emerald-500/30 transition-colors">
                <span className="text-xs font-black text-[var(--foreground)]">{f.opponent}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-display font-bold text-[var(--foreground)] tracking-tight">Match Day {f.id}</h4>
                <p className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-wider">IPL Season 2026</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] border-t border-[var(--border)] pt-4">
              <MapPin className="w-3 h-3" />
              <span className="text-[9px] uppercase font-mono tracking-widest group-hover:text-[var(--foreground)] transition-colors">{f.venue}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 relative z-10">
        <button className="w-full py-3 rounded-xl border border-[var(--border)] text-[10px] text-[var(--muted-foreground)] uppercase tracking-[0.2em] font-bold hover:bg-[var(--accent)] hover:text-[var(--foreground)] transition-all">
          View Full Schedule
        </button>
      </div>
    </div>
  );
}
