import { GoogleGenAI, Type } from "@google/genai";
import { StepsDataPoint } from '../types';

const apiKey = process.env.API_KEY || '';
// Initialize strictly if key is present to avoid runtime crashes in environments without keys, 
// though the prompt implies we should assume it's there. 
// We will handle the "missing key" gracefully in the UI logic or assume it exists.
const ai = new GoogleGenAI({ apiKey });

export const analyzeSolarData = async (recentData: StepsDataPoint[]): Promise<{ summary: string; hazardLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'UNKNOWN' }> => {
  if (!apiKey) {
    return { 
        summary: "API Key missing. Unable to perform AI analysis on solar wind telemetry.", 
        hazardLevel: "UNKNOWN" 
    };
  }

  // Calculate some basic stats to send to the model to reduce token usage
  const lastPoint = recentData[recentData.length - 1];
  const avgProton = recentData.reduce((acc, curr) => acc + curr.protonFluxHigh, 0) / recentData.length;
  
  const prompt = `
    You are an expert Solar Physicist analyzing telemetry from the ISRO Aditya-L1 ASPEX-STEPS instrument.
    
    Current Telemetry Snapshot (Supra Thermal Energetic Particle Spectrometer):
    - Latest Time: ${lastPoint.displayTime}
    - High Energy Proton Flux: ${lastPoint.protonFluxHigh.toFixed(2)} counts/s
    - Low Energy Proton Flux: ${lastPoint.protonFluxLow.toFixed(2)} counts/s
    - Alpha Particle Flux: ${lastPoint.alphaParticles.toFixed(2)} counts/s
    - Average High Energy Flux (last window): ${avgProton.toFixed(2)} counts/s

    Analyze this data for potential Space Weather events (CMEs, Solar Flares, SEP events).
    Is the vehicle in a safe ambient solar wind stream or is there a disturbance?
    Keep the summary concise (max 2 sentences).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            hazardLevel: { type: Type.STRING, enum: ["LOW", "MODERATE", "HIGH"] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as { summary: string; hazardLevel: 'LOW' | 'MODERATE' | 'HIGH' };
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      summary: "Automated analysis temporarily unavailable due to telemetry link latency.",
      hazardLevel: "UNKNOWN"
    };
  }
};