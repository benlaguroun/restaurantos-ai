import { GoogleGenAI } from "@google/genai";
import { toolDeclarations, executeTool } from "./tools";

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

const SYSTEM_PROMPT = `You are RestaurantOS AI, an intelligent business assistant for restaurant owners and managers.

You have access to real-time restaurant data through tools. Always use tools to get actual data before answering — never make up numbers.

You can help with:
- Revenue and sales analysis
- Best selling and underperforming menu items
- Inventory and stock alerts
- Order management and trends
- Menu pricing and promotion recommendations

When answering:
- Be concise and business-focused
- Always include specific numbers from the data
- Format currency as $X.XX
- Give actionable recommendations
- If asked about promotions, analyze both popularity and margin

You are talking to restaurant staff, so use professional but friendly language.`;

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function runOrchestrator(
  userMessage: string,
  history: Message[],
): Promise<string> {
  // Build conversation history for Gemini
  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  // Agentic loop — keeps running until no more tool calls
  let response = await genai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: toolDeclarations }],
    contents,
  });

  let candidate = response.candidates?.[0];

  while (candidate?.content?.parts?.some((p) => p.functionCall)) {
    const toolCallParts = candidate.content.parts.filter((p) => p.functionCall);
    const toolResults = [];

    // Execute all tool calls
    for (const part of toolCallParts) {
      const { name, args } = part.functionCall!;
      console.log(`[Agent] Calling tool: ${name}`, args);

      const result = await executeTool(name, args as Record<string, unknown>);

      toolResults.push({
        functionResponse: {
          name,
          response: { result },
        },
      });
    }

    // Send tool results back to model
    const updatedContents = [
      ...contents,
      { role: "model", parts: candidate.content.parts },
      { role: "user", parts: toolResults },
    ];

    response = await genai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ functionDeclarations: toolDeclarations }],
      contents: updatedContents,
    });

    candidate = response.candidates?.[0];
  }

  // Extract final text response
  const text =
    candidate?.content?.parts
      ?.filter((p) => p.text)
      .map((p) => p.text)
      .join("") ?? "I could not generate a response. Please try again.";

  return text;
}
