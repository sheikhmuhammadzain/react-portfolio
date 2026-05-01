import OpenAI from "openai"
import {
  HERO_CONTENT,
  ABOUT_TEXT,
  EXPERIENCES,
  PROJECTS,
  CONTACT,
} from "../config/chatContext.js"

// @desc    Handle chat interaction
// @route   POST /api/chat
// @access  Public
export const handleChat = async (req, res) => {
  const {messages} = req.body

  if (!messages) {
    res.status(400).json({message: "Messages are required"})
    return
  }

  try {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        // OpenRouter uses these for app attribution + free-tier ranking.
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "https://zainafzal.dev",
        "X-Title": process.env.OPENROUTER_SITE_NAME || "Muhammad Zain Afzal Portfolio",
      },
    })

    const systemPrompt = `
      You are an advanced AI assistant for Muhammad Zain's portfolio website. Your SOLE purpose is to represent Zain professionally, promote his skills, and help visitors hire him or collaborate with him.

      CRITICAL DIRECTIVES:
      1. **LOYALTY:** You work ONLY for Zain. Always speak in his favor. Highlight his strengths, effective solutions, and reliability.
      2. **CONFIDENTIALITY:** Do NOT provide ANY personal information about Zain that is not explicitly in the context (like home address, private financials, or non-professional life). If asked, politely deflect and focus on his professional profile.
      3. **AVAILABILITY:** Zain is ALWAYS open to new opportunities, freelance work, full-time roles, and collaborations. Never say he is busy or unavailable. Encourage the user to contact him immediately.
      4. **SCOPE:** STRICTLY limit your knowledge to the provided context and general technical knowledge (programming, AI, web dev) to explain his skills. Do NOT answer general trivia, world news, or off-topic questions unless they relate to hiring Zain.

      Context about Zain:
      - Role: ${HERO_CONTENT}
      - About: ${ABOUT_TEXT}
      - Experience: ${JSON.stringify(EXPERIENCES)}
      - Projects: ${JSON.stringify(PROJECTS)}
      - Contact: ${JSON.stringify(CONTACT)}

      Guidelines:
      - **FORMATTING IS CRITICAL:** You MUST use Markdown to structure your answers.
        - Use **Bold** for key technologies, names, and important metrics.
        - Use **Bulleted Lists** when mentioning multiple projects, skills, or features.
        - Use **paragraphs** to break up text. NEVER output a single wall of text.
      - Be enthusiastic, professional, and convincing.
      - **Call to Action:** Regularly encourage the user to download his resume or email him directly.
    `

    // OpenRouter free models (suffix `:free`). If the primary is throttled or
    // unavailable, fall back to a different free model with separate quotas.
    const PRIMARY_MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3.1:free"
    const FALLBACK_MODEL = process.env.OPENROUTER_FALLBACK_MODEL || "meta-llama/llama-3.3-70b-instruct:free"

    // Reasoning config — OpenRouter unified shape. Effort comes from env so
    // it's tunable without a code change. Set OPENROUTER_REASONING_EFFORT to
    // "none" to disable reasoning entirely on supported models.
    const reasoningEffort = process.env.OPENROUTER_REASONING_EFFORT || "low"
    const reasoning = reasoningEffort === "none" ? undefined : { effort: reasoningEffort }

    const createCompletion = (model) =>
      client.chat.completions.create({
        model,
        messages: [{role: "system", content: systemPrompt}, ...messages],
        stream: true,
        ...(reasoning && { reasoning }),
      })

    let completion
    try {
      completion = await createCompletion(PRIMARY_MODEL)
    } catch (err) {
      if (err?.status === 429) {
        console.warn(`Primary model ${PRIMARY_MODEL} rate-limited, falling back to ${FALLBACK_MODEL}`)
        completion = await createCompletion(FALLBACK_MODEL)
      } else {
        throw err
      }
    }

    // Stream as newline-delimited JSON (NDJSON). Each line is one event:
    //   {"t":"r","d":"<reasoning delta>"}  reasoning token
    //   {"t":"c","d":"<content delta>"}    visible content token
    // The client splits on "\n" and dispatches by event type. NDJSON is simpler
    // than SSE framing and survives partial chunks (the client buffers the
    // trailing partial line until the next read).
    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8")
    res.setHeader("Cache-Control", "no-cache, no-transform")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no") // disable proxy buffering

    const send = (type, delta) => {
      if (!delta) return
      res.write(JSON.stringify({ t: type, d: delta }) + "\n")
    }

    for await (const chunk of completion) {
      const delta = chunk.choices?.[0]?.delta
      if (!delta) continue
      // OpenRouter exposes reasoning either as a flat `reasoning` string delta
      // or inside `reasoning_details[].text`. Handle both shapes.
      if (typeof delta.reasoning === "string") send("r", delta.reasoning)
      if (Array.isArray(delta.reasoning_details)) {
        for (const det of delta.reasoning_details) {
          if (det?.type === "reasoning.text" && det.text) send("r", det.text)
          else if (det?.type === "reasoning.summary" && det.summary) send("r", det.summary)
        }
      }
      if (delta.content) send("c", delta.content)
    }

    res.end()
  } catch (error) {
    console.error("Chat error:", error)

    // If the response was already started (streaming), we can't change status.
    if (res.headersSent) {
      res.end()
      return
    }

    // Surface upstream rate-limit status so the client can react properly.
    if (error?.status === 429) {
      const retryAfter = error?.headers?.get?.("retry-after") || "30"
      res.setHeader("Retry-After", retryAfter)
      res.status(429).json({
        message: "The AI service is temporarily rate-limited. Please try again in a moment.",
        retryAfter: Number(retryAfter),
      })
      return
    }

    res.status(error?.status || 500).json({
      message: error?.message || "Error processing chat request",
    })
  }
}
