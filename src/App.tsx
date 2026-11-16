import React, { useCallback, useEffect, useState } from "react";
import { Ico } from "./components/Icons";
import { TD } from "./data/rumboData";
import type {
  Course,
  Goal,
  GoalDraft,
  MainTab,
  RumboState,
  TopicKey,
} from "./types";
import { aiAskText, checkAiStatus } from "./utils/aiClient";
import {
  add,
  buildCoachPrompt,
  coachLocalResponse,
  getActCategories,
  getCourseActions,
  getInsights,
  INITIAL_STATE,
  isBaseCourse,
  lateTasks,
  loadState,
  mon,
  saveState,
  today,
  uid,
} from "./utils/rumboHelpers";
import { CoachView, WeeklyBalanceView } from "./views/CoachAndWeekly";
import {
  DiaryFormView,
  DiaryView,
  MoodIntroView,
  MoodView,
} from "./views/DiaryAndMood";
import {
  AreaView,
  createGoalFromDraft,
  GoalAiView,
  GoalDetailView,
  GoalDraftView,
  GoalManualView,
  GoalNewView,
  GoalsView,
  HabitNewView,
  WheelView,
} from "./views/GoalsAndWheel";
import {
  CourseEditView,
  CourseView,
  createGoalFromCourse,
  LessonView,
  ProfileView,
  RecGenView,
  TopicView,
} from "./views/LibraryScreens";
import {
  AgendaView,
  HomeView,
  LibraryView,
  StatsView,
} from "./views/MainTabs";

