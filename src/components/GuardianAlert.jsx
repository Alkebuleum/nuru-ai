const LEVEL_STYLES = {
    warning: {
        bg: "rgba(251,191,36,0.07)",
        border: "#C9A84C",
        text: "#fde68a",
    },
    info: {
        bg: "rgba(96,165,250,0.07)",
        border: "#60a5fa",
        text: "#bfdbfe",
    },
    danger: {
        bg: "rgba(248,113,113,0.07)",
        border: "#f87171",
        text: "#fecaca",
    },
};

export default function GuardianAlert({ alert, onDismiss }) {
    const c = LEVEL_STYLES[alert.level] || LEVEL_STYLES.info;

    return (
        <div
            className="fade-in-up"
            style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: "var(--radius-md)",
                padding: "12px 14px",
                marginBottom: 8,
            }}
        >
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 5,
            }}>
                <span style={{ fontSize: 14 }}>{alert.icon}</span>
                <span style={{
                    color: c.text,
                    fontWeight: 700,
                    fontSize: 12,
                    flex: 1,
                }}>
                    {alert.title}
                </span>
                <button
                    onClick={() => onDismiss(alert.id)}
                    aria-label="Dismiss alert"
                    style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        fontSize: 18,
                        lineHeight: 1,
                        padding: "0 2px",
                    }}
                >
                    ×
                </button>
            </div>
            <p style={{
                color: "var(--text-secondary)",
                fontSize: 12,
                lineHeight: 1.55,
                margin: 0,
            }}>
                {alert.body}
            </p>
        </div>
    );
}