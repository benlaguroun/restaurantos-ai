"use client";

import Link from "next/link";
import { useState } from "react";

const DEMO_RESPONSES: Record<string, string> = {
  "What was my revenue this week?":
    "📊 This week's revenue is **$12,847.50** from 187 orders.\n\nThat's +8.3% compared to last week ($11,863.20). Your average order value is $68.70.\n\n💡 Strong performance — Friday and Saturday drove 42% of weekly revenue.",
  "Which items should I promote this weekend?":
    "🍔 Based on your last 30 days, I recommend promoting:\n\n1. **BBQ Bacon Burger** — 142 sold · 66% margin ⭐ Best choice\n2. **Double Smash Burger** — 128 sold · 62% margin\n3. **Chocolate Lava Cake** — 98 sold · 71% margin (great upsell)\n\n💡 The BBQ Bacon Burger has the highest volume AND strong margin. A weekend combo deal would maximize revenue.",
  "What do I need to restock?":
    "⚠️ 3 items need immediate attention:\n\n🔴 **Ribeye Steak** — 4 units left (min: 4) CRITICAL\n🟡 **Grilled Salmon** — 8 units left (min: 7) LOW\n🟡 **Tiramisu** — 10 units left (min: 9) LOW\n\n💡 Order Ribeye Steak today — you're already at minimum stock.",
  "How did sales trend this month?":
    "📈 Monthly revenue: **$48,230.00** from 701 orders.\n\nWeekend performance is 67% higher than weekdays. Your busiest days are Friday and Saturday.\n\nTop performing week was Week 2 at $13,847 — coinciding with your burger promotion.\n\n💡 Consider running promotions mid-week to balance revenue distribution.",
};

const SUGGESTED = [
  "What was my revenue this week?",
  "Which items should I promote this weekend?",
  "What do I need to restock?",
  "How did sales trend this month?",
];

interface Message {
  role: "user" | "agent";
  content: string;
  typing?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content:
        "👋 Hi! I'm the RestaurantOS AI agent. Ask me anything about your restaurant business — revenue, top sellers, inventory, promotions. Try one of the questions below!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = { role: "user", content: text };
    const typingMsg: Message = { role: "agent", content: "", typing: true };
    setMessages((prev) => [...prev, userMsg, typingMsg]);

