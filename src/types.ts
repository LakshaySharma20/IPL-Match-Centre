/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Player {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  ppi: number; // Player Performance Index
}

export interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface RivalryData {
  batsman: string;
  bowler: string;
  balls: number;
  runs: number;
  dismissals: number;
  strikeRate: number;
}

export interface Fixture {
  id: string;
  date: string;
  opponent: string;
  venue: string;
  time: string;
}

export interface MatchState {
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  overs: string;
  target?: number;
  requiredRuns?: number;
  requiredOvers?: number;
  batsman1: Player;
  batsman2: Player;
  onStrike: 'batsman1' | 'batsman2';
  currentBowler: Bowler;
  lastBalls: string[];
  winProb: number; // 0 to 100
  history: { over: string; runs: number; winProb: number }[];
  commentary: { ball: string; text: string; type: 'wicket' | 'boundary' | 'normal' }[];
}

export interface Shot {
  id: string;
  angle: number; // 0 to 360
  distance: number; // 0 to 1 (normalized)
  runs: number;
  isWicket?: boolean;
}
