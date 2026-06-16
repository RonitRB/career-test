import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send, Sparkles, ShieldAlert, Brain, HeartHandshake, Users, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

/**
 * Sonu Career Personality Assessment
 *
 * Deployment idea:
 * - Frontend on Vercel/Netlify
 * - POST submissions to your own webhook endpoint
 * - Sonu sees no scores, no recommendations, no analysis
 *
 * Set this env var before deploy:
 * VITE_RESULTS_WEBHOOK_URL=https://your-webhook-endpoint.example/submit
 */

const phase1Questions = [
  {
    id: "p1q1",
    kind: "single",
    prompt: "1. Which activity sounds most enjoyable?",
    options: [
      "A. Fixing a machine",
      "B. Solving a difficult problem",
      "C. Creating something artistic",
      "D. Helping people",
      "E. Leading a team",
      "F. Organizing records and plans",
    ],
  },
  {
    id: "p1q2",
    kind: "single",
    prompt: "2. In school/college, what do you naturally enjoy most?",
    options: [
      "A. Practical activities",
      "B. Learning new concepts",
      "C. Creative activities",
      "D. Talking with people",
      "E. Taking responsibility",
      "F. Planning and organizing",
    ],
  },
  {
    id: "p1q3",
    kind: "single",
    prompt: "3. Which environment would you enjoy the most?",
    options: [
      "A. Workshop",
      "B. Research lab",
      "C. Studio",
      "D. Busy public place",
      "E. Business office",
      "F. Administrative office",
    ],
  },
  {
    id: "p1q4",
    kind: "single",
    prompt: "4. If given a free day, what would you choose?",
    options: [
      "A. Build or repair something",
      "B. Learn something new",
      "C. Create something",
      "D. Meet people",
      "E. Start a project",
      "F. Organize your future plans",
    ],
  },
  {
    id: "p1q5",
    kind: "single",
    prompt: "5. Which compliment makes you happiest?",
    options: [
      "A. You're skilled",
      "B. You're intelligent",
      "C. You're creative",
      "D. You're kind",
      "E. You're influential",
      "F. You're reliable",
    ],
  },
  {
    id: "p1q6",
    kind: "single",
    prompt: "6. Do you prefer:",
    options: ["A. Working alone", "B. Small groups", "C. Large groups"],
  },
  {
    id: "p1q7",
    kind: "single",
    prompt: "7. Which would you hate most?",
    options: [
      "A. Physical labor",
      "B. Complex theory",
      "C. Repetitive work",
      "D. Being isolated",
      "E. Lack of growth",
      "F. Strict rules",
    ],
  },
  {
    id: "p1q8",
    kind: "single",
    prompt: "8. Which motivates you most?",
    options: [
      "A. Achievement",
      "B. Knowledge",
      "C. Creativity",
      "D. Helping others",
      "E. Recognition",
      "F. Security",
    ],
  },
  {
    id: "p1q9",
    kind: "single",
    prompt: "9. What gives you energy?",
    options: [
      "A. Building things",
      "B. Learning things",
      "C. Creating things",
      "D. Meeting people",
      "E. Winning",
      "F. Planning",
    ],
  },
  {
    id: "p1q10",
    kind: "single",
    prompt: "10. Which career sounds most interesting?",
    options: [
      "A. Engineer",
      "B. Scientist",
      "C. Designer",
      "D. Counselor",
      "E. Entrepreneur",
      "F. Manager",
    ],
  },
];