export default function App() {
  const [S, setS] = useState<RumboState>(() => loadState());
  const [tab, setTab] = useState<MainTab>("home");
  const [scr, setScr] = useState<string | null>(null);
  const [par, setPar] = useState<string | null>(null);
  const [hist, setHist] = useState<[string | null, string | null][]>([]);
  const [fab, setFab] = useState(false);
  const [sel, setSel] = useState(today());
  const [adding, setAdding] = useState(false);
  const [statsSubTab, setStatsSubTab] = useState<"g" | "h" | "s">("g");
  const [draft, setDraft] = useState<GoalDraft | null>(null);
  const [coachBusy, setCoachBusy] = useState(false);

  const [recGenInit, setRecGenInit] = useState({
    topic: "",
    size: "c",
    base: "",
  });

  const [aiStatus, setAiStatus] = useState<{
    available: boolean;
    model: string;
  }>({
    available: false,
    model: "gemini-4-hydrogen",
  });

  useEffect(() => {
    checkAiStatus().then((st) => {
      setAiStatus({
        available: st.available,
        model: st.model || "gemini-4-hydrogen",
      });
    });
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme =
      S.theme === "auto" ? "" : S.theme;
  }, [S.theme]);

  const updateState = useCallback(
    (updater: (prev: RumboState) => RumboState) => {
      setS((prev) => {
        const next = updater(prev);
        saveState(next);
        return next;
      });
    },
    []
  );

  const initCoachMessages = useCallback(
    (prev: RumboState): RumboState => {
      const cleaned = (prev.chat || []).filter((m) => !m.tmp);
      const nextChat = [...cleaned];
      const n = prev.name ? `, ${prev.name}` : "";
      if (!nextChat.length) {
        nextChat.push({
          r: "a",
          t: `¡Hola${n}! Soy tu guía en Rumbo. Puedo ayudarte a definir una meta, revisar tu semana o entender cómo te has sentido. ¿Por dónde empezamos?`,
        });
      }
      const td = today();
      let cday = prev.cday;
      if (cday !== td) {
        cday = td;
        getInsights(prev)
          .slice(0, 2)
          .forEach((t) => nextChat.push({ r: "a", t }));
      }
      return {
        ...prev,
        seen: td,
        cday,
        chat: nextChat.slice(-40),
      };
    },
    []
  );

  const openScreen = useCallback(
    (nextScr: string, nextPar: string | null = null) => {
      if (nextScr === "coach") {
        updateState((prev) => initCoachMessages(prev));
      } else if (nextScr === "weekly") {
        updateState((prev) => ({ ...prev, wseen: mon(today()) }));
      }

      setHist((prev) => [...prev, [scr, par]]);
      if (nextScr === "mood" && !S.mi) {
        setScr("moodintro");
      } else {
        setScr(nextScr);
      }
      setPar(nextPar);
      setFab(false);
      window.scrollTo(0, 0);
    },
    [S.mi, initCoachMessages, par, scr, updateState]
  );

  const goBack = useCallback(() => {
    setHist((prev) => {
      const copy = [...prev];
      const last = copy.pop() || [null, null];
      setScr(last[0]);
      setPar(last[1]);
      return copy;
    });
    window.scrollTo(0, 0);
  }, []);

  const switchTab = useCallback((nextTab: MainTab) => {
    setTab(nextTab);
    setScr(null);
    setPar(null);
    setHist([]);
    setFab(false);
    window.scrollTo(0, 0);
  }, []);

  const sendCoachMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || coachBusy) return;
      setCoachBusy(true);

      let snapshotAfterUser: RumboState | null = null;
      updateState((prev) => {
        const base = initCoachMessages(prev);
        const withUser: RumboState = {
          ...base,
          chat: [
            ...(base.chat || []),
            { r: "u" as const, t: text },
            { r: "a" as const, t: "Escribiendo…", tmp: 1 },
          ].slice(-40),
        };
        snapshotAfterUser = withUser;
        return withUser;
      });

      const currentSnap = snapshotAfterUser || S;
      let ans: {
        a: string;
        go?: [string, string, string];
        loc?: boolean;
        why?: string;
      } | null = null;

      try {
        const reply = (await aiAskText(buildCoachPrompt(currentSnap))).slice(
          0,
          1200
        );
        if (!reply) throw new Error("Respuesta vacía");
        ans = { a: reply };
      } catch (e: unknown) {
        const err = e as { message?: string };
        const local = coachLocalResponse(currentSnap, text);
        ans = {
          ...local,
          why: err?.message ? err.message.slice(0, 120) : "error al conectar",
        };
      }

      const finalAns = ans;
      updateState((prev) => ({
        ...prev,
        chat: [
          ...(prev.chat || []).filter((m) => !m.tmp),
          {
            r: "a" as const,
            t: finalAns.a,
            go: finalAns.go,
            loc: finalAns.loc,
            why: finalAns.why,
          },
        ].slice(-40),
      }));
      setCoachBusy(false);
    },
    [S, coachBusy, initCoachMessages, updateState]
  );

  const toggleHabitLog = (habitId: string, date: string) => {
    updateState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        const log = { ...h.log };
        if (log[date]) delete log[date];
        else log[date] = true;
        return { ...h, log };
      }),
    }));
  };

  const toggleGoalStep = (goalId: string, idx: number) => {
    updateState((prev) => {
      const target = prev.goals.find((g) => g.id === goalId);
      const step = target?.steps[idx];
      if (!step) return prev;
      const nextDone = !step.d;
      const nextProg = { ...(prev.prog || {}) };
      if (step.lk) nextProg[step.lk] = nextDone;
      return {
        ...prev,
        prog: nextProg,
        goals: prev.goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                steps: g.steps.map((s, si) =>
                  si === idx ? { ...s, d: nextDone } : s
                ),
              }
            : g
        ),
      };
    });
  };

  const renderMainContent = () => {
    if (scr === "coach") {
      return (
        <CoachView
          S={S}
          busy={coachBusy}
          onBack={goBack}
          onSend={sendCoachMessage}
          onOpen={(s, p) => openScreen(s, p ?? null)}
          onTab={switchTab}
        />
      );
    }

    if (scr === "diary") {
      return (
        <DiaryView
          S={S}
          updateState={updateState}
          onBack={goBack}
          onOpen={(s, p) => openScreen(s, p ?? null)}
        />
      );
    }

    if (scr === "dform") {
      return (
        <DiaryFormView
          S={S}
          param={par}
          onBack={goBack}
          onSaveVerseGuide={(g) =>
            updateState((prev) => ({
              ...prev,
              vg: { ...(prev.vg || {}), [g.ref]: g },
            }))
          }
          onSave={(entry) => {
            updateState((prev) => ({
              ...prev,
              diary: [...prev.diary, entry],
            }));
            goBack();
          }}
        />
      );
    }

    if (scr === "moodintro") {
      return (
        <MoodIntroView
          S={S}
          onToggleCategory={(id) =>
            updateState((prev) => ({
              ...prev,
              acts: getActCategories(prev).map((c) =>
                c.id === id ? { ...c, on: !c.on } : c
              ),
            }))
          }
          onBack={goBack}
          onNext={() => {
            updateState((prev) => ({ ...prev, mi: true }));
            setScr("mood");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (scr === "mood") {
      return (
        <MoodView S={S} updateState={updateState} onBack={goBack} />
      );
    }

    if (scr === "wheel") {
      return (
        <WheelView
          S={S}
          param={par}
          onBack={goBack}
          onOpen={(s, p) => openScreen(s, p ?? null)}
          onSaveEval={(sc) => {
            updateState((prev) => ({
              ...prev,
              evals: [...prev.evals, { date: today(), sc }],
            }));
            setScr("wheel");
            setPar(null);
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (scr === "area") {
      return (
        <AreaView
          S={S}
          areaIdx={Number(par) || 0}
          onBack={goBack}
          onOpen={(s, p) => openScreen(s, p ?? null)}
        />
      );
    }

    if (scr === "goals") {
      return (
        <GoalsView
          S={S}
          onBack={goBack}
          onOpen={(s, p) => openScreen(s, p ?? null)}
        />
      );
    }

    if (scr === "goalnew") {
      return (
        <GoalNewView
          areaParam={par}
          onBack={goBack}
          onOpen={(s, p) => openScreen(s, p ?? null)}
          onPickSuggested={(d) => {
            setDraft(d);
            openScreen("goaldraft");
          }}
        />
      );
    }

    if (scr === "goalman") {
      return (
        <GoalManualView
          defaultArea={par}
          onBack={goBack}
          onCreate={(g) => {
            updateState((prev) => ({
              ...prev,
              goals: [...prev.goals, g],
            }));
            setHist([]);
            setScr("goal");
            setPar(g.id);
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (scr === "goalai") {
      return (
        <GoalAiView
          onBack={goBack}
          onDraftReady={(d) => {
            setDraft(d);
            setHist((prev) => [...prev, ["goalai", null]]);
            setScr("goaldraft");
            setPar(null);
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (scr === "goaldraft" && draft) {
      return (
        <GoalDraftView
          draft={draft}
          onBack={goBack}
          onAccept={(start, time, rem) => {
            const { goal, newHabits } = createGoalFromDraft(
              draft,
              start,
              time,
              rem
            );
            updateState((prev) => ({
              ...prev,
              habits: [...prev.habits, ...newHabits],
              goals: [...prev.goals, goal],
            }));
            setHist([]);
            setScr("goal");
            setPar(goal.id);
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (scr === "goal" && par) {
      return (
        <GoalDetailView
          S={S}
          goalId={par}
          onBack={goBack}
          onOpen={(s, p) => openScreen(s, p ?? null)}
          updateGoal={(gid, updater) =>
            updateState((prev) => ({
              ...prev,
              goals: prev.goals.map((g) => (g.id === gid ? updater(g) : g)),
            }))
          }
          onToggleStep={toggleGoalStep}
          onDeleteStep={(gid, idx) =>
            updateState((prev) => {
              const g = prev.goals.find((x) => x.id === gid);
              const step = g?.steps[idx];
              const nextHabits = step?.h
                ? prev.habits.filter((h) => h.id !== step.h)
                : prev.habits;
              return {
                ...prev,
                habits: nextHabits,
                goals: prev.goals.map((x) =>
                  x.id === gid
                    ? { ...x, steps: x.steps.filter((_, si) => si !== idx) }
                    : x
                ),
              };
            })
          }
          onDeleteGoal={(gid) => {
            updateState((prev) => ({
              ...prev,
              goals: prev.goals.filter((x) => x.id !== gid),
            }));
            setScr("goals");
            setPar(null);
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (scr === "habitnew") {
      return (
        <HabitNewView
          onBack={goBack}
          onCreate={(h) => {
            updateState((prev) => ({
              ...prev,
              habits: [...prev.habits, h],
            }));
            switchTab("home");
          }}
        />
      );
    }

    const handleDeleteCourse = (id: string) => {
      updateState((prev) => {
        if (isBaseCourse(id)) {
          const nextCe = { ...(prev.ce || {}) };
          delete nextCe[id];
          return {
            ...prev,
            ce: nextCe,
            ch: { ...(prev.ch || {}), [id]: true },
          };
        }
        return {
          ...prev,
          cu: (prev.cu || []).filter((c) => c.id !== id),
        };
      });
      if ((scr === "course" || scr === "courseedit") && par === id) {
        goBack();
      }
    };

    if (scr === "topic" && par) {
      return (
        <TopicView
          S={S}
          topicKey={par as TopicKey}
          onBack={goBack}
          onOpen={(s, p) => openScreen(s, p ?? null)}
          onSaveReflection={(idx, val) =>
            updateState((prev) => ({
              ...prev,
              refl: { ...prev.refl, [String(idx)]: val },
            }))
          }
          onEditCourse={(c) => openScreen("courseedit", c.id)}
          onDeleteCourse={handleDeleteCourse}
        />
      );
    }

    if (scr === "courseedit" && par) {
      return (
        <CourseEditView
          S={S}
          courseId={par}
          onBack={goBack}
          onSave={(updated) => {
            updateState((prev) => {
              if (isBaseCourse(updated.id)) {
                return {
                  ...prev,
                  ce: { ...(prev.ce || {}), [updated.id]: updated },
                };
              }
              return {
                ...prev,
                cu: (prev.cu || []).map((c) =>
                  c.id === updated.id ? updated : c
                ),
              };
            });
            goBack();
          }}
        />
      );
    }

    if (scr === "course" && par) {
      return (
        <CourseView
          S={S}
          courseId={par}
          onBack={goBack}
          onOpen={(s, p) => openScreen(s, p ?? null)}
          onToggleFav={(id) =>
            updateState((prev) => ({
              ...prev,
              fav: { ...(prev.fav || {}), [id]: !(prev.fav && prev.fav[id]) },
            }))
          }
          onResetCourse={(id) =>
            updateState((prev) => {
              const nextProg = { ...(prev.prog || {}) };
              Object.keys(nextProg).forEach((k) => {
                if (k.startsWith(id + ":")) delete nextProg[k];
              });
              return { ...prev, prog: nextProg };
            })
          }
          onAssignGoal={(c) => {
            const g: Goal = createGoalFromCourse(c);
            g.steps = g.steps.map((st, idx) => ({
              ...st,
              d: Boolean(S.prog?.[`${c.id}:${idx}`]),
            }));
            updateState((prev) => ({
              ...prev,
              goals: [...prev.goals, g],
            }));
            setHist([]);
            setTab("rec");
            setScr("goal");
            setPar(g.id);
            window.scrollTo(0, 0);
          }}
          onExpandCourse={(c) => {
            const base = c.L.map(
              (l, i) => `${i + 1}. ${l[0]}: ${l[1].slice(0, 350)}`
            )
              .join(" | ")
              .slice(0, 2500);
            setRecGenInit({
              topic: `Versión ampliada y más profunda del curso «${c.t}»`,
              size: "e",
              base,
            });
            openScreen("recgen");
          }}
          onEditCourse={(c) => openScreen("courseedit", c.id)}
          onDeleteCourse={handleDeleteCourse}
        />
      );
    }

    if (scr === "lesson" && par) {
      return (
        <LessonView
          S={S}
          param={par}
          onBack={goBack}
          onNavigate={(nextPar) => setPar(nextPar)}
          onMarkNext={(lessonKey, nextPar) => {
            updateState((prev) => ({
              ...prev,
              prog: { ...(prev.prog || {}), [lessonKey]: true },
              goals: prev.goals.map((g) => ({
                ...g,
                steps: g.steps.map((x) =>
                  x.lk === lessonKey ? { ...x, d: true } : x
                ),
              })),
            }));
            setPar(nextPar);
          }}
          onFinishCourse={(c) => {
            updateState((prev) => {
              const nextProg = { ...(prev.prog || {}) };
              c.L.forEach((_, idx) => {
                nextProg[`${c.id}:${idx}`] = true;
              });
              return {
                ...prev,
                prog: nextProg,
                goals: prev.goals.map((g) => ({
                  ...g,
                  steps: g.steps.map((x) =>
                    x.lk && x.lk.startsWith(c.id + ":") ? { ...x, d: true } : x
                  ),
                })),
              };
            });
            goBack();
          }}
          onSaveNote={(noteKey, val) =>
            updateState((prev) => ({
              ...prev,
              nt: { ...(prev.nt || {}), [noteKey]: val },
            }))
          }
          onScheduleSteps={(c) => {
            const ac = getCourseActions(c);
            if (!ac || (S.ad && S.ad[c.id])) return;
            const dm =
              c.dim != null ? c.dim : TD[c.tp] != null ? TD[c.tp] : 7;
            const newTasks = ac.items.map((t, i) => ({
              id: uid(),
              t,
              date: add(today(), i),
              time: "",
              p: 2,
              dim: dm,
              done: false,
              cid: c.id,
            }));
            updateState((prev) => ({
              ...prev,
              tasks: [...prev.tasks, ...newTasks],
              ad: { ...(prev.ad || {}), [c.id]: 1 },
            }));
          }}
        />
      );
    }

    if (scr === "weekly") {
      return (
        <WeeklyBalanceView
          S={S}
          offset={Number(par) || 0}
          onChangeOffset={(nextOff) => setPar(String(nextOff))}
          onBack={goBack}
          onAnalyzeWithCoach={(tx) => {
            openScreen("coach");
            setTimeout(() => {
              sendCoachMessage(
                "Analiza mi balance semanal y dime dos ajustes realistas para la próxima semana.\n" +
                  tx
              );
            }, 0);
          }}
        />
      );
    }

    if (scr === "recgen") {
      return (
        <RecGenView
          S={S}
          aiAvailable={aiStatus.available}
          initialTopic={recGenInit.topic}
          initialSize={recGenInit.size}
          baseContent={recGenInit.base}
          onBack={goBack}
          onSavePending={(pending) =>
            updateState((prev) => ({
              ...prev,
              pendingGen: pending,
            }))
          }
          onCreated={(c: Course) => {
            updateState((prev) => ({
              ...prev,
              cu: [...(prev.cu || []), c],
              pendingGen: null,
            }));
            setRecGenInit({ topic: "", size: "c", base: "" });
            setScr("course");
            setPar(c.id);
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    if (scr === "profile") {
      return (
        <ProfileView
          S={S}
          aiAvailable={aiStatus.available}
          aiModel={aiStatus.model}
          onBack={goBack}
          onSaveName={(name) => updateState((prev) => ({ ...prev, name }))}
          onSelectTheme={(theme) =>
            updateState((prev) => ({
              ...prev,
              theme,
            }))
          }
          onImportBackup={(data) => {
            updateState((prev) => ({
              ...INITIAL_STATE,
              ...data,
              theme: data.theme || prev.theme,
            }));
          }}
          onWipeAll={() => {
            updateState((prev) => ({
              ...INITIAL_STATE,
              theme: prev.theme,
            }));
            setScr(null);
            setPar(null);
            setHist([]);
            setTab("home");
            window.scrollTo(0, 0);
          }}
        />
      );
    }

    // Main Tabs
    if (tab === "home") {
      return (
        <HomeView
          S={S}
          onOpen={(s, p) => openScreen(s, p ?? null)}
          onTab={switchTab}
          onStatsSubTab={(st) => {
            setTab("stats");
            setStatsSubTab(st);
            setScr(null);
            window.scrollTo(0, 0);
          }}
          onToggleHabit={toggleHabitLog}
        />
      );
    }

    if (tab === "agenda") {
      return (
        <AgendaView
          S={S}
          sel={sel}
          setSel={setSel}
          adding={adding}
          setAdding={setAdding}
          onAddTask={(t, dim, time) =>
            updateState((prev) => ({
              ...prev,
              tasks: [
                ...prev.tasks,
                { id: uid(), t, date: sel, time, p: 2, dim, done: false },
              ],
            }))
          }
          onToggleTask={(id) =>
            updateState((prev) => ({
              ...prev,
              tasks: prev.tasks.map((x) =>
                x.id === id ? { ...x, done: !x.done } : x
              ),
            }))
          }
          onDeleteTask={(id) =>
            updateState((prev) => ({
              ...prev,
              tasks: prev.tasks.filter((x) => x.id !== id),
            }))
          }
          onRescheduleLate={() =>
            updateState((prev) => {
              const td = today();
              const lateIds = new Set(lateTasks(prev).map((x) => x.id));
              return {
                ...prev,
                tasks: prev.tasks.map((x) =>
                  lateIds.has(x.id) ? { ...x, date: td } : x
                ),
              };
            })
          }
          onToggleHabit={toggleHabitLog}
          onDeleteHabit={(id) =>
            updateState((prev) => ({
              ...prev,
              habits: prev.habits.filter((h) => h.id !== id),
            }))
          }
          onToggleGoalStep={toggleGoalStep}
        />
      );
    }

    if (tab === "rec") {
      return (
        <LibraryView
          S={S}
          onOpen={(s, p) => openScreen(s, p ?? null)}
          onOpenGenerator={() => {
            setRecGenInit({ topic: "", size: "c", base: "" });
            openScreen("recgen");
          }}
          onEditCourse={(c) => openScreen("courseedit", c.id)}
          onDeleteCourse={handleDeleteCourse}
          onRestoreBaseCourses={() =>
            updateState((prev) => ({
              ...prev,
              ch: {},
            }))
          }
        />
      );
    }

    return (
      <StatsView
        S={S}
        subTab={statsSubTab}
        setSubTab={setStatsSubTab}
        onOpen={(s, p) => openScreen(s, p ?? null)}
        onSaveHealth={(steps, sleep) =>
          updateState((prev) => ({
            ...prev,
            health: { ...prev.health, [today()]: { steps, sleep } },
          }))
        }
      />
    );
  };

  const hideBottomNav =
    scr === "coach" || scr === "moodintro" || scr === "lesson";

  const navItems: (
    | { id: MainTab; icon: string; label: string }
    | null
  )[] = [
    { id: "home", icon: "home", label: "Inicio" },
    { id: "agenda", icon: "week", label: "Agenda" },
    null,
    { id: "rec", icon: "library", label: "Biblioteca" },
    { id: "stats", icon: "chart", label: "Progreso" },
  ];

  return (
    <>
      <main id="m">{renderMainContent()}</main>

      {!hideBottomNav && (
        <nav className="rumbo-nav">
          {navItems.map((n, idx) =>
            n ? (
              <button
                key={n.id}
                className={n.id === tab && !scr ? "on" : ""}
                onClick={() => switchTab(n.id)}
              >
                <i>
                  <Ico name={n.icon} />
                </i>
                {n.label}
              </button>
            ) : (
              <span key={`fab-${idx}`} style={{ position: "relative" }}>
                <button
                  className="fab"
                  onClick={() => setFab(!fab)}
                  aria-label="Crear"
                >
                  <Ico name="plus" />
                </button>
              </span>
            )
          )}
        </nav>
      )}

      {fab && (
        <>
          <div className="bd" onClick={() => setFab(false)} />
          <div className="sh2" role="dialog" aria-label="Crear">
            <div className="grab" />
            <h3>¿Qué quieres crear?</h3>
            <button onClick={() => openScreen("goalnew")}>
              <i style={{ background: "#0E9488" }}>
                <Ico name="target" />
              </i>
              <span>
                <b>Nueva meta</b>
                <small>Con IA, a mano o desde una sugerencia</small>
              </span>
            </button>
            <button onClick={() => openScreen("habitnew")}>
              <i style={{ background: "#5B6FD6" }}>
                <Ico name="repeat" />
              </i>
              <span>
                <b>Nuevo hábito</b>
                <small>Con días y hora</small>
              </span>
            </button>
            <button
              onClick={() => {
                setTab("agenda");
                setScr(null);
                setPar(null);
                setSel(today());
                setAdding(true);
                setFab(false);
                window.scrollTo(0, 0);
              }}
            >
              <i style={{ background: "#C98A1B" }}>
                <Ico name="check" />
              </i>
              <span>
                <b>Nueva tarea</b>
                <small>Para un día y una hora concretos</small>
              </span>
            </button>
          </div>
        </>
      )}
    </>
  );
}
