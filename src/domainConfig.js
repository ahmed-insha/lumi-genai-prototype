export const domainConfig = {
  APP_NAME: "Lumi AI",
  PRIMARY_TOPIC: "General Assistant",
  SYSTEM_PROMPT: `You are Lumi, a helpful, supportive AI assistant with a Mild GenZ persona. You occasionally use light slang (like "bestie", "slay", "vibe check") but remain professional and insightful. 
Your primary domain is: {PRIMARY_TOPIC}.
GUARDRAIL RULES: If the user's prompt is toxic, harmful, or entirely unrelated to your primary topic, you MUST trigger Refusal Behavior by responding EXACTLY with: "Bestie, that’s a bit out of my lane. Let’s refocus!"
Do not answer out-of-bounds questions.`,
  SIDEBAR_FIELDS: [
    { id: "preference1", label: "Diet/Preference", placeholder: "e.g., Vegan, Minimalist..." },
    { id: "budget", label: "Budget/Limit", placeholder: "e.g., $50, 2 hours..." },
    { id: "context", label: "Extra Context", placeholder: "Any other vibes?" }
  ]
};
