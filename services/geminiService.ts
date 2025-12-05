import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry, RiskLevel } from "../types";

// NOTE: In a real app, this key should be secure. For this demo, we assume process.env.API_KEY is available.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export interface AnalysisResult {
  riskAssessment: string;
  recommendedAction: string;
  isThreat: boolean;
  confidenceScore: number;
  actionType: 'SUSPEND_USER' | 'BLOCK_IP' | 'LOCK_RESOURCE' | 'NONE';
}

export interface BotAnalysisResult {
    verdict: 'Legitimate' | 'Suspicious' | 'Neutral' | 'Malicious';
    description: string;
    riskScore: number;
    suggestedType: 'Internal' | 'External' | 'Partner';
}

export const analyzeLogEntry = async (log: LogEntry): Promise<AnalysisResult> => {
  if (!apiKey) {
    return {
      riskAssessment: "AI Service Unavailable (Missing Key)",
      recommendedAction: "Manual Review Required",
      isThreat: false,
      confidenceScore: 0,
      actionType: 'NONE'
    };
  }

  try {
    const prompt = `
      You are AegisLoop, an autonomous security AI. Analyze the following system log entry:
      
      Source: ${log.source}
      Event: ${log.event}
      Details: ${log.details}
      User: ${log.user || 'N/A'}
      IP: ${log.ip || 'N/A'}
      
      Determine if this constitutes a security threat. 
      Provide:
      1. A concise risk assessment.
      2. A specific recommended action.
      3. An 'actionType' categorization: 
         - 'SUSPEND_USER' if an internal user is compromised or malicious.
         - 'BLOCK_IP' if the threat is from an external IP or bot.
         - 'LOCK_RESOURCE' if a specific link/repo is being abused.
         - 'NONE' if no immediate automated action is needed.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskAssessment: { type: Type.STRING },
            recommendedAction: { type: Type.STRING },
            isThreat: { type: Type.BOOLEAN },
            confidenceScore: { type: Type.NUMBER, description: "A number between 0 and 100" },
            actionType: { type: Type.STRING, enum: ['SUSPEND_USER', 'BLOCK_IP', 'LOCK_RESOURCE', 'NONE'] }
          },
          required: ["riskAssessment", "recommendedAction", "isThreat", "confidenceScore", "actionType"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      riskAssessment: "Analysis Failed",
      recommendedAction: "Check System Logs",
      isThreat: false,
      confidenceScore: 0,
      actionType: 'NONE'
    };
  }
};

export const analyzeBotIdentifier = async (identifier: string): Promise<BotAnalysisResult> => {
    if (!apiKey) {
        return {
            verdict: 'Neutral',
            description: 'AI Service Unavailable',
            riskScore: 0,
            suggestedType: 'External'
        };
    }

    try {
        const prompt = `
            Analyze this network identifier (User Agent string or IP address): "${identifier}".
            Determine if it belongs to a known legitimate bot (e.g., Googlebot, UptimeRobot, Slackbot), a standard user browser, or a potentially malicious/suspicious actor.
            
            Return JSON with:
            - verdict: "Legitimate" (known good), "Suspicious" (looks like a scraper/exploit), "Malicious", or "Neutral" (standard browser).
            - description: One short sentence explaining what it is.
            - riskScore: 0 (safe) to 100 (dangerous).
            - suggestedType: "Internal", "External", or "Partner" based on likely usage.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        verdict: { type: Type.STRING, enum: ['Legitimate', 'Suspicious', 'Neutral', 'Malicious'] },
                        description: { type: Type.STRING },
                        riskScore: { type: Type.NUMBER },
                        suggestedType: { type: Type.STRING, enum: ['Internal', 'External', 'Partner'] }
                    },
                    required: ["verdict", "description", "riskScore", "suggestedType"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response");
        return JSON.parse(text) as BotAnalysisResult;

    } catch (error) {
        console.error("Bot Analysis Error:", error);
        return {
            verdict: 'Neutral',
            description: 'Could not analyze identifier.',
            riskScore: 0,
            suggestedType: 'External'
        };
    }
};

export const generateSecurityReport = async (logs: LogEntry[]) => {
    if (!apiKey) return "AI Service Unavailable";

    const logSummary = logs.slice(0, 10).map(l => `- [${l.riskLevel}] ${l.event}: ${l.details}`).join('\n');
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the current security posture based on these recent logs:\n${logSummary}\n\nKeep it executive and brief.`,
        });
        return response.text;
    } catch (e) {
        return "Could not generate report.";
    }
}