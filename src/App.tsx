/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Scoreboard from './components/Scoreboard';
import ActionView from './components/ActionView';
import ScoringHeatmap from './components/ScoringHeatmap';
import RivalryView from './components/RivalryView';
import FixturesView from './components/FixturesView';
import WinProbabilityChart from './components/WinProbabilityChart';
import { MatchState, Shot, RivalryData, Fixture } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, Target, LayoutDashboard, Swords, CalendarDays, RefreshCw, Sun, Moon } from 'lucide-react';
import { generateCommentary, fetchLiveScore } from './services/geminiService';
import CommentaryView from './components/CommentaryView';

const MOCK_STATE: MatchState = {
  battingTeam: "Mumbai Indians",
  bowlingTeam: "Chennai Super Kings",
  runs: 192,
  wickets: 4,
  overs: "19.1",
  target: 205,
  requiredRuns: 13,
  requiredOvers: 0.5,
  batsman1: {
    name: "Rohit Sharma",
    runs: 94,
    balls: 52,
    fours: 8,
    sixes: 4,
    strikeRate: 180.7,
    ppi: 88
  },
  batsman2: {
    name: "Suryakumar Yadav",
    runs: 31,
    balls: 14,
    fours: 2,
    sixes: 3,
    strikeRate: 221.4,
    ppi: 72
  },
  onStrike: 'batsman1',
  currentBowler: {
    name: "Matheesha Pathirana",
    overs: 3.1,
    maidens: 0,
    runs: 42,
    wickets: 2,
    economy: 13.5
  },
  lastBalls: ["6", "4", "1", "6", "W", "1"],
  winProb: 52,
  history: [
    { over: "15", runs: 142, winProb: 45 },
    { over: "16", runs: 155, winProb: 48 },
    { over: "17", runs: 168, winProb: 42 },
    { over: "18", runs: 182, winProb: 50 },
    { over: "19", runs: 192, winProb: 52 },
  ],
  commentary: []
};

const MOCK_RIVALRY: RivalryData = {
  batsman: "Rohit Sharma",
  bowler: "Matheesha Pathirana",
  balls: 42,
  runs: 78,
  dismissals: 2,
  strikeRate: 185.7
};

const MOCK_FIXTURES: Fixture[] = [
  { id: '1', date: 'APR 12', opponent: 'RCB', venue: 'WANKHEDE STADIUM', time: '19:30' },
  { id: '2', date: 'APR 15', opponent: 'GT', venue: 'NARENDRA MODI STADIUM', time: '19:30' },
  { id: '3', date: 'APR 18', opponent: 'LSG', venue: 'EKANA STADIUM', time: '19:30' },
];

const INITIAL_SHOTS: Shot[] = [
  { id: 's1', angle: 45, distance: 0.8, runs: 4 },
  { id: 's2', angle: 90, distance: 0.9, runs: 6 },
  { id: 's3', angle: 220, distance: 0.85, runs: 4 },
  { id: 's4', angle: 315, distance: 0.95, runs: 6 },
  { id: 's5', angle: 180, distance: 0.7, runs: 4 },
  { id: 's6', angle: 60, distance: 0.8, runs: 4 },
];

