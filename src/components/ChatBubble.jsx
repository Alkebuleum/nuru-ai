import NuruLogo from "../shared/NuruLogo";

export default function ChatBubble({ msg }) {
    const isAssistant = msg.role === "assistant";

    return (
        <div
            className="fade-in-up"
            style={{
                display: "flex",
                flexDirection: isAssistant ? "row" : "row-reverse",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 18,
            }}
        >
            {/* Avatar */}
            {isAssistant && (
                <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--navy-mid), var(--navy-light))",
                    border: "1.5px solid var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 0 10px var(--gold-glow)",
                    marginTop: 2,
                }}>
                    <NuruLogo size={17} />
                </div>
            )}

            {/* Bubble */}
            <div style={{
                maxWidth: "78%",
                background: isAssistant
                    ? "linear-gradient(135deg, rgba(15,26,46,0.95), rgba(30,58,95,0.55))"
                    : "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.07))",
                border: isAssistant
                    ? "1px solid rgba(96,165,250,0.18)"
                    : "1px solid rgba(201,168,76,0.35)",
                borderRadius: isAssistant
                    ? "4px 16px 16px 16px"
                    : "16px 4px 16px 16px",
                padding: "11px 15px",
            }}>
                {msg.text.split("\n\n").map((para, i) => (
                    <p key={i} style={{
                        margin: i === 0 ? 0 : "8px 0 0",
                        color: isAssistant ? "var(--text-primary)" : "#fde68a",
                        fontSize: 14,
                        lineHeight: 1.65,
                    }}>
                        {para}
                    </p>
                ))}
                <span style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    display: "block",
                    marginTop: 6,
                    textAlign: isAssistant ? "left" : "right",
                }}>
                    {msg.timestamp}
                </span>
            </div>
        </div>
    );
}