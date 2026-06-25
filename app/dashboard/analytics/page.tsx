"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface RevenueData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  change: number;
}

interface TopItem {
  id: string;
  name: string;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
  margin: number;
}

interface TrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface LowStockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  urgency: string;
}

interface AnalyticsData {
  week: RevenueData;
  month: RevenueData;
  topItems: TopItem[];
  trend: TrendPoint[];
  lowStock: LowStockItem[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  async function fetchData(d: number) {
    setLoading(true);
    const res = await fetch(`/api/analytics?days=${d}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    fetchData(days);
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Loading analytics…</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Business performance overview
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Weekly Revenue",
            value: `$${data.week.totalRevenue.toLocaleString()}`,
            change: data.week.change,
            icon: "💰",
          },
          {
            label: "Monthly Revenue",
            value: `$${data.month.totalRevenue.toLocaleString()}`,
            change: data.month.change,
            icon: "📅",
          },
          {
            label: "Weekly Orders",
            value: data.week.totalOrders,
            change: null,
            icon: "🧾",
          },
          {
            label: "Avg Order Value",
            value: `$${data.week.avgOrderValue.toFixed(2)}`,
            change: null,
            icon: "📊",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              {card.change !== null && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    card.change >= 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {card.change >= 0 ? "+" : ""}
                  {card.change}%
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Revenue Trend
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v.slice(5)}
            />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              labelStyle={{ fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Top Selling Items
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data.topItems.slice(0, 7)}
              layout="vertical"
              margin={{ left: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11 }}
                width={80}
              />
              <Tooltip
                formatter={(value) => [Number(value), "Units sold"]}
                labelStyle={{ fontSize: 12 }}
              />
              <Bar
                dataKey="totalQuantity"
                fill="#f97316"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Low Stock Alerts
          </h2>
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              ✅ All items are well stocked
            </p>
          ) : (
            <div className="space-y-3">
              {data.lowStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {item.currentStock} / {item.minStock} min
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.urgency === "critical"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
