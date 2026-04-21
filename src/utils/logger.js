export const logger = {
  logApiCall: (startTime, tokenEstimate, endpoint = '/api/chat') => {
    const latency = performance.now() - startTime;
    console.log(`[Evaluation Awareness] API Call to ${endpoint} completed.`);
    console.log(`⏱️ Latency: ${latency.toFixed(2)}ms`);
    console.log(`🪙 Estimated Tokens: ${tokenEstimate}`);
  }
};
