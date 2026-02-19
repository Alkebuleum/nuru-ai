export default function StatusDot({ color }) {
    return (
        <span style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}`,
            marginRight: 6,
            flexShrink: 0,
        }} />
    );
}