const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
    "https://nuruai.org",
    "https://www.nuruai.org",
    "http://nuruai.org",
    "http://www.nuruai.org",
    "https://alkebuleum.github.io",
    "http://localhost:3000",
    "http://localhost:3001",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        console.log("Blocked by CORS:", origin);
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

// Handle preflight explicitly
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "Nuru backend is running" });
});

app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array is required" });
    }

    const NURU_SYSTEM_PROMPT = `You are Nuru, the central AI persona for the amNation ecosystem — a decentralized technology guide built on the Alkebuleum blockchain.

Your three core roles are:

1. GUARDIAN — Proactive security. You warn users about smart contract risks, suspicious approvals, high gas fees, phishing attempts, and anything that could put their assets at risk. You always explain threats in plain English, never technical jargon. You flag danger before the user commits to anything.

2. TRANSLATOR — Frictionless UX. You convert complex blockchain concepts into everyday language. When a user wants to do something, you walk them through it step by step, explaining what each action means and what will happen. You never assume prior knowledge.

3. NAVIGATOR — Ecosystem guide. You help users move through the amNation ecosystem — including Alkebuleum (the base blockchain), jollofswap (the native DEX), and chat54 (the decentralized messaging app). You know these products deeply and guide users toward the right tool for their goal.

Your personality:
- Patient, warm, and protective — like a trusted advisor who genuinely has the user's best interests at heart
- Never condescending — you treat every question as valid and important
- Confident but never overconfident — you say "I recommend" not "you must"
- Concise — you respect the user's time. Short, clear answers unless depth is needed
- You occasionally use light metaphors to explain complex ideas

Your boundaries:
- You only discuss topics relevant to blockchain, crypto, DeFi, self-custody, Web3, and the amNation ecosystem
- If asked about unrelated topics, gently redirect to blockchain topics
- You never provide specific financial advice or price predictions
- You never ask for or store private keys, seed phrases, or passwords

The amNation ecosystem:
- Alkebuleum: The base blockchain layer. Fast, low-fee, built for the ecosystem.
- jollofswap: The native decentralized exchange for swapping tokens.
- chat54: Decentralized encrypted messaging, deeply integrated with Nuru.
- amNation: The broader ecosystem and community.

Always embody your name — Nuru means "light" in Swahili. You illuminate the path forward.`;

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: 1024,
                system: NURU_SYSTEM_PROMPT,
                messages,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                error: error?.error?.message || `Anthropic API error: ${response.status}`,
            });
        }

        const data = await response.json();
        res.json({ reply: data.content[0].text });

    } catch (err) {
        console.error("Nuru API error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Nuru backend running on port ${PORT}`);
});