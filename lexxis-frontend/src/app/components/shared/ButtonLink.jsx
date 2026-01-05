import { Link } from "react-router-dom";

export default function ButtonLink({ to, variant = "primary", children }) {
    const styles = {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 14px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.18)",
        },
        primary: {
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
        },
        ghost: {
            background: "transparent",
            color: "#fff",
        },
    };

    const merged = { ...styles.base, ...(variant === "ghost" ? styles.ghost : styles.primary) };

    return (
        <Link to={to} style={merged}>
            {children}
        </Link>
    );
}
