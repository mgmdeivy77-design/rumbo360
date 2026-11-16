import React, { useEffect, useRef, useState } from "react";
import { BarChart } from "../components/Charts";
import { CoachHero, Ico } from "../components/Icons";
import { DN, MOOD_COLORS, MOOD_ICONS } from "../data/rumboData";
import type { ChatMessage, RumboState } from "../types";
import {
  add,
  buildWeeklyText,
  dow,
  findActLabel,
  getWeeklyRecommendations,
  getWeeklyReport,
  getWeeklyTrends,
  pct,
  sched,
} from "../utils/rumboHelpers";

export const CoachView: React.FC<{
  S: RumboState;
  busy: boolean;
  onBack: () => void;
  onSend: (text: string) => void;
  onOpen: (scr: string, par?: string | null) => void;
  onTab: (tab: "home" | "agenda" | "rec" | "stats") => void;
}> = ({ S, busy, onBack, onSend, onOpen, onTab }) => {
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const ch: ChatMessage[] = S.chat || [];

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [ch.length, busy]);

  const handleSend = () => {
    const t = input.trim();
    if (!t || busy) return;
    setInput("");
    onSend(t);
  };

  return (
    <div className="ch">
      <div className="chh">
        <CoachHero />
        <button className="cx" onClick={onBack} aria-label="Cerrar">
          ×
        </button>
      </div>
      <div className="cl" ref={listRef}>
        {ch.map((m, idx) => (
          <div key={idx} className={`cm ${m.r}`}>
            {m.t}
            {m.go && (
              <div style={{ marginTop: 8 }}>
                <button
                  className="chip2"
                  onClick={() => {
                    if (m.go?.[0] === "open") onOpen(m.go[1]);
                    else if (m.go?.[0] === "tab")
                      onTab(m.go[1] as "home" | "agenda" | "rec" | "stats");
                  }}
                >
                  {m.go[2]}
                </button>
              </div>
            )}
            {m.loc && (
              <div className="sub" style={{ color: "var(--bad)" }}>
                respuesta guiada, sin IA{m.why ? `: ${m.why}` : ""}
              </div>
            )}
          </div>
        ))}

        {ch.length <= 3 && (
          <div className="qk">
            {(
              [
                ["goalnew", "Crear una meta"],
                ["wheel", "Revisar mi rueda"],
                ["mood", "Registrar mi ánimo"],
              ] as const
            ).map(([scr, label]) => (
              <button
                key={scr}
                className="chip2"
                onClick={() => onOpen(scr)}
              >
                {label}
              </button>
            ))}
            <button
              className="chip2"
              onClick={() => onSend("Revisa mi semana y sugiere un ajuste realista")}
            >
              Revisar mi semana
            </button>
          </div>
        )}
      </div>
      <div className="cin">
        <input
          placeholder="Introduce un mensaje"
          aria-label="Mensaje"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className="cs" onClick={handleSend} disabled={busy} aria-label="Enviar">
          ➤
        </button>
      </div>
    </div>
  );
};

