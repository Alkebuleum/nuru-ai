export default function NuruLogo({ size = 28 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="Nuru logo">
            {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x1 = 50 + 18 * Math.cos(angle);
                const y1 = 50 + 18 * Math.sin(angle);
                const x2 = 50 + 42 * Math.cos(angle);
                const y2 = 50 + 42 * Math.sin(angle);
                return (
                    <line
                        key={i}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={i < 6 ? "#C9A84C" : "#60a5fa"}
                        strokeWidth="5"
                        strokeLinecap="round"
                    />
                );
            })}
        </svg>
    );
}