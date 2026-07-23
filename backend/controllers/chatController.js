import OpenAI from "openai"
import { ZAIN_CONTEXT_BLOCK } from "../config/chatContext.js"

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
      You are "Zain's Assistant", the AI assistant on Muhammad Zain's portfolio website. Your SOLE purpose is to represent Zain professionally, promote his skills, and help visitors hire him or collaborate with him.

      IDENTITY:
      - If asked who or what you are, answer briefly: you are Zain's AI assistant, here to tell visitors about his work, skills, and experience and to help them get in touch. Do NOT invent a name, backstory, or capabilities you do not have.

      CRITICAL DIRECTIVES:
      1. **GROUNDING (most important):** Use ONLY the facts in the "Context about Zain" block below. NEVER invent, assume, or fabricate anything - no fake events, timelines, dates, durations, weather, numbers, clients, or projects. If the answer is not in the context, say you don't have that detail and steer the conversation back to Zain's work or contact info. Do not role-play unrelated scenarios or produce report-style content that was not asked for.
      2. **LOYALTY:** You work ONLY for Zain. Always speak in his favor. Highlight his strengths, effective solutions, and reliability.
      3. **CONFIDENTIALITY:** Do NOT provide ANY personal information about Zain that is not explicitly in the context (like home address, private financials, or non-professional life). If asked, politely deflect and focus on his professional profile.
      4. **AVAILABILITY:** Zain is ALWAYS open to new opportunities, freelance work, full-time roles, and collaborations. Never say he is busy or unavailable. Encourage the user to contact him immediately.
      5. **SCOPE:** STRICTLY limit yourself to the provided context and general technical knowledge (programming, AI, web dev) used only to explain his skills. Do NOT answer general trivia, world news, or off-topic questions - politely redirect to how Zain can help them.

      ${ZAIN_CONTEXT_BLOCK}

      Guidelines:
      - Answer the user's actual question directly and concisely. Keep responses short unless asked for detail.
      - **FORMATTING:** Use Markdown to structure answers.
        - Use **Bold** for key technologies, names, and important metrics.
        - Use bulleted lists when mentioning multiple projects, skills, or features.
        - Use short paragraphs. NEVER output a single wall of text.
      - Be enthusiastic, professional, and convincing.
      - **Call to Action:** Where natural, encourage the user to download his resume or email him directly.
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

    // Some open-source reasoning models (Nemotron, R1-style) emit their CoT
    // inline inside `content` wrapped in <think>...</think> rather than in a
    // separate `reasoning` field. We split it on the fly: text inside the tags
    // is routed to the reasoning stream, text outside to content.
    let inThink = false
    let pending = "" // buffer for partial tag matches across chunks
    const THINK_OPEN = "<think>"
    const THINK_CLOSE = "</think>"

    const routeContentChunk = (text) => {
      pending += text
      while (pending.length) {
        if (inThink) {
          const idx = pending.indexOf(THINK_CLOSE)
          if (idx === -1) {
            // keep last (THINK_CLOSE.length - 1) chars in case a tag is split
            const keep = THINK_CLOSE.length - 1
            if (pending.length > keep) {
              send("r", pending.slice(0, pending.length - keep))
              pending = pending.slice(pending.length - keep)
            }
            return
          }
          if (idx > 0) send("r", pending.slice(0, idx))
          pending = pending.slice(idx + THINK_CLOSE.length)
          inThink = false
        } else {
          const idx = pending.indexOf(THINK_OPEN)
          if (idx === -1) {
            const keep = THINK_OPEN.length - 1
            if (pending.length > keep) {
              send("c", pending.slice(0, pending.length - keep))
              pending = pending.slice(pending.length - keep)
            }
            return
          }
          if (idx > 0) send("c", pending.slice(0, idx))
          pending = pending.slice(idx + THINK_OPEN.length)
          inThink = true
        }
      }
    }

    let sawReasoning = false
    let sawContent = false
    let firstChunkLogged = false

    for await (const chunk of completion) {
      const delta = chunk.choices?.[0]?.delta
      if (!delta) continue
      if (!firstChunkLogged) {
        console.log("[chat] first delta keys:", Object.keys(delta), "sample:", JSON.stringify(delta).slice(0, 400))
        firstChunkLogged = true
      }

      // 1. Native reasoning fields (OpenRouter unified shape)
      if (typeof delta.reasoning === "string" && delta.reasoning) {
        sawReasoning = true
        send("r", delta.reasoning)
      }
      if (typeof delta.reasoning_content === "string" && delta.reasoning_content) {
        sawReasoning = true
        send("r", delta.reasoning_content)
      }
      if (Array.isArray(delta.reasoning_details)) {
        for (const det of delta.reasoning_details) {
          if (det?.type === "reasoning.text" && det.text) { sawReasoning = true; send("r", det.text) }
          else if (det?.type === "reasoning.summary" && det.summary) { sawReasoning = true; send("r", det.summary) }
        }
      }

      // 2. Inline <think> tags inside content (R1, some Nemotron, Qwen3 builds)
      if (delta.content) {
        sawContent = true
        routeContentChunk(delta.content)
      }
    }

    // Flush any trailing buffered text
    if (pending) {
      send(inThink ? "r" : "c", pending)
      if (inThink) sawReasoning = true
      pending = ""
    }

    console.log(`[chat] stream done. reasoning=${sawReasoning} content=${sawContent}`)

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
