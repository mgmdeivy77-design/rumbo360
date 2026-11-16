import React, { useEffect, useRef, useState } from "react";
import { MoodChart } from "../components/Charts";
import { Ico } from "../components/Icons";
import { GQ, KL, ML, MOOD_COLORS, MOOD_ICONS, VS, VX } from "../data/rumboData";
import type { VerseGuide } from "../data/rumboData";
import type {
  CustomVerseGuide,
  DiaryEntry,
  DiaryKind,
  MoodEntry,
  RumboState,
} from "../types";
import { generateVerseGuide } from "../utils/aiClient";
import {
  findActLabel,
  getActCategories,
  getActivityPatterns,
  today,
  uid,
  vbase,
  verseByOffset,
  vstreak,
} from "../utils/rumboHelpers";

type QuizAttempt = {
  answers: Record<number, number>;
  submitted: boolean;
};

const GuideSections: React.FC<{
  guide: VerseGuide | CustomVerseGuide;
  includeQuestions?: boolean;
  quizState?: QuizAttempt;
  onQuizChange?: (next: QuizAttempt) => void;
  isManualFallbackHint?: boolean;
}> = ({
  guide,
  includeQuestions = false,
  quizState,
  onQuizChange,
  isManualFallbackHint = false,
}) => {
  const posAttitudes = guide.attitudes?.pos?.filter(Boolean) || [];
  const negAttitudes = guide.attitudes?.neg?.filter(Boolean) || [];
  const hasAttitudes = posAttitudes.length > 0 || negAttitudes.length > 0;
  const qNum = hasAttitudes ? 5 : 4;
  const quizNum = qNum + 1;

  const quizItems = guide.quiz || [];
  const answers = quizState?.answers || {};
  const submitted = Boolean(quizState?.submitted);
  const answeredCount = quizItems.filter(
    (_, idx) => typeof answers[idx] === "number"
  ).length;
  const allAnswered = quizItems.length > 0 && answeredCount === quizItems.length;

  const correctNums: number[] = [];
  const incorrectNums: number[] = [];
  if (submitted) {
    quizItems.forEach((item, idx) => {
      if (answers[idx] === item.ans) {
        correctNums.push(idx + 1);
      } else {
        incorrectNums.push(idx + 1);
      }
    });
  }
  const score = correctNums.length;

  return (
    <div className="guide-wrap">
      {guide.c && (
        <div className="guide-sec">
          <p>
            <b>Contexto</b>
          </p>
          <p>{guide.c}</p>
        </div>
      )}

      {guide.o && guide.o.length > 0 && (
        <div className="guide-sec">
          <p>
            <b>1. Observación</b>
          </p>
          <ol className="guide-ol">
            {guide.o.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {guide.i && (
        <div className="guide-sec">
          <p>
            <b>2. Interpretación</b>
          </p>
          <p>{guide.i}</p>
        </div>
      )}

      {guide.a && guide.a.length > 0 && (
        <div className="guide-sec">
          <p>
            <b>3. Aplicación</b>
          </p>
          <ol className="guide-ol">
            {guide.a.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {hasAttitudes && (
        <div className="guide-sec">
          <p>
            <b>4. Actitudes</b>
          </p>
          {posAttitudes.length > 0 && (
            <>
              <p className="sub" style={{ fontWeight: 600, marginTop: 4 }}>
                Actitudes positivas
              </p>
              <ol className="guide-ol">
                {posAttitudes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </>
          )}
          {negAttitudes.length > 0 && (
            <>
              <p className="sub" style={{ fontWeight: 600, marginTop: 8 }}>
                Actitudes negativas
              </p>
              <ol className="guide-ol">
                {negAttitudes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}

      {includeQuestions && guide.q && guide.q.length > 0 && (
        <div className="guide-sec">
          <p>
            <b>{qNum}. Preguntas para meditar</b>
          </p>
          <ol className="guide-ol">
            {guide.q.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {includeQuestions && quizItems.length > 0 && onQuizChange && (
        <div className="guide-sec">
          <div className="row" style={{ marginBottom: 4 }}>
            <p style={{ margin: 0 }}>
              <b>{quizNum}. Comprueba lo aprendido</b>
            </p>
            <span className="sub">{quizItems.length} preguntas</span>
          </div>
          <p className="sub">
            Selecciona una opción en cada pregunta para evaluar tu aprendizaje sobre el pasaje.
          </p>

          <div className="qz-list">
            {quizItems.map((item, qIdx) => {
              const picked = answers[qIdx];
              const isRight = submitted && picked === item.ans;
              const isWrong = submitted && picked !== item.ans;

              return (
                <div
                  key={qIdx}
                  className={`qz-item${isRight ? " ok" : isWrong ? " bad" : ""}`}
                >
                  <div className="row" style={{ alignItems: "flex-start", gap: 8 }}>
                    <p className="qz-q grow">
                      {qIdx + 1}. {item.q}
                    </p>
                    {submitted && (
                      <span
                        className="sub"
                        style={{
                          fontWeight: 700,
                          color: isRight ? "var(--ok)" : "var(--bad)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isRight ? "✓ Correcta (+1)" : "✕ Incorrecta (0)"}
                      </span>
                    )}
                  </div>
                  <div className="qz-opts">
                    {item.opts.map((opt, optIdx) => {
                      const isSel = picked === optIdx;
                      const isCorrectOpt = submitted && optIdx === item.ans;
                      const isWrongPicked =
                        submitted && isSel && optIdx !== item.ans;

                      const cls = [
                        "qz-opt",
                        !submitted && isSel ? "sel" : "",
                        isCorrectOpt ? "ok" : "",
                        isWrongPicked ? "bad" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={cls}
                          disabled={submitted}
                          onClick={() =>
                            onQuizChange({
                              answers: { ...answers, [qIdx]: optIdx },
                              submitted: false,
                            })
                          }
                        >
                          <span className="qz-letter">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="grow">{opt}</span>
                          {isCorrectOpt && (
                            <span
                              style={{
                                fontSize: ".8rem",
                                fontWeight: 700,
                                color: "var(--ok)",
                              }}
                            >
                              ✓ Correcta
                            </span>
                          )}
                          {isWrongPicked && (
                            <span
                              style={{
                                fontSize: ".8rem",
                                fontWeight: 700,
                                color: "var(--bad)",
                              }}
                            >
                              ✕ Tu respuesta
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <div style={{ marginTop: 12 }}>
              <p className="sub" style={{ marginBottom: 6 }}>
                Respondidas: {answeredCount} de {quizItems.length}
                {!allAnswered
                  ? ` (faltan ${quizItems.length - answeredCount})`
                  : ""}
              </p>
              <button
                type="button"
                className="pri"
                disabled={!allAnswered}
                style={!allAnswered ? { opacity: 0.55, cursor: "not-allowed" } : undefined}
                onClick={() => onQuizChange({ answers, submitted: true })}
              >
                Ver resultado final
              </button>
            </div>
          ) : (
            <div className="qz-res">
              <p style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 4 }}>
                Resultado final: {score} de {quizItems.length}{" "}
                {quizItems.length === 1 ? "punto" : "puntos"} (
                {Math.round((score / quizItems.length) * 100)}%)
              </p>
              <p style={{ margin: "4px 0", fontSize: ".92rem" }}>
                <b style={{ color: "var(--ok)" }}>
                  ✓ Preguntas correctas ({correctNums.length}):
                </b>{" "}
                {correctNums.length > 0
                  ? correctNums.map((n) => `#${n}`).join(", ")
                  : "Ninguna"}
              </p>
              <p style={{ margin: "4px 0 8px", fontSize: ".92rem" }}>
                <b style={{ color: "var(--bad)" }}>
                  ✕ Preguntas incorrectas ({incorrectNums.length}):
                </b>{" "}
                {incorrectNums.length > 0
                  ? incorrectNums.map((n) => `#${n}`).join(", ")
                  : "Ninguna"}
              </p>
              <button
                type="button"
                className="chip2"
                onClick={() => onQuizChange({ answers: {}, submitted: false })}
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>
      )}

      {includeQuestions && quizItems.length === 0 && isManualFallbackHint && (
        <div className="guide-sec">
          <p>
            <b>{quizNum}. Comprueba lo aprendido</b>
          </p>
          <p className="sub">
            Esta cita fue guardada antes de incluir el cuestionario. Pulsa «✨ Regenerar» arriba para generar de 5 a 10 preguntas de selección múltiple sobre este pasaje.
          </p>
        </div>
      )}
    </div>
  );
};

export const DiaryView: React.FC<{
  S: RumboState;
  updateState: (fn: (prev: RumboState) => RumboState) => void;
  onBack: () => void;
  onOpen: (scr: string, par?: string | null) => void;
}> = ({ S, updateState, onBack, onOpen }) => {
  const [djd, setDjd] = useState<string | null>(null);
  const [djs, setDjs] = useState(false);
  const [dsh, setDsh] = useState(false);
  const [dopen, setDopen] = useState<Record<string, boolean>>({});
  const [vofs, setVofs] = useState(0);
  const [vCopyMsg, setVCopyMsg] = useState("");
  const [vmode, setVmode] = useState<"daily" | "manual">("daily");
  const [manualRef, setManualRef] = useState("");
  const [guideBusy, setGuideBusy] = useState(false);
  const [guideErr, setGuideErr] = useState("");
  const [quizProgress, setQuizProgress] = useState<Record<string, QuizAttempt>>({});

  const t = today();
  const top = djd || t;
  const f = (d: string, o: Intl.DateTimeFormatOptions) =>
    new Date(d + "T12:00:00").toLocaleDateString("es", o);

  type CombinedEntry =
    | { d: string; k: "e"; e: DiaryEntry; tm: string }
    | { d: string; k: "m"; m: MoodEntry; tm: string };

  const en: CombinedEntry[] = [
    ...S.diary.map((e) => ({ d: e.date, k: "e" as const, e, tm: e.time || "" })),
    ...S.moods
      .filter((m) => m.mood)
      .map((m) => ({ d: m.date, k: "m" as const, m, tm: m.time || "" })),
  ];

  const days = [...new Set([t, ...en.map((x) => x.d)])]
    .filter((d) => !djd || d === djd)
    .sort()
    .reverse();

  const [ref, tx] = verseByOffset(vofs);
  const X = VX[ref];
  const rd = Boolean(S.vr && S.vr[t]);
  const st = vstreak(S.vr);
  const fl = Object.keys(S.vf || {}).filter((k) => S.vf?.[k]);

  const tr = (txt: string | undefined, n: number) => {
    const s = String(txt || "").replace(/\s+/g, " ").trim();
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  };

  const toggleOpen = (k: string) => setDopen((p) => ({ ...p, [k]: !p[k] }));

  const savedManualGuides = Object.values(S.vg || {}).sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
  const activeManualRef = manualRef.trim();
  const activeManualGuide =
    (activeManualRef && (S.vg?.[activeManualRef] || VX[activeManualRef])) ||
    null;
  const activeManualSummary =
    (activeManualRef &&
      (S.vg?.[activeManualRef]?.summary ||
        VS.find((x) => x[0] === activeManualRef)?.[1])) ||
    "";

  const curRef = vmode === "daily" ? ref : activeManualRef;
  const curGuide = vmode === "daily" ? X : activeManualGuide;
  const curTx =
    vmode === "daily" ? tx : activeManualSummary || curGuide?.i || "";
  const curMine = curRef ? (S.vt || {})[curRef] || "" : "";
  const curFv = Boolean(curRef && S.vf && S.vf[curRef]);
  const guideOpenKey = vmode === "daily" ? "vg" : "mg";
  const manualIdx = savedManualGuides.findIndex(
    (item) => item.ref === activeManualRef
  );

  const handleGenerateManualGuide = async () => {
    const cleanRef = manualRef.trim();
    if (!cleanRef) {
      setGuideErr("Escribe una cita bíblica (ej.: Salmo 91:1-4).");
      return;
    }
    setGuideErr("");
    setGuideBusy(true);
    try {
      const g = await generateVerseGuide(cleanRef, (S.vt || {})[cleanRef]);
      updateState((p) => ({
        ...p,
        vg: { ...(p.vg || {}), [cleanRef]: g },
      }));
      setQuizProgress((p) => {
        const next = { ...p };
        delete next[cleanRef];
        return next;
      });
      setDopen((p) => ({ ...p, mg: true }));
    } catch (e: unknown) {
      const err = e as { message?: string };
      setGuideErr(
        err?.message || "No se pudo generar la guía. Inténtalo de nuevo."
      );
    } finally {
      setGuideBusy(false);
    }
  };

  return (
    <>
      <div className="row" style={{ marginBottom: 12 }}>
        <button className="ic" onClick={onBack} aria-label="Cerrar">
          ✕
        </button>
        <div style={{ textAlign: "center" }}>
          <b style={{ fontSize: "1.4rem", textTransform: "capitalize" }}>
            {f(top, { weekday: "long" })}
          </b>
          <div>{f(top, { day: "numeric", month: "short", year: "numeric" })}</div>
        </div>
        <span>
          <label className="ic" aria-label="Elegir fecha" style={{ position: "relative" }}>
            ▦
            <input
              type="date"
              value={top}
              style={{ position: "absolute", inset: 0, opacity: 0, width: "100%" }}
              onChange={(e) => setDjd(e.target.value || null)}
            />
          </label>
          <button className="ic" onClick={() => setDjs(!djs)} aria-label="Ajustes">
            ⚙
          </button>
        </span>
      </div>

      {djs && (
        <div className="card">
          <label className="chk">
            <input
              type="checkbox"
              checked={!S.hv}
              onChange={() => updateState((p) => ({ ...p, hv: !p.hv }))}
            />
            Mostrar el versículo del día
          </label>
          <div className="row">
            <button
              className="lk"
              onClick={() => {
                const next: Record<string, boolean> = {};
                S.diary.forEach((e) => (next["e" + e.id] = true));
                S.moods
                  .filter((m) => m.mood)
                  .forEach((m) => (next["m" + m.date + (m.time || "")] = true));
                setDopen(next);
              }}
            >
              Expandir todo
            </button>
            <button className="lk" onClick={() => setDopen({})}>
              Contraer todo
            </button>
          </div>
          {djd && (
            <button className="lk" onClick={() => setDjd(null)}>
              Ver todos los días
            </button>
          )}
        </div>
      )}

      {days.map((d) => {
        const L = en
          .filter((x) => x.d === d)
          .sort((a, b) => b.tm.localeCompare(a.tm));

        return (
          <React.Fragment key={d}>
            {d === t ? (
              !S.hv && (
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div
                    style={{
                      height: 120,
                      background:
                        "radial-gradient(circle at 50% 110%,#F59E0B 0,#B45309 28%,#1F2937 72%)",
                    }}
                  />
                  <div style={{ padding: 16 }}>
                    <div className="tabs two" style={{ marginBottom: 12 }}>
                      <button
                        className={vmode === "daily" ? "on" : ""}
                        onClick={() => {
                          setVmode("daily");
                          setVCopyMsg("");
                        }}
                      >
                        Devocional prediseñado
                      </button>
                      <button
                        className={vmode === "manual" ? "on" : ""}
                        onClick={() => {
                          setVmode("manual");
                          setVCopyMsg("");
                          if (!manualRef && savedManualGuides.length > 0) {
                            setManualRef(savedManualGuides[0].ref);
                          }
                        }}
                      >
                        Cita manual
                      </button>
                    </div>

                    {vmode === "manual" && (
                      <div style={{ marginBottom: 14 }}>
                        {savedManualGuides.length > 0 && (
                          <div className="chips" style={{ marginBottom: 8 }}>
                            {savedManualGuides.map((item) => (
                              <button
                                key={item.ref}
                                className={activeManualRef === item.ref ? "sel" : ""}
                                onClick={() => {
                                  setManualRef(item.ref);
                                  setGuideErr("");
                                  setVCopyMsg("");
                                }}
                              >
                                📖 {item.ref}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="row" style={{ alignItems: "stretch" }}>
                          <input
                            className="grow"
                            placeholder="Cita bíblica (ej.: Salmo 91:1-4, Juan 15:1-8)"
                            value={manualRef}
                            disabled={guideBusy}
                            onChange={(e) => {
                              setManualRef(e.target.value);
                              setGuideErr("");
                            }}
                          />
                          <button
                            className="chip2"
                            style={{ margin: "3px 0", whiteSpace: "nowrap" }}
                            disabled={guideBusy}
                            onClick={handleGenerateManualGuide}
                          >
                            {guideBusy
                              ? "Generando…"
                              : activeManualGuide
                              ? "✨ Regenerar"
                              : "✨ Generar guía"}
                          </button>
                        </div>

                        {guideErr && (
                          <p className="sub" style={{ color: "var(--bad)" }}>
                            {guideErr}
                          </p>
                        )}

                        {!activeManualGuide && !guideBusy && (
                          <p className="sub" style={{ marginBottom: 0 }}>
                            Escribe cualquier cita bíblica y toca «Generar guía» para ver el pasaje y su guía con la misma estructura del devocional.
                          </p>
                        )}
                      </div>
                    )}

                    {(vmode === "daily" || curGuide) && (
                      <>
                        <div className="row">
                          <b style={{ color: "var(--acct)" }}>
                            {vmode === "daily"
                              ? vofs
                                ? "Otro versículo"
                                : "Palabra de hoy"
                              : "Cita manual"}
                          </b>
                          <span>
                            {vmode === "daily" ? (
                              <>
                                <button
                                  className="ic2"
                                  onClick={() => setVofs((v) => v - 1)}
                                  aria-label="Versículo anterior"
                                >
                                  ‹
                                </button>
                                <button
                                  className="ic2"
                                  onClick={() => setVofs((v) => v + 1)}
                                  aria-label="Versículo siguiente"
                                >
                                  ›
                                </button>
                              </>
                            ) : (
                              <>
                                {savedManualGuides.length > 1 && (
                                  <>
                                    <button
                                      className="ic2"
                                      onClick={() => {
                                        const n = savedManualGuides.length;
                                        const nextIdx =
                                          manualIdx < 0
                                            ? 0
                                            : (manualIdx - 1 + n) % n;
                                        setManualRef(
                                          savedManualGuides[nextIdx].ref
                                        );
                                        setGuideErr("");
                                      }}
                                      aria-label="Cita anterior"
                                    >
                                      ‹
                                    </button>
                                    <button
                                      className="ic2"
                                      onClick={() => {
                                        const n = savedManualGuides.length;
                                        const nextIdx =
                                          manualIdx < 0
                                            ? 0
                                            : (manualIdx + 1) % n;
                                        setManualRef(
                                          savedManualGuides[nextIdx].ref
                                        );
                                        setGuideErr("");
                                      }}
                                      aria-label="Cita siguiente"
                                    >
                                      ›
                                    </button>
                                  </>
                                )}
                                {S.vg?.[curRef] && (
                                  <button
                                    className="lk"
                                    style={{
                                      color: "var(--bad)",
                                      marginLeft: 6,
                                    }}
                                    onClick={() => {
                                      updateState((p) => {
                                        const next = { ...(p.vg || {}) };
                                        delete next[curRef];
                                        return { ...p, vg: next };
                                      });
                                      setManualRef("");
                                    }}
                                  >
                                    Quitar
                                  </button>
                                )}
                              </>
                            )}
                          </span>
                        </div>

                        {curMine ? (
                          <>
                            <p className="sub" style={{ margin: "10px 0 0" }}>
                              En mi Biblia
                            </p>
                            <p
                              style={{
                                fontSize: "1.2rem",
                                fontWeight: 500,
                                margin: "4px 0",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {curMine}
                            </p>
                            {curTx && <p className="sub">Paráfrasis: {curTx}</p>}
                          </>
                        ) : (
                          curTx && (
                            <p
                              style={{
                                fontSize: "1.25rem",
                                fontWeight: 500,
                                margin: "10px 0",
                              }}
                            >
                              {curTx}
                            </p>
                          )
                        )}

                        <div className="row">
                          <div
                            className="sub"
                            style={{ fontStyle: "italic", fontSize: "1rem" }}
                          >
                            — {curRef}
                          </div>
                          <span>
                            <button
                              className="ic2"
                              onClick={() =>
                                updateState((p) => ({
                                  ...p,
                                  vf: {
                                    ...(p.vf || {}),
                                    [curRef]: !(p.vf && p.vf[curRef]),
                                  },
                                }))
                              }
                              aria-label="Favorito"
                            >
                              {curFv ? "♥" : "♡"}
                            </button>
                            <button
                              className="ic2"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    (curMine ? curMine + " " : "") +
                                      `(${curRef}) — ${curTx}`
                                  );
                                  setVCopyMsg(" Copiado ✓");
                                } catch {
                                  setVCopyMsg(" No se pudo copiar");
                                }
                              }}
                              aria-label="Copiar"
                            >
                              ⧉
                            </button>
                          </span>
                        </div>

                        <p className="sub">
                          Paráfrasis libre; lee el pasaje completo en tu Biblia.{" "}
                          <span>{vCopyMsg}</span>
                        </p>

                        {vmode === "daily" && vofs ? (
                          <button className="chip2" onClick={() => setVofs(0)}>
                            Volver al versículo de hoy
                          </button>
                        ) : (
                          <button
                            className="pri"
                            disabled={rd}
                            onClick={() =>
                              updateState((p) => ({
                                ...p,
                                vr: { ...(p.vr || {}), [t]: true },
                              }))
                            }
                          >
                            {rd ? "Leído hoy ✓" : "✓ Marcar como leído hoy"}
                          </button>
                        )}

                        <div className="sub" style={{ margin: "8px 0" }}>
                          🔥 Racha de lectura: {st} {st === 1 ? "día" : "días"}
                        </div>

                        {fl.length > 0 && (
                          <div className="chips" style={{ marginBottom: 6 }}>
                            {fl.map((r) => (
                              <button
                                key={r}
                                onClick={() => {
                                  const vsIdx = VS.findIndex((x) => x[0] === r);
                                  if (vsIdx >= 0) {
                                    setVmode("daily");
                                    setVofs(vsIdx - (vbase() % VS.length));
                                  } else if (S.vg?.[r] || VX[r]) {
                                    setVmode("manual");
                                    setManualRef(r);
                                  }
                                }}
                              >
                                ♥ {r}
                              </button>
                            ))}
                          </div>
                        )}

                        <button
                          className="ch2"
                          onClick={() => toggleOpen(guideOpenKey)}
                          aria-expanded={Boolean(dopen[guideOpenKey])}
                        >
                          <b className="grow">Guía de reflexión</b>
                          <span className="cv">
                            {dopen[guideOpenKey] ? "⌃" : "⌄"}
                          </span>
                        </button>

                        {dopen[guideOpenKey] && (
                          <div style={{ marginTop: 8 }}>
                            {curGuide && (
                              <GuideSections
                                guide={curGuide}
                                includeQuestions
                                quizState={quizProgress[curRef]}
                                onQuizChange={(next) =>
                                  setQuizProgress((p) => ({ ...p, [curRef]: next }))
                                }
                                isManualFallbackHint={vmode === "manual"}
                              />
                            )}
                            <p className="sub" style={{ marginTop: 10 }}>
                              Puntos redactados a partir del texto y de su contexto; contrástalos con tu Biblia.
                            </p>
                            <label className="sub">
                              Escribe el texto en tu versión de la Biblia (opcional)
                              <textarea
                                placeholder="Pega aquí el versículo tal como aparece en tu Biblia"
                                value={curMine}
                                onChange={(e) =>
                                  updateState((p) => ({
                                    ...p,
                                    vt: {
                                      ...(p.vt || {}),
                                      [curRef]: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            ) : (
              <h2 style={{ textAlign: "center", margin: "26px 0 14px" }}>
                <span
                  className="sub"
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--mute)",
                    textTransform: "capitalize",
                  }}
                >
                  {f(d, { weekday: "long" })}
                </span>
                <div className="sub" style={{ fontSize: "1.1rem" }}>
                  {f(d, { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </h2>
            )}

            {L.length > 0 ? (
              L.map((x) => {
                if (x.k === "m") {
                  const m = x.m;
                  const k = "m" + m.date + (m.time || "");
                  const o = Boolean(dopen[k]);
                  const ac = (m.acts || []).map((id) => findActLabel(S, id)).filter(Boolean);
                  const pv =
                    (ML[m.mood - 1] || "") +
                    " (" +
                    m.mood +
                    "/5)" +
                    (ac.length
                      ? " · " + ac.slice(0, 3).join(", ") + (ac.length > 3 ? "…" : "")
                      : "") +
                    (m.note ? " · " + tr(m.note, 40) : "");

                  return (
                    <div key={k} className="card">
                      <button
                        className="ch2"
                        onClick={() => toggleOpen(k)}
                        aria-expanded={o}
                      >
                        <span className="grow">
                          <b style={{ color: "var(--acct)" }}>Registro de estado de ánimo</b>
                          {!o && <div className="pv">{pv}</div>}
                        </span>
                        <span className="sub">{m.time || ""}</span>
                        <span className="cv">{o ? "⌃" : "⌄"}</span>
                      </button>
                      {o && (
                        <>
                          <div style={{ margin: "10px 0" }}>
                            <span className="chip">
                              <Ico name={MOOD_ICONS[m.mood - 1] || "face3"} /> {m.mood}
                            </span>
                            {(m.f || []).map((fac) => (
                              <span key={fac} className="chip">
                                {fac}
                              </span>
                            ))}
                            {ac.map((lbl) => (
                              <span key={lbl} className="chip">
                                {lbl}
                              </span>
                            ))}
                            {m.stress && <span className="chip">Estrés {m.stress}</span>}
                          </div>
                          {m.note && <p style={{ whiteSpace: "pre-wrap" }}>{m.note}</p>}
                          {m.photo && (
                            <img
                              src={m.photo}
                              alt="Foto"
                              style={{ maxWidth: "100%", borderRadius: 14 }}
                            />
                          )}
                          {m.voice && (
                            <audio controls src={m.voice} style={{ width: "100%" }} />
                          )}
                        </>
                      )}
                    </div>
                  );
                }

                const e = x.e;
                const k = "e" + e.id;
                const o = Boolean(dopen[k]);
                const lab = KL[e.kind || "nota"] + (e.ref ? " · " + e.ref : "");
                const pv = tr(
                  (e.title && e.text ? e.title + ": " : "") +
                    (e.text || e.o || e.i || e.a || e.m || e.title || ""),
                  90
                );

                return (
                  <div key={k} className="card">
                    <button
                      className="ch2"
                      onClick={() => toggleOpen(k)}
                      aria-expanded={o}
                    >
                      <span className="grow">
                        <b style={{ color: "var(--acct)" }}>{lab}</b>
                        {!o && <div className="pv">{pv}</div>}
                      </span>
                      <span className="sub">{e.time || ""}</span>
                      <span className="cv">{o ? "⌃" : "⌄"}</span>
                    </button>
                    {o && (
                      <>
                        {e.title && <h3 style={{ marginTop: 8 }}>{e.title}</h3>}
                        {(
                          [
                            ["Observación", e.o],
                            ["Interpretación", e.i],
                            ["Aplicación", e.a],
                            ["Meditación", e.m],
                          ] as [string, string | undefined][]
                        )
                          .filter((q) => Boolean(q[1]))
                          .map(([l, v]) => (
                            <p key={l}>
                              <b>{l}:</b> {v}
                            </p>
                          ))}
                        {e.text && <p style={{ whiteSpace: "pre-wrap" }}>{e.text}</p>}
                        <button
                          className="lk"
                          onClick={() =>
                            updateState((p) => ({
                              ...p,
                              diary: p.diary.filter((item) => item.id !== e.id),
                            }))
                          }
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              d !== t && <p className="sub">Sin entradas.</p>
            )}
          </React.Fragment>
        );
      })}

      <button
        className="dfab"
        onClick={() => setDsh(!dsh)}
        aria-label="Nueva entrada"
      >
        {dsh ? "×" : "＋"}
      </button>

      {dsh && (
        <div className="sheet">
          {(
            [
              ["reflexion", "Reflexión bíblica"],
              ["oracion", "Oración"],
              ["gratitud", "Gratitud"],
              ["nota", "Nota libre"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => {
                setDsh(false);
                onOpen("dform", `${k}|`);
              }}
            >
              {l}
            </button>
          ))}
          <button
            onClick={() => {
              setDsh(false);
              onOpen("mood");
            }}
          >
            Estado de ánimo
          </button>
        </div>
      )}
    </>
  );
};

export const DiaryFormView: React.FC<{
  S: RumboState;
  param: string | null;
  onBack: () => void;
  onSaveVerseGuide: (guide: CustomVerseGuide) => void;
  onSave: (entry: DiaryEntry) => void;
}> = ({ S, param, onBack, onSaveVerseGuide, onSave }) => {
  const [rawKind, rawRef] = (param || "nota|").split("|");
  const k = (rawKind || "nota") as DiaryKind;
  const [refVal, setRefVal] = useState(rawRef || "");
  const [obs, setObs] = useState("");
  const [interp, setInterp] = useState("");
  const [app, setApp] = useState("");
  const [med, setMed] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [guideBusy, setGuideBusy] = useState(false);
  const [guideErr, setGuideErr] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const trimmedRef = refVal.trim();
  const dailyRef = verseByOffset(0)[0];
  const activeGuide =
    (trimmedRef && (VX[trimmedRef] || S.vg?.[trimmedRef])) || null;
  const questions = activeGuide?.q || GQ;

  const handleGenerateFormGuide = async () => {
    if (!trimmedRef) {
      setGuideErr("Escribe primero una cita bíblica (ej.: Salmo 23:1-6).");
      return;
    }
    setGuideErr("");
    setGuideBusy(true);
    try {
      const g = await generateVerseGuide(trimmedRef, (S.vt || {})[trimmedRef]);
      onSaveVerseGuide(g);
      setShowGuide(true);
    } catch (e: unknown) {
      const err = e as { message?: string };
      setGuideErr(err?.message || "No se pudo generar la guía. Inténtalo de nuevo.");
    } finally {
      setGuideBusy(false);
    }
  };

  const handleSave = () => {
    if (k === "reflexion") {
      if (!(refVal.trim() || obs.trim() || interp.trim() || app.trim() || med.trim()))
        return;
      onSave({
        id: uid(),
        date: today(),
        time,
        kind: k,
        ref: refVal.trim(),
        o: obs.trim(),
        i: interp.trim(),
        a: app.trim(),
        m: med.trim(),
      });
    } else {
      if (!text.trim()) return;
      onSave({
        id: uid(),
        date: today(),
        time,
        kind: k,
        title: title.trim(),
        text: text.trim(),
      });
    }
  };

  return (
    <>
      <div className="row">
        <button className="ic" onClick={onBack} aria-label="Volver">
          ‹
        </button>
        <h2 className="grow" style={{ margin: 0 }}>
          {KL[k]}
        </h2>
      </div>
      <br />

      {k === "reflexion" && (
        <div className="card">
          <h3>Preguntas para meditar</h3>
          <ol className="guide-ol">
            {questions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ol>
          <p className="sub" style={{ marginTop: 10 }}>
            Léelas despacio y responde las que más te hablen en los campos de abajo.
          </p>
        </div>
      )}

      <div className="card">
        {k === "reflexion" ? (
          <>
            <div className="chips" style={{ marginBottom: 6 }}>
              <button
                type="button"
                className={trimmedRef === dailyRef ? "sel" : ""}
                onClick={() => {
                  setRefVal(dailyRef);
                  setGuideErr("");
                }}
              >
                Devocional prediseñado ({dailyRef})
              </button>
            </div>
            <input
              placeholder="Cita bíblica manual (ej.: Salmo 23:1-6)"
              value={refVal}
              disabled={guideBusy}
              onChange={(e) => {
                setRefVal(e.target.value);
                setGuideErr("");
              }}
            />
            {!VX[trimmedRef] && (
              <div style={{ margin: "6px 0 10px" }}>
                <button
                  type="button"
                  className="chip2"
                  disabled={guideBusy}
                  onClick={handleGenerateFormGuide}
                >
                  {guideBusy
                    ? "Generando guía de reflexión…"
                    : S.vg?.[trimmedRef]
                    ? "✨ Regenerar guía para esta cita"
                    : "✨ Generar guía de reflexión"}
                </button>
                {guideErr && (
                  <p className="sub" style={{ color: "var(--bad)" }}>
                    {guideErr}
                  </p>
                )}
              </div>
            )}

            {activeGuide && (
              <div
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: "10px 12px",
                  marginBottom: 10,
                }}
              >
                <button
                  type="button"
                  className="ch2"
                  onClick={() => setShowGuide(!showGuide)}
                  aria-expanded={showGuide}
                >
                  <b className="grow">Guía de reflexión ({trimmedRef})</b>
                  <span className="cv">{showGuide ? "⌃" : "⌄"}</span>
                </button>
                {showGuide && <GuideSections guide={activeGuide} />}
              </div>
            )}

            <textarea
              placeholder="Observación: lo que el texto dice (quién, qué, contexto)"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
            <textarea
              placeholder="Interpretación: el principio o mensaje del pasaje"
              value={interp}
              onChange={(e) => setInterp(e.target.value)}
            />
            <textarea
              placeholder="Aplicación: cómo lo vivirás esta semana, con ejemplos de tu día a día"
              value={app}
              onChange={(e) => setApp(e.target.value)}
            />
            <textarea
              placeholder="Mis respuestas a las preguntas para meditar"
              value={med}
              onChange={(e) => setMed(e.target.value)}
            />
          </>
        ) : (
          <>
            {k === "nota" && (
              <input
                placeholder="Título (opcional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            )}
            <textarea
              placeholder={
                k === "oracion"
                  ? "Escribe tu oración o lo que quieres presentar a Dios…"
                  : k === "gratitud"
                  ? "Hoy agradezco…"
                  : "Escribe tus pensamientos y experiencias…"
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </>
        )}
        <input
          type="time"
          aria-label="Hora"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button className="pri" onClick={handleSave}>
          Guardar
        </button>
      </div>
    </>
  );
};

export const MoodIntroView: React.FC<{
  S: RumboState;
  onToggleCategory: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}> = ({ S, onToggleCategory, onBack, onNext }) => {
  const categories = getActCategories(S);
  return (
    <>
      <div className="intro">
        <h1 style={{ color: "#fff" }}>Anota qué haces y encuentra tus patrones</h1>
        <p>
          Cada registro puede incluir lo que hiciste ese día. Con el tiempo verás qué actividades se asocian a tus mejores y peores días. Elige los grupos que quieres usar:
        </p>
        {categories.map((c) => (
          <button
            key={c.id}
            className="icd"
            onClick={() => onToggleCategory(c.id)}
          >
            <i className={c.on ? "on" : ""}>✓</i>
            <span>
              <b>{c.n}</b>
              <div className="sub">
                {c.items
                  .slice(0, 3)
                  .map((x) => x.n)
                  .join(", ")}
                …
              </div>
            </span>
          </button>
        ))}
      </div>
      <div className="ibar">
        <button className="lk" style={{ color: "#fff" }} onClick={onBack}>
          ‹ Atrás
        </button>
        <button className="nx" onClick={onNext}>
          Siguiente ›
        </button>
      </div>
    </>
  );
};

export const MoodView: React.FC<{
  S: RumboState;
  updateState: (fn: (prev: RumboState) => RumboState) => void;
  onBack: () => void;
}> = ({ S, updateState, onBack }) => {
  const t = today();
  const existing = S.moods.find((x) => x.date === t);

  const [medit, setMedit] = useState(false);
  const [mood, setMood] = useState(existing?.mood || 0);
  const [acts, setActs] = useState<string[]>(existing?.acts || []);
  const [note, setNote] = useState(existing?.note || "");
  const [photo, setPhoto] = useState<string | null>(existing?.photo || null);
  const [voice, setVoice] = useState<string | null>(existing?.voice || null);

  const [msg, setMsg] = useState("");
  const [nfull, setNfull] = useState(false);
  const [addCatId, setAddCatId] = useState<string | null>(null);
  const [newActName, setNewActName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [aed, setAed] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mshow, setMshow] = useState(false);
  const [recording, setRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const recTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (recTimerRef.current) clearTimeout(recTimerRef.current);
      if (recRef.current && recRef.current.state !== "inactive") {
        recRef.current.stop();
      }
    };
  }, []);

  const lk = Boolean(existing?.time && !medit);
  const categories = getActCategories(S);
  const patterns = getActivityPatterns(S).slice(0, 4);
  const history = S.moods
    .filter((m) => m.mood && m.date !== t)
    .sort((a, b) => (b.date + (b.time || "")).localeCompare(a.date + (a.time || "")));
  const visibleHistory = mshow ? history : history.slice(0, 7);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const im = new Image();
    const u = URL.createObjectURL(f);
    im.onload = () => {
      const k = Math.min(1, 640 / Math.max(im.width, im.height));
      const c = document.createElement("canvas");
      c.width = Math.round(im.width * k);
      c.height = Math.round(im.height * k);
      c.getContext("2d")?.drawImage(im, 0, 0, c.width, c.height);
      setPhoto(c.toDataURL("image/jpeg", 0.6));
      URL.revokeObjectURL(u);
    };
    im.src = u;
  };

  const toggleVoice = async () => {
    if (recording && recRef.current) {
      if (recTimerRef.current) clearTimeout(recTimerRef.current);
      recRef.current.stop();
      return;
    }
    setMsg("");
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(st, { audioBitsPerSecond: 24000 });
      const chunks: BlobPart[] = [];
      mr.ondataavailable = (ev) => chunks.push(ev.data);
      mr.onstop = () => {
        st.getTracks().forEach((tr) => tr.stop());
        const fr = new FileReader();
        fr.onload = () => {
          setVoice(String(fr.result));
          setRecording(false);
          recRef.current = null;
        };
        fr.readAsDataURL(new Blob(chunks, { type: mr.mimeType }));
      };
      mr.start();
      recRef.current = mr;
      setRecording(true);
      recTimerRef.current = window.setTimeout(() => {
        if (recRef.current && recRef.current.state !== "inactive") {
          recRef.current.stop();
        }
      }, 45000);
    } catch {
      setRecording(false);
      recRef.current = null;
      setMsg(
        "No se pudo usar el micrófono en esta vista. Prueba conceder el permiso en el navegador."
      );
    }
  };

  const handleSave = () => {
    if (!mood) {
      setMsg("Elige primero cómo te sientes (las caritas de arriba).");
      window.scrollTo(0, 0);
      return;
    }
    const timeNow = new Date().toTimeString().slice(0, 5);
    const entry: MoodEntry = {
      date: t,
      mood,
      acts: [...acts],
      note: note.trim(),
      photo,
      voice,
      time: timeNow,
    };
    updateState((prev) => {
      const idx = prev.moods.findIndex((x) => x.date === t);
      const nextMoods = [...prev.moods];
      if (idx >= 0) nextMoods[idx] = entry;
      else nextMoods.push(entry);
      return { ...prev, moods: nextMoods };
    });
    setMsg("Guardado ✓ Lo verás en Reflexión Bíblica y en Progreso.");
    setMedit(false);
    window.scrollTo(0, 0);
  };

  const displayMood = lk ? existing?.mood || 0 : mood;

  return (
    <>
      <div className="row">
        <button className="ic" onClick={onBack} aria-label="Volver">
          ‹
        </button>
        <span
          className="mfc"
          style={{
            background: displayMood ? MOOD_COLORS[displayMood - 1] : "var(--line)",
          }}
        >
          <Ico name={displayMood ? MOOD_ICONS[displayMood - 1] : "face3"} />
        </span>
        {lk ? (
          <span />
        ) : (
          <button
            className="lk"
            onClick={handleSave}
            style={{ fontSize: "1.1rem" }}
          >
            ✓ Guardar
          </button>
        )}
      </div>

      {msg && (
        <p
          style={{
            fontWeight: 700,
            margin: "8px 0",
            color: msg.startsWith("Guardado") ? "var(--ok)" : "var(--bad)",
          }}
        >
          {msg}
        </p>
      )}

      {lk && existing ? (
        <div className="card">
          <b>Hoy a las {existing.time}</b>
          <div style={{ margin: "10px 0" }}>
            {(existing.acts || [])
              .map((id) => findActLabel(S, id))
              .filter(Boolean)
              .concat(existing.f || [])
              .map((lbl, idx) => (
                <span key={idx} className="chip">
                  {lbl}
                </span>
              ))}
          </div>
          {existing.note && <p>{existing.note}</p>}
          {existing.photo && (
            <img
              src={existing.photo}
              alt="Foto"
              style={{ maxWidth: "100%", borderRadius: 14, marginTop: 8 }}
            />
          )}
          {existing.voice && (
            <audio
              controls
              src={existing.voice}
              style={{ width: "100%", marginTop: 8 }}
            />
          )}
          <button
            className="pri"
            style={{ marginTop: 10 }}
            onClick={() => {
              setMood(existing.mood || 0);
              setActs([...(existing.acts || [])]);
              setNote(existing.note || "");
              setPhoto(existing.photo || null);
              setVoice(existing.voice || null);
              setMsg("");
              setMedit(true);
            }}
          >
            Editar registro
          </button>
        </div>
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>¿Cómo te sientes?</h2>
          <div className="mfr">
            {MOOD_ICONS.map((icon, i) => (
              <button
                key={icon}
                className={`mf ${mood === i + 1 ? "sel" : ""}`}
                style={{ background: MOOD_COLORS[i] }}
                onClick={() => {
                  setMood(i + 1);
                  setMsg("");
                }}
                aria-label={ML[i]}
              >
                <Ico name={icon} />
              </button>
            ))}
          </div>

          <h2 style={{ textAlign: "center" }}>¿Qué has estado haciendo?</h2>

          {categories
            .filter((c) => c.on || aed)
            .map((c) => (
              <div
                key={c.id}
                className="card"
                style={{ opacity: c.on ? 1 : 0.5 }}
              >
                <div className="row">
                  <b>{c.n}</b>
                  <span>
                    <button
                      className="ic2"
                      onClick={() =>
                        setAddCatId(addCatId === c.id ? null : c.id)
                      }
                      aria-label="Agregar actividad"
                    >
                      ＋
                    </button>
                    <button
                      className="ic2"
                      onClick={() => {
                        if (aed) {
                          updateState((p) => ({
                            ...p,
                            acts: getActCategories(p).map((cat) =>
                              cat.id === c.id ? { ...cat, on: !cat.on } : cat
                            ),
                          }));
                        } else {
                          setCollapsed((p) => ({ ...p, [c.id]: !p[c.id] }));
                        }
                      }}
                      aria-label={
                        aed ? "Mostrar u ocultar grupo" : "Contraer"
                      }
                    >
                      {aed ? (c.on ? "👁" : "🚫") : collapsed[c.id] ? "⌄" : "⌃"}
                    </button>
                  </span>
                </div>

                {(!collapsed[c.id] || aed) && (
                  <div className="ag">
                    {c.items.map((it) => (
                      <button
                        key={it.id}
                        className={`ai ${acts.includes(it.id) ? "on" : ""}`}
                        onClick={() => {
                          if (aed) {
                            updateState((p) => ({
                              ...p,
                              acts: getActCategories(p).map((cat) =>
                                cat.id === c.id
                                  ? {
                                      ...cat,
                                      items: cat.items.filter(
                                        (item) => item.id !== it.id
                                      ),
                                    }
                                  : cat
                              ),
                            }));
                            setActs((prev) => prev.filter((x) => x !== it.id));
                          } else {
                            setActs((prev) =>
                              prev.includes(it.id)
                                ? prev.filter((x) => x !== it.id)
                                : [...prev, it.id]
                            );
                          }
                        }}
                      >
                        <span>
                          {it.ic}
                          {aed && <em>×</em>}
                        </span>
                        {it.n}
                      </button>
                    ))}
                  </div>
                )}

                {addCatId === c.id && (
                  <div className="row" style={{ marginTop: 8 }}>
                    <input
                      placeholder="Nueva actividad"
                      value={newActName}
                      onChange={(e) => setNewActName(e.target.value)}
                    />
                    <button
                      className="chip2"
                      onClick={() => {
                        const n = newActName.trim();
                        if (!n) return;
                        updateState((p) => ({
                          ...p,
                          acts: getActCategories(p).map((cat) =>
                            cat.id === c.id
                              ? {
                                  ...cat,
                                  items: [
                                    ...cat.items,
                                    { id: "u" + uid(), n, ic: "⭐" },
                                  ],
                                }
                              : cat
                          ),
                        }));
                        setNewActName("");
                        setAddCatId(null);
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                )}
              </div>
            ))}

          {aed && (
            <div className="card row">
              <input
                placeholder="Nuevo grupo de actividades"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button
                className="chip2"
                onClick={() => {
                  const n = newCatName.trim();
                  if (!n) return;
                  updateState((p) => ({
                    ...p,
                    acts: [
                      ...getActCategories(p),
                      { id: "u" + uid(), n, on: true, items: [] },
                    ],
                  }));
                  setNewCatName("");
                }}
              >
                Crear
              </button>
            </div>
          )}

          <div className="row">
            <b>📝 Nota rápida</b>
            <button className="lk" onClick={() => setNfull(!nfull)}>
              {nfull ? "Nota corta" : "Abrir nota completa"}
            </button>
          </div>
          {nfull ? (
            <textarea
              placeholder="Agregar nota…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          ) : (
            <input
              placeholder="Agregar nota…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          )}

          <h3 style={{ marginTop: 14 }}>📷 Foto</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhoto}
          />
          {photo ? (
            <>
              <img
                src={photo}
                alt="Foto"
                style={{ maxWidth: "100%", borderRadius: 14 }}
              />
              <button className="lk" onClick={() => setPhoto(null)}>
                Quitar foto
              </button>
            </>
          ) : (
            <button
              className="wide"
              onClick={() => fileInputRef.current?.click()}
            >
              Toca para agregar foto
            </button>
          )}

          <h3 style={{ marginTop: 14 }}>🎙️ Nota de voz</h3>
          {voice ? (
            <>
              <audio controls src={voice} style={{ width: "100%" }} />
              <button className="lk" onClick={() => setVoice(null)}>
                Quitar nota de voz
              </button>
            </>
          ) : (
            <button className="wide" onClick={toggleVoice}>
              {recording
                ? "● Grabando… toca para detener"
                : "Toca para grabar (máx. 45 s)"}
            </button>
          )}

          <button
            className="pri"
            style={{ marginTop: 18 }}
            onClick={handleSave}
          >
            ✓ Guardar
          </button>
          <button
            className="lk"
            style={{ width: "100%" }}
            onClick={() => {
              setAed(!aed);
              setAddCatId(null);
            }}
          >
            {aed ? "Terminar de editar" : "✎ Editar actividades"}
          </button>
        </>
      )}

      <h2>Mis registros</h2>
      {visibleHistory.length > 0 ? (
        <>
          {visibleHistory.map((m) => (
            <div key={m.date + (m.time || "")} className="card">
              <div className="row">
                <b style={{ textTransform: "capitalize" }}>
                  {new Date(m.date + "T12:00:00").toLocaleDateString("es", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                  })}
                </b>
                <span className="sub">{m.time || ""}</span>
              </div>
              <div style={{ margin: "8px 0" }}>
                <span className="chip">
                  <Ico name={MOOD_ICONS[m.mood - 1] || "face3"} /> {m.mood}
                </span>
                {(m.acts || [])
                  .map((id) => findActLabel(S, id))
                  .filter(Boolean)
                  .concat(m.f || [])
                  .map((x, idx) => (
                    <span key={idx} className="chip">
                      {x}
                    </span>
                  ))}
              </div>
              {m.note && <p>{m.note}</p>}
              {m.photo && (
                <img
                  src={m.photo}
                  alt="Foto"
                  style={{ maxWidth: "100%", borderRadius: 14, marginTop: 8 }}
                />
              )}
              {m.voice && (
                <audio
                  controls
                  src={m.voice}
                  style={{ width: "100%", marginTop: 8 }}
                />
              )}
            </div>
          ))}
          {history.length > 7 && (
            <button
              className="lk"
              style={{ width: "100%" }}
              onClick={() => setMshow(!mshow)}
            >
              {mshow ? "Ver menos" : `Ver las ${history.length} anteriores`}
            </button>
          )}
        </>
      ) : (
        <p className="sub">Aquí verás tus registros anteriores, solo para leer.</p>
      )}

      <div className="card">
        <h3>Esta semana</h3>
        <MoodChart moods={S.moods} />
      </div>

      {patterns.length > 0 && (
        <div className="card">
          <h3>Patrones</h3>
          {patterns.map(([it, a, b, n]) => (
            <p key={it.id} className="sub">
              {it.ic} {it.n}: {a.toFixed(1)} con · {b.toFixed(1)} sin ({n} días)
            </p>
          ))}
          <p className="sub">Son asociaciones, no causas.</p>
        </div>
      )}

      <p className="sub">
        Herramienta psicoeducativa: no diagnostica ni sustituye la atención psicológica.
      </p>
    </>
  );
};
