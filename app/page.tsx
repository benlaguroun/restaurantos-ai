import Link from "next/link";

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <nav
        style={{ borderBottom: "1px solid #f0f0f0", padding: "1rem 1.5rem" }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 14,
              }}
            >
              🍽
            </div>
            <span style={{ fontWeight: 600, color: "#111" }}>
              RestaurantOS AI
            </span>
          </div>
          <Link
            href="/login"
            style={{
              background: "#f97316",
              color: "white",
              padding: "8px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "6rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#fff7ed",
            color: "#ea580c",
            fontSize: 12,
            fontWeight: 500,
            padding: "6px 12px",
            borderRadius: 999,
            border: "1px solid #fed7aa",
            marginBottom: 24,
          }}
        >
          ⚡ Powered by Google Gemini · Kaggle AI Agents Capstone
        </div>

        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          Your restaurant,{" "}
          <span style={{ color: "#f97316" }}>managed by AI</span>
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#6b7280",
            maxWidth: 600,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          A multi-agent system that analyzes your sales, monitors inventory, and
          delivers real-time business insights — just by asking a question.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/login"
            style={{
              background: "#f97316",
              color: "white",
              padding: "12px 24px",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            View Live Demo →
          </Link>
          <a
            href="https://github.com/benlaguroun/restaurantos-ai"
            target="_blank"
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              color: "#374151",
              padding: "12px 24px",
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            View on GitHub
          </a>
        </div>

        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>
          Demo: admin@restaurantos.ai · admin123
        </p>
      </section>

      {/* Features */}
      <section
        style={{
          background: "#f9fafb",
          borderTop: "1px solid #f0f0f0",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#111",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Everything a restaurant needs
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: "🤖",
                title: "AI Business Agent",
                desc: "Ask anything in plain English. The agent uses real-time data to answer revenue, inventory, and sales questions instantly.",
              },
              {
                icon: "📊",
                title: "Live Analytics",
                desc: "Revenue trends, top sellers, profit margins, and daily sales patterns — updated in real time from your order data.",
              },
              {
                icon: "🧾",
                title: "Order Management",
                desc: "Track every order from pending to delivered. Update statuses in one click and monitor table performance.",
              },
              {
                icon: "🍽",
                title: "Menu Management",
                desc: "Add, edit, and remove menu items. Track stock levels, profit margins, and get AI-powered promotion suggestions.",
              },
              {
                icon: "⚠️",
                title: "Inventory Alerts",
                desc: "Never run out of stock again. The system automatically flags items below minimum thresholds.",
              },
              {
                icon: "🔌",
                title: "MCP Server",
                desc: "All tools exposed via Model Context Protocol — enabling any MCP client to query your restaurant data.",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: "white",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  padding: 24,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#111",
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 11,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            Built with
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {[
              "Google Gemini 2.0",
              "Google ADK",
              "Next.js 16",
              "TypeScript",
              "Prisma ORM",
              "PostgreSQL",
              "MCP Server",
              "Auth.js v5",
              "Tailwind CSS v4",
            ].map((t) => (
              <span
                key={t}
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  color: "#6b7280",
                  fontSize: 12,
                  fontWeight: 500,
                  padding: "6px 12px",
                  borderRadius: 999,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ borderTop: "1px solid #f0f0f0", padding: "2rem 1.5rem" }}
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
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 12,
              }}
            >
              🍽
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
              RestaurantOS AI
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#9ca3af" }}>
            Kaggle 5-Day AI Agents Intensive · Agents for Business Track
          </p>
        </div>
      </footer>
    </main>
  );
}
