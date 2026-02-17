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
      apiKey: process.env.VITE_OPENROUTER_API_KEY,
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

    const completion = await client.chat.completions.create({
      model: "stepfun/step-3.5-flash:free",
      messages: [{role: "system", content: systemPrompt}, ...messages],
      stream: true,
    })

    // Set headers for SSE (Server-Sent Events)
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || ""
      if (content) {
        res.write(content)
      }
    }

    res.end()
  } catch (error) {
    console.error("Chat error:", error)
    res.status(500).json({message: "Error processing chat request"})
  }
}
