import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(rand(10, 22), rand(0, 59), 0, 0);
  return d;
}

function weightedRandom<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((sum, i) => sum + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

const CATEGORIES = [
  { name: "Starters", sortOrder: 1 },
  { name: "Burgers", sortOrder: 2 },
  { name: "Mains", sortOrder: 3 },
  { name: "Pasta", sortOrder: 4 },
  { name: "Salads", sortOrder: 5 },
  { name: "Desserts", sortOrder: 6 },
  { name: "Drinks", sortOrder: 7 },
];

const MENU_ITEMS = [
  {
    name: "Crispy Calamari",
    category: "Starters",
    price: 12.5,
    cost: 3.2,
    stock: 80,
    tags: ["popular"],
  },
  {
    name: "Bruschetta",
    category: "Starters",
    price: 9.0,
    cost: 2.1,
    stock: 120,
    tags: ["vegan"],
  },
  {
    name: "Chicken Wings",
    category: "Starters",
    price: 13.5,
    cost: 4.0,
    stock: 60,
    tags: ["popular"],
  },
  {
    name: "Garlic Bread",
    category: "Starters",
    price: 6.5,
    cost: 1.2,
    stock: 150,
    tags: ["vegetarian"],
  },
  {
    name: "Classic Cheeseburger",
    category: "Burgers",
    price: 16.0,
    cost: 5.5,
    stock: 90,
    tags: ["popular"],
  },
  {
    name: "BBQ Bacon Burger",
    category: "Burgers",
    price: 18.5,
    cost: 6.2,
    stock: 75,
    tags: ["bestseller"],
  },
  {
    name: "Veggie Burger",
    category: "Burgers",
    price: 15.5,
    cost: 4.5,
    stock: 45,
    tags: ["vegan"],
  },
  {
    name: "Double Smash Burger",
    category: "Burgers",
    price: 21.0,
    cost: 8.0,
    stock: 50,
    tags: ["new"],
  },
  {
    name: "Grilled Salmon",
    category: "Mains",
    price: 24.0,
    cost: 9.5,
    stock: 35,
    tags: ["healthy"],
  },
  {
    name: "Chicken Parmigiana",
    category: "Mains",
    price: 22.0,
    cost: 7.0,
    stock: 55,
    tags: ["popular"],
  },
  {
    name: "Ribeye Steak",
    category: "Mains",
    price: 38.0,
    cost: 16.0,
    stock: 20,
    tags: ["premium"],
  },
  {
    name: "Fish & Chips",
    category: "Mains",
    price: 19.5,
    cost: 6.5,
    stock: 65,
    tags: [],
  },
  {
    name: "Spaghetti Carbonara",
    category: "Pasta",
    price: 17.0,
    cost: 4.5,
    stock: 80,
    tags: ["popular"],
  },
  {
    name: "Penne Arrabbiata",
    category: "Pasta",
    price: 15.0,
    cost: 3.5,
    stock: 90,
    tags: ["vegan"],
  },
  {
    name: "Linguine Seafood",
    category: "Pasta",
    price: 22.0,
    cost: 8.0,
    stock: 50,
    tags: ["premium"],
  },
  {
    name: "Rigatoni Bolognese",
    category: "Pasta",
    price: 16.5,
    cost: 5.0,
    stock: 70,
    tags: [],
  },
  {
    name: "Caesar Salad",
    category: "Salads",
    price: 13.5,
    cost: 3.0,
    stock: 100,
    tags: ["healthy"],
  },
  {
    name: "Greek Salad",
    category: "Salads",
    price: 12.0,
    cost: 2.8,
    stock: 90,
    tags: ["vegetarian"],
  },
  {
    name: "Quinoa Power Bowl",
    category: "Salads",
    price: 14.5,
    cost: 3.8,
    stock: 55,
    tags: ["vegan", "new"],
  },
  {
    name: "Tiramisu",
    category: "Desserts",
    price: 9.0,
    cost: 2.5,
    stock: 45,
    tags: ["popular"],
  },
  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 10.5,
    cost: 3.0,
    stock: 40,
    tags: ["bestseller"],
  },
  {
    name: "Gelato 3 Scoops",
    category: "Desserts",
    price: 7.5,
    cost: 2.0,
    stock: 100,
    tags: [],
  },
  {
    name: "House Wine",
    category: "Drinks",
    price: 8.0,
    cost: 2.5,
    stock: 200,
    tags: [],
  },
  {
    name: "Craft Beer",
    category: "Drinks",
    price: 7.5,
    cost: 2.0,
    stock: 150,
    tags: [],
  },
  {
    name: "Fresh Lemonade",
    category: "Drinks",
    price: 5.0,
    cost: 0.8,
    stock: 200,
    tags: [],
  },
  {
    name: "Cappuccino",
    category: "Drinks",
    price: 4.5,
    cost: 0.7,
    stock: 500,
    tags: [],
  },
];

