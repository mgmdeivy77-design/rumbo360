import React, { useState } from "react";
import { LifeWheel } from "../components/Charts";
import { GoalCard } from "../components/GoalCard";
import {
  formatGoalMeasureText,
  GoalMeasureControls,
  MeasureFields,
} from "../components/GoalMeasureControls";
import { Ico } from "../components/Icons";
import { D, DN, HZ, MN, PG, PR, RM, RMO_OPTIONS, WD } from "../data/rumboData";
import type { Goal, GoalDraft, Habit, Horizon, RumboState } from "../types";
import { aiAskJson } from "../utils/aiClient";
import {
  add,
  avg,
  buildGoalMeasuresFromInputs,
  cleanGoalDraft,
  gp,
  hlogs,
  localGoalDraft,
  today,
  uid,
} from "../utils/rumboHelpers";

const Head: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <>
    <div className="row">
      <button className="ic" onClick={onBack} aria-label="Volver">
        ‹
      </button>
      <h2 className="grow" style={{ margin: 0 }}>
        {title}
      </h2>
    </div>
    <br />
  </>
);

export const WheelView: React.FC<{
  S: RumboState;
  param: string | null;
  onBack: () => void;
  onOpen: (scr: string, par?: string | null) => void;
  onSaveEval: (scores: number[]) => void;
}> = ({ S, param, onBack, onOpen, onSaveEval }) => {
  const [vals, setVals] = useState<number[][]>(() =>
    D.map(() => [3, 3, 3])
  );

  if (param === "form") {
    return (
      <>
        <Head title="Evaluación" onBack={onBack} />
        <p className="sub">1 = nada cierto, 5 = totalmente cierto.</p>
        {D.map((d, i) => (
          <div key={d.s} className="card">
            <h3 style={{ color: d.c }}>{d.n}</h3>
            {d.q.map((q, j) => (
              <label key={j} style={{ display: "block", marginBottom: 6 }}>
                {q}: <b>{vals[i][j]}</b>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={vals[i][j]}
                  onChange={(e) => {
                    const v = +e.target.value;
                    setVals((prev) =>
                      prev.map((row, ri) =>
                        ri === i ? row.map((c, ci) => (ci === j ? v : c)) : row
                      )
                    );
                  }}
                />
              </label>
            ))}
          </div>
        ))}
        <button
          className="pri"
          onClick={() =>
            onSaveEval(
              vals.map((row) => Math.round(((avg(row) - 1) / 4) * 100))
            )
          }
        >
          Guardar evaluación
        </button>
      </>
    );
  }

  const L = S.evals.at(-1);
  const prev = S.evals.at(-2);

  return (
    <>
      <Head title="Balance de vida" onBack={onBack} />
      <LifeWheel scores={L?.sc} />
      <button className="pri" onClick={() => onOpen("wheel", "form")}>
        {L ? "Evaluar de nuevo" : "Comenzar evaluación"}
      </button>
      {L && (
        <>
          <p className="sub">
            Última evaluación: {L.date}
            {prev
              ? " · cambios: " +
                D.map((d, i) => {
                  const x = L.sc[i] - prev.sc[i];
                  return x ? `${d.s} ${x > 0 ? "+" : ""}${x}` : "";
                })
                  .filter(Boolean)
                  .join(", ")
              : ""}
          </p>
          {D.map((d, i) => ({ d, v: L.sc[i], i }))
            .sort((a, b) => a.v - b.v)
            .map(({ d, v, i }) => (
              <button
                key={d.s}
                className="li"
                onClick={() => onOpen("area", String(i))}
              >
                <i style={{ background: `${d.c}33`, color: d.c }}>●</i>
                <span className="grow">
                  {d.n}
                  <div className="bar">
                    <i style={{ width: `${v}%`, background: d.c }} />
                  </div>
                </span>
                {v}
              </button>
            ))}
        </>
      )}
    </>
  );
};

