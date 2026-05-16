import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Battery, BatteryLow, Users } from "lucide-react";
import { connectPublicSocket, disconnectPublicSocket, getApiBase } from "../lib/socket.js";
import { SmartDoorSimulation } from "./SmartDoorSimulation.js";

type PublicLockDetail = {
  slug: string;
  name: string;
  location: string;
  state: string;
  batteryLevel: number;
  updatedAt?: string;
  owners: { id: string; fullName: string; email: string }[];
};

type Props = {
  lockSlug: string;
  onBack: () => void;
};

function initials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "?";
  const a = p[0][0] ?? "";
  const b = p.length > 1 ? (p[p.length - 1][0] ?? "") : "";
  return (a + b).toUpperCase();
}

export function LiveLockScreen({ lockSlug, onBack }: Props) {
  const [detail, setDetail] = useState<PublicLockDetail | null>(null);
  const [locked, setLocked] = useState(true);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [connectError, setConnectError] = useState("");
  const [loadError, setLoadError] = useState("");

  const pathSeg = encodeURIComponent(lockSlug);

  const fetchMeta = useCallback(async () => {
    const res = await fetch(`${getApiBase()}/api/public/locks/${pathSeg}`);
    if (!res.ok) {
      setLoadError(res.status === 404 ? "Door not found." : "Could not load door.");
      setDetail(null);
      return;
    }
    const data = (await res.json()) as { lock?: PublicLockDetail };
    const L = data.lock;
    if (!L) {
      setLoadError("Invalid response");
      return;
    }
    setLoadError("");
    setDetail(L);
    if (L.state === "locked" || L.state === "unlocked") {
      setLocked(L.state === "locked");
    }
    if (L.updatedAt) setLastUpdated(L.updatedAt);
  }, [pathSeg]);

  useEffect(() => {
    void fetchMeta();
  }, [fetchMeta]);

  useEffect(() => {
    const socket = connectPublicSocket();

    const joinLock = () => {
      socket.emit("lock:subscribe", lockSlug, () => {});
    };

    const onState = (payload: { lockId?: string; state?: string; updatedAt?: string }) => {
      if (payload.lockId !== lockSlug) return;
      if (payload.state === "locked" || payload.state === "unlocked") {
        setLocked(payload.state === "locked");
        setLastUpdated(payload.updatedAt ?? new Date().toISOString());
      }
    };

    const onConnect = () => {
      setConnected(true);
      setConnectError("");
      joinLock();
    };

    const onDisconnect = () => setConnected(false);
    const onConnectError = (err: unknown) => {
      setConnectError(err instanceof Error ? err.message : "Connection failed");
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("lock:state", onState);
    socket.on("reconnect", joinLock);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("lock:state", onState);
      socket.off("reconnect", joinLock);
      disconnectPublicSocket();
    };
  }, [lockSlug]);

  if (loadError && !detail) {
    return (
      <div className="flex h-dvh min-h-0 flex-col items-center justify-center bg-[#060912] p-6 text-white">
        <p className="mb-6 max-w-sm text-center text-red-300/90">{loadError}</p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          All doors
        </button>
      </div>
    );
  }

  const bat = detail?.batteryLevel ?? 0;
  const batLow = bat <= 20;
  const owners = detail?.owners ?? [];

  const statusBlock = (
    <div className="w-full max-w-md shrink-0 px-4 text-center">
      <p
        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] ring-1 ${
          locked
            ? "bg-red-500/15 text-red-200 ring-red-500/30"
            : "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${locked ? "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" : "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"}`}
        />
        {locked ? "Locked" : "Unlocked"}
      </p>
      <h2 className="mt-3 text-lg font-bold text-white sm:mt-4 sm:text-xl">{detail?.name || "—"}</h2>
      {detail?.location ? <p className="mt-1 text-sm text-slate-400">{detail.location}</p> : null}
    </div>
  );

  const residentsAside = owners.length > 0 && (
    <aside className="hidden min-h-0 w-[min(100%,17.5rem)] shrink-0 flex-col border-l border-white/[0.08] bg-black/30 lg:flex lg:w-72">
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
        <p className="mb-3 flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/45">
          <Users className="h-3.5 w-3.5 shrink-0 text-sky-400/80" />
          Assigned ({owners.length})
        </p>
        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 text-sm">
          {owners.map((o) => (
            <li
              key={o.id}
              className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5 text-white/90"
            >
              <span className="font-semibold text-white">{o.fullName}</span>
              <span className="mt-0.5 block truncate font-mono text-[11px] text-white/45" title={o.email}>
                {o.email}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 shrink-0 border-t border-white/[0.06] pt-3 text-[10px] leading-relaxed text-white/38">
          Lock or unlock from the NileLock app while signed in as one of these accounts.
        </p>
      </div>
    </aside>
  );

  const residentsMobileRail = owners.length > 0 && (
    <div className="shrink-0 border-t border-white/[0.08] bg-black/35 px-3 py-2.5 lg:hidden">
      <p className="mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-white/40">
        <Users className="h-3 w-3 text-sky-400/70" />
        Assigned · swipe
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {owners.map((o) => (
          <div
            key={o.id}
            className="flex min-w-[9.5rem] max-w-[11rem] shrink-0 gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-2.5 py-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/40 to-indigo-600/50 text-[11px] font-bold text-white ring-1 ring-white/10">
              {initials(o.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{o.fullName}</p>
              <p className="truncate font-mono text-[10px] text-white/45" title={o.email}>
                {o.email}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] text-white/35">Use NileLock app as a listed resident.</p>
    </div>
  );

  return (
    <div className="relative h-dvh min-h-0 overflow-hidden text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[#060912]" />
      <div className="pointer-events-none fixed inset-0">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${locked ? "opacity-100" : "opacity-70"}`}
          style={{
            background: locked
              ? "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(127, 29, 29, 0.22), transparent 60%)"
              : "radial-gradient(ellipse 70% 50% at 50% 15%, rgba(6, 95, 70, 0.2), transparent 58%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(15,23,42,0.95),transparent)]" />
      </div>

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-2.5 backdrop-blur-md sm:px-5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            All doors
          </button>
          <span className="truncate font-mono text-xs text-sky-400/90 tabular-nums" title={lockSlug}>
            {lockSlug}
          </span>
        </header>

        {connectError ? (
          <p className="shrink-0 border-b border-amber-500/20 bg-amber-950/35 px-4 py-2 text-center font-mono text-[11px] text-amber-100/95">
            {connectError}
          </p>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
          {/* Door + title — uses remaining height, scroll only if ultra-small */}
          <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto overflow-x-hidden lg:min-w-0 lg:overflow-hidden">
            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 px-4 pb-2 pt-3 sm:gap-4 sm:pt-4 lg:py-6">
              <SmartDoorSimulation locked={locked} live={connected} />
              {statusBlock}
            </div>
            {residentsMobileRail}
          </div>

          {residentsAside}
        </div>

        <footer className="shrink-0 border-t border-white/[0.08] bg-[#0a0f1a]/95 backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 font-mono text-[11px] text-white/85 sm:px-5">
            <span className="max-w-[38%] truncate" title={lockSlug}>
              {lockSlug}
            </span>
            <span className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${connected ? "animate-pulse bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" : "bg-slate-500"}`}
              />
              {connected ? "Live" : "Offline"}
            </span>
            <span className="text-white/55 tabular-nums">
              {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
            </span>
          </div>
          {detail ? (
            <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] px-4 py-2 text-[11px] text-white/50">
              {batLow ? (
                <BatteryLow className="h-3.5 w-3.5 text-amber-400/90" />
              ) : (
                <Battery className="h-3.5 w-3.5 text-white/35" />
              )}
              <span>
                Battery · <span className="tabular-nums text-white/70">{detail.batteryLevel}%</span>
              </span>
            </div>
          ) : null}
        </footer>
      </div>
    </div>
  );
}