    setTimeout(() => {
      const response =
        DEMO_RESPONSES[text] ||
        "🤖 Great question! In the live dashboard, I'd query your real database to answer this. Sign in to see your actual restaurant data.";

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "agent", content: response },
      ]);
      setLoading(false);
    }, 1500);
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* ── NAV ── */}
      <nav
        style={{
          borderBottom: "1px solid #f0ede8",
          padding: "0 2rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
            }}
          >
            🍽
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#111",
                lineHeight: 1,
              }}
            >
              RestaurantOS
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#f97316",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              AI PLATFORM
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href="https://github.com/benlaguroun/restaurantos-ai"
            target="_blank"
            style={{
              fontSize: 13,
              color: "#6b7280",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            GitHub
          </a>
          <Link
            href="/login"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "white",
              padding: "8px 20px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(249,115,22,0.3)",
            }}
          >
            Sign in →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "5rem 2rem 3rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* Left — copy */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: 999,
              padding: "5px 14px",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f97316",
                display: "inline-block",
              }}
            ></span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#ea580c" }}>
              Kaggle AI Agents Capstone · Agents for Business
            </span>
          </div>

          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            Your restaurant,
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #f97316, #dc2626)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              run by AI
            </span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "#6b7280",
              lineHeight: 1.7,
              marginBottom: 32,
              maxWidth: 460,
            }}
          >
            A multi-agent system that analyzes your real sales data, monitors
            inventory, and delivers instant business intelligence — just by
            asking a question.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            <Link
              href="/login"
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "white",
                padding: "13px 28px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(249,115,22,0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              View Live Demo →
            </Link>
            <a
              href="https://github.com/benlaguroun/restaurantos-ai"
              target="_blank"
              style={{
                background: "white",
                border: "1.5px solid #e5e7eb",
                color: "#374151",
                padding: "13px 28px",
                borderRadius: 10,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ⭐ GitHub
            </a>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            {[
              { value: "2,635+", label: "Orders analyzed" },
              { value: "96.2%", label: "Agent accuracy" },
              { value: "8.6/10", label: "Response quality" },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>
                  {stat.value}
                </div>
                <div
                  style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Live chatbot */}
        <div
          style={{
            background: "white",
            borderRadius: 20,
            border: "1.5px solid #e5e7eb",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>
                RestaurantOS AI Agent
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
                Powered by Google Gemini · ADK
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4ade80",
                }}
              ></div>
              <span
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Live Demo
              </span>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              height: 300,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "#fafaf9",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  gap: 8,
                }}
              >
                {msg.role === "agent" && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #f97316, #ea580c)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    🤖
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #f97316, #ea580c)"
                        : "white",
                    color: msg.role === "user" ? "white" : "#374151",
                    fontSize: 13,
                    lineHeight: 1.6,
                    border: msg.role === "agent" ? "1px solid #e5e7eb" : "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.typing ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                        padding: "2px 0",
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#f97316",
                            animation: `bounce 1s ${i * 0.15}s infinite`,
                          }}
                        ></div>
                      ))}
                    </div>
                  ) : (
                    msg.content
                      .split("**")
                      .map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
                      )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested questions */}
          {messages.length <= 2 && (
            <div
              style={{
                padding: "8px 16px",
                background: "#fafaf9",
                borderTop: "1px solid #f0ede8",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#9ca3af",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                Try asking
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: 12,
                      color: "#f97316",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: 500,
                      transition: "all 0.15s",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: "12px 16px",
              background: "white",
              borderTop: "1px solid #f0ede8",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask about your restaurant..."
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                fontSize: 13,
                outline: "none",
                color: "#374151",
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "9px 16px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{
          background: "#fafaf9",
          borderTop: "1px solid #f0ede8",
          borderBottom: "1px solid #f0ede8",
          padding: "5rem 2rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "#111",
                marginBottom: 12,
                letterSpacing: "-0.02em",
              }}
            >
              Everything a restaurant needs
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "#6b7280",
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              One platform. Real data. AI-powered insights.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                icon: "🤖",
                title: "AI Business Agent",
                desc: "Ask anything in plain English. The agent queries your real database and gives specific, data-backed answers — never guesses.",
                color: "#fff7ed",
                border: "#fed7aa",
              },
              {
                icon: "📊",
                title: "Live Analytics",
                desc: "Revenue trends, top sellers, profit margins, and daily sales patterns — updated in real time from your order history.",
                color: "#f0fdf4",
                border: "#bbf7d0",
              },
              {
                icon: "🧾",
                title: "Order Management",
                desc: "Track every order from pending to delivered. Update statuses instantly and monitor your entire kitchen workflow.",
                color: "#eff6ff",
                border: "#bfdbfe",
              },
              {
                icon: "🍽",
                title: "Menu Management",
                desc: "Full CRUD on menu items. Track costs, margins, and stock levels. Get AI recommendations on what to promote.",
                color: "#fdf4ff",
                border: "#e9d5ff",
              },
              {
                icon: "⚠️",
                title: "Inventory Alerts",
                desc: "Never run out of stock again. Automatic alerts when items drop below minimum threshold, ranked by urgency.",
                color: "#fff1f2",
                border: "#fecdd3",
              },
              {
                icon: "🔌",
                title: "MCP Server",
                desc: "All restaurant tools exposed via Model Context Protocol. Any MCP-compatible AI client can connect and query your data.",
                color: "#f0fdfa",
                border: "#99f6e4",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: "white",
                  borderRadius: 16,
                  border: "1.5px solid #e5e7eb",
                  padding: "24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: f.color,
                    border: `1.5px solid ${f.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#111",
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 2rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#111",
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            How the agent works
          </h2>
          <p style={{ fontSize: 16, color: "#6b7280" }}>
            Real data. Real answers. No hallucinations.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {[
            {
              step: "01",
              icon: "💬",
              title: "You ask",
              desc: "Type any business question in plain English",
            },
            {
              step: "02",
              icon: "🔧",
              title: "Agent selects tool",
              desc: "Gemini picks the right database function to call",
            },
            {
              step: "03",
              icon: "🗄️",
              title: "Real data fetched",
              desc: "Queries your actual PostgreSQL database",
            },
            {
              step: "04",
              icon: "✅",
              title: "Specific answer",
              desc: "Response with real numbers and recommendations",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "24px 16px",
                background: "white",
                borderRadius: 16,
                border: "1.5px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#f97316",
                  letterSpacing: "0.05em",
                  marginBottom: 12,
                }}
              >
                STEP {item.step}
              </div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111",
                  marginBottom: 8,
                }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
                {item.desc}
              </div>
              {i < 3 && (
                <div
                  style={{
                    position: "absolute",
                    right: -20,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 18,
                    color: "#d1d5db",
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ background: "#111", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: 12,
              color: "#6b7280",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 24,
            }}
          >
            Built with
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
            }}
          >
            {[
              { label: "Google Gemini 2.0", color: "#4285F4" },
              { label: "Google ADK", color: "#34A853" },
              { label: "Next.js 16", color: "#ffffff" },
              { label: "TypeScript", color: "#3178C6" },
              { label: "Prisma ORM", color: "#5A67D8" },
              { label: "PostgreSQL", color: "#336791" },
              { label: "MCP Server", color: "#F97316" },
              { label: "Auth.js v5", color: "#7C3AED" },
              { label: "Tailwind CSS v4", color: "#06B6D4" },
              { label: "Neon DB", color: "#00E599" },
              { label: "Vercel", color: "#ffffff" },
              { label: "Recharts", color: "#FF6384" },
            ].map((t) => (
              <span
                key={t.label}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: t.color,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 14px",
                  borderRadius: 999,
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#111",
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to see it live?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#6b7280",
              marginBottom: 32,
              lineHeight: 1.7,
            }}
          >
            Log in with the demo credentials and explore real restaurant data
            powered by AI.
          </p>
          <Link
            href="/login"
            style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "white",
              padding: "15px 36px",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 15,
              fontWeight: 700,
              boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
              display: "inline-block",
            }}
          >
            Open Live Dashboard →
          </Link>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>
            admin@restaurantos.ai · admin123 · No signup required
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{ borderTop: "1px solid #f0ede8", padding: "1.5rem 2rem" }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🍽
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
              RestaurantOS AI
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>
            Kaggle 5-Day AI Agents Intensive · Agents for Business Track · Built
            with Google Gemini + ADK
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          section { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
