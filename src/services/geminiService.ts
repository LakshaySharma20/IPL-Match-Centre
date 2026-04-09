/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { MatchState, Shot } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCommentary(state: MatchState, shot: Shot): Promise<string> {
  const prompt = `
    You are an expert IPL cricket commentator. 
    Generate a short, exciting, and witty commentary (max 15 words) for the following ball:
    
    Match: ${state.battingTeam} vs ${state.bowlingTeam}
    Batsman: ${state.onStrike === 'batsman1' ? state.batsman1.name : state.batsman2.name}
    Bowler: ${state.currentBowler.name}
    Score: ${state.runs}/${state.wickets} (${state.overs} overs)
    Result of this ball: ${shot.isWicket ? 'WICKET!' : shot.runs + ' runs'}
    
    Make it sound like a real IPL broadcast.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || "What a delivery!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return shot.isWicket ? "OUT! A massive blow for the batting side!" : `${shot.runs} runs added to the total.`;
  }
}

export async function fetchLiveScore(): Promise<Partial<MatchState> & { isLive?: boolean; result?: string }> {
  const prompt = `
    Search for the latest IPL match information. 
    If a match is currently LIVE, return its real-time score.
    If no match is currently live, return the final score and result of the MOST RECENT completed IPL match.
    
    Return the data in the following JSON format:
    {
      "battingTeam": "Team Name",
      "bowlingTeam": "Team Name",
      "runs": number,
      "wickets": number,
      "overs": "string (e.g. 15.4 or 20.0)",
      "target": number (optional),
      "isLive": boolean (true if ongoing, false if completed),
      "result": "string (e.g. MI won by 5 wickets) - only if completed"
    }
    Only return the JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Live Score Fetch Error:", error);
    return {};
  }
}
