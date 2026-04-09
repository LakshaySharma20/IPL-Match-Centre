/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Shot } from '../types';

interface ScoringHeatmapProps {
  shots: Shot[];
}

export default function ScoringHeatmap({ shots }: ScoringHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 280;
    const height = 280;
    const radius = Math.min(width, height) / 2 - 30;

    // Persistent container
    let g = svg.select<SVGGElement>("g.main-container");
    if (g.empty()) {
      g = svg.append("g")
        .attr("class", "main-container")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // Draw static elements once
      g.append("circle")
        .attr("class", "boundary")
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4")
        .attr("class", "text-[var(--border)] opacity-50");

      g.append("rect")
        .attr("class", "pitch")
        .attr("x", -8)
        .attr("y", -24)
        .attr("width", 16)
        .attr("height", 48)
        .attr("fill", "currentColor")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 0.5)
        .attr("rx", 1)
        .attr("class", "text-[var(--background)] stroke-[var(--border)]");

      const sectors = [
        { label: "Off", angle: 0 },
        { label: "Cover", angle: 45 },
        { label: "Point", angle: 90 },
        { label: "Third Man", angle: 135 },
        { label: "Fine Leg", angle: 180 },
        { label: "Square Leg", angle: 225 },
        { label: "Mid Wicket", angle: 270 },
        { label: "Mid On", angle: 315 },
      ];

      sectors.forEach(s => {
        const rad = (s.angle - 90) * (Math.PI / 180);
        const x = (radius + 20) * Math.cos(rad);
        const y = (radius + 20) * Math.sin(rad);

        g.append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "currentColor")
          .attr("font-size", "7px")
          .attr("font-family", "monospace")
          .attr("font-weight", "bold")
          .attr("class", "text-[var(--muted-foreground)]")
          .text(s.label.toUpperCase());
      });

      // Layer groups to ensure correct z-index
      g.append("g").attr("class", "heatmap-layer");
      g.append("g").attr("class", "shots-layer");
    }

    // Heatmap calculation
    const numSectors = 16;
    const numRings = 4;
    const binData = Array.from({ length: numSectors * numRings }, (_, i) => ({
      sector: i % numSectors,
      ring: Math.floor(i / numSectors),
      count: 0
    }));

    shots.forEach(shot => {
      const sector = Math.floor(((shot.angle % 360 + 360) % 360) / (360 / numSectors));
      const ring = Math.min(Math.floor(shot.distance * numRings), numRings - 1);
      const binIndex = ring * numSectors + sector;
      binData[binIndex].count += 1;
    });

    const maxCount = d3.max(binData, d => d.count) || 1;
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxCount]);

    const arcGenerator = d3.arc<any>()
      .innerRadius(d => (d.ring * radius) / numRings)
      .outerRadius(d => ((d.ring + 1) * radius) / numRings)
      .startAngle(d => (d.sector * 2 * Math.PI) / numSectors)
      .endAngle(d => ((d.sector + 1) * 2 * Math.PI) / numSectors);

    // Heatmap Bins Join
    const heatmapLayer = g.select(".heatmap-layer");
    heatmapLayer.selectAll(".heatmap-bin")
      .data(binData.filter(d => d.count > 0), (d: any) => `${d.sector}-${d.ring}`)
      .join(
        enter => enter.append("path")
          .attr("class", "heatmap-bin")
          .attr("d", arcGenerator)
          .attr("stroke", "currentColor")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0)
          .attr("class", "stroke-[var(--background)]")
          .call(enter => enter.transition().duration(800).attr("opacity", 0.4).attr("fill", d => colorScale(d.count))),
        update => update.call(update => update.transition().duration(800).attr("fill", d => colorScale(d.count))),
        exit => exit.call(exit => exit.transition().duration(500).attr("opacity", 0).remove())
      );

    // Shots Dots Join
    const shotsLayer = g.select(".shots-layer");
    shotsLayer.selectAll(".shot-dot")
      .data(shots, (d: any) => d.id)
      .join(
        enter => enter.append("circle")
          .attr("class", "shot-dot")
          .attr("cx", d => {
            const rad = (d.angle - 90) * (Math.PI / 180);
            return d.distance * radius * Math.cos(rad);
          })
          .attr("cy", d => {
            const rad = (d.angle - 90) * (Math.PI / 180);
            return d.distance * radius * Math.sin(rad);
          })
          .attr("r", 0)
          .attr("fill", d => d.runs === 4 ? "#10b981" : d.runs === 6 ? "#3b82f6" : "#71717a")
          .attr("opacity", 0)
          .attr("stroke", "currentColor")
          .attr("stroke-width", 0.5)
          .attr("class", "stroke-[var(--background)]")
          .call(enter => enter.transition().duration(800).attr("r", 2.5).attr("opacity", 1)),
        update => update,
        exit => exit.call(exit => exit.transition().duration(500).attr("r", 0).attr("opacity", 0).remove())
      );

  }, [shots]);

  return (
    <div className="bg-[var(--card)] backdrop-blur-xl p-8 rounded-2xl border border-[var(--border)] flex flex-col items-center shadow-2xl transition-colors duration-300">
      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-[var(--muted-foreground)] text-[10px] uppercase tracking-[0.2em] font-mono font-bold">Scoring Zones</h3>
        <div className="flex gap-3">
          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
          <div className="w-1 h-1 bg-blue-500 rounded-full" />
          <div className="w-1 h-1 bg-[var(--muted-foreground)] rounded-full" />
        </div>
      </div>
      <svg ref={svgRef} width="280" height="280" className="max-w-full h-auto drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
      <div className="grid grid-cols-3 gap-6 mt-8 w-full">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest">Fours</span>
          <span className="text-xs font-bold text-emerald-500 font-mono">{shots.filter(s => s.runs === 4).length}</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-x border-[var(--border)]">
          <span className="text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest">Sixes</span>
          <span className="text-xs font-bold text-blue-500 font-mono">{shots.filter(s => s.runs === 6).length}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] text-[var(--muted-foreground)] font-mono uppercase tracking-widest">Wickets</span>
          <span className="text-xs font-bold text-[var(--foreground)] font-mono">{shots.filter(s => s.isWicket).length}</span>
        </div>
      </div>
    </div>
  );
}
