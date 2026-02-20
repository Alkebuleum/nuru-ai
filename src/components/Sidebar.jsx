import WalletConnect from "./WalletConnect";
import GuardianAlert from "./GuardianAlert";
import ConnectionStatus from "./ConnectionStatus";

export default function Sidebar({
    alerts,
    onDismiss,
    isOpen,
    onClose,
    isMobile,
    isTablet,
}) {
    if (isMobile) {
        return (
            <>
                {isOpen && <div className="drawer-overlay" onClick={onClose} />}
                <aside style={{
                    position: "fixed",
                    bottom: 0, left: 0, right: 0,
                    zIndex: 50,
                    maxHeight: "80vh",
                    background: "rgba(5,13,26,0.97)",
                    backdropFilter: "blur(24px)",
                    borderTop: "1px solid var(--border-gold)",
                    borderRadius: "20px 20px 0 0",
                    padding: "0 20px 32px",
                    overflowY: "auto",
                    transform: isOpen ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
                }}>
                    <div style={{
                        width: 40, height: 4,
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: 2,
                        margin: "12px auto 20px",
                    }} />
                    <DrawerContent alerts={alerts} onDismiss={onDismiss} />
                </aside>
            </>
        );
    }

    if (isTablet) {
        return (
            <>
                {isOpen && <div className="drawer-overlay" onClick={onClose} />}
                <aside style={{
                    position: "fixed",
                    top: "var(--header-height)",
                    left: 0, bottom: 0,
                    width: "var(--sidebar-width)",
                    zIndex: 50,
                    background: "rgba(5,13,26,0.97)",
                    backdropFilter: "blur(24px)",
                    borderRight: "1px solid var(--border-gold)",
                    padding: "20px 16px",
                    overflowY: "auto",
                    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
                }}>
                    <DrawerContent alerts={alerts} onDismiss={onDismiss} />
                </aside>
            </>
        );
    }

    return (
        <aside style={{
            width: "var(--sidebar-width)",
            flexShrink: 0,
            borderRight: "1px solid var(--border-gold)",
            background: "rgba(5,13,26,0.55)",
            backdropFilter: "blur(20px)",
            padding: "20px 16px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
        }}>
            <DrawerContent alerts={alerts} onDismiss={onDismiss} />
        </aside>
    );
}

function DrawerContent({ alerts, onDismiss }) {
    return (
        <>
            {/* Wallet connection — top of sidebar */}
            <WalletConnect />

            {/* Guardian Alerts */}
            <div style={{ marginBottom: 24 }}>
                <div style={{
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: "var(--gold)",
                    marginBottom: 12,
                    textTransform: "uppercase",
                }}>
                    🛡️ Guardian Alerts
                </div>
                {alerts.length === 0 ? (
                    <div style={{
                        padding: 14, borderRadius: "var(--radius-md)",
                        textAlign: "center",
                        background: "rgba(74,222,128,0.05)",
                        border: "1px solid rgba(74,222,128,0.2)",
                    }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>✓</div>
                        <div style={{ fontSize: 12, color: "#4ade80" }}>
                            All clear. No threats detected.
                        </div>
                    </div>
                ) : (
                    alerts.map(a => (
                        <GuardianAlert key={a.id} alert={a} onDismiss={onDismiss} />
                    ))
                )}
            </div>

            <ConnectionStatus />
        </>
    );
}