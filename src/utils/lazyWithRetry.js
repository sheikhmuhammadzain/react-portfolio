import { lazy } from "react";

const RELOAD_FLAG = "chunk-reload";

// Drop-in replacement for React.lazy that survives a failed dynamic import.
// A lazy chunk can fail to load on a flaky mobile connection, or after a new
// deploy when the cached index.html still points at old hashed chunk URLs that
// no longer exist. Left unhandled that renders a blank page until the user
// manually refreshes. Here we force one automatic reload (guarded so it can't
// loop) to fetch fresh HTML + chunks, which is exactly what a manual refresh does.
export function lazyWithRetry(factory) {
  return lazy(async () => {
    try {
      const mod = await factory();
      sessionStorage.removeItem(RELOAD_FLAG); // recovered - allow future reloads
      return mod;
    } catch (error) {
      if (!sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
        return new Promise(() => {}); // hang until the reload takes over
      }
      throw error; // already reloaded once - let the error boundary show a fallback
    }
  });
}
