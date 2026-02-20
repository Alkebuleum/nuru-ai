import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "amvault-connect";
import "./styles/globals.css";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { INITIAL_ALERTS } from "./data/constants";
import { sendMessageToNuru } from "./services/nuruApi";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

// ── Welcome messages depending on auth state ───────────────────────────────
const WELCOME_SIGNED_OUT = [
  {
    id: 1,
    role: "assistant",
    text: "Welcome. I am Nuru — your guide through the Nuru Ecosystem.\n\nBefore I can help you, I need to know who I'm speaking with. Please connect your **AmVault** wallet using the button in the sidebar — or tap **Connect** in the header.\n\nDon't have an AmVault account yet? No problem — you can create one directly from the same connect button. It only takes a moment.\n\nOnce you're connected, I'll be ready to guide, protect, and navigate on your behalf. 🔐",
    timestamp: "",
  },
];

const welcomeSignedIn = (session) => [
  {
    id: 1,
    role: "assistant",
    text: `Welcome back${session.ain ? `, **${session.ain}**` : ""}. I'm Nuru — your Guardian, Translator, and Navigator in the Nuru Ecosystem.\n\nYour wallet is connected and I'm watching over it. What would you like to explore today?`,
    timestamp: "",
  },
];

// ── Inner app ──────────────────────────────────────────────────────────────
function NuruApp() {
  const { isMobile, isTablet } = useBreakpoint();
  const { session, status } = useAuth();

  const [messages, setMessages] = useState(WELCOME_SIGNED_OUT);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isTyping, setIsTyping] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [error, setError] = useState(null);
  const [apiHistory, setApiHistory] = useState([]);
  const [lastSession, setLastSession] = useState(null);

  // ── React to auth state changes ──────────────────────────────────────────
  useEffect(() => {
    if (status === "checking") return; // still loading, wait

    if (session && !lastSession) {
      // Just signed in — reset chat with personal welcome
      setMessages(welcomeSignedIn(session));
      setApiHistory([]);
      setLastSession(session);
    }

    if (!session && lastSession) {
      // Just signed out — reset to sign-in prompt
      setMessages(WELCOME_SIGNED_OUT);
      setApiHistory([]);
      setLastSession(null);
    }

    if (!session && !lastSession && status === "ready") {
      // Initial load, confirmed not signed in
      setMessages(WELCOME_SIGNED_OUT);
    }
  }, [session, status]); // eslint-disable-line

  // ── Handle user sending a message ───────────────────────────────────────
  const handleSend = async (text) => {
    // Guard — if not signed in, redirect to connect instead of calling API
    if (!session) {
      const nudge = {
        id: Date.now(),
        role: "assistant",
        text: "I'd love to help — but first I need to know who I'm speaking with. Please connect your **AmVault** wallet using the **Connect** button above. If you don't have one yet, you can create an account from the same button.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      // Show the user's message then the nudge
      setMessages(prev => [
        ...prev,
        { id: Date.now() - 1, role: "user", text, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        nudge,
      ]);
      return;
    }

    setError(null);

    const userMsg = {
      id: Date.now(),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Inject wallet context so Nuru knows who she's talking to
    const walletContext = `[WALLET CONTEXT — Address: ${session.address}${session.ain ? ` | AIN: ${session.ain}` : ""}. Reference naturally when relevant, do not repeat every message.]`;

    const updatedHistory = [
      ...apiHistory,
      { role: "user", content: `${walletContext}\n\n${text}` },
    ];

    try {
      const replyText = await sendMessageToNuru(updatedHistory);

      const replyMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, replyMsg]);
      setApiHistory([
        ...apiHistory,
        { role: "user", content: text },
        { role: "assistant", content: replyText },
      ]);

    } catch (err) {
      setError(err.message);
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      <div className="ambient-bg" />

      <Header
        onMenuToggle={() => setPanelOpen(o => !o)}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      {/* Error banner */}
      {error && (
        <div style={{
          position: "relative",
          zIndex: 15,
          background: "rgba(248,113,113,0.1)",
          borderBottom: "1px solid rgba(248,113,113,0.3)",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <span style={{ fontSize: 13, color: "#fca5a5" }}>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={{
            background: "none", border: "none",
            color: "#f87171", cursor: "pointer", fontSize: 18,
          }}>×</button>
        </div>
      )}

      <div style={{
        flex: 1, display: "flex",
        overflow: "hidden", position: "relative", zIndex: 1,
      }}>
        <Sidebar
          alerts={alerts}
          onDismiss={id => setAlerts(prev => prev.filter(a => a.id !== id))}
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
          isMobile={isMobile}
          isTablet={isTablet}
        />
        <ChatArea
          messages={messages}
          isTyping={isTyping}
          onSend={handleSend}
          isMobile={isMobile}
          isSignedIn={!!session}
        />
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider
      config={{
        appName: "Nuru AI",
        chainId: Number(process.env.REACT_APP_CHAIN_ID) || 237422,
        amvaultUrl: process.env.REACT_APP_AMVAULT_URL,
        debug: process.env.NODE_ENV === "development",
      }}
    >
      <NuruApp />
    </AuthProvider>
  );
}