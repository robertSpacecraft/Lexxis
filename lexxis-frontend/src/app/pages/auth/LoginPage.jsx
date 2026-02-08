import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../providers/useAuth.js";

export default function LoginPage() {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const from = location.state?.from || "/";

    function onChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!form.email.trim() || !form.password.trim()) {
            setError("Email y contraseña son obligatorios.");
            return;
        }

        setIsSubmitting(true);
        try {
            await login({ email: form.email.trim(), password: form.password });

            // Nota: user puede actualizarse justo después; por eso redirigimos y dejamos
            // que el guard/bootstrapping controle el acceso.
            navigate(from, { replace: true });
        } catch (err) {
            // err viene del wrapper http.js (status/data)
            if (err?.status === 422) {
                // Formato típico: { message, errors: { field: [...] } }
                const first =
                    err.data?.errors &&
                    Object.values(err.data.errors).flat().filter(Boolean)[0];
                setError(first || err.data?.message || "Datos inválidos.");
            } else if (err?.status === 401) {
                setError("Credenciales incorrectas.");
            } else {
                setError(err?.data?.message || err?.message || "Error inesperado.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    // Si ya hay usuario y es admin, no debe usar la SPA
    // (solo si el backend expone el campo; si no, esto no hará nada)
    const role = user?.type || user?.role || null;
    if (role && String(role).toLowerCase() === "admin") {
        // Ajusta esta URL si tu login admin es otra ruta
        window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/login`;
        return null;
    }

    return (
        <div style={{ maxWidth: 420 }}>
            <h1>Login</h1>

            {error && (
                <div style={{ margin: "12px 0", padding: 12, border: "1px solid #999" }}>
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        autoComplete="email"
                        style={{ width: "100%", padding: 8 }}
                    />
                </label>

                <label>
                    Contraseña
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        autoComplete="current-password"
                        style={{ width: "100%", padding: 8 }}
                    />
                </label>

                <button type="submit" disabled={isSubmitting} style={{ padding: 10 }}>
                    {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
        </div>
    );
}