export const WeeklyBalanceView: React.FC<{
  S: RumboState;
  offset: number;
  onChangeOffset: (next: number) => void;
  onBack: () => void;
  onAnalyzeWithCoach: (text: string) => void;
}> = ({ S, offset, onChangeOffset, onBack, onAnalyzeWithCoach }) => {
  const [copyMsg, setCopyMsg] = useState("");
  const w = getWeeklyReport(S, offset);
  const tr = getWeeklyTrends(S, w);
  const a = w.avg;

  const fm = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es", {
      day: "numeric",
      month: "short",
    });
  const lab = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es", { weekday: "long" });

  const fr: Record<string, number> = {};
  w.R.forEach((m) => (m.acts || []).forEach((id) => (fr[id] = (fr[id] || 0) + 1)));
  const top = Object.entries(fr)
    .sort((x, y) => y[1] - x[1])
    .slice(0, 5);

  const hb = S.habits
    .map((h) => {
      const sd = w.ds.filter((d) => sched(h, d));
      return {
        h,
        total: sd.length,
        done: sd.filter((d) => h.log[d]).length,
      };
    })
    .filter((x) => x.total > 0);

  const dm = w.ds.map((d) => {
    const m = w.R.find((x) => x.date === d);
    return m ? m.mood : 0;
  });

  const recs = getWeeklyRecommendations(w, tr);

  return (
    <>
      <div className="row">
        <button className="ic" onClick={onBack} aria-label="Volver">
          ‹
        </button>
        <h2 className="grow" style={{ margin: 0 }}>
          Balance semanal
        </h2>
      </div>
      <br />

      <div className="row">
        <button
          className="chip2"
          onClick={() => {
            onChangeOffset(offset + 1);
            window.scrollTo(0, 0);
          }}
        >
          ‹ Anterior
        </button>
        <b>
          {fm(w.m0)} – {fm(add(w.m0, 6))}
        </b>
        <button
          className="chip2"
          disabled={!offset}
          onClick={() => {
            onChangeOffset(Math.max(0, offset - 1));
            window.scrollTo(0, 0);
          }}
        >
          Siguiente ›
        </button>
      </div>
      <br />

      <div className="card">
        <h3>Resumen</h3>
        {a == null ? (
          <p className="sub">No registraste tu ánimo esta semana.</p>
        ) : (
          <>
            <div className="row">
              <span
                className="mfc"
                style={{ background: MOOD_COLORS[Math.round(a) - 1] }}
              >
                <Ico name={MOOD_ICONS[Math.round(a) - 1]} />
              </span>
              <div className="grow">
                <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                  {a.toFixed(1)} / 5
                </div>
                <div className="sub">
                  {w.R.length} de {w.ds.length} días registrados
                </div>
              </div>
              {w.pavg != null && (
                <b style={{ color: a >= w.pavg ? "var(--ok)" : "var(--bad)" }}>
                  {a >= w.pavg ? "▲" : "▼"} {Math.abs(a - w.pavg).toFixed(1)}
                </b>
              )}
            </div>
            {w.pavg != null && (
              <p className="sub">Semana anterior: {w.pavg.toFixed(1)}</p>
            )}
            {w.best && w.worst && w.R.length > 1 && (
              <p className="sub">
                Mejor día: {lab(w.best.date)} ({w.best.mood}). Día más bajo:{" "}
                {lab(w.worst.date)} ({w.worst.mood}).
              </p>
            )}
          </>
        )}
      </div>

      {a != null && (
        <div className="card">
          <h3>Cómo te sentiste</h3>
          {w.dist.map((n, i) => (
            <div key={i} className="row">
              <span>
                <Ico name={MOOD_ICONS[i]} />
              </span>
              <div className="bar grow" style={{ margin: 6 }}>
                <i
                  style={{
                    width: `${pct(n, w.R.length)}%`,
                    background: MOOD_COLORS[i],
                  }}
                />
              </div>
              <b>{n}</b>
            </div>
          ))}
          <BarChart
            values={dm}
            labels={w.ds.map((d) => DN[dow(d)])}
            color="#14B8A6"
          />
        </div>
      )}

      <div className="card">
        <h3>Actividades de la semana</h3>
        {top.length > 0 ? (
          top.map(([id, n]) => (
            <span key={id} className="chip">
              {findActLabel(S, id)} ×{n}
            </span>
          ))
        ) : (
          <p className="sub">Sin actividades registradas.</p>
        )}
      </div>

      <div className="card">
        <h3>Lo que te ayuda</h3>
        {tr.help.length > 0 ? (
          tr.help.map((x) => (
            <p key={x.it.id} className="sub">
              {x.it.ic} {x.it.n}: +{x.d.toFixed(1)} ({x.n} días)
            </p>
          ))
        ) : (
          <p className="sub">Aún no hay suficientes datos.</p>
        )}
        <h3 style={{ marginTop: 12 }}>Lo que te resta</h3>
        {tr.hurt.length > 0 ? (
          tr.hurt.map((x) => (
            <p key={x.it.id} className="sub">
              {x.it.ic} {x.it.n}: {x.d.toFixed(1)} ({x.n} días)
            </p>
          ))
        ) : (
          <p className="sub">Aún no hay suficientes datos.</p>
        )}
        <p className="sub">
          Compara tu ánimo con y sin cada actividad en las últimas 8 semanas (mínimo 3 días de cada caso). Son asociaciones, no causas.
        </p>
      </div>

      {hb.length > 0 && (
        <div className="card">
          <h3>Hábitos</h3>
          {hb.map(({ h, total, done }) => (
            <div key={h.id}>
              <div className="row">
                <span>{h.name}</span>
                <b>
                  {done}/{total}
                </b>
              </div>
              <div className="bar">
                <i style={{ width: `${pct(done, total)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3>Recomendaciones</h3>
        {recs.map((x, i) => (
          <p key={i}>{x}</p>
        ))}
      </div>

      <button
        className="pri"
        onClick={() => onAnalyzeWithCoach(buildWeeklyText(S, offset))}
      >
        Analizar con Guía personal
      </button>
      <button
        className="lk"
        style={{ width: "100%" }}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(buildWeeklyText(S, offset));
            setCopyMsg(" Copiado");
          } catch {
            setCopyMsg(" No se pudo copiar");
          }
        }}
      >
        Copiar informe
      </button>
      {copyMsg && <span className="sub">{copyMsg}</span>}
      <p className="sub">
        Herramienta psicoeducativa: no diagnostica ni sustituye la atención psicológica.
      </p>
    </>
  );
};
