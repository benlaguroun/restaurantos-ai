import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getRevenue,
  getTopItems,
  getDailySalesTrend,
  getLowStockItems,
} from "@/lib/tools/restaurant-tools";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  const [week, month, topItems, trend, lowStock] = await Promise.all([
    getRevenue("week"),
    getRevenue("month"),
    getTopItems(days, 10),
    getDailySalesTrend(days),
    getLowStockItems(),
  ]);

  return NextResponse.json({ week, month, topItems, trend, lowStock });
}
