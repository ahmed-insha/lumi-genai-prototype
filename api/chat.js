import Groq from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
  });

  const { messages, context, domainConfig, mode } = req.body;

  try {
    // Scaffold Context string
    let contextStr = "User Context:\n";
    if (context) {
      for (const [key, val] of Object.entries(context)) {
        if (val) contextStr += `${key}: ${val}\n`;
      }
    }

    // Replace placeholders in system prompt
    let systemInstruction = domainConfig.SYSTEM_PROMPT
      .replace('{PRIMARY_TOPIC}', domainConfig.PRIMARY_TOPIC)
      .replace('{MODE}', mode || "HOME_SANCTUARY");
    
    const fullSystemMessage = `${systemInstruction}\n\n${contextStr}\n\nREMINDER: You are a JSON-only API. Only output valid JSON.`;

    const apiMessages = [
      { role: 'system', content: fullSystemMessage },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const reply = chatCompletion.choices[0]?.message?.content || "";
    const tokenEstimate = chatCompletion.usage?.total_tokens || 0;

    // Check if the response contains the refusal text
    const refusalText = "Bestie, we only do safe and high-vibe adventures here!";
    let parsedReply;
    
    if (reply.includes("Bestie") && (reply.includes("safe") || reply.includes("high-vibe"))) {
      parsedReply = { refusal: refusalText };
    } else {
      try {
        parsedReply = JSON.parse(reply);
      } catch(e) {
        // Fallback for non-JSON responses
        parsedReply = { error: "JSON Parsing Error", raw: reply };
      }
    }

    return res.status(200).json({ 
      reply: parsedReply,
      tokenEstimate,
      groundingStatus: parsedReply.refusal ? "Refused (Safety)" : "Verified"
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
