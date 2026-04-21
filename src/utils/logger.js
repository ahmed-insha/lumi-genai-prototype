export const logger = {
  logApiCall: (startTime, tokenEstimate, endpoint = '/api/chat', groundingStatus = "Verified") => {
    const latency = performance.now() - startTime;
    console.log(`[Evaluation Awareness] API Call to ${endpoint} completed.`);
    console.log(`⏱️ Latency: ${latency.toFixed(2)}ms`);
    if (tokenEstimate) console.log(`🪙 Estimated Tokens: ${tokenEstimate}`);
    console.log(`🛡️ Grounding Status: ${groundingStatus}`);

    // Dispatch event for Footer
    window.dispatchEvent(new CustomEvent('vibe_latency', { detail: { latency, status: groundingStatus, tokens: tokenEstimate } }));
  }
};
