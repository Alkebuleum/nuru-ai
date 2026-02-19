import StatusDot from "../shared/StatusDot";
import { CONNECTIONS, ECOSYSTEM } from "../data/constants";

export default function ConnectionStatus() {
    return (
        <div>
            {/* Connections */}
            <div style={{ marginBottom: 24 }}>
                <SectionLabel color="var(--blue-accent)">◈ Connections</SectionLabel>
                {CONNECTIONS.map(c => (
                    <div key={c.label} style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "9px 12px",
                        borderRadius: "var(--radius-sm)",
                        marginBottom: 5,
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid var(--border-white)",
                    }}>
                        <StatusDot color={c.color} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                                {c.label}
                            </div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                                {c.detail}
                            </div>
                        </div>
                        <span style={{
                            fontSize: 10,
                            color: c.color,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            {c.status}
                        </span>
                    </div>
                ))}
            </div>

            {/* Ecosystem */}
            <div>
                <SectionLabel color="var(--text-muted)">◆ Ecosystem</SectionLabel>
                {ECOSYSTEM.map(e => (
                    <div key={e.name} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 12px",
                        borderRadius: "var(--radius-sm)",
                        marginBottom: 5,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-white)",
                        cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                        onMouseEnter={e2 => e2.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                        onMouseLeave={e2 => e2.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    >
                        <div>
                            <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 600 }}>
                                {e.name}
                            </div>
                            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                                {e.desc}
                            </div>
                        </div>
                        <span style={{ fontSize: 12, color: e.ready ? "var(--gold)" : "var(--text-muted)" }}>
                            {e.ready ? "→" : "Soon"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SectionLabel({ children, color }) {
    return (
        <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color,
            marginBottom: 10,
            textTransform: "uppercase",
        }}>
            {children}
        </div>
    );
}