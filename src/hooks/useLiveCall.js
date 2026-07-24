import { useCallback, useEffect, useRef, useState } from "react";

import { CONTACT, OPEN_CHAT_EVENT, PROJECTS } from "../constants";
import { downloadResume } from "../utils/downloadResume";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const MIC_RATE = 16000; // Gemini Live input: 16-bit PCM @ 16kHz
const SPEAKER_RATE = 24000; // Gemini Live output: 16-bit PCM @ 24kHz

const floatToPcm16Base64 = (float32) => {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

// Browser-side implementations of the tools declared in backend/controllers/liveController.js.
// The agent calls these mid-conversation ("let me show you his projects...").
const TOOL_HANDLERS = {
  navigate_to_section: ({ section }) => {
    const el = document.getElementById(section);
    if (!el) return { ok: false, error: `Section "${section}" not found on this page` };
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return { ok: true, shown: section };
  },
  download_resume: () => {
    downloadResume();
    return { ok: true };
  },
  open_project: ({ name, target }) => {
    const query = (name || "").toLowerCase();
    const project = PROJECTS.find((p) => p.title.toLowerCase().includes(query) || query.includes(p.title.toLowerCase()));
    if (!project) return { ok: false, error: `No project named "${name}"` };
    const url = target === "github" ? project.githubLink : project.liveLink || project.githubLink;
    if (!url) return { ok: false, error: `${project.title} has no ${target === "github" ? "GitHub" : "live"} link` };
    // window.open outside a click gesture can be popup-blocked; report it honestly
    // so the agent can point the visitor to the project card instead.
    if (!window.open(url, "_blank", "noopener")) {
      TOOL_HANDLERS.navigate_to_section({ section: "projects" });
      return { ok: false, error: "Popup blocked by the browser - scrolled to the projects section instead, tell the visitor to click the card" };
    }
    return { ok: true, opened: project.title, url };
  },
  copy_email: () => {
    navigator.clipboard?.writeText(CONTACT.email).catch(() => {});
    return { ok: true, email: CONTACT.email };
  },
  open_chat: () => {
    // Opening the chat unmounts the call UI, which ends the voice session -
    // that's the intended hand-off.
    window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT));
    return { ok: true };
  },
};

const base64ToFloat32 = (b64) => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;
  return float32;
};

