type LikertScaleProps = {
  question: string;
  minLabel: string;
  maxLabel: string;
  value: number | null;
  onChange: (value: number) => void;
  scale?: number;
};

export function LikertScale({
  question,
  minLabel,
  maxLabel,
  value,
  onChange,
  scale = 7,
}: LikertScaleProps) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-gray-800 dark:text-gray-200 text-lg pt-3">{question}</p>

      <div className="flex justify-between gap-1">
        {Array.from({ length: scale }, (_, i) => {
          const v = i + 1;
          const selected = value === v;

          return (
            <button
              key={v}
              type="button"
              aria-label={`${question}: ${v}`}
              onClick={() => onChange(v)}
              className={`
                flex-1 rounded-md py-3 text-sm
                transition
                ${selected
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-gray-200 hover:bg-slate-500"}
              `}
            >
              {v}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
