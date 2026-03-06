import { useMemo, useState } from "react";
import { LikertScale } from "./LikertScale";

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type StrategyKey =
  | "reasoning"
  | "trialAndError"
  | "patternRecognition"
  | "guessing"
  | "insight"
  | "other";



export type PuzzleFeedback = {
  frustration: number;
  enjoyment: number;
  difficulty?: number;
  strategies: StrategyKey[];
  timestamp: number;
  puzzleId: string;
  trialNumber: number;
  questionOrder: FeedbackKey[];
};

type Props = {
  puzzleId: string;
  trialNumber: number;
  onSubmit: (data: PuzzleFeedback) => void;
};

type FeedbackKey = "frustration" | "enjoyment" | "difficulty";

type FeedbackState = Partial<Record<FeedbackKey, number>>;


type FeedbackQuestion = {
  key: FeedbackKey;
  question: string;
  minLabel: string;
  maxLabel: string;
};


export function PuzzleFeedbackPanel({ puzzleId, trialNumber, onSubmit }: Props) {
  const [responses, setResponses] = useState<FeedbackState>({});
  const [strategies, setStrategies] = useState<Set<StrategyKey>>(new Set());
  
  const FEEDBACK_QUESTIONS: FeedbackQuestion[] = [
    {
      key: "frustration",
      question: "How frustrating did you find this puzzle?",
      minLabel: "Not at all",
      maxLabel: "Extremely",
    },
    {
      key: "enjoyment",
      question: "How much did you enjoy this puzzle?",
      minLabel: "Not at all",
      maxLabel: "Very Much",
    },
    {
      key: "difficulty",
      question: "How difficult did this puzzle feel?",
      minLabel: "Very Easy",
      maxLabel: "Very Hard",
    },
  ];

  const STRATEGY_OPTIONS: { key: StrategyKey; label: string }[] = [
    { key: "reasoning", label:"Step-by-step reasoning/planning"},
    { key: "trialAndError", label:"Trial and error"},
    { key: "patternRecognition", label:"Pattern recognition"},
    { key: "guessing", label:"Guessing when unsure"},
    { key: "insight", label:"Sudden insights or realisations"},
    { key: "other", label:"Another strategy not listed here"}
  ];

  function toggleStrategy(key: StrategyKey) {
    setStrategies(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Shuffle once per mount
  const questions = useMemo(
    () => shuffle(FEEDBACK_QUESTIONS),
    []
  );

  const canSubmit =
    questions.every((q) => responses[q.key] !== undefined) &&
    strategies.size > 0;

  const questionOrder = questions.map((q) => q.key);

  return (
    <div className="max-w-md p-4 space-y-6 dark:text-gray-200 overflow-hidden">
      {questions.map((q) => (
        <LikertScale
          key={q.key}
          question={q.question}
          minLabel={q.minLabel}
          maxLabel={q.maxLabel}
          value={responses[q.key] ?? null}
          onChange={(value) =>
            setResponses((prev) => ({
              ...prev,
              [q.key]: value,
            }))
          }
        />
      ))}

      <div className="space-y-3">
        <p className="font-medium text-lg pt-3">
          Which of the following strategies did you use to complete this puzzle? (Select all that apply)
        </p>

        {STRATEGY_OPTIONS.map((s) => (
          <label
            key={s.key}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={strategies.has(s.key)}
              onChange={() => toggleStrategy(s.key)}
              className="accent-blue-600"
            />
            <span>{s.label}</span>
          </label>
        ))}
      </div>

      <button
        disabled={!canSubmit}
        onClick={() =>
          onSubmit({
            puzzleId,
            frustration: responses.frustration!,
            enjoyment: responses.enjoyment!,
            difficulty: responses.difficulty!,
            strategies: Array.from(strategies),
            timestamp: Date.now(),
            trialNumber: trialNumber,
            questionOrder: questionOrder,
          })
        }
        className={`
          w-full bg-transparent font-semibold py-2 px-4 border-2 border-gray-500  rounded
          ${canSubmit
            ? "bg-blue-600 text-gray-200 hover:bg-gray-500 hover:border-transparent"
            : "bg-gray-600 cursor-not-allowed text-gray-500"}
        `}
      >
       Continue
      </button>
    </div>
  );
}
