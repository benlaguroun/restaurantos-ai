import { NextResponse } from "next/server";

const TOOLS = [
  {
    name: "sales_report",
    description: "Get revenue and sales data for a time period.",
  },
  {
    name: "menu_lookup",
    description: "Get top performing menu items by sales volume.",
  },
  {
    name: "inventory_check",
    description: "Check which menu items are low on stock.",
  },
  {
    name: "order_status",
    description: "Get recent orders filtered by status.",
  },
  { name: "sales_trend", description: "Get daily sales trend data." },
];

export async function GET() {
  return NextResponse.json({
    name: "restaurantos-mcp",
    version: "1.0.0",
    description: "MCP server exposing RestaurantOS AI restaurant data tools.",
    tools: TOOLS,
  });
}
