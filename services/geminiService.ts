import { ItineraryData, TripRequest } from "../types";

export type GeminiModel = "gemini-2.5-flash" | "gemini-2.5-pro";

// 和你原来保持一致：系统提示词仍然由前端生成，然后交给 Worker 转发给 Gemini
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

// 你之前的 schema 是给 SDK 用的；Worker 直连 REST 不强制 schema 校验。
// 我们让模型仍“只输出 JSON”，然后前端 JSON.parse。
// （如果你想继续用 schema 校验，我可以再给你 Worker 版 schema 强校验）
async function callWorkerGenerate(model: GeminiModel, prompt: string, systemInstruction?: string) {
  const payload: any = {
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    // generationConfig 可按需加参数
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 8192,
    },
  };

  // 把 systemInstruction 作为“系统层提示”拼进 prompt（最兼容做法）
  // 也可以改 Worker 支持真正的 system role（后续我可给你升级）
  if (systemInstruction) {
    payload.contents = [
      {
        role: "user",
        parts: [{ text: `${systemInstruction}\n\n---\n\n${prompt}` }],
      },
    ];
  }

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Worker API error");
  }

  const text = data?.text;
  if (!text) throw new Error("Empty response from Worker/Gemini");

  return text as string;
}

export const generateItinerary = async (
  request: TripRequest,
  model: GeminiModel = "gemini-2.5-flash"
): Promise<ItineraryData> => {
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

  const text = await callWorkerGenerate(model, prompt, getSystemInstruction(request.mode));
  return JSON.parse(text) as ItineraryData;
};

export const translateItinerary = async (
  data: ItineraryData,
  model: GeminiModel = "gemini-2.5-flash"
): Promise<ItineraryData> => {
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

  const text = await callWorkerGenerate(model, prompt);
  return JSON.parse(text) as ItineraryData;
};
