import React, { useState } from "react";
import { BarChart, LifeWheel, MoodChart, YearHeatmap } from "../components/Charts";
import { GoalCard } from "../components/GoalCard";
import { Ico } from "../components/Icons";
import { D, DT, T, WK } from "../data/rumboData";
import type { Course, RumboState } from "../types";
import {
  add,
  allCourses,
  bestStreak,
  courseMins,
  fd,
  getInsights,
  gp,
  gr,
  lateTasks,
  mon,
  ndone,
  sched,
  streak,
  today,
} from "../utils/rumboHelpers";

interface NavProps {
  onOpen: (scr: string, par?: string | null) => void;
  onTab: (tab: "home" | "agenda" | "rec" | "stats") => void;
  onStatsSubTab: (s: "g" | "h" | "s") => void;
}

export const HomeView: React.FC<{
  S: RumboState;
  onToggleHabit: (id: string, date: string) => void;
} & NavProps> = ({ S, onOpen, onStatsSubTab, onToggleHabit }) => {
  const td = today();
  const hs = S.habits.filter((h) => sched(h, td));
  const nb = S.seen === td ? 0 : getInsights(S).length;
  const dw = new Date(td + "T12:00:00").getDay();
  const showWeeklyBanner = (dw >= 5 || dw === 0) && S.wseen !== mon(td);
  const reminders = S.goals.filter(
    (g) => g.rem != null && g.due && g.due >= td && add(g.due, -g.rem) <= td && gp(g, S.habits) < 100
  );

  const tiles: { s: string; c: string; icon: string; l: string; badge?: number }[] = [
    { s: "coach", c: "#0E9488", icon: "compass", l: "Guía personal", badge: nb },
    { s: "diary", c: "#5B6FD6", icon: "bible", l: "Reflexión Bíblica" },
    { s: "mood", c: "#C98A1B", icon: "mood", l: "Estado de ánimo" },
    { s: "wheel", c: "#D9527A", icon: "wheel", l: "Balance de vida" },
  ];

  return (
    <>
      <div className="row">
        <h1>
          {gr()}
          {S.name ? `, ${S.name}` : ""}
        </h1>
        <button className="ic" onClick={() => onOpen("profile")} aria-label="Perfil">
          <Ico name="user" />
        </button>
      </div>

      <div className="tiles">
        {tiles.map((t) => (
          <button key={t.s} className="tl" onClick={() => onOpen(t.s)}>
            <span className="tb" style={{ background: t.c }}>
              <Ico name={t.icon} />
              {t.badge ? <em>{t.badge}</em> : null}
            </span>
            {t.l}
          </button>
        ))}
      </div>

      {showWeeklyBanner && (
        <div className="card" style={{ borderColor: "var(--acc)", marginTop: 12 }}>
          <b>📊 Tu balance semanal está listo</b>
          <div className="sub">Resumen de tu ánimo y de las actividades que te ayudan o no.</div>
          <button
            className="pri"
            style={{ marginTop: 8 }}
            onClick={() => onOpen("weekly", "0")}
          >
            Ver informe
          </button>
        </div>
      )}

      {reminders.length > 0 && (
        <div className="card" style={{ borderColor: "var(--acc)", marginTop: 12 }}>
          <b>Recordatorios</b>
          {reminders.map((g) => (
            <div key={g.id} className="sub">
              {g.t}: vence {g.due}
              {g.dtime ? ` ${g.dtime}` : ""}
            </div>
          ))}
        </div>
      )}

      <div className="row">
        <h2>Hábitos</h2>
        <button className="lk" onClick={() => onStatsSubTab("h")}>
          Ver más
        </button>
      </div>

      {hs.length > 0 ? (
        hs.map((h) => (
          <div key={h.id} className="card row">
            <button
              className={`ck ${h.log[td] ? "on" : ""}`}
              onClick={() => onToggleHabit(h.id, td)}
              aria-label="Marcar"
            >
              ✓
            </button>
            <span className="grow">
              {h.name}
              {h.time ? ` · ${h.time}` : ""}
            </span>
            <span className="tag">Racha {streak(h)}</span>
          </div>
        ))
      ) : (
        <div className="card mid">Hoy no hay hábitos programados.</div>
      )}

      <div className="row">
        <h2>Mis metas</h2>
        <button className="lk" onClick={() => onOpen("goals")}>
          Ver más
        </button>
      </div>

      {S.goals.length > 0 ? (
        S.goals.slice(0, 3).map((g) => (
          <GoalCard
            key={g.id}
            goal={g}
            habits={S.habits}
            onClick={() => onOpen("goal", g.id)}
          />
        ))
      ) : (
        <button className="gcn dash" onClick={() => onOpen("goalnew")}>
          <span className="grow">
            <b>Crear mi primera meta</b>
          </span>
          <b>＋</b>
        </button>
      )}
    </>
  );
};

