export type ThemeMode =
  | "auto"
  | "light"
  | "dark"
  | "warm"
  | "sage"
  | "ocean"
  | "indigo"
  | "plum";
export type Horizon = "c" | "m" | "l";
export type MeasureType = "num" | "count" | "time" | "scale" | "pct" | "yn" | "streak";
export type TopicKey = "sleep" | "lead" | "science" | "stress" | "med" | "self";
export type DiaryKind = "reflexion" | "oracion" | "gratitud" | "nota";
export type MainTab = "home" | "agenda" | "rec" | "stats";

export interface GoalMeasure {
  t: MeasureType;
  from: number;
  to: number;
  cur: number;
  unit: string;
  log?: Record<string, boolean>;
}

export interface GoalStep {
  t: string;
  d: boolean;
  f?: number | null;
  h?: string;
  date?: string | null;
  time?: string;
  lk?: string;
}

export interface Goal {
  id: string;
  t: string;
  h: Horizon;
  dim: number;
  start: string;
  due?: string;
  dtime?: string;
  p: number;
  rem: number | null;
  ok?: string;
  steps: GoalStep[];
  weeks?: number;
  m?: GoalMeasure | null;
  cid?: string;
}

export interface Task {
  id: string;
  t: string;
  date: string;
  time?: string;
  p: number;
  dim: number;
  done: boolean;
  cid?: string;
}

export interface Habit {
  id: string;
  name: string;
  days: number[];
  time?: string;
  start: string;
  log: Record<string, boolean>;
  g?: string;
}

export interface MoodEntry {
  date: string;
  mood: number;
  acts?: string[];
  f?: string[];
  stress?: number;
  note?: string;
  photo?: string | null;
  voice?: string | null;
  time?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  time?: string;
  kind?: DiaryKind;
  ref?: string;
  o?: string;
  i?: string;
  a?: string;
  m?: string;
  title?: string;
  text?: string;
}

export interface HealthDay {
  steps?: number;
  sleep?: number;
}

export interface ChatMessage {
  r: "a" | "u";
  t: string;
  tmp?: number;
  go?: [string, string, string];
  loc?: boolean;
  why?: string;
}

export interface ActivityItem {
  id: string;
  n: string;
  ic: string;
}

export interface ActivityCategory {
  id: string;
  n: string;
  on: boolean;
  items: ActivityItem[];
}

export interface LessonExtra {
  r?: string;
  tip?: string;
  ex?: { t: string; x: string } | null;
  q?: { x: string; a: string } | null;
}

export type LessonTuple = [string, string] | [string, string, LessonExtra];

export interface Course {
  id: string;
  tp: TopicKey;
  dim?: number;
  t: string;
  d: string;
  L: LessonTuple[];
  acts?: { t: string; items: string[] } | null;
  ai?: boolean;
}

export interface GoalDraftStep {
  t: string;
  f?: number | null;
  day?: number;
  time?: string;
}

export interface GoalDraft {
  id?: string;
  t: string;
  dim: number;
  weeks: number;
  d: string;
  ok?: string;
  local?: boolean;
  steps: GoalDraftStep[];
}

export interface PendingCourseOutline {
  title?: string;
  area?: number;
  description?: string;
  lessons: { t: string; f: string }[];
  actions?: { t: string; items: string[] };
}

export interface PendingCourseGen {
  topic: string;
  sz: string;
  base: string;
  outline?: PendingCourseOutline;
  completedLessons: Record<string, unknown>[];
  updatedAt: string;
}

export interface VerseQuizQuestion {
  q: string;
  opts: string[];
  ans: number;
}

export interface CustomVerseGuide {
  ref: string;
  summary?: string;
  c: string;
  o: string[];
  i: string;
  a: string[];
  attitudes?: { pos: string[]; neg: string[] };
  q: string[];
  quiz?: VerseQuizQuestion[];
  createdAt?: string;
}

export interface RumboState {
  name: string;
  theme: ThemeMode;
  evals: { date: string; sc: number[] }[];
  goals: Goal[];
  tasks: Task[];
  habits: Habit[];
  moods: MoodEntry[];
  refl: Record<string, string>;
  diary: DiaryEntry[];
  health: Record<string, HealthDay>;
  seen: string;
  wseen?: string;
  prog?: Record<string, boolean>;
  fav?: Record<string, boolean>;
  nt?: Record<string, string>;
  ad?: Record<string, number>;
  cu?: Course[];
  ce?: Record<string, Course>;
  ch?: Record<string, boolean>;
  acts?: ActivityCategory[];
  av?: number;
  mi?: boolean;
  chat?: ChatMessage[];
  cday?: string;
  vr?: Record<string, boolean>;
  vf?: Record<string, boolean>;
  vt?: Record<string, string>;
  vg?: Record<string, CustomVerseGuide>;
  hv?: boolean;
  pendingGen?: PendingCourseGen | null;
}
