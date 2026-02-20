import { useAuth } from "amvault-connect";
import { PROMPT_CHIPS } from "../data/constants";

export default function PromptChips({ onSelect, isMobile }) {
    const { session } = useAuth();

    // Hide chips when not signed in — no point suggesting actions they can't take
    if (!session) return null;

    return (
        <div style={{
            padding: isMobile ? "0 16px 10px" : "0 28px 10px",
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
        }}>
            {PROMPT_CHIPS.map(p => (
                <button
                    key={p}
                    onClick={() => onSelect(p)}
                    style={{
                        padding: "5px 13px",
                        borderRadius: 20,
                        fontSize: isMobile ? 11 : 12,
                        background: "rgba(201,168,76,0.07)",
                        border: "1px solid rgba(201,168,76,0.22)",
                        color: "#fde68a",
                        cursor: "pointer",
                        transition: "background 0.2s, border-color 0.2s",
                        fontFamily: "var(--font-body)",
                        whiteSpace: "nowrap",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(201,168,76,0.14)";
                        e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "rgba(201,168,76,0.07)";
                        e.currentTarget.style.borderColor = "rgba(201,168,76,0.22)";
                    }}
                >
                    {p}
                </button>
            ))}
        </div>
    );
}