// Live voice call to "Zain's Agent" via Gemini Live API. The backend mints a
// single-use ephemeral token with the model + persona locked server-side, then
// the browser streams mic audio directly to Gemini over WebSocket.
export default function useLiveCall() {
  const [status, setStatus] = useState("idle"); // idle | connecting | live | error
  const [isSpeaking, setIsSpeaking] = useState(false);
  const callRef = useRef({});
  const micLevelRef = useRef(0);

  // Current voice loudness 0..1 (louder of: visitor mic, agent playback).
  // Read per-frame by the call visualizer, so it's a plain function, not state.
  const getLevel = useCallback(() => {
    const { analyser, analyserData } = callRef.current;
    let agent = 0;
    if (analyser && analyserData) {
      analyser.getByteTimeDomainData(analyserData);
      let sum = 0;
      for (let i = 0; i < analyserData.length; i++) {
        const v = (analyserData[i] - 128) / 128;
        sum += v * v;
      }
      agent = Math.sqrt(sum / analyserData.length);
    }
    return Math.min(1, Math.max(micLevelRef.current, agent) * 3);
  }, []);

  const cleanup = useCallback(() => {
    const { session, stream, inCtx, outCtx, processor } = callRef.current;
    callRef.current = {};
    if (processor) processor.onaudioprocess = null;
    try {
      session?.close();
    } catch {
      /* already closed */
    }
    stream?.getTracks().forEach((t) => t.stop());
    inCtx?.close().catch(() => {});
    outCtx?.close().catch(() => {});
    micLevelRef.current = 0;
    setIsSpeaking(false);
  }, []);

  const endCall = useCallback(() => {
    cleanup();
    setStatus("idle");
  }, [cleanup]);

  // "Answer now": commit whatever the visitor has said so far so the agent
  // replies immediately instead of waiting for the VAD silence window. The mic
  // keeps streaming, which automatically reopens the audio stream after.
  const forceReply = useCallback(() => {
    try {
      callRef.current.session?.sendRealtimeInput({ audioStreamEnd: true });
    } catch {
      /* session closing - ignore */
    }
  }, []);

  useEffect(() => cleanup, [cleanup]); // release mic on unmount

  const startCall = useCallback(async () => {
    if (callRef.current.session) return;
    setStatus("connecting");
    try {
      // Everything that can run in parallel does: token mint, SDK chunk
      // (dynamic import keeps it out of the page bundle), and mic permission.
      const [{ GoogleGenAI, Modality }, stream, resp] = await Promise.all([
        import("@google/genai"),
        navigator.mediaDevices.getUserMedia({
          audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
        }),
        fetch(`${API_URL}/live/token`, { method: "POST" }),
      ]);
      if (!resp.ok) {
        const body = await resp.json().catch(() => null);
        throw new Error(body?.message || `Token request failed (${resp.status})`);
      }
      const { token, model, tools } = await resp.json();

      const outCtx = new AudioContext({ sampleRate: SPEAKER_RATE });
      // Contexts created after awaits may start "suspended" (the click gesture
      // has expired by then) - resume explicitly or the first call hears nothing.
      outCtx.resume().catch(() => {});
      // Agent audio routes through an analyser so the visualizer can read its level.
      const analyser = outCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.connect(outCtx.destination);
      const analyserData = new Uint8Array(analyser.fftSize);
      let nextStartTime = 0;
      const playing = new Set();

      const stopPlayback = () => {
        playing.forEach((src) => {
          try {
            src.stop();
          } catch {
            /* already stopped */
          }
        });
        playing.clear();
        nextStartTime = 0;
        setIsSpeaking(false);
      };

      const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: "v1alpha" } });
      const session = await ai.live.connect({
        model,
        // tools can't be locked into the ephemeral token (API limitation), so
        // they're passed here; persona/model stay locked server-side.
        config: { responseModalities: [Modality.AUDIO], tools },
        callbacks: {
          onmessage: (msg) => {
            // Agent invoked a page tool: run it and report the result back.
            if (msg.toolCall?.functionCalls?.length) {
              const functionResponses = msg.toolCall.functionCalls.map((fc) => ({
                id: fc.id,
                name: fc.name,
                response:
                  TOOL_HANDLERS[fc.name]?.(fc.args || {}) ?? { ok: false, error: `Unknown tool: ${fc.name}` },
              }));
              session.sendToolResponse({ functionResponses });
            }
            // Barge-in: user spoke over the model, drop queued audio.
            if (msg.serverContent?.interrupted) {
              stopPlayback();
              return;
            }
            for (const part of msg.serverContent?.modelTurn?.parts || []) {
              const data = part.inlineData?.data;
              if (!data) continue;
              const float32 = base64ToFloat32(data);
              const buffer = outCtx.createBuffer(1, float32.length, SPEAKER_RATE);
              buffer.getChannelData(0).set(float32);
              const src = outCtx.createBufferSource();
              src.buffer = buffer;
              src.connect(analyser);
              const startAt = Math.max(outCtx.currentTime, nextStartTime);
              src.start(startAt);
              nextStartTime = startAt + buffer.duration;
              playing.add(src);
              setIsSpeaking(true);
              src.onended = () => {
                playing.delete(src);
                if (playing.size === 0) setIsSpeaking(false);
              };
            }
          },
          onerror: (e) => {
            console.error("Live session error:", e);
            cleanup();
            setStatus("error");
          },
          onclose: () => {
            cleanup();
            setStatus((s) => (s === "error" ? s : "idle"));
          },
        },
      });

      // Mic -> 16kHz PCM16 -> Gemini.
      const inCtx = new AudioContext({ sampleRate: MIC_RATE });
      inCtx.resume().catch(() => {});
      const source = inCtx.createMediaStreamSource(stream);
      // ponytail: ScriptProcessor is deprecated but tiny; swap for an AudioWorklet if audio ever glitches
      // 1024 samples @16kHz = 64ms chunks -> mic audio reaches Gemini ~4x sooner than 4096
      const processor = inCtx.createScriptProcessor(1024, 1, 1);
      processor.onaudioprocess = (e) => {
        const samples = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i];
        micLevelRef.current = Math.sqrt(sum / samples.length);
        session.sendRealtimeInput({
          audio: {
            data: floatToPcm16Base64(samples),
            mimeType: `audio/pcm;rate=${MIC_RATE}`,
          },
        });
      };
      source.connect(processor);
      processor.connect(inCtx.destination); // silent sink; required for onaudioprocess to fire

      callRef.current = { session, stream, inCtx, outCtx, processor, analyser, analyserData };
      setStatus("live");
    } catch (err) {
      console.error("Live call failed:", err);
      cleanup();
      setStatus("error");
    }
  }, [cleanup]);

  return { status, isSpeaking, startCall, endCall, forceReply, getLevel };
}