export const AreaView: React.FC<{
  S: RumboState;
  areaIdx: number;
  onBack: () => void;
  onOpen: (scr: string, par?: string | null) => void;
}> = ({ S, areaIdx, onBack, onOpen }) => {
  const d = D[areaIdx] || D[0];
  const L = S.evals.at(-1);
  const v = L ? L.sc[areaIdx] : null;
  const areaGoals = S.goals.filter((g) => g.dim === areaIdx);

  return (
    <>
      <Head title={d.n} onBack={onBack} />
      <div className="card">
        {v === null ? (
          <p className="sub">Aún no evaluada.</p>
        ) : (
          <>
            <div style={{ fontSize: "2rem", fontWeight: 800 }}>{v}/100</div>
            <div className="bar">
              <i style={{ width: `${v}%`, background: d.c }} />
            </div>
          </>
        )}
        <p>
          {v !== null && v >= 70
            ? "Área sólida. Mantén lo que ya funciona."
            : d.r}
        </p>
      </div>

      <h3>Objetivos en esta área</h3>
      {areaGoals.length > 0 ? (
        areaGoals.map((g) => (
          <GoalCard
            key={g.id}
            goal={g}
            habits={S.habits}
            onClick={() => onOpen("goal", g.id)}
          />
        ))
      ) : (
        <p className="sub">Ninguno todavía.</p>
      )}

      <button
        className="pri"
        onClick={() => onOpen("goalnew", String(areaIdx))}
      >
        Crear una meta
      </button>
    </>
  );
};

export const GoalsView: React.FC<{
  S: RumboState;
  onBack: () => void;
  onOpen: (scr: string, par?: string | null) => void;
}> = ({ S, onBack, onOpen }) => (
  <>
    <Head title="Mis metas" onBack={onBack} />
    {S.goals.length > 0 ? (
      S.goals.map((g) => (
        <GoalCard
          key={g.id}
          goal={g}
          habits={S.habits}
          onClick={() => onOpen("goal", g.id)}
        />
      ))
    ) : (
      <p className="sub">No hay objetivos.</p>
    )}
    <button className="pri" onClick={() => onOpen("goalnew")}>
      Crear una meta
    </button>
  </>
);

