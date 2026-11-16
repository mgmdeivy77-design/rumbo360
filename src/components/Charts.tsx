import React from "react";
import { D, DN } from "../data/rumboData";
import type { Habit, MoodEntry } from "../types";
import { add, dow, today } from "../utils/rumboHelpers";

export const LifeWheel: React.FC<{ scores?: number[] }> = ({ scores }) => {
  const n = D.length;
  const L = 96;
  const pet = (l: number) => {
    const w = l * 0.27;
    return `M0 0C${-w} ${-l * 0.3} ${-w * 0.8} ${-l * 0.82} 0 ${-l}C${w * 0.8} ${-l * 0.82} ${w} ${-l * 0.3} 0 0Z`;
  };

  return (
    <svg viewBox="-16 0 292 260" role="img" aria-label="Rueda de vida">
      {D.map((d, i) => {
        const a = -90 + (i * 360) / n;
        const v = scores ? scores[i] : 0;
        const len = 14 + (v / 100) * (L - 14);
        const m = (a * Math.PI) / 180;
        return (
          <g key={d.s}>
            <g transform={`translate(130 130) rotate(${a + 90})`}>
              <path
                d={pet(L)}
                fill={d.c}
                fillOpacity=".14"
                stroke={d.c}
                strokeOpacity=".35"
                strokeWidth="1"
              />
              {scores && <path d={pet(len)} fill={d.c} fillOpacity=".9" />}
            </g>
            <text
              x={130 + 116 * Math.cos(m)}
              y={130 + 116 * Math.sin(m)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fontWeight="700"
              fill={d.c}
            >
              {d.s}
            </text>
          </g>
        );
      })}
      <circle cx="130" cy="130" r="5" fill="var(--ink)" opacity=".5" />
    </svg>
  );
};

export const MoodChart: React.FC<{ moods: MoodEntry[] }> = ({ moods }) => {
  const ds = Array.from({ length: 7 }, (_, i) => add(today(), i - 6));
  const pt = ds
    .map((d, i) => {
      const m = moods.find((x) => x.date === d);
      return m && m.mood ? ([20 + i * 47, 120 - (m.mood - 1) * 25] as [number, number]) : null;
    })
    .filter((p): p is [number, number] => Boolean(p));

  return (
    <svg viewBox="0 0 330 150" role="img" aria-label="Clima interior de la semana">
      {[1, 2, 3, 4, 5].map((n) => (
        <g key={n}>
          <line
            x1="20"
            x2="325"
            y1={120 - (n - 1) * 25}
            y2={120 - (n - 1) * 25}
            stroke="var(--line)"
          />
          <text x="4" y={124 - (n - 1) * 25} fontSize="10" fill="var(--mute)">
            {n}
          </text>
        </g>
      ))}
      {pt.length > 1 && (
        <polyline
          points={pt.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="var(--acc)"
          strokeWidth="3"
        />
      )}
      {pt.map((p, idx) => (
        <circle key={idx} cx={p[0]} cy={p[1]} r="5" fill="var(--acc)" />
      ))}
      {ds.map((d, i) => (
        <text
          key={d}
          x={20 + i * 47}
          y="144"
          fontSize="10"
          textAnchor="middle"
          fill="var(--mute)"
        >
          {DN[dow(d)]}
        </text>
      ))}
    </svg>
  );
};

export const BarChart: React.FC<{
  values: number[];
  labels: string[];
  color: string;
  demo?: boolean;
}> = ({ values, labels, color, demo }) => {
  const mx = Math.max(1, ...values);
  return (
    <div className={`bars ${demo ? "demo" : ""}`}>
      {values.map((x, i) => (
        <div key={i}>
          <small>{x || ""}</small>
          <i style={{ height: `${Math.round((x / mx) * 140)}px`, background: color }} />
          <small>{labels[i]}</small>
        </div>
      ))}
    </div>
  );
};

export const YearHeatmap: React.FC<{ habit: Habit }> = ({ habit }) => {
  const y = new Date().getFullYear();
  const offset = dow(y + "-01-01");
  const n = Math.round(
    (new Date(y + 1, 0, 1).getTime() - new Date(y, 0, 1).getTime()) / 864e5
  );
  return (
    <div className="yr">
      {Array.from({ length: offset }, (_, i) => (
        <i key={`e${i}`} className="e" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const d = add(y + "-01-01", i);
        return <i key={d} className={habit.log[d] ? "y" : ""} />;
      })}
    </div>
  );
};
