import { useEffect, useState } from "react";
import {
  Battery,
  BatteryLow,
  ChevronRight,
  DoorOpen,
  Loader2,
  Lock,
  MapPin,
  Radio,
  Shield,
  Unlock,
  WifiOff,
} from "lucide-react";
import { getApiBase } from "../lib/socket.js";

export type PublicLockSummary = {
  slug: string;
  name: string;
  location: string;
  state: string;
  batteryLevel: number;
};

type Props = {
  onOpenDoor: (slug: string) => void;
};

function BatteryMeter({ level }: { level: number }) {
  const pct = Math.min(100, Math.max(0, level));
  const low = pct <= 20;
  return (
    <div className="flex items-center gap-2">
      {low ? (
        <BatteryLow className="h-4 w-4 shrink-0 text-amber-400" strokeWidth={2} />
      ) : (
        <Battery className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
      )}
      <div className="h-1.5 flex-1 max-w-[5.5rem] overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all ${
            low ? "bg-amber-400" : pct <= 50 ? "bg-sky-400" : "bg-emerald-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="tabular-nums text-[11px] font-medium text-slate-400">{pct}%</span>
    </div>
  );
}

export function LockListScreen({ onOpenDoor }: Props) {
  const [locks, setLocks] = useState<PublicLockSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const res = await fetch(`${getApiBase()}/api/public/locks`);
        const data = (await res.json().catch(() => ({}))) as { locks?: PublicLockSummary[]; error?: string };
        if (!res.ok) {
          if (!cancelled) setError(data.error || "Could not load doors");
          return;
        }
        if (!cancelled) setLocks(data.locks ?? []);
      } catch {
        if (!cancelled) setError("Unable to reach the server.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#060912]" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(56,189,248,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_60%,rgba(99,102,241,0.14),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_0%_80%,rgba(236,72,153,0.08),transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#060912]/90" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="border-b border-white/[0.06] px-4 py-10 sm:px-8 sm:py-12">
          <div className="mx-auto max-w-6xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-md">
              <Radio className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/90">Nile University</span>
            </div>
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/30 to-indigo-600/40 ring-1 ring-white/10">
                <DoorOpen className="h-7 w-7 text-sky-200" strokeWidth={1.75} />
              </div>
              <h1 className="bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                Campus smart locks
              </h1>
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                Browse doors in a live grid. Tap any card for real-time status. Locking and unlocking stays in the{" "}
                <span className="text-sky-300/90">NileLock</span> mobile app — assigned residents only.
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500/80" strokeWidth={1.5} />
                <p className="text-sm font-medium">Scanning campus doors…</p>
              </div>
            ) : error ? (
              <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-red-500/25 bg-red-950/30 px-6 py-10 text-center">
                <WifiOff className="h-10 w-10 text-red-400/80" />
                <p className="text-red-200/90">{error}</p>
              </div>
            ) : locks.length === 0 ? (
              <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-14 text-center backdrop-blur-sm">
                <Shield className="h-10 w-10 text-slate-500" strokeWidth={1.25} />
                <p className="font-medium text-slate-300">No doors registered yet.</p>
                <p className="text-sm text-slate-500">Check back once locks are added in the admin console.</p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {locks.map((l) => {
                  const locked = l.state === "locked";
                  return (
                    <li key={l.slug} className="min-w-0">
                      <button
                        type="button"
                        onClick={() => onOpenDoor(l.slug)}
                        className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-px text-left shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/35 hover:from-white/[0.12] hover:shadow-xl hover:shadow-sky-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
                      >
                        <span
                          className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-50 ${
                            locked ? "bg-red-500" : "bg-emerald-400"
                          }`}
                        />
                        <span
                          className={`pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full opacity-20 blur-2xl ${
                            locked ? "bg-rose-600" : "bg-teal-500"
                          }`}
                        />

                        <div className="relative flex flex-1 flex-col rounded-[1.35rem] bg-[#0c1222]/85 p-5 sm:p-6 backdrop-blur-md">
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${
                                locked
                                  ? "bg-red-500/15 text-red-300 ring-red-500/25"
                                  : "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25"
                              }`}
                            >
                              {locked ? (
                                <Lock className="h-7 w-7" strokeWidth={2} />
                              ) : (
                                <Unlock className="h-7 w-7" strokeWidth={2} />
                              )}
                            </div>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ring-1 ${
                                locked
                                  ? "bg-red-500/15 text-red-200 ring-red-500/25"
                                  : "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-red-400 animate-pulse" : "bg-emerald-400"}`}
                              />
                              {locked ? "Locked" : "Unlocked"}
                            </span>
                          </div>

                          <h2 className="mt-5 text-lg font-bold leading-snug text-white sm:text-xl">{l.name}</h2>
                          {l.location ? (
                            <p className="mt-2 flex items-start gap-2 text-sm text-slate-400">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-500/70" strokeWidth={2} />
                              <span>{l.location}</span>
                            </p>
                          ) : null}
                          <p className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-1.5 font-mono text-[11px] text-sky-400/95">
                            {l.slug}
                          </p>

                          <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.06] pt-5">
                            <BatteryMeter level={l.batteryLevel} />
                            <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 transition group-hover:text-sky-400">
                              Live
                              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={2} />
                            </span>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="mt-14 text-center font-mono text-[10px] text-slate-600">
              API endpoint · <span className="text-slate-500">{getApiBase()}</span>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
