import React, { useEffect, useRef, useState } from "react";
import { Ico } from "../components/Icons";
import { PWAInstallButton } from "../components/PWAPrompts";
import { REF, SZ, T, TD } from "../data/rumboData";
import type {
  Course,
  Goal,
  LessonExtra,
  LessonTuple,
  PendingCourseGen,
  RumboState,
  ThemeMode,
  TopicKey,
} from "../types";
import { GenerationPausedError, generateAiCourse } from "../utils/aiClient";
import {
  add,
  allCourses,
  autoTopic,
  buildBackupJson,
  buildReport,
  courseMins,
  getCourseActions,
  getLessonExtra,
  ndone,
  normalizeCourseForEdit,
  parseBackupJson,
  pct,
  today,
  uid,
  wc,
} from "../utils/rumboHelpers";
import { CourseCard } from "./MainTabs";

const Head: React.FC<{
  title: React.ReactNode;
  right?: React.ReactNode;
  onBack: () => void;
}> = ({ title, right, onBack }) => (
  <>
    <div className="row">
      <button className="ic" onClick={onBack} aria-label="Volver">
        ‹
      </button>
      <h2 className="grow" style={{ margin: 0 }}>
        {title}
      </h2>
      {right}
    </div>
    <br />
  </>
);

export const TopicView: React.FC<{
  S: RumboState;
  topicKey: TopicKey;
  onBack: () => void;
  onOpen: (scr: string, par?: string | null) => void;
  onSaveReflection: (idx: number, value: string) => void;
  onEditCourse: (c: Course) => void;
  onDeleteCourse: (id: string) => void;
}> = ({
  S,
  topicKey,
  onBack,
  onOpen,
  onSaveReflection,
  onEditCourse,
  onDeleteCourse,
}) => {
  const [manage, setManage] = useState(false);
  const t = T[topicKey];
  const courses = allCourses(S).filter((c) => c.tp === topicKey);

  return (
    <>
      <Head
        title={
          <>
            <span style={{ color: t.c }}>
              <Ico name={t.icon} />
            </span>{" "}
            {t.t}
          </>
        }
        right={
          courses.length > 0 ? (
            <button
              className="ic"
              onClick={() => setManage(!manage)}
              aria-label={manage ? "Terminar de editar" : "Modificar o eliminar recursos"}
              style={manage ? { color: "var(--acct)" } : undefined}
            >
              {manage ? "✓" : "✎"}
            </button>
          ) : undefined
        }
        onBack={onBack}
      />

      {courses.map((c) => (
        <CourseCard
          key={c.id}
          c={c}
          prog={S.prog}
          onOpen={(id) => onOpen("course", id)}
          editing={manage}
          onEdit={onEditCourse}
          onDelete={onDeleteCourse}
        />
      ))}

      <h3>
        {topicKey === "self" ? "Ejercicios de reflexión" : "Consejos rápidos"}
      </h3>

      {topicKey === "self"
        ? REF.map(([a, q], i) => (
            <div key={i} className="card">
              <h3>{a}</h3>
              <p className="sub">{q}</p>
              <textarea
                value={S.refl[String(i)] || ""}
                onChange={(e) => onSaveReflection(i, e.target.value)}
              />
            </div>
          ))
        : t.k.map((x, i) => (
            <div key={i} className="card">
              {topicKey === "med" && <b>{i + 1}. </b>}
              {x}
            </div>
          ))}
    </>
  );
};

