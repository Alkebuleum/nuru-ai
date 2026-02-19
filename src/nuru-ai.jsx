import { useState, useRef, useEffect } from "react";

const NURU_WELCOME = [
  {
    id: 1,
    role: "assistant",
    text: "Greetings. I am Nuru — your guide through the decentralized world.\n\nI speak blockchain so you don't have to. Whether you're sending tokens, signing a contract, or navigating jollofswap, I'll translate every step into plain language before you commit to anything.\n\nYour sovereignty is my purpose. What would you like to explore today?",
    timestamp: "Now",
  },
];

const GUARDIAN_ALERTS = [
  {
    id: 1,
    level: "warning",
    title: "High Gas Detected",
    body: "Network congestion is high. Estimated fee: $18.40. Consider waiting 20–40 min for lower costs.",
    icon: "⚠️",
  },
  {
    id: 2,
    level: "info",
    title: "New Contract Interaction",
    body: "jollofswap.com is requesting token approval. Nuru has reviewed this contract — it appears legitimate.",
    icon: "🔍",
  },
];

const CONNECTIONS = [
  { label: "Wallet", status: "connected", detail: "0x4f2a...c91b", color: "#4ade80" },
  { label: "chat54", status: "idle", detail: "Not linked", color: "#fbbf24" },
  { label: "Alkebuleum", status: "synced", detail: "Block #2,847,193", color: "#4ade80" },
  { label: "jollofswap", status: "available", detail: "Ready", color: "#60a5fa" },
];

const NuruLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = 50 + 18 * Math.cos(angle);
      const y1 = 50 + 18 * Math.sin(angle);
      const x2 = 50 + 42 * Math.cos(angle);
      const y2 = 50 + 42 * Math.sin(angle);
      const gold = i < 6;
      return (
        <line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={gold ? "#C9A84C" : "#60a5fa"}
          strokeWidth="5"
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

const StatusDot = ({ color }) => (
  <span style={{
    display: "inline-block",
    width: 8, height: 8,
    borderRadius: "50%",
    background: color,
    boxShadow: `0 0 6px ${color}`,
    marginRight: 6,
    flexShrink: 0,
  }} />
);

const GuardianAlert = ({ alert, onDismiss }) => {
  const colors = {
    warning: { bg: "rgba(251,191,36,0.08)", border: "#C9A84C", text: "#fde68a" },
    info: { bg: "rgba(96,165,250,0.08)", border: "#60a5fa", text: "#bfdbfe" },
    danger: { bg: "rgba(248,113,113,0.08)", border: "#f87171", text: "#fecaca" },
  };
  const c = colors[alert.level];
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 10,
      padding: "12px 14px",
      marginBottom: 10,
      position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span>{alert.icon}</span>
        <span style={{ color: c.text, fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
          {alert.title}
        </span>
        <button
          onClick={() => onDismiss(alert.id)}
          style={{
            marginLeft: "auto", background: "none", border: "none",
            color: "#6b7280", cursor: "pointer", fontSize: 16, lineHeight: 1,
          }}
        >×</button>
      </div>
      <p style={{ color: "#94a3b8", fontSize: 12, margin: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
        {alert.body}
      </p>
    </div>
  );
};

const ChatBubble = ({ msg }) => {
  const isAssistant = msg.role === "assistant";
  return (
    <div style={{
      display: "flex",
      flexDirection: isAssistant ? "row" : "row-reverse",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 20,
    }}>
      {isAssistant && (
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #0f1a2e, #1e3a5f)",
          border: "1.5px solid #C9A84C",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 0 12px rgba(201,168,76,0.3)",
        }}>
          <NuruLogo size={18} />
        </div>
      )}
      <div style={{
        maxWidth: "75%",
        background: isAssistant
          ? "linear-gradient(135deg, rgba(15,26,46,0.9), rgba(30,58,95,0.6))"
          : "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))",
        border: isAssistant ? "1px solid rgba(96,165,250,0.2)" : "1px solid rgba(201,168,76,0.4)",
        borderRadius: isAssistant ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
        padding: "12px 16px",
      }}>
        {msg.text.split("\n\n").map((para, i) => (
          <p key={i} style={{
            margin: i === 0 ? 0 : "8px 0 0 0",
            color: isAssistant ? "#e2e8f0" : "#fde68a",
            fontSize: 14,
            lineHeight: 1.65,
            fontFamily: "'DM Sans', sans-serif",
          }}>{para}</p>
        ))}
        <span style={{ fontSize: 10, color: "#475569", display: "block", marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>
          {msg.timestamp}
        </span>
      </div>
    </div>
  );
};

export default function NuruApp() {
  const [messages, setMessages] = useState(NURU_WELCOME);
  const [input, setInput] = useState("");
  const [alerts, setAlerts] = useState(GUARDIAN_ALERTS);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const RESPONSES = [
    "I've analyzed your request. On the Alkebuleum network, this transaction would cost approximately $2.10 in gas at current rates. The receiving address checks out as verified. Shall I proceed, or would you like me to schedule this for off-peak hours?",
    "Smart contracts can seem intimidating, but think of them as vending machines: you put something in, you get something out — and no human can interfere with the outcome. This one specifically handles token swaps. I'll walk you through each permission before you sign.",
    "Your wallet is secure. I'm monitoring for phishing attempts and unusual approval requests continuously. The chat54 integration will further encrypt your communications end-to-end once linked. You're in good hands.",
    "jollofswap currently shows a 0.3% fee on this pair with minimal slippage. Liquidity is healthy. I recommend proceeding — but as always, never invest more than you're comfortable holding through volatility.",
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: input, timestamp: "Now" };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        role: "assistant",
        text: RESPONSES[Math.floor(Math.random() * RESPONSES.length)],
        timestamp: "Now",
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1600);
  };

  const dismissAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

  const PROMPTS = ["What is self-custody?", "Check my wallet security", "Explain this contract", "Swap on jollofswap"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #050d1a 0%, #0a1628 50%, #070e1d 100%)",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      color: "#e2e8f0",
    }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(201,168,76,0.04) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 20%, rgba(96,165,250,0.05) 0%, transparent 70%)",
      }} />

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 10,
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        background: "rgba(5,13,26,0.85)",
        backdropFilter: "blur(20px)",
        padding: "0 24px",
        height: 60,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg, #0f1a2e, #1e3a5f)",
            border: "1.5px solid #C9A84C",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(201,168,76,0.25)",
          }}>
            <NuruLogo size={22} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.05em", color: "#f1f5f9", lineHeight: 1.1, fontFamily: "'Syne', sans-serif" }}>
              Nuru <span style={{ color: "#C9A84C", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em" }}>AI</span>
            </div>
            <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em" }}>DECENTRALIZED GUIDE · amNATION</div>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            padding: "5px 12px", borderRadius: 20,
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.3)",
            fontSize: 11, color: "#4ade80", letterSpacing: "0.05em",
          }}>
            <StatusDot color="#4ade80" />GUARDIAN ACTIVE
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#94a3b8", padding: "6px 12px", cursor: "pointer", fontSize: 12,
            }}
          >
            {sidebarOpen ? "Hide Panel" : "Show Panel"}
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, position: "relative", zIndex: 1, overflow: "hidden", height: "calc(100vh - 60px)" }}>
        
        {/* Sidebar */}
        {sidebarOpen && (
          <aside style={{
            width: 280,
            borderRight: "1px solid rgba(201,168,76,0.1)",
            background: "rgba(5,13,26,0.6)",
            backdropFilter: "blur(20px)",
            padding: 20,
            overflowY: "auto",
            flexShrink: 0,
          }}>
            {/* Guardian Alerts */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                color: "#C9A84C", marginBottom: 12, textTransform: "uppercase",
              }}>
                🛡️ Guardian Alerts
              </div>
              {alerts.length === 0 ? (
                <div style={{
                  padding: "14px", borderRadius: 10, textAlign: "center",
                  background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.2)",
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>✓</div>
                  <div style={{ fontSize: 12, color: "#4ade80" }}>All clear. No threats detected.</div>
                </div>
              ) : (
                alerts.map(a => <GuardianAlert key={a.id} alert={a} onDismiss={dismissAlert} />)
              )}
            </div>

            {/* Connections */}
            <div>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                color: "#60a5fa", marginBottom: 12, textTransform: "uppercase",
              }}>
                ◈ Connections
              </div>
              {CONNECTIONS.map(c => (
                <div key={c.label} style={{
                  display: "flex", alignItems: "center",
                  padding: "10px 12px", borderRadius: 8, marginBottom: 6,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <StatusDot color={c.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{c.label}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{c.detail}</div>
                  </div>
                  <span style={{ fontSize: 10, color: c.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Ecosystem */}
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
                color: "#94a3b8", marginBottom: 12, textTransform: "uppercase",
              }}>
                ◆ Ecosystem
              </div>
              {[
                { name: "chat54", desc: "Decentralized messaging", ready: false },
                { name: "jollofswap", desc: "Native DEX", ready: true },
                { name: "Alkebuleum", desc: "Base network", ready: true },
              ].map(e => (
                <div key={e.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px", borderRadius: 8, marginBottom: 6,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{e.name}</div>
                    <div style={{ fontSize: 10, color: "#475569" }}>{e.desc}</div>
                  </div>
                  <span style={{ fontSize: 10, color: e.ready ? "#C9A84C" : "#475569" }}>
                    {e.ready ? "→" : "Soon"}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Chat Area */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
            {messages.map(msg => <ChatBubble key={msg.id} msg={msg} />)}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #0f1a2e, #1e3a5f)",
                  border: "1.5px solid #C9A84C",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 12px rgba(201,168,76,0.3)",
                }}>
                  <NuruLogo size={18} />
                </div>
                <div style={{
                  background: "rgba(15,26,46,0.9)",
                  border: "1px solid rgba(96,165,250,0.2)",
                  borderRadius: "4px 16px 16px 16px",
                  padding: "12px 20px",
                  display: "flex", gap: 6, alignItems: "center",
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: "#C9A84C",
                      display: "inline-block",
                      animation: "pulse 1.2s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts */}
          <div style={{ padding: "0 32px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => { setInput(p); }}
                style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 12,
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  color: "#fde68a", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            borderTop: "1px solid rgba(201,168,76,0.1)",
            padding: "16px 32px",
            background: "rgba(5,13,26,0.7)",
            backdropFilter: "blur(20px)",
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                flex: 1, display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "0 16px",
                transition: "border-color 0.2s",
              }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Ask Nuru anything about blockchain, your wallet, or DeFi…"
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "#e2e8f0", fontSize: 14, padding: "14px 0",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
              <button
                onClick={sendMessage}
                style={{
                  padding: "14px 24px", borderRadius: 12,
                  background: "linear-gradient(135deg, #C9A84C, #a0782e)",
                  border: "none", color: "#050d1a", fontWeight: 700,
                  fontSize: 14, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
                  transition: "opacity 0.2s",
                }}
              >
                Send
              </button>
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: "#334155", textAlign: "center" }}>
              Nuru never stores your private keys · Powered by Alkebuleum · amNation ecosystem
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
