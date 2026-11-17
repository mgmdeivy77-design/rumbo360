import { D, SZ } from "../data/rumboData";
import type {
  Course,
  CustomVerseGuide,
  PendingCourseGen,
  PendingCourseOutline,
  VerseQuizQuestion,
} from "../types";
import { cleanCourse } from "./rumboHelpers";

export class GenerationPausedError extends Error {
  constructor() {
    super("GENERATION_PAUSED");
    this.name = "GenerationPausedError";
  }
}

class HttpAiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function checkAiStatus(): Promise<{ available: boolean; model?: string }> {
  try {
    const res = await fetch("/api/ai/status", { credentials: "same-origin" });
    if (!res.ok) return { available: false };
    return (await res.json()) as { available: boolean; model?: string };
  } catch {
    return { available: false };
  }
}

async function postAiGenerate(
  prompt: string,
  json: boolean,
  signal?: AbortSignal
): Promise<{ text?: string; data?: unknown }> {
  let res: Response;
  try {
    res = await fetch("/api/ai/generate", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, json }),
      signal,
    });
  } catch (err: unknown) {
    if (signal?.aborted || (err instanceof DOMException && err.name === "AbortError")) {
      throw new GenerationPausedError();
    }
    throw new Error(
      "No se pudo conectar con el servidor de IA. Tu avance quedó guardado para continuar donde te quedaste."
    );
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new HttpAiError(
      body?.message || `Error del servidor (${res.status}).`,
      res.status
    );
  }
  return body as { text?: string; data?: unknown };
}

export async function aiAskText(prompt: string, signal?: AbortSignal): Promise<string> {
  const body = await postAiGenerate(prompt, false, signal);
  return String(body?.text || "").trim();
}

export async function aiAskJson<T = Record<string, unknown>>(
  prompt: string,
  signal?: AbortSignal
): Promise<T> {
  const body = await postAiGenerate(prompt, true, signal);
  if (body?.data !== undefined) return body.data as T;
  return JSON.parse(String(body?.text || "{}")) as T;
}

async function jx<T = Record<string, unknown>>(
  prompt: string,
  tries = 2,
  signal?: AbortSignal
): Promise<T> {
  for (let k = 1; ; k++) {
    if (signal?.aborted) throw new GenerationPausedError();
    try {
      return await aiAskJson<T>(prompt, signal);
    } catch (e) {
      if (e instanceof GenerationPausedError || signal?.aborted) {
        throw new GenerationPausedError();
      }
      if (
        e instanceof HttpAiError &&
        e.status >= 400 &&
        e.status < 500 &&
        e.status !== 429
      ) {
        throw e;
      }
      if (k >= tries) throw e;
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          signal?.removeEventListener("abort", onAbort);
          resolve();
        }, 1200 * k);
        const onAbort = () => {
          clearTimeout(timer);
          reject(new GenerationPausedError());
        };
        signal?.addEventListener("abort", onAbort, { once: true });
      });
    }
  }
}

