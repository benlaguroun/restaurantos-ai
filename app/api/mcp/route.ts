/**
 * RestaurantOS AI — MCP HTTP endpoint
 * Exposes the MCP server over HTTP using StreamableHTTP transport.
 * This allows any MCP-compatible client to connect to our restaurant tools.
 */

import { NextRequest, NextResponse } from "next/server";
import { mcpServer } from "@/lib/mcp/server";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export async function POST(req: NextRequest) {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    const body = await req.json();

    const response = await new Promise<Response>((resolve) => {
      transport.handleRequest(
        {
          method: req.method,
          headers: Object.fromEntries(req.headers.entries()),
          body,
        },
        {
          writeHead: (status: number, headers: Record<string, string>) => {
            resolve(
              new Response(null, {
                status,
                headers,
              }),
            );
          },
          end: (data: string) => {
            resolve(
              new Response(data, {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }),
            );
          },
        },
      );
      mcpServer.connect(transport);
    });

    return response;
  } catch (error) {
    console.error("[MCP] Error:", error);
    return NextResponse.json({ error: "MCP server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: "restaurantos-mcp",
    version: "1.0.0",
    tools: [
      "sales_report",
      "menu_lookup",
      "inventory_check",
      "order_status",
      "sales_trend",
    ],
  });
}