const ITEM_WEIGHTS: Record<string, number> = {
  "BBQ Bacon Burger": 10,
  "Double Smash Burger": 9,
  "Classic Cheeseburger": 9,
  "Chicken Parmigiana": 8,
  "Spaghetti Carbonara": 8,
  "Chocolate Lava Cake": 7,
  Tiramisu: 7,
  "Crispy Calamari": 7,
  Cappuccino: 8,
  "House Wine": 7,
};

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean
  await prisma.agentConversation.deleteMany();
  await prisma.dailySale.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Cleaned existing data");

  // Users
  const passwordHash = await hash("admin123", 12);
  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@restaurantos.ai",
        passwordHash,
        role: "ADMIN",
      },
      {
        name: "Manager Sam",
        email: "manager@restaurantos.ai",
        passwordHash,
        role: "MANAGER",
      },
    ],
  });
  console.log("✓ Created users");

  // Categories
  const categories = await Promise.all(
    CATEGORIES.map((c) => prisma.category.create({ data: c })),
  );
  const categoryMap = Object.fromEntries(categories.map((c) => [c.name, c.id]));
  console.log("✓ Created categories");

  // Menu items
  const menuItems = await Promise.all(
    MENU_ITEMS.map((item) =>
      prisma.menuItem.create({
        data: {
          name: item.name,
          price: item.price,
          cost: item.cost,
          stock: item.stock,
          minStock: Math.floor(item.stock * 0.2),
          tags: item.tags,
          categoryId: categoryMap[item.category],
          isAvailable: true,
        },
      }),
    ),
  );
  console.log(`✓ Created ${menuItems.length} menu items`);

  // Orders — 60 days
  const weightedItems = menuItems.map((item) => ({
    value: item,
    weight: ITEM_WEIGHTS[item.name] ?? 4,
  }));

  let totalOrders = 0;

  for (let day = 60; day >= 0; day--) {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - day);
    const dayOfWeek = baseDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const ordersToday = isWeekend ? rand(45, 70) : rand(25, 45);

    let dayRevenue = 0;
    const ordersData: {
      status: "PENDING" | "DELIVERED" | "CANCELLED";
      subtotal: number;
      tax: number;
      total: number;
      createdAt: Date;
      orderItems: { menuItemId: string; quantity: number; unitPrice: number }[];
    }[] = [];

    for (let o = 0; o < ordersToday; o++) {
      const itemCount = rand(1, 4);
      const orderItems: {
        menuItemId: string;
        quantity: number;
        unitPrice: number;
      }[] = [];

      for (let i = 0; i < itemCount; i++) {
        const item = weightedRandom(weightedItems);
        const quantity = rand(1, 3);
        const existing = orderItems.find((oi) => oi.menuItemId === item.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          orderItems.push({
            menuItemId: item.id,
            quantity,
            unitPrice: Number(item.price),
          });
        }
      }

      const subtotal = orderItems.reduce(
        (sum, oi) => sum + oi.unitPrice * oi.quantity,
        0,
      );
      const tax = parseFloat((subtotal * 0.1).toFixed(2));
      const total = parseFloat((subtotal + tax).toFixed(2));
      const createdAt = daysAgo(day);
      const status =
        day === 0
          ? "PENDING"
          : weightedRandom([
              { value: "DELIVERED" as const, weight: 85 },
              { value: "CANCELLED" as const, weight: 15 },
            ]);

      ordersData.push({ status, subtotal, tax, total, createdAt, orderItems });
      if (status === "DELIVERED") dayRevenue += total;
      totalOrders++;
    }

    // Create orders for this day
    for (const o of ordersData) {
      await prisma.order.create({
        data: {
          status: o.status,
          tableNumber: rand(1, 20),
          subtotal: o.subtotal,
          tax: o.tax,
          total: o.total,
          createdAt: o.createdAt,
          updatedAt: o.createdAt,
          completedAt:
            o.status === "DELIVERED"
              ? new Date(o.createdAt.getTime() + rand(15, 45) * 60000)
              : null,
          items: {
            create: o.orderItems.map((oi) => ({
              menuItemId: oi.menuItemId,
              quantity: oi.quantity,
              unitPrice: oi.unitPrice,
              subtotal: parseFloat((oi.unitPrice * oi.quantity).toFixed(2)),
            })),
          },
        },
      });
    }

    // Daily sales aggregate
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - day);
    dayDate.setHours(0, 0, 0, 0);

    await prisma.dailySale.create({
      data: {
        date: dayDate,
        totalRevenue: parseFloat(dayRevenue.toFixed(2)),
        totalOrders: ordersToday,
        totalCovers: rand(ordersToday, ordersToday * 2),
        avgOrderValue: parseFloat((dayRevenue / ordersToday).toFixed(2)),
      },
    });

    process.stdout.write(`\r⏳ Processing day ${60 - day + 1}/61...`);
  }

  console.log(`\n✓ Created ${totalOrders} orders across 60 days`);

  const totalRevenue = await prisma.dailySale.aggregate({
    _sum: { totalRevenue: true },
  });

  console.log(
    `\n📊 Total revenue seeded: $${Number(totalRevenue._sum.totalRevenue).toFixed(2)}`,
  );
  console.log(`🔑 Login: admin@restaurantos.ai / admin123`);
  console.log(`✅ Seed complete!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
