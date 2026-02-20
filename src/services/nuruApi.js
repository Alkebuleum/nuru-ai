// In development, call localhost. In production, call Railway backend.
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function sendMessageToNuru(conversationHistory) {
    const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
}