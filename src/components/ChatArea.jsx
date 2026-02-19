import { useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import PromptChips from "./PromptChips";
import ChatInput from "./ChatInput";

export default function ChatArea({
    messages,
    isTyping,
    onSend,
    isMobile,
}) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
        }}>
            {/* Scrollable messages */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                padding: isMobile ? "20px 16px 8px" : "24px 28px 8px",
            }}>
                {messages.map(msg => (
                    <ChatBubble key={msg.id} msg={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>

            {/* Prompt chips */}
            <PromptChips onSelect={onSend} isMobile={isMobile} />

            {/* Input bar */}
            <ChatInput onSend={onSend} disabled={isTyping} isMobile={isMobile} />
        </div>
    );
}