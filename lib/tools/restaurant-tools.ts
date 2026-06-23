import { prisma } from "@/lib/prisma";

// ─── Revenue ──────────────────────────────────────────────────────────────────

export async function getRevenue(
  period: "today" | "yesterday" | "week" | "month" = "week",
) {
  const now = new Date();
  let startDate: Date;
  let prevStartDate: Date;
  let prevEndDate: Date;

  if (period === "today") {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 1);
    prevEndDate = new Date(startDate);
  } else if (period === "yesterday") {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    startDate = new Date(yesterday);
    startDate.setHours(0, 0, 0, 0);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 1);
    prevEndDate = new Date(startDate);
  } else if (period === "week") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 7);
    prevEndDate = new Date(startDate);
  } else {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 30);
    prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - 30);
    prevEndDate = new Date(startDate);
  }

  const [current, previous] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "DELIVERED", createdAt: { gte: startDate } },
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.order.aggregate({
      where: {
        status: "DELIVERED",
        createdAt: { gte: prevStartDate, lt: prevEndDate },
      },
      _sum: { total: true },
      _count: { id: true },
    }),
  ]);

  const currentRevenue = Number(current._sum.total ?? 0);
  const previousRevenue = Number(previous._sum.total ?? 0);
  const change =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  return {
    period,
    totalRevenue: parseFloat(currentRevenue.toFixed(2)),
    totalOrders: current._count.id,
    avgOrderValue:
      current._count.id > 0
        ? parseFloat((currentRevenue / current._count.id).toFixed(2))
        : 0,
    change: parseFloat(change.toFixed(1)),
  };
}

// ─── Top Items ────────────────────────────────────────────────────────────────

export async function getTopItems(days = 30, limit = 10) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const results = await prisma.orderItem.groupBy({
    by: ["menuItemId"],
    where: {
      order: { status: "DELIVERED", createdAt: { gte: since } },
    },
    _sum: { quantity: true, subtotal: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const items = await prisma.menuItem.findMany({
    where: { id: { in: results.map((r) => r.menuItemId) } },
    include: { category: true },
  });

  return results.map((r) => {
    const item = items.find((i) => i.id === r.menuItemId)!;
    const revenue = Number(r._sum.subtotal ?? 0);
    const qty = r._sum.quantity ?? 0;
    const cost = Number(item.cost) * qty;
    const margin = revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0;

    return {
      id: item.id,
      name: item.name,
      category: item.category.name,
      totalQuantity: qty,
      totalRevenue: parseFloat(revenue.toFixed(2)),
      margin: parseFloat(margin.toFixed(1)),
    };
  });
}

// ─── Low Stock ────────────────────────────────────────────────────────────────

export async function getLowStockItems() {
  const items = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    include: { category: true },
    orderBy: { stock: "asc" },
  });

  return items
    .filter((item) => item.stock <= item.minStock * 1.5)
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category.name,
      currentStock: item.stock,
      minStock: item.minStock,
      urgency:
        item.stock <= item.minStock * 0.5
          ? "critical"
          : item.stock <= item.minStock
            ? "low"
            : "ok",
    }));
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders(status?: string, limit = 20) {
  const orders = await prisma.order.findMany({
    where: status ? { status: status as never } : {},
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    total: Number(o.total),
    itemCount: o._count.items,
    tableNumber: o.tableNumber,
    createdAt: o.createdAt,
  }));
}

// ─── Daily Trend ──────────────────────────────────────────────────────────────

export async function getDailySalesTrend(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const sales = await prisma.dailySale.findMany({
    where: { date: { gte: since } },
    orderBy: { date: "asc" },
  });

  return sales.map((s) => ({
    date: s.date.toISOString().split("T")[0],
    revenue: Number(s.totalRevenue),
    orders: s.totalOrders,
  }));
}
