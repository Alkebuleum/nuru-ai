export const NURU_WELCOME = []; // welcome now lives in App.js — auth-aware

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
    body: "A contract is requesting token approval. Connect your wallet so Nuru can review it with you.",
    icon: "🔍",
  },
];

export const CONNECTIONS = [
  { label: "chat54",      status: "coming soon", detail: "Decentralized messaging", color: "#fbbf24" },
  { label: "Alkebuleum", status: "live",         detail: "Block #2,847,193",        color: "#4ade80" },
  { label: "jollofswap", status: "live",         detail: "DEX ready",               color: "#4ade80" },
];

export const ECOSYSTEM = [
  { name: "AmID",        desc: "Sovereign identity",      ready: true  },
  { name: "AmVault",     desc: "Wallet + identity vault",  ready: true  },
  { name: "JollofSwap",  desc: "Decentralized exchange",   ready: true  },
  { name: "uGov",        desc: "Ecosystem governance",     ready: false },
  { name: "chat54",      desc: "Encrypted messaging",      ready: false },
];

// Shown only when user is signed in
export const PROMPT_CHIPS = [
  "Learn the basics",
  "Set up my wallet",
  "Send or receive money",
  "Explore earning options",
  "Check if something is risky",
  "What is a gas fee?",
];