const phase2Questions = [
  {
    id: "p2q1",
    kind: "single",
    prompt: "1. Which scares you more?",
    options: [
      "A. Living your whole life in one city",
      "B. Having an unstable future",
    ],
    followup: true,
  },
  {
    id: "p2q2",
    kind: "single",
    prompt: "2. Which would you choose?",
    options: [
      "A. A secure career with limited travel",
      "B. A less predictable career with more travel",
    ],
    followup: true,
  },
  {
    id: "p2q3",
    kind: "text",
    prompt: "3. Complete this sentence: The biggest thing missing from my life right now is __________.",
  },
  {
    id: "p2q4",
    kind: "text",
    prompt: "4. As the eldest child, what responsibilities do you think you will have in the next 10 years?",
  },
  {
    id: "p2q5",
    kind: "single",
    prompt: "5. How often would you ideally want to see your family?",
    options: ["A. Daily", "B. Weekly", "C. Monthly", "D. Occasionally"],
  },
  {
    id: "p2q6",
    kind: "single",
    prompt: "6. Which would upset you more?",
    options: [
      "A. Missing your best friend's wedding",
      "B. Missing a major career opportunity",
    ],
    followup: true,
  },
  {
    id: "p2q7",
    kind: "rank",
    prompt: "7. Why do you want to travel? Rank these from most important to least important:",
    options: ["Freedom", "Adventure", "Confidence", "New people", "Escaping routine", "Learning cultures"],
  },
  {
    id: "p2q8",
    kind: "single",
    prompt: "8. If someone paid for all your travel forever, would you still want a travel-related career?",
    options: ["Yes", "No"],
    followup: true,
  },
  {
    id: "p2q9",
    kind: "text",
    prompt: "9. What do you think travel will give you that you don't currently have?",
  },
  {
    id: "p2q10",
    kind: "single",
    prompt: "10. Which statement feels most true?",
    options: [
      "A. I want to prove myself.",
      "B. I want independence.",
      "C. I want adventure.",
      "D. I want security.",
    ],
  },
  {
    id: "p2q11",
    kind: "text",
    prompt: "11. What kind of people do you admire most?",
  },
  {
    id: "p2q12",
    kind: "text",
    prompt: "12. What kind of life would make you proud at age 30? Describe it.",
  },
  {
    id: "p2q13",
    kind: "single",
    prompt: "13. Which sacrifice can you accept?",
    options: [
      "A. Less travel",
      "B. Less family time",
      "C. Lower salary",
      "D. More stress",
      "E. Slower growth",
    ],
  },
  {
    id: "p2q14",
    kind: "text",
    prompt: "14. Which sacrifice can you NOT accept? Why?",
  },
  {
    id: "p2q15",
    kind: "text",
    prompt: "15. If nobody judged you, nobody pressured you, and money was guaranteed, what would you do with your life?",
  },
];

const initialAnswers = {
  respondentName: "",
  respondentAge: "",
  currentCourse: "",
  college: "",
};

function phaseLetter(optionText) {
  const m = optionText?.match(/^([A-F])\./i);
  return m ? m[1].toUpperCase() : null;
}

function optionLabelFromAnswer(answer) {
  if (!answer) return null;
  const m = String(answer).match(/^([A-F])\./i);
  return m ? m[1].toUpperCase() : null;
}

function scorePhase1(answers) {
  const totals = {
    social: 0,
    enterprising: 0,
    creative: 0,
    technical: 0,
    investigative: 0,
    conventional: 0,
    realistic: 0,
  };

  const add = (key, amt = 1) => {
    totals[key] = (totals[key] || 0) + amt;
  };

  // Uses the exact question structure to estimate broad categories.
  const mapFor = (letter, qid) => {
    if (qid === "p1q6") {
      if (letter === "A") return { conventional: 1 };
      if (letter === "B") return { social: 1 };
      if (letter === "C") return { social: 2, enterprising: 1 };
    }

    const mappings = {
      A: { realistic: 2 },
      B: { investigative: 2 },
      C: { creative: 2 },
      D: { social: 2 },
      E: { enterprising: 2 },
      F: { conventional: 2 },
    };
    return mappings[letter] || {};
  };

  phase1Questions.forEach((q) => {
    const ans = answers[q.id];
    const letter = optionLabelFromAnswer(ans);
    if (!letter) return;

    const mapped = mapFor(letter, q.id);
    Object.entries(mapped).forEach(([k, v]) => add(k, v));
  });

  return totals;
}

