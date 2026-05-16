import { useCallback, useState } from "react";
import { Delete, Loader2 } from "lucide-react";

const PIN_LENGTH = 4;

type Props = {
  disabled?: boolean;
  onUnlock: (passcode: string) => Promise<void>;
};

export function SimulatorPinPad({ disabled = false, onUnlock }: Props) {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passcode = digits.join("");

  const pushDigit = useCallback((d: string) => {
    setError("");
    setDigits((prev) => (prev.length >= PIN_LENGTH ? prev : [...prev, d]));
  }, []);

  const backspace = useCallback(() => {
    setError("");
    setDigits((prev) => prev.slice(0, -1));
  }, []);

  const clear = useCallback(() => {
    setError("");
    setDigits([]);
  }, []);

  const submit = async () => {
    if (passcode.length !== PIN_LENGTH || submitting || disabled) return;
    setSubmitting(true);
    setError("");
    try {
      await onUnlock(passcode);
      setDigits([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unlock failed");
    } finally {
      setSubmitting(false);
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"];

  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-black/40 p-4 shadow-xl backdrop-blur-md sm:max-w-sm">
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-sky-300/80">
        Visitor passcode
      </p>

      <div className="mb-4 flex justify-center gap-2.5">
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <div
            key={i}
            className={`flex h-12 w-11 items-center justify-center rounded-xl border text-lg font-bold tabular-nums transition ${
              digits[i]
                ? "border-sky-500/50 bg-sky-500/15 text-white"
                : "border-white/10 bg-white/[0.04] text-white/25"
            }`}
          >
            {digits[i] ? "•" : ""}
          </div>
        ))}
      </div>

      {error ? (
        <p className="mb-3 text-center text-xs font-medium text-red-300/95" role="alert">
          {error}
        </p>
      ) : (
        <p className="mb-3 text-center text-[11px] text-white/40">Enter the 4-digit code from a resident</p>
      )}

      <div className="grid grid-cols-3 gap-2">
        {keys.map((k) => {
          if (k === "clear") {
            return (
              <button
                key={k}
                type="button"
                disabled={disabled || submitting}
                onClick={clear}
                className="rounded-xl border border-white/10 bg-white/[0.04] py-3 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:bg-white/10 disabled:opacity-40"
              >
                Clear
              </button>
            );
          }
          if (k === "back") {
            return (
              <button
                key={k}
                type="button"
                disabled={disabled || submitting || digits.length === 0}
                onClick={backspace}
                aria-label="Backspace"
                className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] py-3 text-white/80 transition hover:bg-white/10 disabled:opacity-40"
              >
                <Delete className="h-5 w-5" />
              </button>
            );
          }
          return (
            <button
              key={k}
              type="button"
              disabled={disabled || submitting || digits.length >= PIN_LENGTH}
              onClick={() => pushDigit(k)}
              className="rounded-xl border border-white/10 bg-white/[0.06] py-3 text-lg font-semibold text-white transition hover:border-sky-500/40 hover:bg-sky-500/10 disabled:opacity-40"
            >
              {k}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={disabled || submitting || passcode.length !== PIN_LENGTH}
        onClick={() => void submit()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-sky-900/40 transition hover:from-sky-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Unlocking…
          </>
        ) : (
          "Unlock door"
        )}
      </button>
    </div>
  );
}
