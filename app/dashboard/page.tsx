import {
  getRevenue,
  getLowStockItems,
  getOrders,
} from "@/lib/tools/restaurant-tools";

export default async function DashboardPage() {
  const [revenue, lowStock, recentOrders] = await Promise.all([
    getRevenue("today"),
    getLowStockItems(),
    getOrders(undefined, 5),
  ]);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border border-blue-200",
    PREPARING: "bg-orange-50 text-orange-700 border border-orange-200",
    READY: "bg-green-50 text-green-700 border border-green-200",
    DELIVERED: "bg-gray-50 text-gray-600 border border-gray-200",
    CANCELLED: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">💰</span>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                revenue.change >= 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {revenue.change >= 0 ? "+" : ""}
              {revenue.change}%
            </span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            ${revenue.totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Today's Revenue</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">🧾</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {revenue.totalOrders}
          </p>
          <p className="text-sm text-gray-500 mt-1">Orders Today</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            ${revenue.avgOrderValue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Avg Order Value</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">⚠️</span>
          </div>
          <p
            className={`text-2xl font-semibold ${
              lowStock.length > 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {lowStock.length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Low Stock Alerts</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Orders
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">
              No orders yet today.
            </p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">
                    #{order.orderNumber}
                  </span>
                  <span className="text-sm text-gray-500">
                    {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                  </span>
                  {order.tableNumber && (
                    <span className="text-sm text-gray-400">
                      Table {order.tableNumber}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">
                    ${order.total.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
