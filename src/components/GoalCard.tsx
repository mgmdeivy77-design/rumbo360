import React from "react";
import { D } from "../data/rumboData";
import type { Goal, Habit } from "../types";
import { gp } from "../utils/rumboHelpers";

export const GoalCard: React.FC<{
  goal: Goal;
  habits: Habit[];
  onClick: () => void;
}> = ({ goal, habits, onClick }) => {
  const pct = gp(goal, habits);
  const color = D[goal.dim]?.c || "#0E9488";
  return (
    <button
      className="gcn"
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <span className="grow">
        <b>{goal.t}</b>
        <small>
          {D[goal.dim]?.n}
          {goal.due ? ` · vence ${goal.due}` : ""}
        </small>
      </span>
      <span
        className="ring"
        style={{ "--p": pct, "--c": color } as React.CSSProperties}
      >
        <i>{pct}%</i>
      </span>
    </button>
  );
};
