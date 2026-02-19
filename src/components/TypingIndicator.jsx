import NuruLogo from "../shared/NuruLogo";

export default function TypingIndicator() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
        }}>
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
            }}>
                <NuruLogo size={17} />
            </div>
            <div style={{
                background: "linear-gradient(135deg, rgba(15,26,46,0.95), rgba(30,58,95,0.55))",
                border: "1px solid rgba(96,165,250,0.18)",
                borderRadius: "4px 16px 16px 16px",
                padding: "12px 18px",
                display: "flex",
                gap: 6,
                alignItems: "center",
            }}>
                {[0, 1, 2].map(i => (
                    <span key={i} style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--gold)",
                        display: "inline-block",
                        animation: "pulse-dot 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                    }} />
                ))}
            </div>
        </div>
    );
}