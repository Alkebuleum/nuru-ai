import { useState } from "react";

export default function ChatInput({ onSend, disabled, isMobile }) {
    const [value, setValue] = useState("");

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

    return (
        <div style={{
            borderTop: "1px solid var(--border-gold)",
            padding: isMobile ? "12px 16px 20px" : "14px 28px 18px",
            background: "rgba(5,13,26,0.85)",
            backdropFilter: "blur(20px)",
            flexShrink: 0,
        }}>
            <div style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
            }}>
                {/* Input wrapper */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "var(--radius-md)",
                    padding: "0 14px",
                    transition: "border-color 0.2s",
                }}
                    onFocus={() => { }}
                >
                    <textarea
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Ask Nuru anything about blockchain, your wallet, or DeFi…"
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

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={disabled || !value.trim()}
                    style={{
                        padding: "13px 20px",
                        borderRadius: "var(--radius-md)",
                        background: disabled || !value.trim()
                            ? "rgba(201,168,76,0.3)"
                            : "linear-gradient(135deg, var(--gold), var(--gold-dim))",
                        border: "none",
                        color: disabled || !value.trim() ? "rgba(5,13,26,0.5)" : "var(--navy-deepest)",
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

            {/* Footer note */}
            <p style={{
                marginTop: 8,
                fontSize: 10,
                color: "var(--text-faint)",
                textAlign: "center",
                lineHeight: 1.4,
            }}>
                Nuru never stores your private keys · Powered by Alkebuleum · amNation ecosystem
            </p>
        </div>
    );
}