export async function generateAiCourse(
  topic: string,
  sz: string,
  base: string,
  options?: {
    existingPending?: PendingCourseGen | null;
    signal?: AbortSignal;
    onProgress?: (i: number, n: number) => void;
    onCheckpoint?: (pending: PendingCourseGen) => void;
  }
): Promise<Course> {
  const { existingPending, signal, onProgress, onCheckpoint } = options || {};
  const Z = SZ[sz] || SZ.c;
  const ar = D.map((d, i) => i + "=" + d.n).join(", ");
  const rules =
    "texto plano sin formato Markdown; tono cálido y práctico; no inventes estudios, cifras ni citas; si mencionas un texto bíblico, indica su referencia y aclara que es una paráfrasis; no des consejo médico, psicológico clínico ni financiero específico; si el tema toca la salud mental, recomienda apoyo profesional cuando haga falta";

  let pending: PendingCourseGen =
    existingPending && existingPending.outline?.lessons?.length
      ? {
          ...existingPending,
          completedLessons: [...(existingPending.completedLessons || [])],
          updatedAt: new Date().toISOString(),
        }
      : {
          topic,
          sz,
          base,
          completedLessons: [],
          updatedAt: new Date().toISOString(),
        };

  if (!existingPending?.outline?.lessons?.length) {
    onCheckpoint?.(pending);
    const rawOutline = await jx<PendingCourseOutline>(
      `Eres un diseñador instruccional de desarrollo personal. Diseña el esquema de un curso en español sobre: ${topic}.${
        base
          ? " Basa el curso en este material existente, amplíalo y profundízalo sin contradecirlo: " + base
          : ""
      } Reglas: ${rules}. El curso tendrá exactamente ${Z.n} lecciones que avancen de lo básico a lo práctico. Responde SOLO con JSON: {"title":string,"area":número (${ar}),"description":string de máximo 30 palabras,"lessons":[{"t":título,"f":qué cubrirá la lección en una frase}],"actions":{"t":título,"items":[5 a 6 acciones concretas y breves]}}`,
      2,
      signal
    );

    const ls = (Array.isArray(rawOutline.lessons) ? rawOutline.lessons : []).slice(0, Z.n);
    if (ls.length < 2) throw new Error("No se pudieron generar las lecciones.");

    pending = {
      ...pending,
      outline: {
        ...rawOutline,
        lessons: ls,
      },
      completedLessons: [],
      updatedAt: new Date().toISOString(),
    };
    onCheckpoint?.(pending);
  }

  const outline = pending.outline!;
  const ls = outline.lessons;
  const out: Record<string, unknown>[] = [...pending.completedLessons];

  for (let i = out.length; i < ls.length; i++) {
    if (signal?.aborted) throw new GenerationPausedError();
    const l = ls[i];
    onProgress?.(i + 1, ls.length);
    const x = await jx<Record<string, unknown>>(
      `Estás escribiendo el curso «${String(outline.title || pending.topic).slice(0, 90)}». Esquema: ${ls
        .map((q, j) => j + 1 + ". " + q.t)
        .join("; ")}. Escribe ahora la lección ${i + 1} de ${ls.length}: «${l.t}» (${
        l.f
      }). Reglas: ${rules}. Estructura el texto "x" en 3 o 4 párrafos separados por salto de línea ("\\n"), de ${
        Z.w
      } palabras en total, con una explicación clara, un ejemplo concreto, errores comunes y cómo aplicarlo. Incluye además "r" (pregunta de reflexión), "tip" (consejo breve), "ex" ({"t":título,"x":instrucciones paso a paso de un ejercicio}) y, solo si estás seguro de que es real y está bien atribuida, "q" ({"x":cita,"a":autor}); si no, omite "q". Responde SOLO con JSON: {"x":string,"r":string,"tip":string,"ex":{"t":string,"x":string},"q":{"x":string,"a":string}}`,
      2,
      signal
    );
    out.push(Object.assign({ t: l.t }, x));
    pending = {
      ...pending,
      completedLessons: [...out],
      updatedAt: new Date().toISOString(),
    };
    onCheckpoint?.(pending);
  }

  return cleanCourse({
    title: outline.title,
    area: outline.area,
    description: outline.description,
    lessons: out,
    actions: outline.actions,
  });
}

