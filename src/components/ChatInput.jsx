import { useState } from "react";
import { useAuth } from "amvault-connect";

export default function ChatInput({ onSend, disabled, isMobile }) {
    const [value, setValue] = useState("");
    const { session, signin, status } = useAuth();
    const isConnecting = status === "checking";

    const handleSend = () => {
        if (!value.trim() || disabled) return;
        onSend(value.trim());
        setValue("");
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ── Signed out state — show connect prompt instead of input ───────────────
    if (!session) {
        return (
            <div style={{
                borderTop: "1px solid var(--border-gold)",
                padding: isMobile ? "16px" : "16px 28px",
                background: "rgba(5,13,26,0.85)",
                backdropFilter: "blur(20px)",
                flexShrink: 0,
            }}>
                <button
                    onClick={signin}
                    disabled={isConnecting}
                    style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "var(--radius-md)",
                        background: isConnecting
                            ? "rgba(201,168,76,0.2)"
                            : "linear-gradient(135deg, var(--gold), var(--gold-dim))",
                        border: "none",
                        color: isConnecting ? "rgba(5,13,26,0.4)" : "var(--navy-deepest)",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: isConnecting ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-body)",
                        letterSpacing: "0.05em",
                        boxShadow: isConnecting ? "none" : "0 4px 20px var(--gold-glow)",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    {isConnecting ? (
                        <>
                            <span style={{
                                width: 14, height: 14, borderRadius: "50%",
                                border: "2px solid rgba(5,13,26,0.3)",
                                borderTopColor: "var(--navy-deepest)",
                                display: "inline-block",
                                animation: "spin 0.8s linear infinite",
                            }} />
                            Connecting to AmVault…
                        </>
                    ) : (
                        <>
                            <span style={{ fontSize: 18 }}>🔐</span>
                            Connect AmVault to start chatting
                        </>
                    )}
                </button>
                <p style={{
                    marginTop: 8,
                    fontSize: 10,
                    color: "var(--text-faint)",
                    textAlign: "center",
                    lineHeight: 1.4,
                }}>
                    New to AmVault? Create your account from the connect button above.
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // ── Signed in state — normal input ────────────────────────────────────────
    return (
        <div style={{
            borderTop: "1px solid var(--border-gold)",
            padding: isMobile ? "12px 16px 20px" : "14px 28px 18px",
            background: "rgba(5,13,26,0.85)",
            backdropFilter: "blur(20px)",
            flexShrink: 0,
        }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "var(--radius-md)",
                    padding: "0 14px",
                }}>
                    <textarea
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Ask Nuru anything about the ecosystem…"
                        rows={1}
                        style={{
                            flex: 1,
                            background: "none",
                            border: "none",
                            outline: "none",
                            color: "var(--text-primary)",
                            fontSize: 14,
                            padding: "13px 0",
                            fontFamily: "var(--font-body)",
                            resize: "none",
                            lineHeight: 1.5,
                            maxHeight: 120,
                            overflowY: "auto",
                        }}
                        onInput={e => {
                            e.target.style.height = "auto";
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                        }}
                    />
                </div>
                <button
                    onClick={handleSend}
                    disabled={disabled || !value.trim()}
                    style={{
                        padding: "13px 20px",
                        borderRadius: "var(--radius-md)",
                        background: disabled || !value.trim()
                            ? "rgba(201,168,76,0.25)"
                            : "linear-gradient(135deg, var(--gold), var(--gold-dim))",
                        border: "none",
                        color: disabled || !value.trim() ? "rgba(5,13,26,0.4)" : "var(--navy-deepest)",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-body)",
                        boxShadow: disabled ? "none" : "0 4px 16px var(--gold-glow)",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                >
                    {isMobile ? "↑" : "Send"}
                </button>
            </div>
            <p style={{
                marginTop: 8,
                fontSize: 10,
                color: "var(--text-faint)",
                textAlign: "center",
                lineHeight: 1.4,
            }}>
                Nuru never stores your private keys · Powered by Alkebuleum
            </p>
        </div>
    );
}