import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ItineraryData, TripRequest } from "../types";

export type GeminiModel = "gemini-2.5-flash" | "gemini-2.5-pro";

const getSystemInstruction = (mode: "A" | "B" | "C") => `
You are a professional travel agency itinerary generator. You must generate a strict JSON object describing a travel itinerary based on the user's request.

**Role & Tone:**
- Mode A (Domestic): Pure Simplified Chinese. Grounded, practical. Focus on "worry-free".
- Mode B (SG/MY): Simplified Chinese main text, with English professional terms (Private Tour, Pick-up, etc.) mixed in.
- Mode C (English): Professional English throughout. High-end, service-oriented, elegant tone.

**Template Constraints:**
- **Template Code:** Must be uppercase with hyphens, e.g., "XJ-ALTAY-9D8N-WINTER-001".
- **Route:** If the user provides a draft route in "requirements", you MUST follow it strictly. Do not add new attractions unless asked.
- **Stay:** Use specific hotel descriptions or placeholders like "{4钻+ 观景房}".
- **Meals:** Detailed description.
- **Titles:** Catchy and professional.

**Output Format:**
Return ONLY a valid JSON object matching the defined schema.
`;

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    template_code: { type: Type.STRING, description: "Format: DEST-THEME-DAYS-SEQ, e.g. XJ-ALTAY-9D8N-001" },
    title: { type: Type.STRING },
    mode: { type: Type.STRING, enum: ["A", "B", "C"] },
    route_overview: { type: Type.STRING },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    duration_days: { type: Type.INTEGER },
    duration_nights: { type: Type.INTEGER },
    defaults: {
      type: Type.OBJECT,
      properties: {
        transport: { type: Type.STRING },
        target_audience: { type: Type.STRING },
      },
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day_no: { type: Type.INTEGER },
          title: { type: Type.STRING },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["transfer", "sight", "experience", "free", "tip", "branch"] },
                description: { type: Type.STRING },
                detail: { type: Type.STRING },
              },
            },
          },
          stay: { type: Type.STRING },
          meals: {
            type: Type.OBJECT,
            properties: {
              breakfast: { type: Type.STRING },
              lunch: { type: Type.STRING },
              dinner: { type: Type.STRING },
            },
          },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
    includes: { type: Type.ARRAY, items: { type: Type.STRING } },
    excludes: { type: Type.ARRAY, items: { type: Type.STRING } },
    notes: { type: Type.ARRAY, items: { type: Type.STRING } },
    signature: { type: Type.STRING },
  },
  required: ["title", "itinerary", "includes", "excludes", "template_code"],
};

export const generateItinerary = async (
  apiKey: string,
  request: TripRequest,
  model: GeminiModel = "gemini-2.5-flash"
): Promise<ItineraryData> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Destination: ${request.destination}
Duration: ${request.days} days
Mode: ${request.mode}
Context:
- Pax: ${request.adults} Adults, ${request.children} Children.
- Specific Requirements/Draft Route: ${request.requirements}

Generate a complete itinerary JSON.
Important: If specific Route details are provided in 'Requirements', map them exactly to the days.
Language: Mode ${request.mode} rules apply strictly.
`;

  try {
    const response = await ai.models.generateContent({
      model, // ✅ 动态模型
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(request.mode),
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    return JSON.parse(text) as ItineraryData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const translateItinerary = async (
  apiKey: string,
  data: ItineraryData,
  model: GeminiModel = "gemini-2.5-flash"
): Promise<ItineraryData> => {
  if (!apiKey) throw new Error("API Key is missing for translation");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Task: Translate the following travel itinerary JSON from Chinese to Professional English.

Requirements:
1. Keep the strict JSON structure. Do not remove any keys.
2. Translate values for: title, route_overview, tags, defaults, itinerary (title, highlights, segments, stay, meals, tips), includes, excludes, notes.
3. Change 'mode' to 'C'.
4. Keep 'template_code' unchanged.
5. Ensure the tone is high-end and inviting.

Input JSON:
${JSON.stringify(data)}
`;

  try {
    const response = await ai.models.generateContent({
      model, // ✅ 动态模型
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Translation failed");
    return JSON.parse(text) as ItineraryData;
  } catch (error) {
    console.error("Translation Error:", error);
    throw error;
  }
};
