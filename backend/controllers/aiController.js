import OpenAI from 'openai';

// @desc    Generate blog content using AI
// @route   POST /api/ai/generate
// @access  Public (protected by client-side admin check, but good to add middleware if possible)
export const generateBlogContent = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    res.status(400).json({ message: 'Topic is required' });
    return;
  }

  try {
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.VITE_OPENROUTER_API_KEY, // Keeping consistent with chatController
    });

    const systemPrompt = `
      You are an expert technical blog writer for a developer portfolio.
      Your task is to write a high-quality, engaging, and educational blog post based on the user's topic.
      
      Return the response in strictly valid JSON format with the following structure:
      {
        "title": "A catchy, SEO-friendly title",
        "content": "The full blog post content in Markdown format. Use h2, h3, code blocks, and lists.",
        "tags": "comma, separated, tags, relevant, to, topic",
        "summary": "A short summary (2-3 sentences) for the card preview."
      }
      
      Do NOT wrap the JSON in markdown code blocks (like \`\`\`json). Just return the raw JSON string.
    `;

    const completion = await client.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free", // Using the same model as chat
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write a blog post about: ${topic}` },
      ],
    });

    const generatedText = completion.choices[0]?.message?.content || "{}";
    
    // Attempt to parse JSON. If the model wraps it in backticks, clean it.
    let cleanedText = generatedText.trim();
    if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json/, '').replace(/```$/, '');
    } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```/, '').replace(/```$/, '');
    }

    const parsedContent = JSON.parse(cleanedText);

    res.status(200).json(parsedContent);

  } catch (error) {
    console.error('AI Generation error:', error);
    res.status(500).json({ message: 'Error generating content', error: error.message });
  }
};
