/**
 * RestaurantOS AI — Response Quality Evaluation
 * Tests the quality, accuracy, and business usefulness of agent responses.
 * Uses LLM-as-judge pattern — Gemini evaluates Gemini's responses.
 */

import { GoogleGenAI } from "@google/genai";
import { toolDeclarations, executeTool } from "../../lib/agents/tools";

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

// ─── Test Cases ───────────────────────────────────────────────────────────────

interface QualityTest {
  id: string;
  question: string;
  criteria: string[];
}

const QUALITY_TESTS: QualityTest[] = [
  {
    id: "Q001",
    question:
      "What was our revenue this week and how does it compare to last week?",
    criteria: [
      "Includes specific dollar amounts",
      "Mentions percentage change vs previous period",
      "Is concise and business-focused",
      "Provides actionable insight",
    ],
  },
  {
    id: "Q002",
    question: "Which menu items should I promote this weekend?",
    criteria: [
      "Names specific menu items",
      "Considers both popularity and margin",
      "Gives clear recommendation",
      "Explains reasoning",
    ],
  },
  {
    id: "Q003",
    question: "What items are critically low on stock?",
    criteria: [
      "Lists specific items by name",
      "Includes current stock levels",
      "Prioritizes by urgency",
      "Suggests action to take",
    ],
  },
  {
    id: "Q004",
    question: "Give me a full business summary for this month.",
    criteria: [
      "Covers revenue figures",
      "Mentions top selling items",
      "Includes inventory status",
      "Structured and easy to read",
    ],
  },
];

// ─── Agent Response Generator ─────────────────────────────────────────────────

const AGENT_SYSTEM = `You are RestaurantOS AI, an intelligent business assistant for restaurant owners.
Always use tools to get real data. Be concise, specific, and business-focused.`;

const JUDGE_SYSTEM = `You are an expert evaluator assessing the quality of AI restaurant assistant responses.
Score responses on a scale of 1-10 based on the given criteria.
Return ONLY a JSON object like: {"score": 8.5, "feedback": "explanation"}`;

async function generateAgentResponse(question: string): Promise<string> {
  const response = await genai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    systemInstruction: AGENT_SYSTEM,
    tools: [{ functionDeclarations: toolDeclarations }],
    contents: [{ role: "user", parts: [{ text: question }] }],
  });

  let candidate = response.candidates?.[0];

  // Handle tool calls
  if (candidate?.content?.parts?.some((p) => p.functionCall)) {
    const toolCallParts = candidate.content.parts.filter((p) => p.functionCall);
    const toolResults = [];

    for (const part of toolCallParts) {
      const { name, args } = part.functionCall!;
      const result = await executeTool(name, args as Record<string, unknown>);
      toolResults.push({
        functionResponse: { name, response: { result } },
      });
    }

    const followUp = await genai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      systemInstruction: AGENT_SYSTEM,
      tools: [{ functionDeclarations: toolDeclarations }],
      contents: [
        { role: "user", parts: [{ text: question }] },
        { role: "model", parts: candidate.content.parts },
        { role: "user", parts: toolResults },
      ],
    });

    candidate = followUp.candidates?.[0];
  }

  return (
    candidate?.content?.parts
      ?.filter((p) => p.text)
      .map((p) => p.text)
      .join("") ?? "No response generated."
  );
}

async function judgeResponse(
  question: string,
  response: string,
  criteria: string[],
): Promise<{ score: number; feedback: string }> {
  const prompt = `
Question asked: "${question}"

Agent response: "${response}"

Evaluation criteria:
${criteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Score this response 1-10 based on how well it meets the criteria.
Return ONLY valid JSON: {"score": X, "feedback": "explanation"}`;

  const result = await genai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    systemInstruction: JUDGE_SYSTEM,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text =
    result.candidates?.[0]?.content?.parts
      ?.filter((p) => p.text)
      .map((p) => p.text)
      .join("") ?? '{"score": 0, "feedback": "Error"}';

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { score: 0, feedback: "Could not parse judge response." };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🧪 RestaurantOS AI — Response Quality Evaluation");
  console.log("=".repeat(55));
  console.log(`Running ${QUALITY_TESTS.length} quality tests...\n`);

  const results = [];
  let totalScore = 0;

  for (const test of QUALITY_TESTS) {
    console.log(`\n[${test.id}] ${test.question}`);

    try {
      // Generate agent response
      console.log("   → Generating agent response...");
      const agentResponse = await generateAgentResponse(test.question);
      console.log(`   → Response: ${agentResponse.slice(0, 100)}...`);

      await new Promise((r) => setTimeout(r, 1500));

      // Judge the response
      console.log("   → Judging response quality...");
      const judgment = await judgeResponse(
        test.question,
        agentResponse,
        test.criteria,
      );

      console.log(`   → Score: ${judgment.score}/10`);
      console.log(`   → Feedback: ${judgment.feedback}`);

      results.push({ ...test, agentResponse, judgment });
      totalScore += judgment.score;

      await new Promise((r) => setTimeout(r, 1500));
    } catch (error) {
      console.log(`   ⚠️  Skipped (rate limit)`);
      results.push({
        ...test,
        agentResponse: "skipped",
        judgment: { score: 0, feedback: "Rate limited" },
      });
    }
  }

  // ─── Summary ────────────────────────────────────────────────────────────
  const avgScore = (totalScore / QUALITY_TESTS.length).toFixed(1);

  console.log("\n" + "=".repeat(55));
  console.log("📊 QUALITY EVALUATION RESULTS");
  console.log("=".repeat(55));
  console.log(`Tests Run:     ${QUALITY_TESTS.length}`);
  console.log(`Avg Score:     ${avgScore}/10`);
  console.log(
    `Rating:        ${Number(avgScore) >= 8 ? "Excellent" : Number(avgScore) >= 6 ? "Good" : "Needs Improvement"}`,
  );

  console.log("\n📋 Individual scores:");
  results.forEach((r) => {
    console.log(
      `   [${r.id}] ${r.judgment.score}/10 — ${r.question.slice(0, 50)}...`,
    );
  });

  console.log("\n✅ Quality evaluation complete.");
  return { avgScore, results };
}

main().catch(console.error);
