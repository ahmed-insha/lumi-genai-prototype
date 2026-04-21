import Groq from 'groq-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY,
  });

  const { messages, context, domainConfig } = req.body;

  try {
    // Scaffold Context string
    let contextStr = "User Context:\n";
    if (context) {
      for (const [key, val] of Object.entries(context)) {
        if (val) contextStr += `${key}: ${val}\n`;
      }
    }

    // Replace {PRIMARY_TOPIC} in system prompt
    const systemInstruction = domainConfig.SYSTEM_PROMPT.replace('{PRIMARY_TOPIC}', domainConfig.PRIMARY_TOPIC);
    
    // Construct System Message including the RAG Scaffold context
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
    });

    const reply = chatCompletion.choices[0]?.message?.content || "";
    const tokenEstimate = chatCompletion.usage?.total_tokens || 0;

    return res.status(200).json({ 
      reply,
      tokenEstimate
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
