import { lazy, Suspense, useEffect } from "react";
import { createPortal } from "react-dom";

import useLiveCall from "../hooks/useLiveCall";
import { LIVE_CALL_EVENT } from "../constants";

// three.js loads only when a call actually starts
const AbstractBall = lazy(() => import("./AbstractBall"));

const TITLES = {
  idle: "Talk live to Zain's Agent",
  connecting: "Connecting…",
  live: "End call",
  error: "Call failed - tap to retry",
};

// Siri-style blob that starts/ends a Gemini Live voice call. While the call is
// active, a large morphing 3D ball pops up above the input bar and reacts to
// whoever is talking (visitor mic or agent audio).
const LiveCallBlob = () => {
  const { status, isSpeaking, startCall, endCall, getLevel } = useLiveCall();
  const isLive = status === "live";
  const showBall = isLive || status === "connecting";
  const title = TITLES[status];

  // Let the Hero button, ⌘K palette, or anything else start a call by dispatching LIVE_CALL_EVENT.
  // ponytail: only fires while this blob is mounted (home page, chat closed).
  useEffect(() => {
    const onStart = () => {
      if (status !== "live" && status !== "connecting") startCall();
    };
    window.addEventListener(LIVE_CALL_EVENT, onStart);
    return () => window.removeEventListener(LIVE_CALL_EVENT, onStart);
  }, [status, startCall]);

  return (
    <>
      <button
        type="button"
        onClick={isLive ? endCall : startCall}
        disabled={status === "connecting"}
        title={title}
        aria-label={title}
        data-live={isLive}
        data-speaking={isSpeaking}
        className="siri-blob relative ml-1.5 sm:ml-2 h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 disabled:cursor-wait"
      >
        <span className="siri-blob-layer siri-blob-a" />
        <span className="siri-blob-layer siri-blob-b" />
        <span className="siri-blob-layer siri-blob-c" />
        {status === "connecting" && (
          <span className="absolute inset-0 rounded-full border-2 border-purple-300/70 border-t-transparent animate-spin" />
        )}
        {status === "error" && (
          <span className="absolute inset-0 rounded-full ring-2 ring-inset ring-red-500/70" />
        )}
      </button>

      {showBall &&
        createPortal(
          <>
          {/* Invisible click shield: swallows accidental clicks on page content
              during the call. Transparent on purpose - the agent scrolls the page
              to show sections, so nothing may be dimmed or blurred. The input bar
              (z-50) stays above it, keeping the end-call blob clickable. */}
          <div className="fixed inset-0 z-40" aria-hidden="true" />
          <div className="pointer-events-none fixed inset-x-0 bottom-16 sm:bottom-24 z-40 flex flex-col items-center gap-1.5 sm:gap-2 px-4">
            {/* min() caps the ball on narrow phones so it never overflows the viewport */}
            <div className="voice-ball-pop h-[min(20rem,85vw)] w-[min(20rem,85vw)] sm:h-[32rem] sm:w-[32rem]">
              <Suspense fallback={null}>
                <AbstractBall getLevel={getLevel} />
              </Suspense>
            </div>
            <p className="text-xs text-neutral-400 tracking-wide">
              {isLive ? (isSpeaking ? "Zain's Agent is speaking…" : "Listening…") : "Connecting…"}
            </p>
          </div>
          </>,
          document.body,
        )}
    </>
  );
};

export default LiveCallBlob;
