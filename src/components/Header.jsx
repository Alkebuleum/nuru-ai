import NuruLogo from "../shared/NuruLogo";
import StatusDot from "../shared/StatusDot";

export default function Header({ onMenuToggle, isMobile, isTablet }) {
    return (
        <header style={{
            position: "relative",
            zIndex: 20,
            height: "var(--header-height)",
            borderBottom: "1px solid var(--border-gold)",
            background: "rgba(5,13,26,0.9)",
            backdropFilter: "blur(20px)",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
        }}>

            {/* Logo + Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                    width: isMobile ? 34 : 38,
                    height: isMobile ? 34 : 38,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--navy-mid), var(--navy-light))",
                    border: "1.5px solid var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "glow-pulse 3s ease-in-out infinite",
                    flexShrink: 0,
                }}>
                    <NuruLogo size={isMobile ? 18 : 22} />
                </div>
                <div>
                    <div style={{
                        fontSize: isMobile ? 16 : 18,
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        color: "var(--text-primary)",
                        lineHeight: 1.1,
                        fontFamily: "var(--font-display)",
                    }}>
                        Nuru{" "}
                        <span style={{
                            color: "var(--gold)",
                            fontSize: 11,
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
                            fontFamily: "var(--font-body)",
                        }}>
                            DECENTRALIZED GUIDE · amNATION
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Guardian Status Badge */}
            <div style={{
                padding: isMobile ? "4px 10px" : "5px 14px",
                borderRadius: 20,
                background: "rgba(74,222,128,0.08)",
                border: "1px solid rgba(74,222,128,0.3)",
                fontSize: isMobile ? 10 : 11,
                color: "var(--green)",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                flexShrink: 0,
            }}>
                <StatusDot color="var(--green)" />
                {isMobile ? "ACTIVE" : "GUARDIAN ACTIVE"}
            </div>

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
                        padding: "7px 10px",
                        cursor: "pointer",
                        fontSize: 18,
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