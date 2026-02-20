import { useAuth } from "amvault-connect";

export default function WalletConnect() {
    const { session, signin, signout, status, error } = useAuth();

    const isConnecting = status === "checking";

    // ── Connected state ────────────────────────────────────────────────────────
    if (session) {
        const shortAddr = `${session.address.slice(0, 6)}...${session.address.slice(-4)}`;
        const shortAin = session.ain ? `AIN: ${session.ain}` : null;

        return (
            <div style={{
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(74,222,128,0.25)",
                background: "rgba(74,222,128,0.05)",
                padding: "12px 14px",
                marginBottom: 16,
            }}>
                {/* Status row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#4ade80",
                        boxShadow: "0 0 6px #4ade80",
                        flexShrink: 0,
                        display: "inline-block",
                    }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", letterSpacing: "0.08em" }}>
                        AMVAULT CONNECTED
                    </span>
                </div>

                {/* Address */}
                <div style={{
                    fontSize: 13,
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    marginBottom: shortAin ? 3 : 8,
                    fontFamily: "monospace",
                    letterSpacing: "0.03em",
                }}>
                    {shortAddr}
                </div>

                {/* AIN */}
                {shortAin && (
                    <div style={{
                        fontSize: 11,
                        color: "var(--gold)",
                        marginBottom: 10,
                        letterSpacing: "0.05em",
                    }}>
                        {shortAin}
                    </div>
                )}

                {/* Disconnect */}
                <button
                    onClick={signout}
                    style={{
                        width: "100%",
                        padding: "7px 0",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(248,113,113,0.08)",
                        border: "1px solid rgba(248,113,113,0.25)",
                        color: "#fca5a5",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                >
                    Disconnect
                </button>
            </div>
        );
    }

    // ── Disconnected state ─────────────────────────────────────────────────────
    return (
        <div style={{ marginBottom: 16 }}>
            <button
                onClick={signin}
                disabled={isConnecting}
                style={{
                    width: "100%",
                    padding: "11px 0",
                    borderRadius: "var(--radius-md)",
                    background: isConnecting
                        ? "rgba(201,168,76,0.2)"
                        : "linear-gradient(135deg, var(--gold), var(--gold-dim))",
                    border: "none",
                    color: isConnecting ? "rgba(5,13,26,0.5)" : "var(--navy-deepest)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: isConnecting ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.05em",
                    boxShadow: isConnecting ? "none" : "0 4px 16px var(--gold-glow)",
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
                            width: 12, height: 12, borderRadius: "50%",
                            border: "2px solid rgba(5,13,26,0.3)",
                            borderTopColor: "var(--navy-deepest)",
                            display: "inline-block",
                            animation: "spin 0.8s linear infinite",
                        }} />
                        Connecting…
                    </>
                ) : (
                    <>
                        <span style={{ fontSize: 16 }}>🔐</span>
                        Connect AmVault
                    </>
                )}
            </button>

            {error && (
                <div style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.2)",
                    fontSize: 11,
                    color: "#fca5a5",
                    lineHeight: 1.4,
                }}>
                    {error}
                </div>
            )}

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}