export const GoalNewView: React.FC<{
  areaParam: string | null;
  onBack: () => void;
  onOpen: (scr: string, par?: string | null) => void;
  onPickSuggested: (draft: GoalDraft) => void;
}> = ({ areaParam, onBack, onOpen, onPickSuggested }) => {
  const groups = D.map((d, i) => ({ d, i })).filter(({ i }) =>
    PG.some((x) => x.dim === i)
  );

  return (
    <>
      <Head title="Nueva meta" onBack={onBack} />
      <button className="opt" onClick={() => onOpen("goalai")}>
        <i>
          <Ico name="plus" />
        </i>
        <span>
          <b>Diseñar mi meta con IA</b>
          <br />
          Cuéntame qué quieres lograr y armo un plan por etapas.
        </span>
      </button>
      <button className="opt" onClick={() => onOpen("goalman", areaParam)}>
        <i>
          <Ico name="plus" />
        </i>
        <span>
          <b>Diseñar mi meta a mano</b>
          <br />
          Tú defines la meta y cada uno de sus pasos.
        </span>
      </button>
      <p>O parte de una meta sugerida:</p>
      {groups.map(({ d, i }) => (
        <React.Fragment key={d.s}>
          <h2 style={{ color: d.c }}>{d.n}</h2>
          <div className="pg">
            {PG.filter((x) => x.dim === i).map((x) => (
              <button
                key={x.id}
                onClick={() =>
                  onPickSuggested(JSON.parse(JSON.stringify(x)) as GoalDraft)
                }
              >
                <span
                  className="pb"
                  style={{
                    background: `linear-gradient(135deg,${d.c},${d.c}77)`,
                  }}
                >
                  ◎
                </span>
                {x.t}
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

export const GoalManualView: React.FC<{
  defaultArea: string | null;
  onBack: () => void;
  onCreate: (g: Goal) => void;
}> = ({ defaultArea, onBack, onCreate }) => {
  const initialDim =
    defaultArea === "" || defaultArea == null ? 7 : Number(defaultArea);
  const [t, setT] = useState("");
  const [ok, setOk] = useState("");
  const [dim, setDim] = useState(initialDim);
  const [h, setH] = useState<Horizon>("c");
  const [start, setStart] = useState(today());
  const [due, setDue] = useState("");
  const [dtime, setDtime] = useState("");
  const [p, setP] = useState(2);
  const [rem, setRem] = useState("");
  const [measureInput, setMeasureInput] = useState({
    type: "a",
    from: "",
    to: "",
    unit: "",
  });
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if (!t.trim()) return;
    const mm = buildGoalMeasuresFromInputs(
      measureInput.type,
      measureInput.from,
      measureInput.to,
      measureInput.unit
    );
    if (mm.err) {
      setErr(mm.err);
      return;
    }
    onCreate({
      id: uid(),
      t: t.trim(),
      h,
      dim,
      start: start || today(),
      due,
      dtime,
      p,
      rem: rem === "" ? null : Number(rem),
      ok: ok.trim(),
      steps: [],
      weeks: 4,
      m: mm.m || undefined,
    });
  };

  return (
    <>
      <Head title="Meta manual" onBack={onBack} />
      <div className="card">
        <input
          placeholder="Meta específica (ej.: correr 5 km sin parar)"
          value={t}
          onChange={(e) => setT(e.target.value)}
        />
        <input
          placeholder="¿Cómo sabrás que la lograste? (criterio de éxito)"
          value={ok}
          onChange={(e) => setOk(e.target.value)}
        />
        <select value={dim} onChange={(e) => setDim(+e.target.value)}>
          {D.map((d, i) => (
            <option key={d.s} value={i}>
              {d.n}
            </option>
          ))}
        </select>
        <select value={h} onChange={(e) => setH(e.target.value as Horizon)}>
          {Object.entries(HZ).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <label className="sub">
          Comienza
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <div className="row">
          <label className="sub grow">
            Fecha límite
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
            />
          </label>
          <label className="sub grow">
            Hora
            <input
              type="time"
              value={dtime}
              onChange={(e) => setDtime(e.target.value)}
            />
          </label>
        </div>
        <label className="sub">
          Prioridad
          <select value={p} onChange={(e) => setP(+e.target.value)}>
            {Object.entries(PR).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="sub">
          Recordatorio de vencimiento
          <select value={rem} onChange={(e) => setRem(e.target.value)}>
            {RMO_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <MeasureFields onChange={setMeasureInput} />

        <button className="pri" onClick={handleSubmit}>
          Crear objetivo
        </button>
        {err && <p className="sub">{err}</p>}
      </div>
    </>
  );
};

export const GoalAiView: React.FC<{
  onBack: () => void;
  onDraftReady: (draft: GoalDraft) => void;
}> = ({ onBack, onDraftReady }) => {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [aim, setAim] = useState("");

  const handleGo = async () => {
    const t = text.trim();
    if (!t) {
      setAim("Describe primero tu meta.");
      return;
    }
    setBusy(true);
    setAim("Creando tu plan…");
    try {
      const prompt = `Eres una guía de desarrollo personal. Convierte la meta del usuario en un plan realista y seguro. No des consejo médico, legal ni financiero específico. Responde SOLO con JSON con esta forma: {"title":string,"area":número,"weeks":número entre 1 y 12,"description":string de máximo 40 palabras,"success":string que diga cómo medir el logro,"steps":[{"t":string,"f":número de veces por semana (1 a 7) solo si es recurrente,"day":número de día desde el inicio solo si es única,"time":"HH:MM" opcional}]} con 4 a 7 pasos. Áreas: ${D.map(
        (d, i) => i + "=" + d.n
      ).join(", ")}. Escribe en español. Meta del usuario: ${t}`;
      const r = await aiAskJson<Record<string, unknown>>(prompt);
      onDraftReady(cleanGoalDraft(r));
    } catch {
      onDraftReady(localGoalDraft(t));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head title="Meta con IA" onBack={onBack} />
      <div className="card">
        <p>Cuéntame qué quieres lograr y armaré un plan por etapas.</p>
        <textarea
          placeholder="Ej.: Quiero correr 5 km sin parar en dos meses, entrenando después del trabajo"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="pri" disabled={busy} onClick={handleGo}>
          Crear plan con IA
        </button>
        {aim && <p className="sub">{aim}</p>}
        <p className="sub">
          La IA da sugerencias generales, no consejo médico ni financiero. Revisa el plan antes de aceptarlo.
        </p>
      </div>
    </>
  );
};

export const GoalDraftView: React.FC<{
  draft: GoalDraft;
  onBack: () => void;
  onAccept: (start: string, time: string, rem: number | null) => void;
}> = ({ draft, onBack, onAccept }) => {
  const [start, setStart] = useState(today());
  const [time, setTime] = useState("");
  const [rem, setRem] = useState("");
  const c = D[draft.dim]?.c || "#0E9488";
  const isPreset = PG.some((x) => x.id === draft.id);

  return (
    <>
      <Head title="" onBack={onBack} />
      <div
        className="gc"
        style={{
          background: `linear-gradient(135deg,${c},${c}88)`,
          minHeight: 150,
        }}
      >
        <span>{draft.t}</span>
      </div>

      <button
        className="pri"
        onClick={() => onAccept(start || today(), time, rem === "" ? null : +rem)}
      >
        Aceptar objetivo
      </button>

      {draft.local && !isPreset && (
        <p className="sub">
          Plan base creado sin IA, porque la IA no está disponible en esta vista. Revísalo y ajústalo.
        </p>
      )}

      <div className="row" style={{ margin: "14px 0" }}>
        <span>
          Comienza:{" "}
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ width: "auto" }}
          />
        </span>
        <span>{draft.weeks} semanas</span>
      </div>

      <label className="sub">
        Hora habitual (opcional)
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>

      <label className="sub">
        Recordatorio de vencimiento
        <select value={rem} onChange={(e) => setRem(e.target.value)}>
          {RMO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <p>{draft.d}</p>
      {draft.ok && (
        <p className="sub">
          <b>Cómo medir el logro:</b> {draft.ok}
        </p>
      )}

      {draft.steps.map((x, idx) => (
        <div key={idx} className="chk">
          <span className="grow">
            ◉ {x.t}
            <div className="sub">
              {x.f ? `${x.f} veces por semana` : `Día ${(x.day || 0) + 1}`}
              {x.time ? ` · ${x.time}` : ""}
            </div>
          </span>
        </div>
      ))}
    </>
  );
};

export const GoalDetailView: React.FC<{
  S: RumboState;
  goalId: string;
  onBack: () => void;
  onOpen: (scr: string, par?: string | null) => void;
  updateGoal: (goalId: string, updater: (g: Goal) => Goal) => void;
  onToggleStep: (goalId: string, idx: number) => void;
  onDeleteStep: (goalId: string, idx: number) => void;
  onDeleteGoal: (goalId: string) => void;
}> = ({
  S,
  goalId,
  onBack,
  onOpen,
  updateGoal,
  onToggleStep,
  onDeleteStep,
  onDeleteGoal,
}) => {
  const [newStep, setNewStep] = useState("");
  const [newStepDate, setNewStepDate] = useState("");
  const [newStepTime, setNewStepTime] = useState("");

  const g = S.goals.find((x) => x.id === goalId);
  if (!g) return <Head title="Objetivo" onBack={onBack} />;

  const c = D[g.dim]?.c || "#0E9488";
  const progress = gp(g, S.habits);
  const measureName = MN[g.m ? g.m.t || "num" : "a"];

  return (
    <>
      <Head title={g.t} onBack={onBack} />
      <div className="card">
        <div className="sub">
          {D[g.dim]?.n} · {HZ[g.h]}
          {g.start ? ` · inicia ${g.start}` : ""}
          {g.due ? ` · vence ${g.due}${g.dtime ? " " + g.dtime : ""}` : ""} ·
          prioridad {PR[g.p]}
          {g.rem != null ? ` · recordatorio ${RM[g.rem]}` : ""}
        </div>

        {g.ok && <p className="sub">Éxito si: {g.ok}</p>}

        <div className="bar">
          <i style={{ width: `${progress}%`, background: c }} />
        </div>
        <div className="sub">
          {progress}% logrado{g.m ? ` · ${formatGoalMeasureText(g)}` : ""}
        </div>

        {g.m && (
          <div style={{ marginTop: 8 }}>
            <GoalMeasureControls
              goal={g}
              onUpdate={(updater) => updateGoal(g.id, updater)}
            />
          </div>
        )}

        <details>
          <summary className="sub" style={{ margin: "8px 0", cursor: "pointer" }}>
            Forma de medir: {measureName}
          </summary>
          <MeasureFields
            showApply
            onApply={(m) =>
              updateGoal(g.id, (prev) => ({ ...prev, m: m || null }))
            }
          />
        </details>

        {g.steps.map((x, i) =>
          x.f ? (
            <div key={i} className="chk">
              <span className="grow">
                {x.t}
                <div className="sub">
                  {x.f} veces por semana · {hlogs(x, g, S.habits)}/
                  {x.f * (g.weeks || 4)} hechas (se marcan en Hábitos)
                </div>
              </span>
              <button
                className="ic"
                onClick={() => onDeleteStep(g.id, i)}
                aria-label="Quitar"
              >
                ×
              </button>
            </div>
          ) : (
            <div key={i} className="chk">
              <input
                type="checkbox"
                checked={x.d}
                onChange={() => onToggleStep(g.id, i)}
              />
              <span className={`grow ${x.d ? "done" : ""}`}>
                {x.date
                  ? `${x.date}${x.time ? " " + x.time : ""} · `
                  : ""}
                {x.t}
              </span>
              {x.lk && (
                <button
                  className="lk"
                  onClick={() => onOpen("lesson", x.lk)}
                >
                  Abrir
                </button>
              )}
              <button
                className="ic"
                onClick={() => onDeleteStep(g.id, i)}
                aria-label="Quitar"
              >
                ×
              </button>
            </div>
          )
        )}

        <input
          placeholder="Nueva acción"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
        />
        <div className="row">
          <input
            type="date"
            aria-label="Fecha"
            value={newStepDate}
            onChange={(e) => setNewStepDate(e.target.value)}
          />
          <input
            type="time"
            aria-label="Hora"
            value={newStepTime}
            onChange={(e) => setNewStepTime(e.target.value)}
          />
        </div>
        <button
          className="pri"
          onClick={() => {
            const t = newStep.trim();
            if (!t) return;
            updateGoal(g.id, (prev) => ({
              ...prev,
              steps: [
                ...prev.steps,
                { t, d: false, date: newStepDate || null, time: newStepTime },
              ],
            }));
            setNewStep("");
            setNewStepDate("");
            setNewStepTime("");
          }}
        >
          Agregar acción
        </button>
      </div>

      <button className="lk" onClick={() => onDeleteGoal(g.id)}>
        Eliminar objetivo
      </button>
    </>
  );
};

export const HabitNewView: React.FC<{
  onBack: () => void;
  onCreate: (h: Habit) => void;
}> = ({ onBack, onCreate }) => {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);

  return (
    <>
      <Head title="Nuevo hábito" onBack={onBack} />
      <div className="card">
        <input
          placeholder="Ej.: caminar 20 minutos"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="time"
          aria-label="Hora"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <div className="chips">
          {DN.map((d, i) => (
            <label key={d} className="chk">
              <input
                type="checkbox"
                checked={days[i]}
                onChange={() =>
                  setDays((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                }
              />
              {d}
            </label>
          ))}
        </div>
        <button
          className="pri"
          onClick={() => {
            const n = name.trim();
            const selDays = days
              .map((v, i) => (v ? i : -1))
              .filter((i) => i >= 0);
            if (!n || !selDays.length) return;
            onCreate({
              id: uid(),
              name: n,
              days: selDays,
              time,
              start: today(),
              log: {},
            });
          }}
        >
          Comenzar hábito
        </button>
        <p className="sub">
          Los recordatorios diarios se muestran dentro de tu agenda y panel.
        </p>
      </div>
    </>
  );
};

export function createGoalFromDraft(
  draft: GoalDraft,
  start: string,
  tm: string,
  rem: number | null
): { goal: Goal; newHabits: Habit[] } {
  const gid = uid();
  const w = draft.weeks || 4;
  const newHabits: Habit[] = [];
  const steps = draft.steps.map((x) => {
    const o: Goal["steps"][number] = { t: x.t, d: false };
    if (x.f) {
      const hid = uid();
      newHabits.push({
        id: hid,
        name: x.t,
        days: WD[x.f] || [1, 3, 5],
        time: x.time || tm,
        start,
        log: {},
        g: gid,
      });
      o.f = x.f;
      o.h = hid;
    } else {
      o.date = add(start, x.day || 0);
      o.time = x.time || "";
    }
    return o;
  });

  const goal: Goal = {
    id: gid,
    t: draft.t,
    h: w > 12 ? "l" : w > 4 ? "m" : "c",
    dim: draft.dim,
    start,
    due: add(start, w * 7),
    dtime: tm,
    p: 2,
    rem,
    ok: draft.ok || "",
    steps,
    weeks: w,
  };

  return { goal, newHabits };
}
