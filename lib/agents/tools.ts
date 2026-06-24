import { FunctionDeclaration, Type } from "@google/genai";
import {
  getRevenue,
  getTopItems,
  getLowStockItems,
  getOrders,
  getDailySalesTrend,
} from "@/lib/tools/restaurant-tools";

// ─── Tool Definitions (ADK/Gemini function declarations) ──────────────────────

export const toolDeclarations: FunctionDeclaration[] = [
  {
    name: "getRevenue",
    description:
      "Get revenue summary for a given period. Use this for any question about sales, income, or money earned.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        period: {
          type: Type.STRING,
          enum: ["today", "yesterday", "week", "month"],
          description: "The time period to get revenue for.",
        },
      },
      required: ["period"],
    },
  },
  {
    name: "getTopItems",
    description:
      "Get the top selling menu items by quantity. Use this for questions about best sellers, popular items, or what to promote.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        days: {
          type: Type.NUMBER,
          description: "Number of days to look back. Default is 30.",
        },
        limit: {
          type: Type.NUMBER,
          description: "Number of items to return. Default is 10.",
        },
      },
      required: [],
    },
  },
  {
    name: "getLowStockItems",
    description:
      "Get menu items that are low on stock or need restocking. Use this for inventory questions.",
    parameters: {
      type: Type.OBJECT,
      properties: {},
      required: [],
    },
  },
  {
    name: "getOrders",
    description:
      "Get recent orders, optionally filtered by status. Use this for questions about orders.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        status: {
          type: Type.STRING,
          enum: [
            "PENDING",
            "CONFIRMED",
            "PREPARING",
            "READY",
            "DELIVERED",
            "CANCELLED",
          ],
          description: "Filter orders by status.",
        },
        limit: {
          type: Type.NUMBER,
          description: "Number of orders to return.",
        },
      },
      required: [],
    },
  },
  {
    name: "getDailySalesTrend",
    description:
      "Get daily sales trend data. Use this for questions about trends, patterns, or performance over time.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        days: {
          type: Type.NUMBER,
          description: "Number of days to look back.",
        },
      },
      required: [],
    },
  },
];

// ─── Tool Executor ────────────────────────────────────────────────────────────

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  switch (name) {
    case "getRevenue":
      return getRevenue(
        args.period as "today" | "yesterday" | "week" | "month",
      );
    case "getTopItems":
      return getTopItems(
        (args.days as number) ?? 30,
        (args.limit as number) ?? 10,
      );
    case "getLowStockItems":
      return getLowStockItems();
    case "getOrders":
      return getOrders(
        args.status as string | undefined,
        (args.limit as number) ?? 20,
      );
    case "getDailySalesTrend":
      return getDailySalesTrend((args.days as number) ?? 30);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
