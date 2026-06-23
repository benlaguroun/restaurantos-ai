"use client";

import { useEffect, useState } from "react";

const STATUSES = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED",
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border border-blue-200",
  PREPARING: "bg-orange-50 text-orange-700 border border-orange-200",
  READY: "bg-green-50 text-green-700 border border-green-200",
  DELIVERED: "bg-gray-50 text-gray-600 border border-gray-200",
  CANCELLED: "bg-red-50 text-red-600 border border-red-200",
};

const nextStatus: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  menuItem: { name: string };
}

interface Order {
  id: string;
  orderNumber: number;
  status: string;
  total: number;
  tableNumber: number | null;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchOrders(status: string) {
    setLoading(true);
    const url =
      status === "ALL" ? "/api/orders" : `/api/orders?status=${status}`;
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.orders);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders(activeStatus);
  }, [activeStatus]);

  async function updateStatus(orderId: string, newStatus: string) {
    setUpdating(orderId);
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    await fetchOrders(activeStatus);
    setUpdating(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{total} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeStatus === s
                ? "bg-orange-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            No orders found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Table
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <div className="max-w-xs">
                      {order.items.map((item) => (
                        <span key={item.id} className="block truncate">
                          {item.quantity}× {item.menuItem.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.tableNumber ? `Table ${order.tableNumber}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {nextStatus[order.status] && (
                      <button
                        onClick={() =>
                          updateStatus(order.id, nextStatus[order.status])
                        }
                        disabled={updating === order.id}
                        className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2 py-1 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50"
                      >
                        {updating === order.id
                          ? "…"
                          : `→ ${nextStatus[order.status]}`}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
