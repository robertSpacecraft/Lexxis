import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./app/styles/shared/global.css";
import AuthProvider from "./app/providers/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);












/*
*************************************************************************************
Código para comprobar que la autenticación contra el servidor funciona correctamente:
*************************************************************************************


import { login, me, logout } from "./api/auth";

async function testAuth() {
    console.log("--- INICIANDO TEST DE AUTENTICACIÓN ---");
    
    try {
        // 1. LOGIN
        // Nota: Dentro de login() ya se llama a csrf(), lo cual es correcto.
        console.log("1. Intentando Login...");
        const loginRes = await login({
            email: "demo@lexxis.test", // Asegúrate de que este usuario existe en tu DB
            password: "password",
        });
        console.log("✅ Login OK (Status:", loginRes.status, ")");

        // 2. VERIFICAR SESIÓN (ME)
        console.log("2. Verificando identidad del usuario (/api/me)...");
        const meRes = await me();
        console.log("👤 Datos del usuario:", meRes.data);

        // 3. LOGOUT
        console.log("3. Cerrando sesión...");
        const logoutRes = await logout();
        console.log("✅ Logout OK (Status:", logoutRes.status, ")");

    } catch (err) {
        console.error("❌ ERROR EN EL FLUJO:");
        // Intentamos desglosar el error para saber si es de red o de Laravel
        if (err.status) {
            console.error(`Código de estado: ${err.status}`);
            console.error(`Cuerpo del error:`, err.data);
        } else {
            console.error(`Error de red o configuración:`, err.message || err);
        }
    }
    console.log("--- TEST FINALIZADO ---");
}

// Evitamos que se ejecute dos veces en el arranque por el StrictMode de React
let hasRun = false;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <div>
            <h1>Lexxis Auth Test</h1>
            <p>Mira la consola del navegador (F12) para ver los resultados.</p>
            <button onClick={() => testAuth()}>Ejecutar Test Manual</button>
        </div>
    </React.StrictMode>
);

// Ejecución automática inicial (opcional)
if (!hasRun) {
    testAuth();
    hasRun = true;
}

*/