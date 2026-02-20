import NuruLogo from "../shared/NuruLogo";

// Lightweight markdown renderer — no external dependencies needed
function renderMarkdown(text) {
    const lines = text.split("\n");
    const elements = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Skip empty lines
        if (line.trim() === "") {
            i++;
            continue;
        }

        // Bullet list item: lines starting with - or *
        if (/^[-*]\s+/.test(line)) {
            const listItems = [];
            while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
                listItems.push(lines[i].replace(/^[-*]\s+/, ""));
                i++;
            }
            elements.push(
                <ul key={i} style={{ margin: "6px 0", paddingLeft: 18 }}>
                    {listItems.map((item, j) => (
                        <li key={j} style={{ marginBottom: 4, lineHeight: 1.6 }}>
                            {renderInline(item)}
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // Numbered list
        if (/^\d+\.\s+/.test(line)) {
            const listItems = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                listItems.push(lines[i].replace(/^\d+\.\s+/, ""));
                i++;
            }
            elements.push(
                <ol key={i} style={{ margin: "6px 0", paddingLeft: 20 }}>
                    {listItems.map((item, j) => (
                        <li key={j} style={{ marginBottom: 4, lineHeight: 1.6 }}>
                            {renderInline(item)}
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // Regular paragraph
        elements.push(
            <p key={i} style={{ margin: elements.length === 0 ? 0 : "8px 0 0", lineHeight: 1.65 }}>
                {renderInline(line)}
            </p>
        );
        i++;
    }

    return elements;
}

// Handle inline formatting: **bold**, *italic*, `code`
function renderInline(text) {
    const parts = [];
    // Split on bold (**text**), italic (*text*), code (`text`)
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Text before match
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        const raw = match[0];
        if (raw.startsWith("**")) {
            parts.push(<strong key={match.index} style={{ color: "#fde68a", fontWeight: 700 }}>{raw.slice(2, -2)}</strong>);
        } else if (raw.startsWith("*")) {
            parts.push(<em key={match.index} style={{ fontStyle: "italic" }}>{raw.slice(1, -1)}</em>);
        } else if (raw.startsWith("`")) {
            parts.push(
                <code key={match.index} style={{
                    background: "rgba(201,168,76,0.15)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: 4,
                    padding: "1px 5px",
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: "#fde68a",
                }}>
                    {raw.slice(1, -1)}
                </code>
            );
        }
        lastIndex = match.index + raw.length;
    }

    // Remaining text
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}

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
                borderRadius: isAssistant ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                padding: "11px 15px",
                color: isAssistant ? "var(--text-primary)" : "#fde68a",
                fontSize: 14,
            }}>
                {isAssistant ? renderMarkdown(msg.text) : (
                    <p style={{ margin: 0, lineHeight: 1.65 }}>{msg.text}</p>
                )}
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