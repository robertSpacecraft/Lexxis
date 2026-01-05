// src/api/http.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length !== 2) return null;
    return decodeURIComponent(parts.pop().split(";").shift());
}

function buildUrl(path) {
    if (!path.startsWith("/")) path = "/" + path;
    return BASE_URL.replace(/\/$/, "") + path;
}

async function parseResponse(res) {
    // 204 No Content
    if (res.status === 204) return { status: res.status, data: null };

    const contentType = res.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
        try {
            data = await res.json();
        } catch {
            data = null;
        }
    } else {
        // fallback por si backend devuelve texto/HTML en algún caso
        try {
            data = await res.text();
        } catch {
            data = null;
        }
    }

    return { status: res.status, data };
}

async function request(method, path, body, options = {}) {
    const headers = { ...(options.headers || {}) };

    // Impone siempre Accept para que Breeze devuelva 204 en SPA
    headers["Accept"] = "application/json";

    headers["X-Requested-With"] = "XMLHttpRequest";

    // Content-Type solo si hay body y no es FormData
    const isFormData = body instanceof FormData;
    if (body !== undefined && body !== null && !isFormData) {
        headers["Content-Type"] = "application/json";
    }

    // XSRF header (no en csrf-cookie)
    const xsrf = getCookie("XSRF-TOKEN");
    if (xsrf && path !== "/sanctum/csrf-cookie") {
        headers["X-XSRF-TOKEN"] = xsrf;
    }
    // DEBUG temporal (solo desarrollo)
if (import.meta.env.DEV && path === "/api/login") {
  console.log("[DEBUG login] BASE_URL =", BASE_URL);
  console.log("[DEBUG login] document.cookie =", document.cookie);
  console.log("[DEBUG login] XSRF cookie =", getCookie("XSRF-TOKEN"));
  console.log("[DEBUG login] X-XSRF-TOKEN header =", headers["X-XSRF-TOKEN"]);
}


    const res = await fetch(buildUrl(path), {
        ...options,
        method,
        credentials: "include",
        headers,
        body:
            body === undefined || body === null
                ? undefined
                : isFormData
                    ? body
                    : JSON.stringify(body),
    });


    const { status, data } = await parseResponse(res);

    if (!res.ok) {
        // normalizamos el error para capturarlo arriba con {status, data}
        throw { status, data };
    }

    return { status, data };
}

export async function csrf() {
    // Sanctum CSRF cookie endpoint NO está bajo /api
    return request("GET", "/sanctum/csrf-cookie");
}

export async function get(path, options) {
    return request("GET", path, undefined, options);
}

export async function post(path, body, options) {
    return request("POST", path, body, options);
}

export async function patch(path, body, options) {
    return request("PATCH", path, body, options);
}

export async function del(path, options) {
    return request("DELETE", path, undefined, options);
}
