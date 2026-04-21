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
    
    const fullSystemMessage = `${systemInstruction}\n\n${contextStr}`;

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

    let parsedReply;
    try {
      parsedReply = JSON.parse(reply);
    } catch(e) {
      // Fallback for non-JSON responses or hard refusals
      if (reply.includes("Bestie,") || reply.includes("thrilling") || reply.includes("off-limits")) {
        parsedReply = { refusal: reply };
      } else {
        parsedReply = { error: "JSON Parsing Error", raw: reply };
      }
    }

    let status = mode === 'GLOBAL_ESCAPE' ? "Voyaging..." : "Curating Home Sanctuary...";
    if (parsedReply?.refusal) {
      if (parsedReply.refusal.includes("medical")) status = "Refused (Medical/Legal)";
      else if (parsedReply.refusal.includes("knees")) status = "Refused (Grandma Safety)";
      else if (parsedReply.refusal.includes("physics")) status = "Refused (Reality Check)";
      else status = "Refused (Allergy/Toxic)";
    }

    return res.status(200).json({ 
      reply: parsedReply,
      tokenEstimate,
      groundingStatus: status
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
