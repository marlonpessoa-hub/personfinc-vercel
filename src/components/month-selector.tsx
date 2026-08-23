import { formatMonthLabel, shiftMonth } from "../lib/month";

export function MonthSelector({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (m: string) => void;
  className?: string;
}) {
  return (
    <div
      className={
        "inline-flex items-center gap-xs bg-surface-container rounded-full p-1 " + className
      }
    >
      <button
        type="button"
        onClick={() => onChange(shiftMonth(value, -1))}
        aria-label="Mês anterior"
        className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low"
      >
        <span className="material-symbols-outlined !text-[20px]">chevron_left</span>
      </button>
      <span className="min-w-[140px] text-center font-label-md text-label-md text-primary">
        {formatMonthLabel(value)}
      </span>
      <button
        type="button"
        onClick={() => onChange(shiftMonth(value, 1))}
        aria-label="Próximo mês"
        className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low"
      >
        <span className="material-symbols-outlined !text-[20px]">chevron_right</span>
      </button>
    </div>
  );
}