export const CourseView: React.FC<{
  S: RumboState;
  courseId: string;
  onBack: () => void;
  onOpen: (scr: string, par?: string | null) => void;
  onToggleFav: (id: string) => void;
  onResetCourse: (id: string) => void;
  onAssignGoal: (c: Course) => void;
  onExpandCourse: (c: Course) => void;
  onEditCourse: (c: Course) => void;
  onDeleteCourse: (id: string) => void;
}> = ({
  S,
  courseId,
  onBack,
  onOpen,
  onToggleFav,
  onResetCourse,
  onAssignGoal,
  onExpandCourse,
  onEditCourse,
  onDeleteCourse,
}) => {
  const [confirmDel, setConfirmDel] = useState(false);
  const c = allCourses(S).find((x) => x.id === courseId);
  if (!c) return <Head title="Curso" onBack={onBack} />;
  const t = T[c.tp];
  const k = ndone(c, S.prog);
  const existingGoal = S.goals.find((g) => g.cid === c.id);
  const isFav = Boolean(S.fav?.[c.id]);

  return (
    <>
      <Head
        title=""
        right={
          <button
            className="ic"
            onClick={() => onToggleFav(c.id)}
            aria-label="Favorito"
          >
            {isFav ? "♥" : "♡"}
          </button>
        }
        onBack={onBack}
      />

      <div className="card" style={{ background: `${t.c}22` }}>
        <h2 style={{ marginTop: 0 }}>{c.t}</h2>
        <p className="sub" style={{ fontSize: "1rem" }}>
          {c.d}
        </p>
        <span className="sub">
          {c.L.length} lecciones · ≈{courseMins(c)} min · Español
        </span>
        <div className="bar">
          <i
            style={{
              width: `${pct(k, c.L.length)}%`,
              background: t.c,
            }}
          />
        </div>
        <span className="sub">
          {k}/{c.L.length} completadas
        </span>
      </div>

      {c.L.map((l, i) => {
        const d = Boolean(S.prog?.[c.id + ":" + i]);
        return (
          <button
            key={i}
            className="li"
            style={{
              background: "var(--surf)",
              border: "1px solid var(--line)",
              borderRadius: 18,
              padding: 12,
              marginBottom: 10,
            }}
            onClick={() => onOpen("lesson", `${c.id}:${i}`)}
          >
            <i
              style={{
                background: d ? "#10B981" : "var(--line)",
                color: d ? "#fff" : "inherit",
                borderRadius: "50%",
                width: 44,
                height: 44,
              }}
            >
              {d ? "✓" : i + 1}
            </i>
            <span className="grow">
              {l[0]}
              <div className="sub">≈{Math.max(1, Math.round(wc(l[1]) / 180))} min</div>
            </span>
            ▷
          </button>
        );
      })}

      {k > 0 && (
        <button className="lk" onClick={() => onResetCourse(c.id)}>
          Reiniciar progreso
        </button>
      )}

      {existingGoal ? (
        <button
          className="pri"
          onClick={() => onOpen("goal", existingGoal.id)}
        >
          🎯 Ver mi objetivo
        </button>
      ) : (
        <button className="pri" onClick={() => onAssignGoal(c)}>
          🎯 Asignar como objetivo
        </button>
      )}

      <button
        className="lk"
        style={{ width: "100%" }}
        onClick={() => onExpandCourse(c)}
      >
        📚 Crear versión ampliada con IA
      </button>

      <button
        className="lk"
        style={{ width: "100%" }}
        onClick={() => onEditCourse(c)}
      >
        ✎ Modificar recurso
      </button>

      <button
        className="lk"
        style={{ width: "100%", color: "var(--bad)" }}
        onClick={() => {
          if (!confirmDel) {
            setConfirmDel(true);
            return;
          }
          onDeleteCourse(c.id);
        }}
      >
        {confirmDel ? "Toca otra vez para eliminar este recurso" : "Eliminar recurso"}
      </button>
    </>
  );
};