export default function App() {
  const [matchState, setMatchState] = useState<MatchState>(MOCK_STATE);
  const [shots, setShots] = useState<Shot[]>(INITIAL_SHOTS);
  const [lastShot, setLastShot] = useState<Shot | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'rivalry' | 'fixtures'>('live');

  const [isFetching, setIsFetching] = useState(false);
  const [isAutoSync, setIsAutoSync] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Update document class when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleFetchLiveScore = async () => {
    setIsFetching(true);
    setSyncError(null);
    try {
      const liveData = await fetchLiveScore();
      if (liveData.battingTeam) {
        const isMatchLive = liveData.isLive ?? true;
        
        setMatchState(prev => ({
          ...prev,
          ...liveData,
          // Reset some state if team changes
          batsman1: liveData.battingTeam === prev.battingTeam ? prev.batsman1 : { ...prev.batsman1, runs: 0, balls: 0, ppi: 50 },
          batsman2: liveData.battingTeam === prev.battingTeam ? prev.batsman2 : { ...prev.batsman2, runs: 0, balls: 0, ppi: 50 },
          commentary: [
            { 
              ball: liveData.overs || '0.0', 
              text: isMatchLive ? `Live data synced: ${liveData.battingTeam} score updated.` : `Recent Match Data: ${liveData.result || 'Match completed.'}`, 
              type: 'normal' 
            }, 
            ...prev.commentary
          ]
        }));
        setLastSyncTime(new Date());
        
        // If match is completed, switch to fixtures tab after a short delay or just show it
        if (!isMatchLive) {
          setIsAutoSync(false); // Stop auto-sync if match is over
        }
      } else {
        setSyncError("No match data found.");
      }
    } catch (err) {
      setSyncError("Failed to fetch match data.");
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  const simulateNewShot = useCallback(async () => {
    const isWicket = Math.random() < 0.08;
    const runs = isWicket ? 0 : [0, 1, 2, 4, 6][Math.floor(Math.random() * 5)];
    
    const newShot: Shot = {
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      angle: Math.random() * 360,
      distance: 0.3 + Math.random() * 0.65,
      runs,
      isWicket
    };

    setLastShot(newShot);
    setShots(prev => [...prev, newShot]);
    
    // Generate AI commentary
    const commText = await generateCommentary(matchState, newShot);

    setMatchState(prev => {
      const newRuns = prev.runs + runs;
      const newWickets = isWicket ? prev.wickets + 1 : prev.wickets;
      
      const [overStr, ballStr] = prev.overs.split('.');
      let over = parseInt(overStr);
      let ball = parseInt(ballStr) + 1;
      
      let nextOnStrike = prev.onStrike;
      
      // Strike rotation on odd runs
      if (runs === 1 || runs === 3) {
        nextOnStrike = prev.onStrike === 'batsman1' ? 'batsman2' : 'batsman1';
      }

      // Over completion
      if (ball >= 6) {
        over += 1;
        ball = 0;
        // Strike rotation at end of over
        nextOnStrike = nextOnStrike === 'batsman1' ? 'batsman2' : 'batsman1';
      }
      
      const newOvers = `${over}.${ball}`;

      // Update win probability
      let newWinProb = prev.winProb + (runs * 1.5) - (isWicket ? 12 : 0);
      newWinProb = Math.min(99, Math.max(1, newWinProb));

      // Update Batsman stats
      const updateBatsman = (b: any, isStriker: boolean) => {
        if (!isStriker) return b;
        if (isWicket) return { ...b, balls: b.balls + 1, ppi: Math.max(0, b.ppi - 20) };
        return {
          ...b,
          runs: b.runs + runs,
          balls: b.balls + 1,
          fours: b.fours + (runs === 4 ? 1 : 0),
          sixes: b.sixes + (runs === 6 ? 1 : 0),
          strikeRate: ((b.runs + runs) / (b.balls + 1)) * 100,
          ppi: Math.min(100, b.ppi + (runs * 2))
        };
      };

      const newBatsman1 = updateBatsman(prev.batsman1, prev.onStrike === 'batsman1');
      const newBatsman2 = updateBatsman(prev.batsman2, prev.onStrike === 'batsman2');

      // If wicket, replace striker with a "new" player (simplified)
      if (isWicket) {
        const newPlayer = {
          name: "New Batsman",
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          ppi: 50
        };
        if (prev.onStrike === 'batsman1') newBatsman1.name = "Hardik Pandya"; // Example
        else newBatsman2.name = "Tim David";
      }

      const newComm = {
        ball: newOvers,
        text: commText,
        type: isWicket ? 'wicket' : (runs >= 4 ? 'boundary' : 'normal') as any
      };

      return {
        ...prev,
        runs: newRuns,
        wickets: newWickets,
        overs: newOvers,
        onStrike: nextOnStrike,
        requiredRuns: prev.target ? Math.max(0, prev.target - newRuns) : undefined,
        lastBalls: [...prev.lastBalls.slice(1), isWicket ? 'W' : runs.toString()],
        winProb: newWinProb,
        batsman1: newBatsman1,
        batsman2: newBatsman2,
        commentary: [...prev.commentary, newComm].slice(-10), // Keep last 10
        history: ball === 0 ? [...prev.history, { over: over.toString(), runs: newRuns, winProb: newWinProb }] : prev.history
      };
    });
  }, [matchState]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoSync) {
        handleFetchLiveScore();
        return;
      }

      const [overStr, ballStr] = matchState.overs.split('.');
      const over = parseInt(overStr);
      const isMatchOver = (matchState.target && matchState.runs >= matchState.target) || over >= 20 || matchState.wickets >= 10;
      
      if (!isMatchOver) {
        simulateNewShot();
      }
    }, isAutoSync ? 30000 : 5000); // 30s for auto-sync, 5s for simulation
    return () => clearInterval(interval);
  }, [simulateNewShot, matchState.overs, matchState.runs, matchState.target, matchState.wickets, isAutoSync]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[var(--border)] pb-8">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-blue-600 p-2.5 rounded-xl shadow-[0_0_25px_rgba(37,99,235,0.3)]"
            >
              <Trophy className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-display font-extrabold tracking-tight text-[var(--foreground)]">IPL MATCH CENTER</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-[var(--muted-foreground)] font-mono uppercase tracking-[0.2em]">TATA IPL 2026 • LIVE BROADCAST</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 bg-[var(--muted)] p-1.5 rounded-xl border border-[var(--border)] backdrop-blur-md">
            <div className="flex gap-1">
              <button 
                onClick={() => setActiveTab('live')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all duration-300 ${activeTab === 'live' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Live
              </button>
              <button 
                onClick={() => setActiveTab('rivalry')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all duration-300 ${activeTab === 'rivalry' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}
              >
                <Swords className="w-3.5 h-3.5" />
                Rivalry
              </button>
              <button 
                onClick={() => setActiveTab('fixtures')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all duration-300 ${activeTab === 'fixtures' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]'}`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                Fixtures
              </button>
            </div>
            
            <div className="h-6 w-px bg-[var(--border)] mx-1 hidden sm:block" />

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Auto Sync Toggle */}
              <div className="flex items-center gap-3 bg-[var(--background)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                <span className="text-[9px] font-bold uppercase text-[var(--muted-foreground)] tracking-wider">Auto Sync</span>
                <button 
                  onClick={() => setIsAutoSync(!isAutoSync)}
                  className={`relative w-9 h-5 rounded-full transition-all duration-500 ${isAutoSync ? 'bg-emerald-600' : 'bg-zinc-400 dark:bg-zinc-700'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isAutoSync ? 'left-5' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={handleFetchLiveScore}
                  disabled={isFetching}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all duration-300 border ${isFetching ? 'bg-blue-600/10 text-blue-400 border-blue-500/30' : 'bg-[var(--accent)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] border-[var(--border)]'}`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                  {isFetching ? 'Syncing...' : 'Fetch Latest'}
                </button>
                <div className="flex flex-col items-end">
                  {lastSyncTime && (
                    <span className="text-[8px] text-[var(--muted-foreground)] font-mono uppercase tracking-wider">
                      Last Sync: {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  )}
                  {syncError && (
                    <span className="text-[8px] text-red-500 font-mono uppercase tracking-wider">
                      {syncError}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          <AnimatePresence>
            {((matchState.target && matchState.runs >= matchState.target) || parseInt(matchState.overs.split('.')[0]) >= 20 || matchState.wickets >= 10) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-md rounded-3xl border border-[var(--border)]"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="text-center p-12 bg-[var(--card)] rounded-3xl border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.15)] max-w-md"
                >
                  <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                  <h2 className="text-4xl font-display font-black mb-4 text-[var(--foreground)] tracking-tight">MATCH OVER</h2>
                  <p className="text-blue-400 font-mono text-xl mb-8 leading-relaxed">
                    {matchState.target && matchState.runs >= matchState.target 
                      ? `${matchState.battingTeam} won by ${10 - matchState.wickets} wickets!` 
                      : `${matchState.bowlingTeam} won the match!`}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40"
                  >
                    Reset Match
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Left Column: Action & Heatmap */}
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <section>
              <ActionView 
                lastShot={lastShot} 
                strikerName={matchState.onStrike === 'batsman1' ? matchState.batsman1.name : matchState.batsman2.name} 
                bowlerName={matchState.currentBowler.name}
              />
            </section>
            <section>
              <ScoringHeatmap shots={shots} />
            </section>
          </div>

          {/* Center Column: Scoreboard & Tabs */}
          <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
            {activeTab === 'live' ? (
              <>
                <section>
                  <Scoreboard state={matchState} />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                    <WinProbabilityChart data={matchState.history} />
                  </section>
                  
                  <section>
                    <CommentaryView commentary={matchState.commentary} />
                  </section>
                </div>

                <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800/50">
                  <h3 className="text-zinc-400 text-xs uppercase tracking-widest mb-4 font-mono">Performance Index (PPI)</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-zinc-300 font-bold">{matchState.batsman1.name}</span>
                          <span className="text-xs font-mono text-emerald-400">{matchState.batsman1.ppi.toFixed(0)} PPI</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-1000" 
                            style={{ width: `${matchState.batsman1.ppi}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-zinc-300 font-bold">{matchState.batsman2.name}</span>
                          <span className="text-xs font-mono text-blue-400">{matchState.batsman2.ppi.toFixed(0)} PPI</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-1000" 
                            style={{ width: `${matchState.batsman2.ppi}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-mono italic">
                        PPI is a real-time metric calculating impact based on SR, pressure, and boundary frequency.
                      </p>
                    </div>
                  </div>
              </>
            ) : activeTab === 'rivalry' ? (
              <section className="h-full">
                <RivalryView data={MOCK_RIVALRY} />
              </section>
            ) : (
              <section className="h-full">
                <FixturesView fixtures={MOCK_FIXTURES} teamName={matchState.battingTeam} />
              </section>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">Powered by AI Studio • Real-time Cricket Analytics Engine</p>
        </footer>
      </div>
    </div>
  );
}
