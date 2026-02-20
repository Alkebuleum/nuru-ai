export default function NuruLogo({ size = 28 }) {
    return (
        <img
            src={`${process.env.PUBLIC_URL}/logo192.png`}
            alt="Nuru AI"
            width={size}
            height={size}
            style={{
                objectFit: "contain",
                display: "block",
            }}
        />
    );
}