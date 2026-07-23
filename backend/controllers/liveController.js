import { GoogleGenAI } from "@google/genai"
import { ZAIN_CONTEXT_BLOCK } from "../config/chatContext.js"

// Free-tier native-audio live model; override via env if Google renames it.
const LIVE_MODEL = process.env.GEMINI_LIVE_MODEL || "gemini-2.5-flash-native-audio-preview-12-2025"

const VOICE_SYSTEM_PROMPT = `
You are "Zain's Agent", the live VOICE assistant on Muhammad Zain Afzal's portfolio website. You are speaking out loud with a visitor in real time.

CRITICAL DIRECTIVES:
1. LOYALTY: You work ONLY for Zain. Always speak in his favor. Highlight his strengths, shipped products, and reliability. Never criticize him or compare him unfavorably to anyone.
2. SCOPE: ONLY discuss Zain - his skills, projects, experience, and how to hire or collaborate with him. For anything off-topic (news, trivia, other people, general help), politely steer the conversation back to Zain in one short sentence.
3. CONFIDENTIALITY: Never share personal details beyond the professional context below.
4. AVAILABILITY: Zain is always open to opportunities, freelance work, and collaborations. Encourage the visitor to email him at zain@zainafzal.dev.
5. VOICE STYLE: This is spoken conversation. Keep answers short and natural - 1 to 3 sentences unless the visitor asks for detail. No markdown, no lists, no code. Be warm, confident, and enthusiastic.

${ZAIN_CONTEXT_BLOCK}
`

// @desc    Mint a single-use ephemeral token for a Gemini Live voice session.
//          Model + persona are locked server-side so the browser cannot
//          change what the agent is allowed to talk about.
// @route   POST /api/live/token
// @access  Public
export const createLiveToken = async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    res.status(503).json({ message: "Voice calling is not configured (missing GEMINI_API_KEY)" })
    return
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { apiVersion: "v1alpha" },
    })

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: LIVE_MODEL,
          config: {
            responseModalities: ["AUDIO"],
            systemInstruction: VOICE_SYSTEM_PROMPT,
            // Deep male prebuilt voice; see https://ai.google.dev/gemini-api/docs/speech-generation#voices
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: process.env.GEMINI_LIVE_VOICE || "Charon" },
              },
            },
            // Native-audio models think before speaking by default; disabling
            // thinking cuts response latency substantially for chit-chat.
            thinkingConfig: { thinkingBudget: 0 },
            // Snappy turn-taking: detect end of speech aggressively and only
            // wait 250ms of silence before replying (default is ~1s).
            realtimeInputConfig: {
              automaticActivityDetection: {
                startOfSpeechSensitivity: "START_SENSITIVITY_HIGH",
                endOfSpeechSensitivity: "END_SENSITIVITY_HIGH",
                prefixPaddingMs: 20,
                silenceDurationMs: 250,
              },
            },
          },
        },
        // Empty array = lock exactly the fields set above (persona + modality).
        lockAdditionalFields: [],
      },
    })

    res.json({ token: token.name, model: LIVE_MODEL })
  } catch (error) {
    console.error("Live token error:", error)
    res.status(error?.status || 500).json({
      message: error?.message || "Failed to create live session token",
    })
  }
}
