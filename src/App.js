import { useState } from "react";
import "./styles/globals.css";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { NURU_WELCOME, INITIAL_ALERTS } from "./data/constants";
import { sendMessageToNuru } from "./services/nuruApi";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

export default function App() {
  const { isMobile, isTablet } = useBreakpoint();

  const [messages, setMessages] = useState(NURU_WELCOME);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isTyping, setIsTyping] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [error, setError] = useState(null);

  // Keep a clean conversation history for the API
  // (separate from display messages which have extra UI fields)
  const [apiHistory, setApiHistory] = useState([]);

  const handleSend = async (text) => {
    setError(null);

    // Add user message to display
    const userMsg = {
      id: Date.now(),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Build updated history for API call
    const updatedHistory = [
      ...apiHistory,
      { role: "user", content: text },
    ];

    try {
      const replyText = await sendMessageToNuru(updatedHistory);

      // Add Nuru's reply to display
      const replyMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, replyMsg]);

      // Save full exchange to API history
      setApiHistory([
        ...updatedHistory,
        { role: "assistant", content: replyText },
      ]);

    } catch (err) {
      setError(err.message);
      // Remove the user message if API failed so they can retry
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setIsTyping(false);
    }
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
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
          <span style={{ fontSize: 13, color: "#fca5a5" }}>
            ⚠️ {error}
          </span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none", border: "none",
              color: "#f87171", cursor: "pointer", fontSize: 18,
            }}
          >×</button>
        </div>
      )}

      <div style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}>
        <Sidebar
          alerts={alerts}
          onDismiss={handleDismissAlert}
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
        />
      </div>
    </div>
  );
}