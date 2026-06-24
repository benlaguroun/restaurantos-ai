/**
 * RestaurantOS AI — MCP Server
 * Standalone MCP server exposing restaurant tools.
 * Run with: npx tsx lib/mcp/server.ts
 */

import { createServer } from "http";

const TOOLS = [
  {
    name: "sales_report",
    description: "Get revenue and sales data for a time period.",
    inputSchema: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["today", "yesterday", "week", "month"],
        },
      },
      required: ["period"],
    },
  },
  {
    name: "menu_lookup",
    description: "Get top performing menu items by sales volume.",
    inputSchema: {
      type: "object",
      properties: {
        days: { type: "number" },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "inventory_check",
    description: "Check which menu items are low on stock.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "order_status",
    description: "Get recent orders filtered by status.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: [
            "PENDING",
            "CONFIRMED",
            "PREPARING",
            "READY",
            "DELIVERED",
            "CANCELLED",
          ],
        },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "sales_trend",
    description: "Get daily sales trend data.",
    inputSchema: {
      type: "object",
      properties: {
        days: { type: "number" },
      },
    },
  },
];

function handleJsonRpc(body: Record<string, unknown>) {
  const { method, params, id } = body as {
    method: string;
    params: Record<string, unknown>;
    id: number;
  };

  // MCP protocol handlers
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        serverInfo: { name: "restaurantos-mcp", version: "1.0.0" },
        capabilities: { tools: {} },
      },
    };
  }

  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { tools: TOOLS },
    };
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params as {
      name: string;
      arguments: Record<string, unknown>;
    };

    // In production this calls the actual DB tools.
    // For demo purposes we return the tool signature.
    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              tool: name,
              args,
              message: "Connect to RestaurantOS AI database to get real data.",
            }),
          },
        ],
      },
    };
  }

  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" },
  };
}

const server = createServer((req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        name: "restaurantos-mcp",
        tools: TOOLS.map((t) => t.name),
      }),
    );
    return;
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const response = handleJsonRpc(parsed);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(405);
  res.end();
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🔌 RestaurantOS MCP server running on http://localhost:${PORT}`);
  console.log(`   Tools: ${TOOLS.map((t) => t.name).join(", ")}`);
});