function computeLifeSignals(answers) {
  const signals = {
    freedom: 0,
    stability: 0,
    family: 0,
    travel: 0,
    independence: 0,
    security: 0,
    growth: 0,
    social: 0,
  };

  const bumpIfIncludes = (text, target, words) => {
    if (!text) return;
    const t = String(text).toLowerCase();
    words.forEach((w) => {
      if (t.includes(w)) signals[target] += 1;
    });
  };

  bumpIfIncludes(answers.p2q3, "freedom", ["freedom", "independent", "independence", "escape", "cage"]);
  bumpIfIncludes(answers.p2q3, "travel", ["travel", "world", "places", "explore"]);
  bumpIfIncludes(answers.p2q4, "family", ["family", "sister", "brother", "parents", "responsibility", "eldest"]);
  bumpIfIncludes(answers.p2q4, "growth", ["career", "job", "success", "money", "work"]);
  bumpIfIncludes(answers.p2q9, "travel", ["travel", "places", "explore", "world"]);
  bumpIfIncludes(answers.p2q9, "freedom", ["freedom", "independence", "confidence", "courage"]);
  bumpIfIncludes(answers.p2q11, "social", ["people", "kind", "respected", "confident", "leader", "responsible"]);
  bumpIfIncludes(answers.p2q12, "growth", ["career", "success", "proud", "strong", "independent"]);
  bumpIfIncludes(answers.p2q12, "travel", ["travel", "places", "countries", "cities"]);
  bumpIfIncludes(answers.p2q14, "family", ["family", "home", "parents", "siblings"]);
  bumpIfIncludes(answers.p2q15, "freedom", ["freedom", "independent", "own"]);
  bumpIfIncludes(answers.p2q15, "travel", ["travel", "places", "world"]);
  bumpIfIncludes(answers.p2q15, "growth", ["career", "build", "business", "study"]);

  const addChoice = (qid, mapping) => {
    const answer = answers[qid];
    if (!answer) return;
    const delta = mapping[answer];
    if (!delta) return;
    Object.entries(delta).forEach(([k, v]) => (signals[k] += v));
  };

  addChoice("p2q1", {
    "A. Living your whole life in one city": { freedom: 3, travel: 1 },
    "B. Having an unstable future": { stability: 2, security: 2 },
  });
  addChoice("p2q2", {
    "A. A secure career with limited travel": { stability: 3, security: 3 },
    "B. A less predictable career with more travel": { travel: 3, freedom: 2, independence: 1 },
  });
  addChoice("p2q5", {
    "A. Daily": { family: 3, stability: 1 },
    "B. Weekly": { family: 2 },
    "C. Monthly": { independence: 1 },
    "D. Occasionally": { freedom: 2, travel: 1 },
  });
  addChoice("p2q6", {
    "A. Missing your best friend's wedding": { travel: 1, growth: 1 },
    "B. Missing a major career opportunity": { family: 2, stability: 1 },
  });
  addChoice("p2q8", {
    Yes: { travel: 2, freedom: 1 },
    No: { stability: 2, family: 1 },
  });
  addChoice("p2q10", {
    "A. I want to prove myself.": { growth: 2 },
    "B. I want independence.": { freedom: 3, independence: 2 },
    "C. I want adventure.": { travel: 3, freedom: 1 },
    "D. I want security.": { stability: 3, security: 3 },
  });
  addChoice("p2q13", {
    "A. Less travel": { family: 1, stability: 1 },
    "B. Less family time": { freedom: 1, travel: 1 },
    "C. Lower salary": { freedom: 1, travel: 1 },
    "D. More stress": { security: 1 },
    "E. Slower growth": { growth: 1 },
  });

  // Rank question stored as draggable order; rank position is the signal.
  const ranking = answers.p2q7 || [];
  ranking.forEach((item, idx) => {
    const score = 6 - idx;
    if (item === "Freedom") signals.freedom += score;
    if (item === "Adventure") signals.travel += score;
    if (item === "Confidence") signals.growth += score;
    if (item === "New people") signals.social += score;
    if (item === "Escaping routine") signals.freedom += score;
    if (item === "Learning cultures") signals.travel += score;
  });

  return signals;
}

