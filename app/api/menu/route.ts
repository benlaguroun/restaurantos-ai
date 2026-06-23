import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const item = await prisma.menuItem.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      cost: body.cost,
      stock: body.stock,
      minStock: body.minStock,
      categoryId: body.categoryId,
      tags: body.tags ?? [],
      isAvailable: body.isAvailable ?? true,
    },
    include: { category: true },
  });

  return NextResponse.json(item);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  const item = await prisma.menuItem.update({
    where: { id },
    data,
    include: { category: true },
  });

  return NextResponse.json(item);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.menuItem.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
