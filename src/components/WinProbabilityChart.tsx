/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface WinProbabilityChartProps {
  data: { over: string; winProb: number }[];
}

export default function WinProbabilityChart({ data }: WinProbabilityChartProps) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full">
      <h3 className="text-zinc-400 text-xs uppercase tracking-widest mb-6 font-mono">Win Probability Swing</h3>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="over" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              label={{ value: 'OVERS', position: 'insideBottom', offset: -5, fill: '#3f3f46', fontSize: 8 }}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              ticks={[0, 50, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
              labelStyle={{ color: '#a1a1aa', fontSize: '10px', marginBottom: '4px' }}
              formatter={(value: number) => [`${value}%`, 'Win Prob']}
            />
            <ReferenceLine y={50} stroke="#3f3f46" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="winProb" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 2, fill: '#3b82f6' }}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-600 uppercase font-mono">Current Prob</span>
          <span className="text-lg font-bold text-blue-500 font-mono">{data[data.length - 1]?.winProb}%</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-zinc-600 uppercase font-mono">Momentum</span>
          <span className="text-lg font-bold text-emerald-500 font-mono">↑ High</span>
        </div>
      </div>
    </div>
  );
}
