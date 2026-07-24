import { GoogleGenAI } from "@google/genai"
import { PROJECTS, ZAIN_CONTEXT_BLOCK } from "../config/chatContext.js"

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
6. PAGE CONTROL: You can control the portfolio page the visitor is looking at. Use tools naturally mid-conversation - say what you're doing ("let me show you..."):
   - navigate_to_section: scroll them to a section while discussing it (work history -> "experience", his apps -> "projects").
   - open_project: open a project's live demo or GitHub repo in a new tab when they want to see or try it.
   - download_resume: download his resume PDF when they ask for his resume or CV.
   - copy_email: copy his email to their clipboard when they want to reach out.
   - open_chat: switch them to the text chat (note: this ends the voice call - confirm before doing it).
7. CAPABILITIES: If asked what you can do, list it plainly: answer anything about Zain's skills, projects, and experience; scroll the page to any section; open his project demos or GitHub; download his resume; copy his email; and switch to text chat.

${ZAIN_CONTEXT_BLOCK}
`

// Tools the browser executes when the agent calls them (see useLiveCall.js).
// Note: the Live API's token field mask can't lock `tools`, so these are
// returned to the client and passed at connect time instead. Harmless - the
// tools run in the visitor's own browser anyway.
const AGENT_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "navigate_to_section",
        description:
          "Scroll the visitor's page to a section of Zain's portfolio. Call this while talking about that topic.",
        parameters: {
          type: "OBJECT",
          properties: {
            section: {
              type: "STRING",
              enum: ["about", "technologies", "experience", "projects", "certificates", "contact"],
              description: "The portfolio section to show",
            },
          },
          required: ["section"],
        },
      },
      {
        name: "download_resume",
        description:
          "Download Zain's resume PDF to the visitor's device. Call when they ask for his resume or CV.",
      },
      {
        name: "open_project",
        description:
          "Open one of Zain's projects in a new browser tab - the live demo by default, or the GitHub repo.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: {
              type: "STRING",
              enum: PROJECTS.map((p) => p.title),
              description: "The project to open",
            },
            target: {
              type: "STRING",
              enum: ["live", "github"],
              description: "Open the live demo (default) or the GitHub repo",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "copy_email",
        description:
          "Copy Zain's email address to the visitor's clipboard. Call when they want to contact him.",
      },
      {
        name: "open_chat",
        description:
          "Switch the visitor to the text chatbot. WARNING: this ends the voice call - confirm with the visitor first.",
      },
    ],
  },
]

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
            // wait 150ms of silence before replying (default is ~1s). If the
            // agent starts cutting people off mid-pause, raise this first.
            realtimeInputConfig: {
              automaticActivityDetection: {
                startOfSpeechSensitivity: "START_SENSITIVITY_HIGH",
                endOfSpeechSensitivity: "END_SENSITIVITY_HIGH",
                prefixPaddingMs: 20,
                silenceDurationMs: 150,
              },
            },
          },
        },
        // Empty array = lock exactly the fields set above (persona + modality).
        lockAdditionalFields: [],
      },
    })

    res.json({ token: token.name, model: LIVE_MODEL, tools: AGENT_TOOLS })
  } catch (error) {
    console.error("Live token error:", error)
    res.status(error?.status || 500).json({
      message: error?.message || "Failed to create live session token",
    })
  }
}