export const CourseEditView: React.FC<{
  S: RumboState;
  courseId: string;
  onBack: () => void;
  onSave: (updated: Course) => void;
}> = ({ S, courseId, onBack, onSave }) => {
  const rawCourse = allCourses(S).find((x) => x.id === courseId);
  const normalized = rawCourse ? normalizeCourseForEdit(rawCourse) : null;

  const [title, setTitle] = useState(normalized?.t || "");
  const [desc, setDesc] = useState(normalized?.d || "");
  const [tp, setTp] = useState<TopicKey>(normalized?.tp || "self");
  const [lessons, setLessons] = useState<
    { t: string; x: string; r: string; tip: string; extra?: LessonExtra }[]
  >(() =>
    normalized
      ? normalized.L.map((l) => {
          const ex = l[2] || {};
          return {
            t: l[0],
            x: l[1],
            r: ex.r || "",
            tip: ex.tip || "",
            extra: ex,
          };
        })
      : []
  );
  const [err, setErr] = useState("");

  if (!normalized) return <Head title="Modificar recurso" onBack={onBack} />;

  const handleSave = () => {
    if (!title.trim()) {
      setErr("Escribe un título para el recurso.");
      window.scrollTo(0, 0);
      return;
    }
    const cleanLessons: LessonTuple[] = lessons
      .map((l) => {
        const nextExtra: LessonExtra = {
          ...(l.extra || {}),
          r: l.r.trim() || undefined,
          tip: l.tip.trim() || undefined,
        };
        return [l.t.trim(), l.x.trim(), nextExtra] as LessonTuple;
      })
      .filter((l) => l[0] && l[1]);

    if (!cleanLessons.length) {
      setErr("Incluye al menos una lección con título y contenido.");
      window.scrollTo(0, 0);
      return;
    }

    onSave({
      ...normalized,
      t: title.trim().slice(0, 90),
      d: desc.trim().slice(0, 240),
      tp,
      dim: TD[tp],
      L: cleanLessons,
    });
  };

  return (
    <>
      <Head title="Modificar recurso" onBack={onBack} />
      {err && (
        <p style={{ color: "var(--bad)", fontWeight: 700, marginBottom: 8 }}>
          {err}
        </p>
      )}
      <div className="card">
        <label className="sub">
          Título
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErr("");
            }}
          />
        </label>
        <label className="sub">
          Descripción breve
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ minHeight: 70 }}
          />
        </label>
        <label className="sub">
          Tema
          <select value={tp} onChange={(e) => setTp(e.target.value as TopicKey)}>
            {Object.entries(T).map(([k, item]) => (
              <option key={k} value={k}>
                {item.t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h3>Lecciones ({lessons.length})</h3>
      {lessons.map((l, idx) => (
        <div key={idx} className="card">
          <div className="row">
            <b>Lección {idx + 1}</b>
            {lessons.length > 1 && (
              <button
                className="lk"
                style={{ color: "var(--bad)" }}
                onClick={() =>
                  setLessons((prev) => prev.filter((_, i) => i !== idx))
                }
              >
                Quitar lección
              </button>
            )}
          </div>
          <label className="sub">
            Título de la lección
            <input
              value={l.t}
              onChange={(e) => {
                const v = e.target.value;
                setLessons((prev) =>
                  prev.map((item, i) => (i === idx ? { ...item, t: v } : item))
                );
              }}
            />
          </label>
          <label className="sub">
            Contenido
            <textarea
              value={l.x}
              onChange={(e) => {
                const v = e.target.value;
                setLessons((prev) =>
                  prev.map((item, i) => (i === idx ? { ...item, x: v } : item))
                );
              }}
            />
          </label>
          <label className="sub">
            Pregunta de reflexión (opcional)
            <input
              value={l.r}
              onChange={(e) => {
                const v = e.target.value;
                setLessons((prev) =>
                  prev.map((item, i) => (i === idx ? { ...item, r: v } : item))
                );
              }}
            />
          </label>
          <label className="sub">
            Consejo breve (opcional)
            <input
              value={l.tip}
              onChange={(e) => {
                const v = e.target.value;
                setLessons((prev) =>
                  prev.map((item, i) => (i === idx ? { ...item, tip: v } : item))
                );
              }}
            />
          </label>
        </div>
      ))}

      <button
        className="chip2"
        style={{ width: "100%", marginBottom: 10 }}
        onClick={() =>
          setLessons((prev) => [
            ...prev,
            { t: `Lección ${prev.length + 1}`, x: "", r: "", tip: "" },
          ])
        }
      >
        ＋ Agregar lección
      </button>

      <button className="pri" onClick={handleSave}>
        Guardar cambios
      </button>
    </>
  );
};

export const LessonView: React.FC<{
  S: RumboState;
  param: string;
  onBack: () => void;
  onNavigate: (nextParam: string) => void;
  onMarkNext: (lessonKey: string, nextParam: string) => void;
  onFinishCourse: (course: Course) => void;
  onSaveNote: (noteKey: string, value: string) => void;
  onScheduleSteps: (course: Course) => void;
}> = ({
  S,
  param,
  onBack,
  onNavigate,
  onMarkNext,
  onFinishCourse,
  onSaveNote,
  onScheduleSteps,
}) => {
  const [id, rawIdx] = param.split(":");
  const c = allCourses(S).find((x) => x.id === id);
  if (!c) return <Head title="Lección" onBack={onBack} />;

  const n = c.L.length;
  const k = Math.min(Number(rawIdx) || 0, n);
  const t = T[c.tp];
  const fin = k >= n;
  const ac = getCourseActions(c);
  const nt = S.nt || {};

  const progressBar = (
    <div className="pgbar">
      {k > 0 ? (
        <button
          className="lk"
          style={{ color: "var(--mute)", fontSize: "1.05rem" }}
          onClick={() => {
            onNavigate(`${id}:${k - 1}`);
            window.scrollTo(0, 0);
          }}
        >
          ‹ Anterior
        </button>
      ) : (
        <span style={{ width: 96 }} />
      )}
      <span className="dots">
        {Array.from({ length: n + 1 }, (_, j) => (
          <i
            key={j}
            className={`dot ${j < k ? "past" : j === k ? "cur" : ""}`}
          />
        ))}
      </span>
      {fin ? (
        <button className="nx2" onClick={() => onFinishCourse(c)}>
          Finalizar
        </button>
      ) : (
        <button
          className="lk"
          style={{ fontSize: "1.05rem" }}
          onClick={() => {
            onMarkNext(`${id}:${k}`, `${id}:${k + 1}`);
            window.scrollTo(0, 0);
          }}
        >
          Siguiente ›
        </button>
      )}
    </div>
  );

  if (fin) {
    const notes = c.L.map((l, j) => [
      l[0],
      nt[`${id}:${j}:r`],
      nt[`${id}:${j}:x`],
    ]).filter((x) => x[1] || x[2]);
    const scheduled = Boolean(S.ad && S.ad[id]);

    return (
      <>
        <div className="row">
          <button className="ic" onClick={onBack} aria-label="Volver">
            ‹
          </button>
        </div>
        <h1 style={{ marginTop: 26 }}>Cierre del curso</h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
          Terminaste «{c.t}». Estas ideas y tus notas te ayudarán a convertir lo aprendido en acciones concretas.
        </p>

        <div className="nb nb-info">
          <div className="nbh">ⓘ</div>
          Tus anotaciones quedan guardadas: puedes releerlas aquí abajo.
        </div>

        {ac && (
          <div className="nb nb-act">
            <div className="nbh">✓ {ac.t}</div>
            <p className="sub" style={{ color: "inherit" }}>
              Elige por dónde empezar con estos pasos.
            </p>
            <ul>
              {ac.items.map((x, idx) => (
                <li key={idx}>{x}</li>
              ))}
            </ul>
            <button
              className="pri"
              style={{ background: "#059669", color: "#fff" }}
              disabled={scheduled}
              onClick={() => onScheduleSteps(c)}
            >
              {scheduled ? "Pasos programados ✓" : "Programar estos pasos"}
            </button>
            {!scheduled && (
              <p className="sub">Se programa un paso por día, desde hoy.</p>
            )}
          </div>
        )}

        {notes.length > 0 && (
          <>
            <h3 style={{ marginTop: 16 }}>Tus notas</h3>
            {notes.map((x, idx) => (
              <div key={idx} className="card">
                <b>{x[0]}</b>
                {x[1] && <p style={{ whiteSpace: "pre-wrap" }}>{x[1]}</p>}
                {x[2] && <p style={{ whiteSpace: "pre-wrap" }}>{x[2]}</p>}
              </div>
            ))}
          </>
        )}
        {progressBar}
      </>
    );
  }

  const l = c.L[k];
  const ex = getLessonExtra(c, k);
  const kr = `${id}:${k}:r`;
  const kx = `${id}:${k}:x`;

  return (
    <>
      <div className="row">
        <button className="ic" onClick={onBack} aria-label="Volver">
          ‹
        </button>
      </div>
      <h1 style={{ marginTop: 26 }}>{l[0]}</h1>
      {l[1].split("\n").map((p, idx) => (
        <p key={idx} style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
          {p}
        </p>
      ))}

      {k === 0 && (
        <>
          <div
            className="gc"
            style={{
              background: `linear-gradient(135deg,${t.c},${t.c}66)`,
              minHeight: 200,
              justifyContent: "center",
              alignItems: "center",
              fontSize: "4rem",
              marginTop: 14,
            }}
          >
            <Ico name={t.icon} />
          </div>
          <p className="sub" style={{ textAlign: "center" }}>
            {c.d}
          </p>
        </>
      )}

      {ex.q && (
        <div className="nb nb-q">
          <div className="nbh">❝</div>
          <i>“{ex.q.x}”</i>
          <p className="sub" style={{ color: "inherit" }}>
            — {ex.q.a}
          </p>
        </div>
      )}

      {ex.tip && (
        <div className="nb nb-tip">
          <div className="nbh">💡</div>
          <b>Para recordar:</b> {ex.tip}
        </div>
      )}

      {ex.r && (
        <div className="nb nb-ref">
          <div className="nbh">▤ Pausa para pensar</div>
          <p style={{ fontStyle: "italic", fontSize: "1.05rem" }}>{ex.r}</p>
          <p className="sub">
            Tómate unos minutos con esta pregunta antes de seguir.
          </p>
          <textarea
            placeholder="Escribe tus pensamientos…"
            value={nt[kr] || ""}
            onChange={(e) => onSaveNote(kr, e.target.value)}
          />
        </div>
      )}

      {ex.ex && (
        <div className="nb nb-ex">
          <div className="nbh">✎ {ex.ex.t}</div>
          <p>{ex.ex.x}</p>
          <textarea
            placeholder="Escribe tu respuesta…"
            value={nt[kx] || ""}
            onChange={(e) => onSaveNote(kx, e.target.value)}
          />
        </div>
      )}

      {progressBar}
    </>
  );
};

export const RecGenView: React.FC<{
  S: RumboState;
  aiAvailable: boolean;
  initialTopic: string;
  initialSize: string;
  baseContent: string;
  onBack: () => void;
  onSavePending: (pending: PendingCourseGen | null) => void;
  onCreated: (c: Course) => void;
}> = ({
  S,
  aiAvailable,
  initialTopic,
  initialSize,
  baseContent,
  onBack,
  onSavePending,
  onCreated,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [sz, setSz] = useState(initialSize || "c");
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState<{ i: number; n: number } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    setSz(initialSize || "c");
  }, [initialSize]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const pending = S.pendingGen;
  const hasSavedProgress = Boolean(pending?.outline?.lessons?.length);
  const savedDone = pending?.completedLessons?.length || 0;
  const savedTotal = pending?.outline?.lessons?.length || 0;

  const runGeneration = async (resumePending: PendingCourseGen | null) => {
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    setErrorMsg("");

    if (resumePending?.outline?.lessons?.length) {
      const done = resumePending.completedLessons?.length || 0;
      const total = resumePending.outline.lessons.length;
      setProgress({ i: Math.min(done + 1, total), n: total });
      setStatusMsg(`Retomando desde la lección ${Math.min(done + 1, total)} de ${total}…`);
    } else {
      setProgress(null);
      setStatusMsg("Preparando el esquema del curso…");
    }

    const effectiveTopic = resumePending
      ? resumePending.topic
      : topic.trim() || autoTopic(S);
    const effectiveSz = resumePending ? resumePending.sz : sz;
    const effectiveBase = resumePending ? resumePending.base : baseContent;

    try {
      const c = await generateAiCourse(effectiveTopic, effectiveSz, effectiveBase, {
        existingPending: resumePending,
        signal: controller.signal,
        onProgress: (i, n, batchEnd) => {
          setProgress({ i, n });
          if (batchEnd && batchEnd > i) {
            setStatusMsg(`Escribiendo lecciones ${i}–${batchEnd} de ${n}…`);
          } else {
            setStatusMsg(`Escribiendo la lección ${i} de ${n}…`);
          }
        },
        onCheckpoint: (cp) => {
          onSavePending(cp);
        },
      });
      onSavePending(null);
      setProgress(null);
      setStatusMsg("");
      onCreated(c);
    } catch (e: unknown) {
      if (e instanceof GenerationPausedError) {
        setStatusMsg(
          "Generación pausada. Tu avance quedó guardado para continuar donde te quedaste."
        );
      } else {
        const err = e as { message?: string };
        setStatusMsg("");
        setErrorMsg(
          err?.message || "No se pudo generar el recurso. Inténtalo de nuevo."
        );
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
    }
  };

  return (
    <>
      <Head title="Generar recurso" onBack={onBack} />

      {hasSavedProgress && !busy && pending && (
        <div className="card" style={{ borderColor: "var(--acc)" }}>
          <b>Generación pendiente</b>
          <p style={{ margin: "6px 0" }}>
            {pending.outline?.title || pending.topic}
          </p>
          <div className="bar">
            <i style={{ width: `${pct(savedDone, savedTotal)}%` }} />
          </div>
          <p className="sub">
            {savedDone} de {savedTotal} lecciones completadas. Puedes continuar justo donde se detuvo.
          </p>
          <button
            className="pri"
            onClick={() => runGeneration(pending)}
          >
            {savedDone >= savedTotal
              ? `Completar recurso (${savedDone}/${savedTotal})`
              : `Continuar donde se quedó (${savedDone + 1}/${savedTotal})`}
          </button>
          <button
            className="lk"
            style={{ width: "100%", marginTop: 4 }}
            onClick={() => {
              onSavePending(null);
              setStatusMsg("");
              setErrorMsg("");
              setProgress(null);
            }}
          >
            Descartar progreso y empezar otro
          </button>
        </div>
      )}

      <div className="card">
        <p>
          Describe qué quieres aprender o trabajar, o déjalo vacío y lo genero según tu evaluación, tus actividades y tu ánimo.
        </p>
        <textarea
          placeholder="Ej.: manejar los nervios antes de hablar en público"
          value={topic}
          disabled={busy}
          onChange={(e) => setTopic(e.target.value)}
        />
        {baseContent && (
          <p className="sub">
            Se usará el curso ya existente como base para ampliarlo.
          </p>
        )}
        <label className="sub">
          Extensión
          <select
            value={sz}
            disabled={busy}
            onChange={(e) => setSz(e.target.value)}
          >
            {Object.entries(SZ).map(([k, v]) => (
              <option key={k} value={k}>
                {v.l} ({v.n} lecciones)
              </option>
            ))}
          </select>
        </label>
        <p className="sub">
          Cada lección se guarda automáticamente al completarse: si se detiene, podrás continuar donde se quedó.
        </p>
        <button
          className="pri"
          disabled={busy}
          onClick={() => runGeneration(null)}
        >
          {busy
            ? "Generando…"
            : hasSavedProgress
              ? "Generar un recurso nuevo"
              : "Generar recurso"}
        </button>

        {busy && (
          <>
            {progress && (
              <div className="bar" style={{ marginTop: 10 }}>
                <i
                  style={{
                    width: `${pct(progress.i - 1, progress.n)}%`,
                  }}
                />
              </div>
            )}
            <button
              className="lk"
              style={{ width: "100%", color: "var(--bad)" }}
              onClick={() => abortRef.current?.abort()}
            >
              Pausar y guardar avance
            </button>
          </>
        )}

        {statusMsg && <p className="sub">{statusMsg}</p>}
        {errorMsg && (
          <div
            className="card"
            style={{
              marginTop: 10,
              borderColor: "var(--bad)",
              color: "var(--bad)",
            }}
          >
            <b>No se pudo completar</b>
            <p style={{ margin: "6px 0 0" }}>{errorMsg}</p>
          </div>
        )}
        <p className="sub">
          {aiAvailable
            ? "IA activa en el servidor."
            : "IA no disponible en este entorno."}{" "}
          El contenido lo escribe una IA: revísalo, puede tener errores y no sustituye a un profesional.
        </p>
      </div>
    </>
  );
};

export const ProfileView: React.FC<{
  S: RumboState;
  aiAvailable: boolean;
  aiModel: string;
  onBack: () => void;
  onSaveName: (name: string) => void;
  onSelectTheme: (theme: ThemeMode) => void;
  onImportBackup: (data: Partial<RumboState>) => void;
  onWipeAll: () => void;
}> = ({
  S,
  aiAvailable,
  aiModel,
  onBack,
  onSaveName,
  onSelectTheme,
  onImportBackup,
  onWipeAll,
}) => {
  const [nameInput, setNameInput] = useState(S.name);
  const [copyMsg, setCopyMsg] = useState("");
  const [backupText, setBackupText] = useState("");
  const [backupMsg, setBackupMsg] = useState("");
  const [confirmImport, setConfirmImport] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const themeOptions: {
    id: ThemeMode;
    label: string;
    bg: string;
    acc: string;
  }[] = [
    { id: "auto", label: "Automático", bg: "linear-gradient(135deg,#F8FAFC 50%,#0B1014 50%)", acc: "#14B8A6" },
    { id: "light", label: "Claro", bg: "#F8FAFC", acc: "#14B8A6" },
    { id: "dark", label: "Oscuro", bg: "#0B1014", acc: "#2DD4BF" },
    { id: "warm", label: "Pergamino", bg: "#FAF6EE", acc: "#D97706" },
    { id: "sage", label: "Bosque", bg: "#F2F7F3", acc: "#059669" },
    { id: "ocean", label: "Océano", bg: "#F0F7FB", acc: "#0284C7" },
    { id: "indigo", label: "Índigo", bg: "#0F1424", acc: "#818CF8" },
    { id: "plum", label: "Ciruela", bg: "#161017", acc: "#F472B6" },
  ];

  return (
    <>
      <Head title="Perfil" onBack={onBack} />
      <div className="card">
        <input
          placeholder="Tu nombre"
          aria-label="Nombre"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button className="pri" onClick={() => onSaveName(nameInput.trim())}>
          Guardar nombre
        </button>

        <h3 style={{ marginTop: 16 }}>Tema de la aplicación</h3>
        <div className="chips" style={{ marginBottom: 8 }}>
          {themeOptions.map((th) => (
            <button
              key={th.id}
              type="button"
              className={S.theme === th.id ? "sel" : ""}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
              onClick={() => onSelectTheme(th.id)}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: th.bg,
                  border: `3px solid ${th.acc}`,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {th.label}
            </button>
          ))}
        </div>

        <button
          style={{ width: "100%" }}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(buildReport(S));
              setCopyMsg("Copiado");
            } catch {
              setCopyMsg("No se pudo copiar");
            }
          }}
        >
          Copiar informe
        </button>
        {copyMsg && <span className="sub">{copyMsg}</span>}

        <h3 style={{ marginTop: 16 }}>Asistente inteligente</h3>
        <p className="sub">
          {aiAvailable
            ? `IA activa en el servidor (${aiModel}). Guía personal, las metas con IA y el generador de recursos funcionan automáticamente.`
            : "Sin IA conectada: Guía personal y el generador de planes usan respuestas locales con tus datos."}
        </p>

        <h3 style={{ marginTop: 16 }}>Instalar en el celular</h3>
        <PWAInstallButton variant="profile" />

        <h3 style={{ marginTop: 16 }}>Respaldo de datos</h3>
        <p className="sub">
          Exporta tus datos para pasarlos a otra dirección o dispositivo. Las fotos y notas de voz hacen el respaldo más pesado.
        </p>
        <div className="row">
          <button
            className="chip2"
            onClick={() => {
              try {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(
                  new Blob([buildBackupJson(S)], { type: "application/json" })
                );
                a.download = `integral-life-respaldo-${today()}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setBackupMsg(
                  "Descarga iniciada. Si no aparece, usa “Copiar respaldo”."
                );
              } catch {
                setBackupMsg("No se pudo descargar. Usa “Copiar respaldo”.");
              }
            }}
          >
            Descargar respaldo
          </button>
          <button
            className="chip2"
            onClick={async () => {
              const t = buildBackupJson(S);
              try {
                await navigator.clipboard.writeText(t);
                setBackupMsg(
                  `Respaldo copiado (${Math.round(t.length / 1024)} KB). Pégalo en Perfil > Importar de la otra versión.`
                );
              } catch {
                setBackupText(t);
                setBackupMsg(
                  "No se pudo copiar automáticamente: el texto quedó en el cuadro; cópialo a mano."
                );
              }
            }}
          >
            Copiar respaldo
          </button>
        </div>

        <textarea
          placeholder="Para importar, pega aquí un respaldo o elige un archivo"
          aria-label="Respaldo"
          value={backupText}
          onChange={(e) => {
            setBackupText(e.target.value);
            setConfirmImport(false);
          }}
        />
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => {
              const txt = String(r.result);
              setBackupText(txt);
              setConfirmImport(false);
              setBackupMsg(
                parseBackupJson(txt)
                  ? "Archivo cargado. Toca “Importar” para confirmar."
                  : "Ese archivo no es un respaldo válido de Rumbo."
              );
            };
            r.readAsText(f);
          }}
        />
        <div className="row">
          <button className="chip2" onClick={() => fileRef.current?.click()}>
            Elegir archivo
          </button>
          <button
            className="chip2"
            onClick={() => {
              const parsed = parseBackupJson(backupText.trim());
              if (!parsed) {
                setBackupMsg(
                  "No hay un respaldo válido. Pega el texto completo o elige el archivo."
                );
                return;
              }
              if (!confirmImport) {
                setConfirmImport(true);
                setBackupMsg(
                  "Esto reemplazará los datos actuales de este dispositivo. Toca “Importar” otra vez para confirmar."
                );
                return;
              }
              setConfirmImport(false);
              onImportBackup(parsed);
              setBackupMsg("Respaldo importado ✓");
            }}
          >
            Importar
          </button>
        </div>
        {backupMsg && <p className="sub">{backupMsg}</p>}

        <button
          style={{ width: "100%", color: "var(--bad)", marginTop: 12 }}
          onClick={() => {
            if (!confirmWipe) {
              setConfirmWipe(true);
              return;
            }
            setConfirmWipe(false);
            onWipeAll();
          }}
        >
          {confirmWipe
            ? "Toca otra vez para borrar todo"
            : "Borrar todos mis datos"}
        </button>
        <p className="sub">Tus datos se guardan solo en este dispositivo.</p>
      </div>
    </>
  );
};

export function createGoalFromCourse(c: Course): Goal {
  const t = today();
  const gid = uid();
  const n = c.L.length;
  return {
    id: gid,
    t: "Completar: " + c.t,
    h: "c",
    dim: c.dim != null ? c.dim : TD[c.tp] != null ? TD[c.tp] : 7,
    start: t,
    due: add(t, n * 2),
    dtime: "",
    p: 2,
    rem: null,
    ok: `Completas las ${n} lecciones`,
    weeks: Math.max(1, Math.ceil((n * 2) / 7)),
    cid: c.id,
    steps: c.L.map((l, i) => ({
      t: `Lección ${i + 1}: ${l[0]}`,
      d: false,
      date: add(t, i * 2),
      time: "",
      lk: `${c.id}:${i}`,
    })),
  };
}
