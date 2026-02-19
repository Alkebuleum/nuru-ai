import { useState } from "react";
import "./styles/globals.css";
import { useBreakpoint } from "./hooks/useBreakpoint";
import { NURU_WELCOME, INITIAL_ALERTS, NURU_RESPONSES } from "./data/constants";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

export default function App() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [messages, setMessages] = useState(NURU_WELCOME);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isTyping, setIsTyping] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSend = (text) => {
    const userMsg = {
      id: Date.now(),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        role: "assistant",
        text: NURU_RESPONSES[Math.floor(Math.random() * NURU_RESPONSES.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1600 + Math.random() * 800);
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={{
      height: "100dvh",           // dynamic viewport height — fixes mobile browsers
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient background layer */}
      <div className="ambient-bg" />

      {/* Header */}
      <Header
        onMenuToggle={() => setPanelOpen(o => !o)}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      {/* Body */}
      <div style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Sidebar — desktop always visible; mobile/tablet as overlay */}
        <Sidebar
          alerts={alerts}
          onDismiss={handleDismissAlert}
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Main chat */}
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