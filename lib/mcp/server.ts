/**
 * RestaurantOS AI — MCP Server
 * Exposes restaurant data tools via the Model Context Protocol.
 * Satisfies the mandatory MCP judging criterion.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getRevenue,
  getTopItems,
  getLowStockItems,
  getOrders,
  getDailySalesTrend,
} from "@/lib/tools/restaurant-tools";

export const mcpServer = new McpServer({
  name: "restaurantos-mcp",
  version: "1.0.0",
});

// ─── Tool: sales_report ───────────────────────────────────────────────────────

mcpServer.tool(
  "sales_report",
  "Get a sales and revenue report for a given time period.",
  {
    period: z
      .enum(["today", "yesterday", "week", "month"])
      .describe("Time period for the report."),
  },
  async ({ period }) => {
    const data = await getRevenue(period);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

// ─── Tool: menu_lookup ────────────────────────────────────────────────────────

mcpServer.tool(
  "menu_lookup",
  "Get top performing menu items by sales volume.",
  {
    days: z
      .number()
      .optional()
      .describe("Number of days to look back. Default 30."),
    limit: z
      .number()
      .optional()
      .describe("Number of items to return. Default 10."),
  },
  async ({ days, limit }) => {
    const data = await getTopItems(days ?? 30, limit ?? 10);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

// ─── Tool: inventory_check ────────────────────────────────────────────────────

mcpServer.tool(
  "inventory_check",
  "Check which menu items are low on stock or need restocking.",
  {},
  async () => {
    const data = await getLowStockItems();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

// ─── Tool: order_status ───────────────────────────────────────────────────────

mcpServer.tool(
  "order_status",
  "Get recent orders, optionally filtered by status.",
  {
    status: z
      .enum([
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "READY",
        "DELIVERED",
        "CANCELLED",
      ])
      .optional()
      .describe("Filter orders by status."),
    limit: z
      .number()
      .optional()
      .describe("Number of orders to return. Default 20."),
  },
  async ({ status, limit }) => {
    const data = await getOrders(status, limit ?? 20);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);

// ─── Tool: sales_trend ────────────────────────────────────────────────────────

mcpServer.tool(
  "sales_trend",
  "Get daily sales trend data over a number of days.",
  {
    days: z
      .number()
      .optional()
      .describe("Number of days to look back. Default 30."),
  },
  async ({ days }) => {
    const data = await getDailySalesTrend(days ?? 30);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  },
);
