import { useCallback, useEffect, useState } from "react";
import { Delete, Loader2, X } from "lucide-react";

const PIN_LENGTH = 4;

type Props = {
  open: boolean;
  lockName?: string;
  /** When false, show confirm-only UI (no PIN on this lock). */
  requirePin?: boolean;
  onClose: () => void;
  onUnlock: (passcode: string) => Promise<void>;
};

export function SimulatorUnlockModal({
  open,
  lockName,
  requirePin = true,
  onClose,
  onUnlock,
}: Props) {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = useCallback(() => {
    setDigits([]);
    setError("");
    setSubmitting(false);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const runUnlock = useCallback(
    async (code: string) => {
      setSubmitting(true);
      setError("");
      try {
        await onUnlock(code);
        reset();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unlock failed");
        setDigits([]);
      } finally {
        setSubmitting(false);
      }
    },
    [onClose, onUnlock, reset],
  );

  const submitPin = useCallback(
    async (code: string) => {
      if (code.length !== PIN_LENGTH || submitting) return;
      await runUnlock(code);
    },
    [runUnlock, submitting],
  );

  const pushDigit = useCallback(
    (d: string) => {
      if (submitting || !requirePin) return;
      setError("");
      setDigits((prev) => {
        if (prev.length >= PIN_LENGTH) return prev;
        const next = [...prev, d];
        if (next.length === PIN_LENGTH) {
          void submitPin(next.join(""));
        }
        return next;
      });
    },
    [requirePin, submitPin, submitting],
  );

  const backspace = useCallback(() => {
    if (submitting) return;
    setError("");
    setDigits((prev) => prev.slice(0, -1));
  }, [submitting]);

  const clear = useCallback(() => {
    if (submitting) return;
    setError("");
    setDigits([]);
  }, [submitting]);

  useEffect(() => {
    if (!open || !requirePin) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (submitting) return;
      if (e.key >= "0" && e.key <= "9") pushDigit(e.key);
      if (e.key === "Backspace") backspace();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, backspace, onClose, pushDigit, requirePin, submitting]);

  if (!open) return null;

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-4 backdrop-blur-md sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unlock-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-b from-[#141c2e] to-[#0a0f1a] p-5 shadow-2xl shadow-black/50 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-400/90">
              {requirePin ? "Enter PIN" : "Confirm"}
            </p>
            <h2 id="unlock-modal-title" className="mt-1 text-lg font-bold text-white">
              Unlock door
            </h2>
            {lockName ? <p className="mt-0.5 text-sm text-slate-400">{lockName}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {requirePin ? (
          <>
            <div className="mb-5 flex justify-center gap-3">
              {Array.from({ length: PIN_LENGTH }, (_, i) => (
                <div
                  key={i}
                  className={`flex h-14 w-12 items-center justify-center rounded-2xl border-2 text-xl font-bold transition-all ${
                    digits[i]
                      ? "scale-105 border-sky-400 bg-sky-500/20 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                      : "border-white/15 bg-black/30 text-white/20"
                  }`}
                >
                  {digits[i] ? "●" : ""}
                </div>
              ))}
            </div>

            {error ? (
              <p className="mb-4 text-center text-sm font-medium text-red-300" role="alert">
                {error}
              </p>
            ) : submitting ? (
              <p className="mb-4 flex items-center justify-center gap-2 text-center text-sm text-sky-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying PIN…
              </p>
            ) : (
              <p className="mb-4 text-center text-xs text-white/45">
                Enter 4-digit visitor code · submits automatically
              </p>
            )}

            <div className="grid grid-cols-3 gap-2.5">
              {keys.map((k) => {
                if (k === "clear") {
                  return (
                    <button
                      key={k}
                      type="button"
                      disabled={submitting}
                      onClick={clear}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] py-4 text-sm font-bold uppercase tracking-wide text-white/75 transition active:scale-95 hover:bg-white/10 disabled:opacity-40"
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
                      disabled={submitting || digits.length === 0}
                      onClick={backspace}
                      aria-label="Backspace"
                      className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] py-4 text-white transition active:scale-95 hover:bg-white/10 disabled:opacity-40"
                    >
                      <Delete className="h-6 w-6" />
                    </button>
                  );
                }
                return (
                  <button
                    key={k}
                    type="button"
                    disabled={submitting || digits.length >= PIN_LENGTH}
                    onClick={() => pushDigit(k)}
                    className="rounded-2xl border border-white/10 bg-white/[0.08] py-4 text-2xl font-semibold text-white shadow-inner transition active:scale-95 hover:border-sky-500/50 hover:bg-sky-500/15 disabled:opacity-40"
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-2">
            <p className="mb-5 text-center text-sm leading-relaxed text-white/55">
              No visitor PIN is set for this door. Tap below to open it.
            </p>
            {error ? (
              <p className="mb-4 text-center text-sm font-medium text-red-300" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="button"
              disabled={submitting}
              onClick={() => void runUnlock("")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening…
                </>
              ) : (
                "Open door"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
