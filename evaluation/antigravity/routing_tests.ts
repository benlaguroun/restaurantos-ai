/**
 * RestaurantOS AI — Agent Routing Evaluation
 * Tests whether the agent correctly identifies intent and selects the right tool.
 * This is the Antigravity evaluation layer for the Kaggle capstone.
 */

import { GoogleGenAI } from "@google/genai";
import { toolDeclarations } from "../../lib/agents/tools";

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

// ─── Test Cases ───────────────────────────────────────────────────────────────

interface RoutingTest {
  id: string;
  question: string;
  expectedTool: string;
  category: string;
}

const ROUTING_TESTS: RoutingTest[] = [
  // Revenue questions → getRevenue
  {
    id: "R001",
    question: "What was my revenue today?",
    expectedTool: "getRevenue",
    category: "Revenue",
  },
  {
    id: "R002",
    question: "How much did we earn this week?",
    expectedTool: "getRevenue",
    category: "Revenue",
  },
  {
    id: "R003",
    question: "Show me yesterday's sales numbers.",
    expectedTool: "getRevenue",
    category: "Revenue",
  },
  {
    id: "R004",
    question: "What is our monthly income?",
    expectedTool: "getRevenue",
    category: "Revenue",
  },

  // Top items questions → getTopItems
  {
    id: "T001",
    question: "What are my best selling items?",
    expectedTool: "getTopItems",
    category: "Menu Performance",
  },
  {
    id: "T002",
    question: "Which products should I promote this weekend?",
    expectedTool: "getTopItems",
    category: "Menu Performance",
  },
  {
    id: "T003",
    question: "What are the most popular dishes?",
    expectedTool: "getTopItems",
    category: "Menu Performance",
  },
  {
    id: "T004",
    question: "Which menu items generate the most revenue?",
    expectedTool: "getTopItems",
    category: "Menu Performance",
  },

  // Inventory questions → getLowStockItems
  {
    id: "I001",
    question: "What items are running low on stock?",
    expectedTool: "getLowStockItems",
    category: "Inventory",
  },
  {
    id: "I002",
    question: "What do I need to restock?",
    expectedTool: "getLowStockItems",
    category: "Inventory",
  },
  {
    id: "I003",
    question: "Are there any inventory alerts?",
    expectedTool: "getLowStockItems",
    category: "Inventory",
  },

  // Orders questions → getOrders
  {
    id: "O001",
    question: "Show me the pending orders.",
    expectedTool: "getOrders",
    category: "Orders",
  },
  {
    id: "O002",
    question: "How many orders are being prepared right now?",
    expectedTool: "getOrders",
    category: "Orders",
  },
  {
    id: "O003",
    question: "What orders were cancelled today?",
    expectedTool: "getOrders",
    category: "Orders",
  },

  // Trend questions → getDailySalesTrend
  {
    id: "TR001",
    question: "How has revenue trended over the last 30 days?",
    expectedTool: "getDailySalesTrend",
    category: "Trends",
  },
  {
    id: "TR002",
    question: "Show me the sales pattern for this month.",
    expectedTool: "getDailySalesTrend",
    category: "Trends",
  },
];

// ─── Evaluator ────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are RestaurantOS AI. Given a user question, respond by calling the most appropriate tool.
Available tools help with: revenue (getRevenue), top items (getTopItems), inventory (getLowStockItems), orders (getOrders), trends (getDailySalesTrend).`;

async function evaluateRouting(test: RoutingTest): Promise<{
  id: string;
  question: string;
  expectedTool: string;
  actualTool: string;
  passed: boolean;
  category: string;
}> {
  const response = await genai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: toolDeclarations }],
    contents: [{ role: "user", parts: [{ text: test.question }] }],
  });

  const candidate = response.candidates?.[0];
  const functionCall = candidate?.content?.parts?.find((p) => p.functionCall);
  const actualTool = functionCall?.functionCall?.name ?? "none";
  const passed = actualTool === test.expectedTool;

  return {
    id: test.id,
    question: test.question,
    expectedTool: test.expectedTool,
    actualTool,
    passed,
    category: test.category,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🧪 RestaurantOS AI — Routing Accuracy Evaluation");
  console.log("=".repeat(55));
  console.log(`Running ${ROUTING_TESTS.length} routing tests...\n`);

  const results = [];
  let passed = 0;

  for (const test of ROUTING_TESTS) {
    try {
      const result = await evaluateRouting(test);
      results.push(result);

      const icon = result.passed ? "✅" : "❌";
      console.log(`${icon} [${result.id}] ${result.question}`);
      if (!result.passed) {
        console.log(`      Expected: ${result.expectedTool}`);
        console.log(`      Actual:   ${result.actualTool}`);
      }

      if (result.passed) passed++;

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.log(`⚠️  [${test.id}] Skipped (rate limit) — ${test.question}`);
      results.push({
        id: test.id,
        question: test.question,
        expectedTool: test.expectedTool,
        actualTool: "error",
        passed: false,
        category: test.category,
      });
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────
  const accuracy = ((passed / ROUTING_TESTS.length) * 100).toFixed(1);

  console.log("\n" + "=".repeat(55));
  console.log("📊 ROUTING EVALUATION RESULTS");
  console.log("=".repeat(55));
  console.log(`Total Tests:  ${ROUTING_TESTS.length}`);
  console.log(`Passed:       ${passed}`);
  console.log(`Failed:       ${ROUTING_TESTS.length - passed}`);
  console.log(`Accuracy:     ${accuracy}%`);

  // By category
  console.log("\n📂 Results by category:");
  const categories = [...new Set(ROUTING_TESTS.map((t) => t.category))];
  for (const cat of categories) {
    const catResults = results.filter((r) => r.category === cat);
    const catPassed = catResults.filter((r) => r.passed).length;
    console.log(`   ${cat}: ${catPassed}/${catResults.length}`);
  }

  console.log("\n✅ Evaluation complete.");
  console.log(`   Routing Accuracy: ${accuracy}%`);

  return { accuracy, passed, total: ROUTING_TESTS.length, results };
}

main().catch(console.error);
