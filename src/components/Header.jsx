import NuruLogo from "../shared/NuruLogo";
import { useAuth } from "amvault-connect";

export default function Header({ onMenuToggle, isMobile, isTablet }) {
    const { session, signin, status } = useAuth();

    const isConnecting = status === "checking";
    const shortAin = session?.ain
        ? session.ain.length > 12
            ? `${session.ain.slice(0, 10)}…`
            : session.ain
        : null;
    const shortAddr = session?.address
        ? `${session.address.slice(0, 5)}…${session.address.slice(-3)}`
        : null;

    return (
        <header style={{
            position: "relative",
            zIndex: 20,
            height: "var(--header-height)",
            borderBottom: "1px solid var(--border-gold)",
            background: "rgba(5,13,26,0.9)",
            backdropFilter: "blur(20px)",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
        }}>

            {/* Logo + Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: isMobile ? 32 : 38,
                    height: isMobile ? 32 : 38,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--navy-mid), var(--navy-light))",
                    border: "1.5px solid var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "glow-pulse 3s ease-in-out infinite",
                    flexShrink: 0,
                }}>
                    <NuruLogo size={isMobile ? 17 : 22} />
                </div>
                <div>
                    <div style={{
                        fontSize: isMobile ? 15 : 18,
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        color: "var(--text-primary)",
                        lineHeight: 1.1,
                        fontFamily: "var(--font-display)",
                    }}>
                        Nuru{" "}
                        <span style={{
                            color: "var(--gold)",
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: "0.15em",
                            fontFamily: "var(--font-body)",
                        }}>AI</span>
                    </div>
                    {!isMobile && (
                        <div style={{
                            fontSize: 10,
                            color: "var(--text-muted)",
                            letterSpacing: "0.1em",
                        }}>
                            DECENTRALIZED GUIDE · NURU ECOSYSTEM
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* ── Wallet / Auth indicator ─────────────────────────────────────── */}
            {session ? (
                // Connected — show AIN or address
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: isMobile ? "4px 10px" : "5px 14px",
                    borderRadius: 20,
                    background: "rgba(74,222,128,0.08)",
                    border: "1px solid rgba(74,222,128,0.25)",
                    flexShrink: 0,
                    cursor: "pointer",
                }}
                    onClick={onMenuToggle}
                    title={session.address}
                >
                    {/* Green dot */}
                    <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#4ade80",
                        boxShadow: "0 0 6px #4ade80",
                        flexShrink: 0,
                        display: "inline-block",
                    }} />
                    <span style={{
                        fontSize: isMobile ? 10 : 11,
                        color: "#4ade80",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        fontFamily: "monospace",
                    }}>
                        {shortAin || shortAddr}
                    </span>
                </div>
            ) : (
                // Not connected — tap to connect or open sidebar
                <button
                    onClick={isMobile || isTablet ? onMenuToggle : signin}
                    disabled={isConnecting}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: isMobile ? "4px 10px" : "5px 14px",
                        borderRadius: 20,
                        background: "rgba(201,168,76,0.08)",
                        border: "1px solid rgba(201,168,76,0.25)",
                        color: "var(--gold)",
                        fontSize: isMobile ? 10 : 11,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        cursor: isConnecting ? "not-allowed" : "pointer",
                        fontFamily: "var(--font-body)",
                        flexShrink: 0,
                    }}
                >
                    <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "transparent",
                        border: "1.5px solid var(--gold)",
                        flexShrink: 0,
                        display: "inline-block",
                    }} />
                    {isConnecting ? "Connecting…" : isMobile ? "Connect" : "Connect AmVault"}
                </button>
            )}

            {/* Guardian AI status — desktop only, no need to duplicate on mobile */}
            {!isMobile && (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 14px",
                    borderRadius: 20,
                    background: "rgba(96,165,250,0.06)",
                    border: "1px solid rgba(96,165,250,0.2)",
                    fontSize: 11,
                    color: "var(--blue-accent)",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                }}>
                    <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "var(--blue-accent)",
                        boxShadow: "0 0 6px var(--blue-accent)",
                        display: "inline-block",
                    }} />
                    NURU ACTIVE
                </div>
            )}

            {/* Mobile/Tablet menu toggle */}
            {(isMobile || isTablet) && (
                <button
                    onClick={onMenuToggle}
                    aria-label="Toggle panel"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border-white)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--text-secondary)",
                        padding: "6px 9px",
                        cursor: "pointer",
                        fontSize: 16,
                        lineHeight: 1,
                        flexShrink: 0,
                    }}
                >
                    ☰
                </button>
            )}
        </header>
    );
}