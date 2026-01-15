import { ItineraryData, TripRequest } from "../types";

export type GeminiModel = "gemini-2.5-flash" | "gemini-2.5-pro";

const getSystemInstruction = (mode: "A" | "B" | "C") => `
You are a professional travel agency itinerary generator. You must generate a strict JSON object describing a travel itinerary based on the user's request.

ABSOLUTE RULES:
- Return ONLY raw JSON. No markdown. No \`\`\`json fences. No commentary. No extra text.
- The JSON MUST include: template_code, title, mode, route_overview, tags, duration_days, duration_nights, defaults, itinerary, includes, excludes, notes, signature.
- defaults MUST include: transport, target_audience.
- itinerary MUST be an array. Each item MUST include: day_no, title, highlights, segments, stay, meals, tips.
- meals MUST include: breakfast, lunch, dinner (string, can be empty).

Role & Tone:
- Mode A: Pure Simplified Chinese. Practical, worry-free.
- Mode B: Simplified Chinese + some English travel terms mixed in.
- Mode C: Professional English, high-end tone.
`;

function extractJson(text: string): string {
  let t = (text || "").trim();

  // Remove ```json fences if any
  t = t.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();

  // Try slice between first { and last }
  const firstBrace = t.indexOf("{");
  const lastBrace = t.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    t = t.slice(firstBrace, lastBrace + 1).trim();
  }

  return t;
}

function normalizeItinerary(obj: any): ItineraryData {
  const x: any = obj && typeof obj === "object" ? obj : {};

  // top-level required
  x.template_code = x.template_code || "XJ-CUSTOM-ITIN-001";
  x.title = x.title || "定制行程";
  x.mode = x.mode || "A";
  x.route_overview = x.route_overview || "";
  x.tags = Array.isArray(x.tags) ? x.tags : [];

  // duration
  const inferredDays = Array.isArray(x.itinerary) ? x.itinerary.length : 0;
  x.duration_days = Number.isFinite(x.duration_days) ? x.duration_days : inferredDays;
  x.duration_nights = Number.isFinite(x.duration_nights)
    ? x.duration_nights
    : Math.max(0, (x.duration_days || 0) - 1);

  // defaults (avoid crash: defaults.target_audience)
  if (!x.defaults || typeof x.defaults !== "object") x.defaults = {};
  x.defaults.transport = x.defaults.transport || "Private Tour Vehicle";
  x.defaults.target_audience = x.defaults.target_audience || "";

  // itinerary
  x.itinerary = Array.isArray(x.itinerary) ? x.itinerary : [];
  x.itinerary = x.itinerary.map((d: any, idx: number) => {
    const day: any = d && typeof d === "object" ? d : {};
    day.day_no = Number.isFinite(day.day_no) ? day.day_no : idx + 1;
    day.title = day.title || `Day ${idx + 1}`;
    day.highlights = Array.isArray(day.highlights) ? day.highlights : [];

    day.segments = Array.isArray(day.segments) ? day.segments : [];
    day.segments = day.segments.map((s: any) => ({
      type: s?.type || "sight",
      description: s?.description || "",
      detail: s?.detail || "",
    }));

    day.stay = day.stay || "";

    if (!day.meals || typeof day.meals !== "object") day.meals = {};
    day.meals.breakfast = typeof day.meals.breakfast === "string" ? day.meals.breakfast : "";
    day.meals.lunch = typeof day.meals.lunch === "string" ? day.meals.lunch : "";
    day.meals.dinner = typeof day.meals.dinner === "string" ? day.meals.dinner : "";

    day.tips = Array.isArray(day.tips) ? day.tips : [];
    return day;
  });

  // includes/excludes/notes/signature
  x.includes = Array.isArray(x.includes) ? x.includes : [];
  x.excludes = Array.isArray(x.excludes) ? x.excludes : [];
  x.notes = Array.isArray(x.notes) ? x.notes : [];
  x.signature = typeof x.signature === "string" ? x.signature : "";

  return x as ItineraryData;
}

async function callWorkerGenerate(model: GeminiModel, prompt: string, systemInstruction?: string) {
  const strict = `Return ONLY raw JSON. No markdown. No commentary.\n`;

  const merged = systemInstruction
    ? `${strict}${systemInstruction}\n\n---\n\n${prompt}`
    : `${strict}${prompt}`;

  const payload: any = {
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: merged }],
      },
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 8192,
    },
  };

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({} as any));
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

  const raw = await callWorkerGenerate(model, prompt, getSystemInstruction(request.mode));
  const cleaned = extractJson(raw);

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Model output is not valid JSON");
  }

  return normalizeItinerary(parsed);
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

  const raw = await callWorkerGenerate(model, prompt);
  const cleaned = extractJson(raw);

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Translation output is not valid JSON");
  }

  return normalizeItinerary(parsed);
};