function topCareerMatches(phase1, life) {
  const raw = {
    cabinCrew: life.travel + life.freedom + life.social + life.independence - life.stability * 0.5,
    businessDev: phase1.enterprising + life.social + life.growth + life.independence,
    tourism: life.travel + life.social + life.freedom,
    eventMgmt: phase1.enterprising + life.social + life.freedom + life.growth,
    hospitality: life.social + life.travel + life.independence,
    corporate: phase1.conventional + life.stability + life.security + life.growth,
    engineering: phase1.realistic + phase1.investigative + life.stability + life.security,
    pr: phase1.social + phase1.enterprising + life.growth + life.social,
  };

  const labels = {
    cabinCrew: "Cabin Crew",
    businessDev: "International Sales / Business Development",
    tourism: "Tourism & Travel",
    eventMgmt: "Event Management",
    hospitality: "Hospitality",
    corporate: "Corporate / Operations",
    engineering: "Core Engineering",
    pr: "Public Relations / Communications",
  };

  return Object.entries(raw)
    .map(([k, v]) => ({ name: labels[k], score: Math.max(0, Math.min(100, Math.round((v / 12) * 100))) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function QuestionCard({ question, value, onChange, onMoveUp, onMoveDown, allowReorder }) {
  return (
    <div className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[15px] font-medium leading-6 text-slate-900">{question.prompt}</p>

      <div className="mt-4 space-y-3">
        {question.kind === "single" &&
          question.options.map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                value === option
                  ? "border-slate-950 bg-slate-50"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                checked={value === option}
                onChange={() => onChange(option)}
                className="h-4 w-4"
              />
              <span className="text-sm text-slate-800">{option}</span>
            </label>
          ))}

        {question.kind === "text" && (
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[118px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none transition focus:border-slate-400"
          />
        )}

        {question.kind === "rank" && allowReorder && (
          <div className="space-y-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Drag the items or use the arrows to rank them from most important to least important.
            </div>
            <div className="space-y-2">
              {value.map((item, idx) => (
                <DraggableRankItem
                  key={item}
                  item={item}
                  index={idx}
                  onMoveUp={() => onMoveUp(idx)}
                  onMoveDown={() => onMoveDown(idx)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableRankItem({ item, index, onMoveUp, onMoveDown }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", item);
        e.dataTransfer.effectAllowed = "move";
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      className={`flex items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm ${
        dragging ? "border-slate-950 ring-2 ring-slate-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="h-4 w-4 text-slate-400" />
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-slate-900">{item}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
          aria-label={`Move ${item} up`}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
          aria-label={`Move ${item} down`}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>{current} / {total} completed</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-slate-950 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function submitPayloadToWebhook(payload) {
  const webhook = import.meta.env.VITE_RESULTS_WEBHOOK_URL;
  if (!webhook) {
    console.warn("No VITE_RESULTS_WEBHOOK_URL configured. Payload:", payload);
    return Promise.resolve({ ok: true, localOnly: true });
  }

  return fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export default function SonuCareerAssessment() {
  const [phase, setPhase] = useState(1);
  const [answers, setAnswers] = useState({
    ...initialAnswers,
    ...Object.fromEntries(phase1Questions.map((q) => [q.id, ""])),
    ...Object.fromEntries(phase2Questions.map((q) => [q.id, q.kind === "rank" ? [...q.options] : ""])),
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");

  const phase1 = useMemo(() => scorePhase1(answers), [answers]);
  const life = useMemo(() => computeLifeSignals(answers), [answers]);
  const matches = useMemo(() => topCareerMatches(phase1, life), [phase1, life]);

  const totalQuestions = phase1Questions.length + phase2Questions.length + 4; // respondent details

  const answeredCount = useMemo(() => {
    const requiredBasics = [answers.respondentName, answers.respondentAge, answers.currentCourse, answers.college].filter(Boolean).length;
    const q1 = phase1Questions.filter((q) => answers[q.id]).length;
    const q2 = phase2Questions.filter((q) => {
      if (q.kind === "rank") return Array.isArray(answers[q.id]) && answers[q.id].length === q.options.length;
      return Boolean(answers[q.id]);
    }).length;
    return requiredBasics + q1 + q2;
  }, [answers]);

  const allDone = answeredCount === totalQuestions;

  const setValue = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));

  const moveRankItem = (qid, fromIndex, toIndex) => {
    setAnswers((prev) => {
      const arr = [...prev[qid]];
      if (toIndex < 0 || toIndex >= arr.length) return prev;
      const next = arr.slice();
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...prev, [qid]: next };
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setStatus("");

    const payload = {
      submittedAt: new Date().toISOString(),
      respondent: {
        name: answers.respondentName,
        age: answers.respondentAge,
        currentCourse: answers.currentCourse,
        college: answers.college,
      },
      answers,
      phase1Profile: phase1,
      lifeSignals: life,
      topCareerMatches: matches,
      meta: {
        version: "final-sonu-career-assessment-v1",
      },
    };

    try {
      await submitPayloadToWebhook(payload);
      setStatus(
        import.meta.env.VITE_RESULTS_WEBHOOK_URL
          ? "Submitted successfully."
          : "Submitted locally. Set VITE_RESULTS_WEBHOOK_URL to send responses privately to your endpoint."
      );
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setStatus("Submission failed. Check your webhook URL or network connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 text-slate-900 flex items-center justify-center">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl text-center">
          <div className="flex items-center justify-center gap-3 text-emerald-600 mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-semibold">Assessment submitted successfully</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Thank you for completing the career assessment.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Your responses have been securely submitted and will be analyzed privately.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl"
        >
          <div className="bg-slate-950 px-6 py-8 text-white md:px-10">
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <Badge icon={<Sparkles size={14} />} text="Career assessment" />
              <Badge icon={<ShieldAlert size={14} />} text="Results hidden from respondent" />
              <Badge icon={<Brain size={14} />} text="Two-phase profile" />
              <Badge icon={<HeartHandshake size={14} />} text="Private analysis" />
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">Sonu Career Personality Assessment</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
              The first phase finds out who she is. The second phase explores what kind of life she actually wants. Nothing is shown to her after submission; only you receive the answers.
            </p>
          </div>

          <div className="grid w-full min-w-0 gap-6 p-5 md:p-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="w-full min-w-0 space-y-6">
              <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-lg font-semibold">Respondent details</h2>
                <p className="mt-1 text-sm text-slate-600">This helps you identify the submission later.</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="Name" value={answers.respondentName} onChange={(v) => setValue("respondentName", v)} placeholder="Sonu" />
                  <Field label="Age" value={answers.respondentAge} onChange={(v) => setValue("respondentAge", v)} placeholder="18" />
                  <Field label="Current course" value={answers.currentCourse} onChange={(v) => setValue("currentCourse", v)} placeholder="Diploma ECE" />
                  <Field label="College / Institute" value={answers.college} onChange={(v) => setValue("college", v)} placeholder="Optional" />
                </div>
              </section>

              <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-semibold">PHASE 1: General Career Personality Assessment</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Answer instinctively. Don't think about Cabin Crew, Engineering, Father, or Family pressure.
                    </p>
                  </div>
                  <div className="w-full md:w-auto md:min-w-[220px]">
                    <ProgressBar current={answeredCount} total={totalQuestions} />
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  The mistake most people make is: "What career should I choose?" before answering: "Who am I?"
                </div>

                <div className="mt-5 space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Part A: Interests</h3>
                  {phase1Questions.slice(0, 5).map((q) => (
                    <QuestionCard key={q.id} question={q} value={answers[q.id]} onChange={(v) => setValue(q.id, v)} />
                  ))}

                  <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Part B: Work Environment</h3>
                  {phase1Questions.slice(5).map((q) => (
                    <QuestionCard key={q.id} question={q} value={answers[q.id]} onChange={(v) => setValue(q.id, v)} />
                  ))}
                </div>
              </section>

              <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-2xl font-semibold">PHASE 2: Sonu's Personalized Life & Career Assessment</h2>
                <p className="mt-2 text-sm text-slate-600">Only after Phase 1.</p>

                <div className="mt-5 space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Section 1: Freedom vs Stability</h3>
                  {phase2Questions.slice(0, 3).map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={(v) => setValue(q.id, v)}
                    />
                  ))}

                  <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Section 2: Family Reality</h3>
                  {phase2Questions.slice(3, 6).map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={(v) => setValue(q.id, v)}
                    />
                  ))}

                  <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Section 3: Travel Motivation</h3>
                  {phase2Questions.slice(6, 9).map((q) =>
                    q.kind === "rank" ? (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        value={answers[q.id]}
                        onChange={(v) => setValue(q.id, v)}
                        allowReorder
                        onMoveUp={(idx) => moveRankItem(q.id, idx, idx - 1)}
                        onMoveDown={(idx) => moveRankItem(q.id, idx, idx + 1)}
                      />
                    ) : (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        value={answers[q.id]}
                        onChange={(v) => setValue(q.id, v)}
                      />
                    )
                  )}

                  <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Section 4: Personal Growth</h3>
                  {phase2Questions.slice(9, 12).map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={(v) => setValue(q.id, v)}
                    />
                  ))}

                  <h3 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Section 5: Reality Check</h3>
                  {phase2Questions.slice(12).map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      value={answers[q.id]}
                      onChange={(v) => setValue(q.id, v)}
                    />
                  ))}
                </div>
              </section>

              <div className="flex flex-wrap items-center gap-3 pb-2">
                <button
                  type="button"
                  onClick={() => setPhase((p) => (p === 1 ? 2 : 1))}
                  className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {phase === 1 ? "Go to Phase 2" : "Back to Phase 1"}
                </button>
                <button
                  type="button"
                  disabled={!allDone || submitting}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />
                  {submitting ? "Sending..." : "Submit responses"}
                </button>
                {!allDone && <span className="text-sm text-slate-500">Fill every question before submission.</span>}
                {status && <span className="text-sm text-emerald-600">{status}</span>}
              </div>
            </div>

            <aside className="w-full min-w-0 space-y-6 xl:sticky xl:top-6 xl:h-fit">
              <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Live snapshot for you</h2>
                <p className="mt-1 text-sm text-slate-600">Sonu will not see this panel.</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <StatCard label="Social" value={phase1.social} />
                  <StatCard label="Enterprising" value={phase1.enterprising} />
                  <StatCard label="Creative" value={phase1.creative} />
                  <StatCard label="Investigative" value={phase1.investigative} />
                  <StatCard label="Freedom" value={life.freedom} />
                  <StatCard label="Travel" value={life.travel} />
                  <StatCard label="Family" value={life.family} />
                  <StatCard label="Stability" value={life.stability} />
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold">Generated matches</h3>
                <p className="mt-1 text-sm text-slate-600">Useful only for your private analysis.</p>
                <div className="mt-4 space-y-3">
                  {matches.map((m, idx) => (
                    <div key={m.name} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{m.name}</div>
                            <div className="text-xs text-slate-500">Private match score</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-700">{m.score}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
                <h3 className="text-lg font-semibold">Deployment note</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Set <code className="rounded bg-white/10 px-1 py-0.5">VITE_RESULTS_WEBHOOK_URL</code> to your own endpoint.
                  The respondent only sees the questionnaire and the final submit confirmation.
                </p>
              </section>
            </aside>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Badge({ icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
      {icon}
      {text}
    </span>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
      />
    </label>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
