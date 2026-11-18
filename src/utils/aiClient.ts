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

const REQUEST_TIMEOUT_MS = 45_000;
const LESSON_BATCH_SIZE = 3;

async function postAiGenerate(
  prompt: string,
  json: boolean,
  signal?: AbortSignal,
  fast = false
): Promise<{ text?: string; data?: unknown }> {
  const timeoutCtrl = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    timeoutCtrl.abort();
  }, REQUEST_TIMEOUT_MS);

  const onParentAbort = () => timeoutCtrl.abort();
  if (signal?.aborted) {
    clearTimeout(timer);
    throw new GenerationPausedError();
  }
  signal?.addEventListener("abort", onParentAbort, { once: true });

  let res: Response;
  try {
    res = await fetch("/api/ai/generate", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, json, ...(fast ? { fast: true } : {}) }),
      signal: timeoutCtrl.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onParentAbort);
    if (signal?.aborted) {
      throw new GenerationPausedError();
    }
    if (timedOut) {
      throw new Error("La solicitud tardó demasiado. Tu avance quedó guardado para continuar.");
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new GenerationPausedError();
    }
    throw new Error(
      "No se pudo conectar con el servidor de IA. Tu avance quedó guardado para continuar donde te quedaste."
    );
  }
  clearTimeout(timer);
  signal?.removeEventListener("abort", onParentAbort);

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
  signal?: AbortSignal,
  fast = false
): Promise<T> {
  const body = await postAiGenerate(prompt, true, signal, fast);
  if (body?.data !== undefined) return body.data as T;
  return JSON.parse(String(body?.text || "{}")) as T;
}

async function jx<T = Record<string, unknown>>(
  prompt: string,
  tries = 3,
  signal?: AbortSignal,
  fast = false
): Promise<T> {
  for (let k = 1; ; k++) {
    if (signal?.aborted) throw new GenerationPausedError();
    try {
      return await aiAskJson<T>(prompt, signal, fast);
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
      const delay = k === 1 ? 900 : 2200;
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          signal?.removeEventListener("abort", onAbort);
          resolve();
        }, delay);
        const onAbort = () => {
          clearTimeout(timer);
          reject(new GenerationPausedError());
        };
        signal?.addEventListener("abort", onAbort, { once: true });
      });
    }
  }
}

function extractLessonBody(rec: Record<string, unknown>): string {
  return String(
    rec.x ?? rec.content ?? rec.contenido ?? rec.text ?? rec.texto ?? rec.body ?? ""
  ).trim();
}

