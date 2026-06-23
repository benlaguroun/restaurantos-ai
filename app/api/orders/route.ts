import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: status ? { status: status as never } : {},
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    prisma.order.count({
      where: status ? { status: status as never } : {},
    }),
  ]);

  return NextResponse.json({ orders, total, page, limit });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await request.json();

  const order = await prisma.order.update({
    where: { id },
    data: {
      status,
      completedAt: status === "DELIVERED" ? new Date() : undefined,
    },
  });

  return NextResponse.json(order);
}