export async function generateVerseGuide(
  citation: string,
  verseText?: string,
  signal?: AbortSignal
): Promise<CustomVerseGuide> {
  const cleanRef = citation.trim().slice(0, 120);
  if (!cleanRef) {
    throw new Error("Escribe una cita bíblica (ej.: Salmo 23:1-6).");
  }
  const textSnippet = (verseText || "").trim().slice(0, 1200);
  const prompt = `Eres un guía de estudio bíblico inductivo en español, respetuoso y práctico (sin imponer postura denominacional). El usuario quiere reflexionar sobre la cita bíblica: "${cleanRef}".${
    textSnippet
      ? ` El usuario escribió este texto de su Biblia: "${textSnippet}".`
      : ""
  }
Reglas: texto plano sin Markdown; no inventes detalles históricos inciertos ni alucines hechos fuera del texto; habla con fidelidad al sentido del pasaje; responde SOLO con JSON válido con esta estructura exacta:
{
  "ref": string con la cita formateada con claridad (ej. "${cleanRef}"),
  "summary": string de 1 a 2 frases con una paráfrasis libre y fiel del pasaje en español sencillo (como un versículo legible en primera o segunda persona según el pasaje, sin decir "este pasaje habla de"),
  "c": string de máximo 45 palabras con el contexto literario e histórico breve del pasaje,
  "o": array de 3 o 4 strings breves de Observación (qué dice el texto, quién habla, palabras clave),
  "i": string de máximo 45 palabras con la Interpretación (principio o mensaje central del pasaje),
  "a": array de 3 strings breves y concretos de Aplicación práctica a la vida diaria,
  "attitudes": {
    "pos": array de 1 a 2 actitudes positivas que nacen naturalmente del pasaje (sin forzar; mínimo 1, máximo 2),
    "neg": array de 1 a 2 actitudes negativas o de alerta que el pasaje corrige o invita a evitar (sin forzar; mínimo 1, máximo 2)
  },
  "q": array de 4 o 5 preguntas abiertas para meditar,
  "quiz": array de entre 5 y 10 preguntas de selección múltiple (mínimo 5, máximo 10; elige la cantidad que mejor se adapte a la extensión y contenido real del pasaje sin forzar ni inventar datos) para medir el aprendizaje sobre el pasaje, su contexto y su aplicación. Cada elemento debe tener: {"q": string con la pregunta, "opts": array de 3 o 4 opciones claras sin prefijo de letra, "ans": índice numérico base 0 de la única opción correcta}
}`;

  const raw = await jx<Record<string, unknown>>(prompt, 2, signal);
  const strList = (v: unknown, maxLen: number, maxItems: number): string[] =>
    Array.isArray(v)
      ? v.map((x) => String(x || "").trim().slice(0, maxLen)).filter(Boolean).slice(0, maxItems)
      : [];

  const o = strList(raw.o, 260, 5);
  const a = strList(raw.a, 260, 4);
  const q = strList(raw.q, 240, 6);
  const rawAtt = (raw.attitudes as { pos?: unknown; neg?: unknown } | undefined) || {};
  const pos = strList(rawAtt.pos, 220, 2);
  const neg = strList(rawAtt.neg, 220, 2);
  const c = String(raw.c || "").trim().slice(0, 400);
  const i = String(raw.i || "").trim().slice(0, 400);
  const summary = String(raw.summary || "").trim().slice(0, 320);

  const rawQuiz = Array.isArray(raw.quiz) ? raw.quiz : [];
  const quiz: VerseQuizQuestion[] = rawQuiz
    .map((item) => {
      const rec = item as { q?: unknown; opts?: unknown; ans?: unknown };
      const qText = String(rec?.q || "").trim().slice(0, 260);
      const opts = strList(rec?.opts, 200, 4);
      const ansNum = typeof rec?.ans === "number" ? Math.floor(rec.ans) : Number(rec?.ans);
      if (!qText || opts.length < 2 || !Number.isInteger(ansNum) || ansNum < 0 || ansNum >= opts.length) {
        return null;
      }
      return { q: qText, opts, ans: ansNum };
    })
    .filter((item): item is VerseQuizQuestion => Boolean(item))
    .slice(0, 10);

  if (!c && !o.length && !i && !a.length) {
    throw new Error("No se pudo generar la guía para esa cita. Inténtalo de nuevo.");
  }

  return {
    ref: cleanRef,
    summary,
    c,
    o,
    i,
    a,
    attitudes: pos.length || neg.length ? { pos, neg } : undefined,
    q: q.length ? q : ["¿Qué te llama más la atención de este pasaje y cómo puedes aplicarlo esta semana?"],
    quiz: quiz.length ? quiz : undefined,
    createdAt: new Date().toISOString(),
  };
}
