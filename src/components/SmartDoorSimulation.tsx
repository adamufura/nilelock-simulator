import { Bluetooth, Lock, Unlock, Wifi } from "lucide-react";

/** Contactless / NFC waves (inline SVG). */
function NfcWaves({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden>
      <path
        d="M28 38c-4.5 0-8-3.5-8-8s3.5-8 8-8 8 3.5 8 8-3.5 8-8 8z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        opacity={0.9}
      />
      <path
        d="M20 30a8 8 0 0 1 16 0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.65}
      />
      <path
        d="M14 30c0-7.7 6.3-14 14-14s14 6.3 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.45}
      />
      <path
        d="M8 30c0-11 9-20 20-20s20 9 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.28}
      />
    </svg>
  );
}

type Props = {
  locked: boolean;
  /** Socket connected — subtle “scanning” pulse on reader */
  live: boolean;
  /** Optional class on outer wrapper (e.g. max height in a flex layout). */
  className?: string;
};

export function SmartDoorSimulation({ locked, live, className = "" }: Props) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[min(100%,20rem)] select-none ${className}`}
      style={{ perspective: "1400px" }}
      role="img"
      aria-label={
        locked
          ? live
            ? "Door simulation: closed and locked; listening for live updates"
            : "Door simulation: closed and locked"
          : "Door simulation: ajar, unlocked"
      }
    >
      <div
        className="relative mx-auto w-full max-h-[min(48dvh,34rem)] lg:max-h-[min(62dvh,36rem)]"
        style={{ aspectRatio: "9 / 20" }}
      >
        {/* Outer frame — brushed metal */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-zinc-500 via-zinc-700 to-zinc-900 p-[10px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/10">
          {/* Screw heads (decorative) */}
          <div className="absolute left-2 top-3 h-1.5 w-1.5 rounded-full bg-zinc-900/60 shadow-inner" />
          <div className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-zinc-900/60 shadow-inner" />
          <div className="absolute left-2 bottom-3 h-1.5 w-1.5 rounded-full bg-zinc-900/60 shadow-inner" />
          <div className="absolute right-2 bottom-3 h-1.5 w-1.5 rounded-full bg-zinc-900/60 shadow-inner" />

          <div className="relative h-full w-full overflow-visible rounded-xl bg-gradient-to-b from-zinc-950 to-black p-1">
            {/* Jamb shadow */}
            <div className="pointer-events-none absolute inset-1 rounded-lg bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.08),transparent_55%)]" />

            {/* Warm light leak when door is ajar — stronger + pulses when unlocked */}
            <div
              className={`pointer-events-none absolute left-[96%] top-[10%] z-0 h-[80%] w-8 -translate-x-1/2 rounded-full blur-xl transition-opacity duration-700 ease-out motion-reduce:animate-none ${
                locked ? "opacity-0" : "animate-crack-glow opacity-100"
              }`}
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(253, 230, 138, 0.55), rgba(255, 251, 235, 0.85), rgba(253, 230, 138, 0.5))",
              }}
            />

            <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
              {/* Door leaf — when live+locked: subtle hinge “listening” sway; unlocked: wider swing */}
              <div
                className={`absolute inset-0 origin-left rounded-lg shadow-[inset_0_0_40px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  locked && live ? "animate-door-listen motion-reduce:animate-none" : ""
                }`}
                style={{
                  ...(locked && live
                    ? {}
                    : { transform: locked ? "rotateY(0deg)" : "rotateY(-22deg)" }),
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  background: `
                    linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 42%),
                    linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.2) 100%),
                    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px),
                    linear-gradient(165deg, #475569 0%, #334155 22%, #1e293b 55%, #0f172a 100%)
                  `,
                  boxShadow: locked
                    ? "inset 0 1px 0 rgba(255,255,255,0.06), 12px 0 28px rgba(0,0,0,0.45)"
                    : "inset 0 1px 0 rgba(255,255,255,0.08), 28px 12px 48px rgba(0,0,0,0.55)",
                }}
              >
                {/* Vertical lever handle */}
                <div className="absolute right-[10%] top-1/2 z-10 h-[28%] w-2.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-600 shadow-[2px_0_8px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-black/40" />

                {/* Status LED strip — shimmer when live */}
                <div className="absolute left-1/2 top-[14%] z-10 w-[80%] -translate-x-1/2">
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-black/50 ring-1 ring-white/5">
                    <div
                      className={`h-full flex-1 transition-all duration-500 ${
                        live
                          ? locked
                            ? "animate-led-flow bg-[length:220%_100%] bg-gradient-to-r from-red-600 via-red-400 to-red-600"
                            : "animate-led-flow bg-[length:220%_100%] bg-gradient-to-r from-emerald-600 via-teal-300 to-emerald-600"
                          : locked
                            ? "bg-red-500 shadow-[0_0_16px_rgba(239,68,68,0.65)]"
                            : "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.65)]"
                      }`}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    {locked ? (
                      <Lock className="h-3 w-3 text-red-300/90" strokeWidth={2.5} />
                    ) : (
                      <Unlock className="h-3 w-3 text-emerald-300/90" strokeWidth={2.5} />
                    )}
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {locked ? "Secure" : "Access granted"}
                    </span>
                    {live ? (
                      <span className="ml-1 flex items-center gap-0.5" aria-hidden>
                        <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_6px_cyan]" />
                        <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_6px_cyan] [animation-delay:200ms]" />
                        <span className="h-1 w-1 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_6px_cyan] [animation-delay:400ms]" />
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Smart reader module */}
                <div className="absolute left-1/2 top-[32%] z-10 w-[78%] -translate-x-1/2">
                  <div
                    className={`relative overflow-hidden rounded-2xl border border-white/[0.12] bg-gradient-to-b from-zinc-950/98 via-zinc-900/95 to-black/95 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_12px_28px_rgba(0,0,0,0.5)] backdrop-blur-sm motion-reduce:shadow-none ${
                      live
                        ? "animate-live-ring ring-1 ring-cyan-500/35 motion-reduce:animate-none motion-reduce:ring-0"
                        : "ring-1 ring-white/[0.06]"
                    }`}
                  >
                    {/* Sweeping scan beam (live) or soft standby glow */}
                    {live ? (
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-7 bg-gradient-to-b from-cyan-300/70 via-cyan-400/35 to-transparent opacity-90 blur-[1px] motion-reduce:hidden motion-reduce:opacity-0 animate-reader-scan"
                        aria-hidden
                      />
                    ) : (
                      <div
                        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(56,189,248,0.08),transparent_55%)] motion-reduce:opacity-50 animate-standby-pulse"
                        aria-hidden
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <Wifi
                          className={`h-4 w-4 text-cyan-400 ${live ? "motion-reduce:opacity-100 animate-pulse" : "opacity-55"}`}
                          strokeWidth={2}
                        />
                        <Bluetooth
                          className={`h-4 w-4 text-sky-400 ${live ? "motion-reduce:opacity-100 animate-pulse [animation-delay:180ms]" : "opacity-55"}`}
                        />
                      </div>
                      <span className="text-[8px] font-semibold uppercase tracking-widest text-white/35">NileLock</span>
                    </div>

                    <div className="relative z-10 mt-3 flex flex-col items-center">
                      <div
                        className={
                          live
                            ? "motion-reduce:scale-100 animate-nfc-breathe text-cyan-300"
                            : "text-cyan-400/55 animate-standby-pulse"
                        }
                      >
                        <NfcWaves className="h-14 w-14" />
                      </div>
                      <div
                        className={`mt-2 h-1 w-[70%] rounded-full bg-gradient-to-r from-transparent to-transparent ${
                          live
                            ? "via-cyan-400/70 shadow-[0_0_12px_rgba(34,211,238,0.45)] motion-reduce:shadow-none animate-pulse"
                            : "via-cyan-400/25"
                        }`}
                      />
                      <div
                        className={`absolute bottom-9 left-1/2 z-10 h-8 w-[76%] -translate-x-1/2 rounded-full blur-lg motion-reduce:opacity-40 ${
                          live ? "bg-cyan-400/35 animate-pulse" : "bg-cyan-500/10"
                        }`}
                        aria-hidden
                      />
                      <p className="relative z-10 mt-3 text-center text-[8px] font-medium uppercase leading-tight tracking-wider text-white/35">
                        Card · Phone NFC · BLE
                      </p>
                      {live ? (
                        <p className="relative z-10 mt-1.5 text-center text-[7px] font-semibold uppercase tracking-[0.18em] text-cyan-400/80 motion-reduce:opacity-90">
                          <span className="inline-flex items-center gap-1">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60 motion-reduce:animate-none" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            </span>
                            Linked · listening
                          </span>
                        </p>
                      ) : (
                        <p className="relative z-10 mt-1.5 text-center text-[7px] uppercase tracking-wider text-white/28">
                          Waiting for network…
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom kick plate */}
                <div className="absolute bottom-0 left-0 right-0 h-[12%] rounded-b-lg bg-gradient-to-t from-black/55 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
