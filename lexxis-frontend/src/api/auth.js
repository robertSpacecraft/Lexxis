// src/api/auth.js
import { csrf, get, post } from "./http";

export async function register(payload) {
    await csrf();
    return post("/api/register", payload);
}

export async function login(payload) {
    await csrf();
    return post("/api/login", payload, {
        headers: {
            Accept: "application/json",
        },
    });
}

export async function me() {
    return get("/api/me");
}

export async function logout() {
    return post("/api/logout", null, {
        headers: { Accept: "application/json" },
    });
}
