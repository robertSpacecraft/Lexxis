import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/useAuth.js";

export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
        } finally {
            navigate("/login", { replace: true });
        }
    }

    return (
        <div style={{ padding: 24 }}>
            <header
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <div>
                    <strong>Lexxis (Zona privada)</strong>{" "}
                    <nav style={{ display: "inline-flex", gap: 12, marginLeft: 12 }}>
                        <Link to="/">Home</Link>
                    </nav>
                </div>

                <div style={{ display: "inline-flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 14, opacity: 0.85 }}>
                        {user?.email || "Usuario"}
                    </span>
                    <button onClick={handleLogout} style={{ padding: "8px 10px" }}>
                        Salir
                    </button>
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

