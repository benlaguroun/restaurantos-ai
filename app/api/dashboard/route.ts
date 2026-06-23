import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getRevenue,
  getLowStockItems,
  getOrders,
} from "@/lib/tools/restaurant-tools";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [revenue, lowStock, recentOrders] = await Promise.all([
    getRevenue("today"),
    getLowStockItems(),
    getOrders(undefined, 5),
  ]);

  return NextResponse.json({
    revenue,
    lowStockCount: lowStock.length,
    recentOrders,
  });
}
