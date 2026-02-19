export const NURU_WELCOME = [
    {
        id: 1,
        role: "assistant",
        text: "Greetings. I am Nuru — your guide through the decentralized world.\n\nI speak blockchain so you don't have to. Whether you're sending tokens, signing a contract, or navigating jollofswap, I'll translate every step into plain language before you commit to anything.\n\nYour sovereignty is my purpose. What would you like to explore today?",
        timestamp: "Now",
    },
];

export const INITIAL_ALERTS = [
    {
        id: 1,
        level: "warning",
        title: "High Gas Detected",
        body: "Network congestion is high. Estimated fee: $18.40. Consider waiting 20–40 min for lower costs.",
        icon: "⚠️",
    },
    {
        id: 2,
        level: "info",
        title: "New Contract Interaction",
        body: "jollofswap.com is requesting token approval. Nuru has reviewed this contract — it appears legitimate.",
        icon: "🔍",
    },
];

export const CONNECTIONS = [
    { label: "Wallet", status: "connected", detail: "0x4f2a...c91b", color: "#4ade80" },
    { label: "chat54", status: "idle", detail: "Not linked", color: "#fbbf24" },
    { label: "Alkebuleum", status: "synced", detail: "Block #2,847,193", color: "#4ade80" },
    { label: "jollofswap", status: "available", detail: "Ready", color: "#60a5fa" },
];

export const ECOSYSTEM = [
    { name: "chat54", desc: "Decentralized messaging", ready: false },
    { name: "jollofswap", desc: "Native DEX", ready: true },
    { name: "Alkebuleum", desc: "Base network", ready: true },
];

export const PROMPT_CHIPS = [
    "What is self-custody?",
    "Check my wallet security",
    "Explain this contract",
    "Swap on jollofswap",
    "What is Alkebuleum?",
    "How do I stay safe?",
];

export const NURU_RESPONSES = [
    "I've analyzed your request. On the Alkebuleum network, this transaction would cost approximately $2.10 in gas at current rates. The receiving address checks out as verified. Shall I proceed, or would you like me to schedule this for off-peak hours?",
    "Smart contracts can seem intimidating, but think of them as vending machines: you put something in, you get something out — and no human can interfere with the outcome. This one specifically handles token swaps. I'll walk you through each permission before you sign.",
    "Your wallet is secure. I'm monitoring for phishing attempts and unusual approval requests continuously. The chat54 integration will further encrypt your communications end-to-end once linked. You're in good hands.",
    "jollofswap currently shows a 0.3% fee on this pair with minimal slippage. Liquidity is healthy. I recommend proceeding — but as always, never invest more than you're comfortable holding through volatility.",
    "Self-custody means you — and only you — hold the private keys to your assets. No bank, no company, no intermediary can freeze, seize, or access your funds. With that power comes responsibility, and that's exactly why I'm here to guide you.",
    "Alkebuleum is the blockchain layer that powers the amNation ecosystem. It's designed for speed, low fees, and deep integration with tools like chat54 and jollofswap. Think of it as the foundation everything is built on.",
];