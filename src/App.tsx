import { useEffect, useState } from "react";
import { LockListScreen } from "./components/LockListScreen.js";
import { LiveLockScreen } from "./components/LiveLockScreen.js";

const baseUrl = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

function readSlugFromPath(): string | null {
  const path = window.location.pathname.replace(/\/+$/, "");
  const basePath = baseUrl.replace(/\/$/, "");
  const relative =
    basePath && path.startsWith(basePath)
      ? path.slice(basePath.length).replace(/^\//, "")
      : path.replace(/^\//, "");
  return relative ? decodeURIComponent(relative) : null;
}

function navigateToList(): void {
  window.history.pushState({}, "", baseUrl);
}

function navigateToDoor(slug: string): void {
  window.history.pushState({}, "", `${baseUrl}${encodeURIComponent(slug)}`);
}

export default function App() {
  const [slug, setSlug] = useState<string | null>(() => readSlugFromPath());

  useEffect(() => {
    const onPop = () => setSlug(readSlugFromPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (slug) {
    return (
      <LiveLockScreen
        lockSlug={slug}
        onBack={() => {
          navigateToList();
          setSlug(null);
        }}
      />
    );
  }

  return (
    <LockListScreen
      onOpenDoor={(s) => {
        navigateToDoor(s);
        setSlug(s);
      }}
    />
  );
}
