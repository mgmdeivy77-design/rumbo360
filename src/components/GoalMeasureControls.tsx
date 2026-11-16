import React, { useState } from "react";
import type { Goal } from "../types";
import { buildGoalMeasuresFromInputs, mstreak, today } from "../utils/rumboHelpers";

export const MeasureFields: React.FC<{
  onApply?: (m: Goal["m"]) => void;
  showApply?: boolean;
  onChange?: (state: {
    type: string;
    from: string;
    to: string;
    unit: string;
  }) => void;
}> = ({ onApply, showApply, onChange }) => {
  const [type, setType] = useState("a");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [unit, setUnit] = useState("");
  const [err, setErr] = useState("");

  const notify = (next: { type: string; from: string; to: string; unit: string }) => {
    setErr("");
    onChange?.(next);
  };

  const toPlaceholder =
    {
      c: "Meta: cuántas veces",
      t: "Meta: minutos en total",
      r: "Meta: días seguidos",
      s: "Meta (1 a 10)",
    }[type] || "Meta";

  const fromPlaceholder = type === "s" ? "Valor inicial (1 a 10)" : "Valor inicial";

  return (
    <div>
      <label className="sub">
        Cómo medir el logro
        <select
          value={type}
          onChange={(e) => {
            const nt = e.target.value;
            setType(nt);
            notify({ type: nt, from, to, unit });
          }}
        >
          <option value="a">Por acciones completadas</option>
          <option value="n">Meta numérica (inicio → meta)</option>
          <option value="c">Contador de veces</option>
          <option value="t">Tiempo acumulado (minutos)</option>
          <option value="s">Autoevaluación de 1 a 10</option>
          <option value="p">Porcentaje manual</option>
          <option value="y">Logrado: sí o no</option>
          <option value="r">Racha de días seguidos</option>
        </select>
      </label>

      {"nctsr".includes(type) && (
        <div>
          <div className="row">
            {"ns".includes(type) && (
              <input
                type="number"
                step="any"
                placeholder={fromPlaceholder}
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  notify({ type, from: e.target.value, to, unit });
                }}
              />
            )}
            <input
              type="number"
              step="any"
              placeholder={toPlaceholder}
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                notify({ type, from, to: e.target.value, unit });
              }}
            />
          </div>
          {type === "n" && (
            <input
              placeholder="Unidad (kg, km, USD…)"
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                notify({ type, from, to, unit: e.target.value });
              }}
            />
          )}
        </div>
      )}

      {showApply && onApply && (
        <>
          <button
            className="chip2"
            type="button"
            onClick={() => {
              const res = buildGoalMeasuresFromInputs(type, from, to, unit);
              if (res.err) {
                setErr(res.err);
                return;
              }
              setErr("");
              onApply(res.m);
            }}
          >
            Aplicar
          </button>
          {err && <p className="sub">{err}</p>}
        </>
      )}
    </div>
  );
};

export const GoalMeasureControls: React.FC<{
  goal: Goal;
  onUpdate: (updater: (g: Goal) => Goal) => void;
}> = ({ goal, onUpdate }) => {
  const [inputVal, setInputVal] = useState("");
  const m = goal.m;
  if (!m) return null;
  const t = m.t || "num";

  if (t === "yn") {
    return (
      <button
        className="pri"
        onClick={() =>
          onUpdate((g) => ({
            ...g,
            m: g.m ? { ...g.m, cur: g.m.cur ? 0 : 1 } : null,
          }))
        }
      >
        {m.cur ? "Logrado ✓ (deshacer)" : "Marcar como logrado"}
      </button>
    );
  }

  if (t === "streak") {
    const td = today();
    const doneToday = Boolean(m.log && m.log[td]);
    return (
      <button
        className="pri"
        onClick={() =>
          onUpdate((g) => {
            if (!g.m) return g;
            const log = { ...(g.m.log || {}) };
            if (log[td]) delete log[td];
            else log[td] = true;
            return { ...g, m: { ...g.m, log } };
          })
        }
      >
        {doneToday ? "Hoy lo hice ✓ (deshacer)" : "Hoy lo hice"}
      </button>
    );
  }

  if (t === "count") {
    return (
      <div className="row">
        <button
          className="pri"
          style={{ flex: 1 }}
          onClick={() =>
            onUpdate((g) => ({
              ...g,
              m: g.m ? { ...g.m, cur: Math.max(0, g.m.cur + 1) } : null,
            }))
          }
        >
          ＋1 vez
        </button>
        <button
          className="chip2"
          onClick={() =>
            onUpdate((g) => ({
              ...g,
              m: g.m ? { ...g.m, cur: Math.max(0, g.m.cur - 1) } : null,
            }))
          }
        >
          −1
        </button>
      </div>
    );
  }

  if (t === "time") {
    return (
      <div className="row">
        <input
          type="number"
          min={1}
          placeholder="Minutos de esta sesión"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button
          className="pri"
          style={{ width: "auto" }}
          onClick={() => {
            const n = Number(inputVal);
            if (!n || Number.isNaN(n)) return;
            onUpdate((g) => ({
              ...g,
              m: g.m ? { ...g.m, cur: Math.max(0, g.m.cur + n) } : null,
            }));
            setInputVal("");
          }}
        >
          Registrar
        </button>
      </div>
    );
  }

  return (
    <div className="row">
      <input
        type="number"
        step="any"
        placeholder={
          t === "scale"
            ? "Tu valor actual (1–10)"
            : t === "pct"
            ? "Porcentaje (0–100)"
            : "Valor actual"
        }
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      <button
        className="pri"
        style={{ width: "auto" }}
        onClick={() => {
          if (inputVal === "" || Number.isNaN(Number(inputVal))) return;
          const v = Number(inputVal);
          onUpdate((g) => {
            if (!g.m) return g;
            const mt = g.m.t || "num";
            const cur =
              mt === "scale"
                ? Math.min(10, Math.max(1, v))
                : mt === "pct"
                ? Math.min(100, Math.max(0, v))
                : v;
            return { ...g, m: { ...g.m, cur } };
          });
          setInputVal("");
        }}
      >
        Registrar avance
      </button>
    </div>
  );
};

export function formatGoalMeasureText(goal: Goal): string {
  const m = goal.m;
  if (!m) return "";
  const t = m.t || "num";
  if (t === "yn") return m.cur ? "logrado" : "pendiente";
  if (t === "streak") return `${mstreak(m)} de ${m.to} días seguidos`;
  if (t === "scale") return `${m.cur}/10 (meta ${m.to})`;
  if (t === "pct") return `${m.cur}%`;
  return `${m.cur} de ${m.to} ${m.unit || ""}`;
}