export const AgendaView: React.FC<{
  S: RumboState;
  sel: string;
  setSel: (d: string) => void;
  adding: boolean;
  setAdding: (v: boolean) => void;
  onAddTask: (title: string, dim: number, time: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onRescheduleLate: () => void;
  onToggleHabit: (id: string, date: string) => void;
  onDeleteHabit: (id: string) => void;
  onToggleGoalStep: (goalId: string, idx: number) => void;
}> = ({
  S,
  sel,
  setSel,
  adding,
  setAdding,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onRescheduleLate,
  onToggleHabit,
  onDeleteHabit,
  onToggleGoalStep,
}) => {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [dim, setDim] = useState(7);
  const [time, setTime] = useState("");

  const td = today();
  const weekDays = Array.from({ length: 7 }, (_, i) => add(mon(sel), i));
  const tasks = S.tasks
    .filter((x) => x.date === sel)
    .sort((a, b) => (a.time || "99").localeCompare(b.time || "99"));
  const habits = S.habits.filter((h) => sched(h, sel));
  const late = sel === td ? lateTasks(S) : [];
  const goalSteps = S.goals
    .flatMap((g) => g.steps.map((x, i) => ({ g, x, i })))
    .filter(({ x }) => !x.f && x.date === sel);

  return (
    <>
      <div className="row">
        <label className="ic" aria-label="Elegir fecha" style={{ position: "relative" }}>
          ▦
          <input
            type="date"
            value={sel}
            style={{ position: "absolute", inset: 0, opacity: 0, width: 36 }}
            onChange={(e) => {
              if (e.target.value) setSel(e.target.value);
            }}
          />
        </label>
        <h2 style={{ margin: 0, textTransform: "capitalize" }}>{sel === td ? "Hoy" : fd(sel)}</h2>
        <button className="ic" onClick={() => setEdit(!edit)} aria-label="Editar">
          ✎
        </button>
      </div>

      <div className="wk">
        {weekDays.map((d, i) => (
          <button
            key={d}
            onClick={() => setSel(d)}
            className={d === sel ? "s" : ""}
          >
            <small>{WK[i]}</small>
            <b>{+d.slice(8)}</b>
          </button>
        ))}
      </div>

      {adding ? (
        <div className="card">
          <input
            placeholder="¿Qué tienes que hacer?"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select value={dim} onChange={(e) => setDim(+e.target.value)}>
            {D.map((d, i) => (
              <option key={d.s} value={i}>
                {d.n}
              </option>
            ))}
          </select>
          <input
            type="time"
            aria-label="Hora"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <button
            className="pri"
            onClick={() => {
              if (!title.trim()) return;
              onAddTask(title.trim(), dim, time);
              setTitle("");
              setTime("");
              setAdding(false);
            }}
          >
            Agregar tarea
          </button>
        </div>
      ) : (
        <button
          className="lk"
          style={{ fontSize: "1.1rem", color: "var(--mute)" }}
          onClick={() => setAdding(true)}
        >
          ＋ Nueva tarea
        </button>
      )}

      {habits.map((h) => (
        <div key={h.id} className="card row">
          <button
            className={`ck ${h.log[sel] ? "on" : ""}`}
            onClick={() => onToggleHabit(h.id, sel)}
            aria-label="Marcar"
          >
            ✓
          </button>
          <span className="grow">
            {h.name}
            {h.time ? ` · ${h.time}` : ""}
          </span>
          <span className="tag">Racha {streak(h)}</span>
          {edit && (
            <button
              className="ic"
              onClick={() => onDeleteHabit(h.id)}
              aria-label="Eliminar"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {goalSteps.map(({ g, x, i }) => (
        <div key={`${g.id}-${i}`} className="card row">
          <button
            className={`ck ${x.d ? "on" : ""}`}
            onClick={() => onToggleGoalStep(g.id, i)}
            aria-label="Completar"
          >
            ✓
          </button>
          <span className={`grow ${x.d ? "done" : ""}`}>
            {x.time ? `${x.time} · ` : ""}
            {x.t}
            <div className="sub">{g.t}</div>
          </span>
          <span className="tag" style={{ color: D[g.dim]?.c }}>
            Objetivo
          </span>
        </div>
      ))}

      {tasks.map((x) => (
        <div key={x.id} className="card row">
          <button
            className={`ck ${x.done ? "on" : ""}`}
            onClick={() => onToggleTask(x.id)}
            aria-label="Completar"
          >
            ✓
          </button>
          <span className={`grow ${x.done ? "done" : ""}`}>
            {x.time ? `${x.time} · ` : ""}
            {x.t}
          </span>
          <span className="tag" style={{ color: D[x.dim]?.c }}>
            {D[x.dim]?.s}
          </span>
          {edit && (
            <button
              className="ic"
              onClick={() => onDeleteTask(x.id)}
              aria-label="Eliminar"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {late.length > 0 && (
        <>
          <h3 className="late">Atrasadas ({late.length})</h3>
          {late.map((x) => (
            <div key={x.id} className="card row">
              <button
                className={`ck ${x.done ? "on" : ""}`}
                onClick={() => onToggleTask(x.id)}
                aria-label="Completar"
              >
                ✓
              </button>
              <span className={`grow ${x.done ? "done" : ""}`}>
                {x.time ? `${x.time} · ` : ""}
                {x.t}
              </span>
              <span className="tag" style={{ color: D[x.dim]?.c }}>
                {D[x.dim]?.s}
              </span>
              {edit && (
                <button
                  className="ic"
                  onClick={() => onDeleteTask(x.id)}
                  aria-label="Eliminar"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button className="pri" onClick={onRescheduleLate}>
            Reprogramar a hoy
          </button>
        </>
      )}
    </>
  );
};

export const CourseCard: React.FC<{
  c: Course;
  prog?: Record<string, boolean>;
  onOpen: (id: string) => void;
  editing?: boolean;
  onEdit?: (c: Course) => void;
  onDelete?: (id: string) => void;
}> = ({ c, prog, onOpen, editing, onEdit, onDelete }) => {
  const [confirmDel, setConfirmDel] = useState(false);
  const t = T[c.tp];
  const k = ndone(c, prog);

  return (
    <div style={{ marginBottom: editing ? 14 : 0 }}>
      <button
        className="cc"
        style={editing ? { marginBottom: 4 } : undefined}
        onClick={() => onOpen(c.id)}
      >
        <span
          className="cb"
          style={{ background: `linear-gradient(135deg,${t.c},${t.c}66)` }}
        >
          <Ico name={t.icon} />
        </span>
        <span className="ct">
          <span className="row">
            <strong>{c.t}</strong>
            <span>→</span>
          </span>
          <span className="sub">{c.d}</span>
          <span className="sub">
            {c.L.length} lecciones · ≈{courseMins(c)} min
            {k ? ` · ${k}/${c.L.length}` : ""}
          </span>
        </span>
      </button>
      {editing && (
        <div className="row" style={{ padding: "0 4px" }}>
          {onEdit && (
            <button
              className="lk"
              onClick={() => {
                setConfirmDel(false);
                onEdit(c);
              }}
            >
              ✎ Modificar
            </button>
          )}
          {onDelete && (
            <button
              className="lk"
              style={{ color: "var(--bad)" }}
              onClick={() => {
                if (!confirmDel) {
                  setConfirmDel(true);
                  return;
                }
                setConfirmDel(false);
                onDelete(c.id);
              }}
            >
              {confirmDel ? "Toca otra vez para eliminar" : "Eliminar"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const LibraryView: React.FC<{
  S: RumboState;
  onOpen: (scr: string, par?: string | null) => void;
  onOpenGenerator: () => void;
  onEditCourse: (c: Course) => void;
  onDeleteCourse: (id: string) => void;
  onRestoreBaseCourses: () => void;
}> = ({
  S,
  onOpen,
  onOpenGenerator,
  onEditCourse,
  onDeleteCourse,
  onRestoreBaseCourses,
}) => {
  const [manage, setManage] = useState(false);
  const courses = allCourses(S);
  const L = S.evals.at(-1);
  const ord = L ? D.map((_, i) => i).sort((a, b) => L.sc[a] - L.sc[b]) : [0, 1];
  const rc = [...new Set(ord.map((i) => DT[i]))].slice(0, 2);
  const favs = courses.filter((c) => S.fav?.[c.id]);
  const aiCourses = courses.filter((c) => c.ai);
  const hasHiddenBase = Object.keys(S.ch || {}).some((k) => S.ch?.[k]);

  const pending = S.pendingGen;
  const hasPending = Boolean(pending?.outline?.lessons?.length);

  return (
    <>
      <div className="row">
        <h1 style={{ margin: "8px 0" }}>Biblioteca</h1>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            className="chip2"
            style={{ margin: 0 }}
            onClick={onOpenGenerator}
          >
            ✨ Generar con IA
          </button>
          <button
            className="ic"
            onClick={() => setManage(!manage)}
            aria-label={manage ? "Terminar de editar" : "Modificar o eliminar recursos"}
            style={manage ? { color: "var(--acct)" } : undefined}
          >
            {manage ? "✓" : "✎"}
          </button>
        </div>
      </div>

      {manage && (
        <div className="card" style={{ borderColor: "var(--acc)" }}>
          <div className="row">
            <b>Administrar recursos ({courses.length})</b>
            <button className="lk" onClick={() => setManage(false)}>
              Listo
            </button>
          </div>
          <p className="sub">
            Modifica el título, tema o lecciones de cualquier recurso, o elimínalo de tu Biblioteca.
          </p>
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              c={c}
              prog={S.prog}
              onOpen={(id) => onOpen("course", id)}
              editing
              onEdit={onEditCourse}
              onDelete={onDeleteCourse}
            />
          ))}
          {courses.length === 0 && (
            <p className="sub">No hay recursos en tu Biblioteca.</p>
          )}
          {hasHiddenBase && (
            <button
              className="lk"
              style={{ width: "100%", marginTop: 4 }}
              onClick={onRestoreBaseCourses}
            >
              Restaurar recursos originales eliminados
            </button>
          )}
        </div>
      )}

      {hasPending && pending && (
        <div className="card" style={{ borderColor: "var(--acc)" }}>
          <b>Recurso en progreso</b>
          <div className="sub" style={{ marginTop: 4 }}>
            {pending.outline?.title || pending.topic} ·{" "}
            {pending.completedLessons.length} de{" "}
            {pending.outline?.lessons.length || 0} lecciones
          </div>
          <button
            className="pri"
            style={{ marginTop: 8 }}
            onClick={onOpenGenerator}
          >
            Continuar donde se quedó
          </button>
        </div>
      )}

      {!manage && (
        <>
          <h3>Sugeridos para esta semana</h3>
          <div className="hs">
            {rc.map((k) => {
              const c = courses.find((x) => x.tp === k);
              return c ? (
                <CourseCard
                  key={c.id}
                  c={c}
                  prog={S.prog}
                  onOpen={(id) => onOpen("course", id)}
                />
              ) : null;
            })}
          </div>

          {favs.length > 0 && (
            <>
              <h2>Favoritos</h2>
              {favs.map((c) => (
                <CourseCard
                  key={c.id}
                  c={c}
                  prog={S.prog}
                  onOpen={(id) => onOpen("course", id)}
                />
              ))}
            </>
          )}

          {aiCourses.length > 0 && (
            <>
              <h2>Mis recursos</h2>
              {aiCourses.map((c) => (
                <CourseCard
                  key={c.id}
                  c={c}
                  prog={S.prog}
                  onOpen={(id) => onOpen("course", id)}
                />
              ))}
            </>
          )}
        </>
      )}

      <h2>Temas</h2>
      <div className="tg">
        {Object.entries(T).map(([k, t]) => (
          <button key={k} onClick={() => onOpen("topic", k)}>
            <i style={{ background: `${t.c}33`, color: t.c }}>
              <Ico name={t.icon} />
            </i>
            {t.t}
          </button>
        ))}
      </div>

      <h2>Balance de vida</h2>
      <div className="card">
        {D.map((d, i) => (
          <button
            key={d.s}
            className="li"
            onClick={() => onOpen("area", String(i))}
          >
            <i style={{ background: `${d.c}33`, color: d.c }}>●</i>
            <span className="grow">{d.n}</span>›
          </button>
        ))}
      </div>
    </>
  );
};

export const StatsView: React.FC<{
  S: RumboState;
  subTab: "g" | "h" | "s";
  setSubTab: (s: "g" | "h" | "s") => void;
  onOpen: (scr: string, par?: string | null) => void;
  onSaveHealth: (steps: number, sleep: number) => void;
}> = ({ S, subTab, setSubTab, onOpen, onSaveHealth }) => {
  const h0 = S.health[today()] || {};
  const [stepsInput, setStepsInput] = useState(h0.steps ? String(h0.steps) : "");
  const [sleepInput, setSleepInput] = useState(h0.sleep ? String(h0.sleep) : "");

  const L = S.evals.at(-1);
  const mo = mon(today());
  const ds = Array.from({ length: 7 }, (_, i) => add(mo, i));
  const st = ds.map((d) => S.health[d]?.steps || 0);
  const sl = ds.map((d) => S.health[d]?.sleep || 0);
  const dm = !st.some(Boolean);
  const dm2 = !sl.some(Boolean);

  return (
    <>
      <div className="tabs">
        {(
          [
            ["g", "General"],
            ["h", "Hábitos"],
            ["s", "Salud"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            className={subTab === k ? "on" : ""}
            onClick={() => setSubTab(k)}
          >
            {l}
          </button>
        ))}
      </div>

      {subTab === "g" && (
        <>
          <LifeWheel scores={L?.sc} />
          {!L && <p className="sub">Completa tu evaluación para ver tu rueda.</p>}
          <button
            className="pri"
            style={{ margin: "10px 0" }}
            onClick={() => onOpen("weekly", "0")}
          >
            📊 Balance semanal
          </button>
          <div className="row">
            <h2>Tu estado de ánimo</h2>
            <button className="lk" onClick={() => onOpen("mood")}>
              Ver más
            </button>
          </div>
          <p className="sub">Esta semana</p>
          <MoodChart moods={S.moods} />
        </>
      )}

      {subTab === "h" && (
        <>
          {S.habits.length > 0 ? (
            S.habits.map((h) => (
              <div key={h.id}>
                <div className="row">
                  <h2 style={{ margin: 0 }}>{h.name}</h2>
                </div>
                <div className="row">
                  <span>Racha (actual):</span>
                  <b>{streak(h)}</b>
                </div>
                <div className="row">
                  <span>Racha (más larga):</span>
                  <b>{bestStreak(h)}</b>
                </div>
                <div className="row">
                  <span>Total:</span>
                  <b>{Object.keys(h.log).length}</b>
                </div>
                <h3 style={{ marginTop: 14 }}>
                  Resumen del año {new Date().getFullYear()}
                </h3>
                <YearHeatmap habit={h} />
                <hr
                  style={{
                    border: 0,
                    borderTop: "1px solid var(--line)",
                    margin: "20px 0",
                  }}
                />
              </div>
            ))
          ) : (
            <p className="sub">Aún no tienes hábitos. Crea uno con el botón +.</p>
          )}
        </>
      )}

      {subTab === "s" && (
        <>
          <div className="card">
            <h3>Registrar hoy</h3>
            <p className="sub">
              Registra tus pasos y horas de sueño diarios para ver tu evolución semanal.
            </p>
            <div className="row">
              <input
                type="number"
                min={0}
                placeholder="Pasos"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
              />
              <input
                type="number"
                min={0}
                max={24}
                step={0.5}
                placeholder="Horas de sueño"
                value={sleepInput}
                onChange={(e) => setSleepInput(e.target.value)}
              />
            </div>
            <button
              className="pri"
              onClick={() => onSaveHealth(Number(stepsInput) || 0, Number(sleepInput) || 0)}
            >
              Guardar
            </button>
          </div>

          <h2>Tu movimiento {dm ? "(Datos de demostración)" : ""}</h2>
          <p className="sub">Cuántos pasos has dado esta semana</p>
          <BarChart
            values={dm ? [5290, 8420, 3380, 5930, 4800, 5370, 7400] : st}
            labels={WK}
            color="#14B8A666"
            demo={dm}
          />

          <h2>Tu sueño {dm2 ? "(Datos de demostración)" : ""}</h2>
          <p className="sub">Horas dormidas esta semana</p>
          <BarChart
            values={dm2 ? [7, 6.5, 5.5, 7.5, 8, 6, 7] : sl}
            labels={WK}
            color="#5B6FD6aa"
            demo={dm2}
          />
        </>
      )}
    </>
  );
};
