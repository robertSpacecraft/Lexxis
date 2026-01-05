import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div style={{ padding: 24 }}>
            <header style={{ marginBottom: 16 }}>
                <strong>Lexxis</strong>{" "}
                <nav style={{ display: "inline-flex", gap: 12, marginLeft: 12 }}>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Registro</Link>
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
