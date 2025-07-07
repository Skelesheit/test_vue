// src/services/api.js
const API_URL = import.meta.env.VITE_APP_API_URL;

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");

function setTokens(access, refresh) {
    accessToken = access;
    refreshToken = refresh;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
}

function clearTokens() {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

async function request(endpoint, options = {}) {
    const headers = options.headers || {};

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    });

    if (response.status === 401 && refreshToken) {
        const ok = await tryRefreshToken();
        if (ok) return request(endpoint, options); // retry once
        else clearTokens();
    }

    return response;
}

async function tryRefreshToken() {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${refreshToken}`,
        },
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.access && data.refresh) {
        setTokens(data.access, data.refresh);
        return true;
    }

    return false;
}

export const api = {
    async login(email, password) {
        const res = await request("user/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) setTokens(data.access, data.refresh);
        return { ok: res.ok, data };
    },

    async register(email, password, captchaToken) {
        return await request("user/register", {
            method: "POST",
            body: JSON.stringify({ email, password, captchaToken }),
        });
    },

    async logout() {
        await request("auth/logout", { method: "POST" });
        clearTokens();
    },

    async me() {
        return await request("auth/me");
    },

    async fillData(payload) {
        return await request("user/fill-data", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async getDadataSuggest(inn) {
        return await request(`dadata/suggest/${inn}`);
    },

    async confirmEmail(token) {
        return await request(`mail/confirm/${token}`);
    },

    getAccessToken() {
        return accessToken;
    },

    isAuthorized() {
        return Boolean(accessToken);
    }
};