export async function generateAiCourse(
  topic: string,
  sz: string,
  base: string,
  options?: {
    existingPending?: PendingCourseGen | null;
    signal?: AbortSignal;
    onProgress?: (i: number, n: number, batchEnd?: number) => void;
    onCheckpoint?: (pending: PendingCourseGen) => void;
  }
): Promise<Course> {
  const { existingPending, signal, onProgress, onCheckpoint } = options || {};
  const Z = SZ[sz] || SZ.c;
  const ar = D.map((d, i) => i + "=" + d.n).join(", ");
  const rules =
    "texto plano sin formato Markdown; tono cálido y práctico; no inventes estudios, cifras ni citas; si mencionas un texto bíblico, indica su referencia y aclara que es una paráfrasis; no des consejo médico, psicológico clínico ni financiero específico; si el tema toca la salud mental, recomienda apoyo profesional cuando haga falta";

  const validExistingLessons: Record<string, unknown>[] = [];
  if (existingPending?.completedLessons?.length) {
    for (const item of existingPending.completedLessons) {
      if (extractLessonBody(item).length >= 20) {
        validExistingLessons.push(item);
      } else {
        break;
      }
    }
  }

  let pending: PendingCourseGen =
    existingPending && existingPending.outline?.lessons?.length
      ? {
          ...existingPending,
          completedLessons: validExistingLessons,
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
    const rawOutline = await jx<Record<string, unknown>>(
      `Eres un diseñador instruccional de desarrollo personal. Diseña el esquema de un curso en español sobre: ${topic}.${
        base
          ? " Basa el curso en este material existente, amplíalo y profundízalo sin contradecirlo: " + base
          : ""
      } Reglas: ${rules}. El curso tendrá exactamente ${Z.n} lecciones que avancen de lo básico a lo práctico. Responde SOLO con JSON: {"title":string,"area":número (${ar}),"description":string de máximo 30 palabras,"lessons":[{"t":título,"f":qué cubrirá la lección en una frase}],"actions":{"t":título,"items":[5 a 6 acciones concretas y breves]}}`,
      3,
      signal,
      true
    );

    const rawLessons = Array.isArray(rawOutline.lessons)
      ? rawOutline.lessons
      : Array.isArray(rawOutline.lecciones)
        ? rawOutline.lecciones
        : [];
    const ls = rawLessons
      .map((item: unknown) => {
        const rec = (item || {}) as Record<string, unknown>;
        return {
          t: String(rec.t ?? rec.title ?? rec.titulo ?? "").trim(),
          f: String(rec.f ?? rec.focus ?? rec.enfoque ?? rec.resumen ?? "").trim(),
        };
      })
      .filter((item) => item.t.length > 0)
      .slice(0, Z.n);

    if (ls.length < 2) {
      throw new Error("No se pudieron estructurar las lecciones del curso. Inténtalo de nuevo.");
    }

    const outline: PendingCourseOutline = {
      title: String(rawOutline.title ?? rawOutline.titulo ?? topic).trim(),
      area: typeof rawOutline.area === "number" ? rawOutline.area : Number(rawOutline.area) || 7,
      description: String(rawOutline.description ?? rawOutline.descripcion ?? "").trim(),
      lessons: ls,
      actions: rawOutline.actions as { t: string; items: string[] } | undefined,
    };

    pending = {
      ...pending,
      outline,
      completedLessons: [],
      updatedAt: new Date().toISOString(),
    };
    onCheckpoint?.(pending);
  }

  const outline = pending.outline!;
  const ls = outline.lessons;
  const out: Record<string, unknown>[] = [...pending.completedLessons];
  const outlineSummary = ls.map((q, j) => `${j + 1}. ${q.t}`).join("; ");
  const courseTitle = String(outline.title || pending.topic).slice(0, 90);

  const generateSingleLesson = async (
    idx: number,
    l: { t: string; f: string }
  ): Promise<Record<string, unknown>> => {
    const prompt = `Estás escribiendo el curso «${courseTitle}». Esquema: ${outlineSummary}. Escribe ahora la lección ${idx + 1} de ${ls.length}: «${l.t}»${
      l.f ? ` (${l.f})` : ""
    }. Reglas: ${rules}. Estructura el texto "x" en 3 o 4 párrafos separados por salto de línea ("\\n"), de ${
      Z.w
    } palabras en total, con una explicación clara, un ejemplo concreto, errores comunes y cómo aplicarlo. Incluye además "r" (pregunta de reflexión), "tip" (consejo breve), "ex" ({"t":título,"x":instrucciones paso a paso de un ejercicio}) y, solo si estás seguro de que es real y está bien atribuida, "q" ({"x":cita,"a":autor}); si no, omite "q". Responde SOLO con JSON: {"x":string,"r":string,"tip":string,"ex":{"t":string,"x":string},"q":{"x":string,"a":string}}`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      const raw = await jx<Record<string, unknown>>(prompt, 3, signal, true);
      const body = extractLessonBody(raw);
      if (body.length >= 20) {
        return {
          ...raw,
          t: String(raw.t ?? raw.title ?? raw.titulo ?? l.t).trim() || l.t,
          x: body,
        };
      }
      if (attempt === 2) {
        throw new Error(`La lección ${idx + 1} llegó vacía. Intenta continuar de nuevo.`);
      }
    }
    throw new Error(`No se pudo completar la lección ${idx + 1}.`);
  };

  while (out.length < ls.length) {
    if (signal?.aborted) throw new GenerationPausedError();
    const startIdx = out.length;
    const batch = ls.slice(startIdx, startIdx + LESSON_BATCH_SIZE);
    const batchEnd = startIdx + batch.length;
    onProgress?.(startIdx + 1, ls.length, batchEnd);

    const results = await Promise.allSettled(
      batch.map((l, offset) => generateSingleLesson(startIdx + offset, l))
    );

    let firstErr: unknown = null;
    let pushedAny = false;
    for (const res of results) {
      if (res.status === "fulfilled") {
        out.push(res.value);
        pushedAny = true;
      } else {
        firstErr = res.reason;
        break;
      }
    }

    if (pushedAny) {
      pending = {
        ...pending,
        completedLessons: [...out],
        updatedAt: new Date().toISOString(),
      };
      onCheckpoint?.(pending);
    }

    if (firstErr) {
      if (signal?.aborted || firstErr instanceof GenerationPausedError) {
        throw new GenerationPausedError();
      }
      throw firstErr;
    }
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
