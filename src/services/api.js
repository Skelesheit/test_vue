const API_URL = import.meta.env.VITE_APP_API_URL;

// --- Обёртка для всех API-запросов ---
async function request(endpoint, options = {}) {
    const headers = options.headers || {};
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include", // всегда отправляем куки (refresh_token)
    });

    // Если access_token протух — пробуем обновить через refresh_token из куки
    if (response.status === 401) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            // Повторяем запрос с новым токеном
            return request(endpoint, options);
        } else {
            // Не смогли обновить — чистим токен
            localStorage.removeItem("accessToken");
        }
    }

    return response;
}

// --- Функция для получения нового access_token через refresh_token в куке ---
async function tryRefreshToken() {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // чтобы refresh_token отправился автоматически
    });

    if (!res.ok) return false;

    try {
        const data = await res.json();
        const access_token = data['access_token'];
        if (access_token) {
            localStorage.setItem("accessToken", access_token);
            return true;
        }
    } catch (e) {
        // Если вдруг ответ пустой/не JSON
        return false;
    }

    return false;
}

// --- Экспортируемый api-объект ---
export const api = {
    async login(email, password) {
        const res = await request("user/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        let data = {};
        try {
            data = await res.json();
        } catch (e) {
            // если сервер вернул пустой ответ
            data = {};
        }

        if (res.ok && data.access_token) {
            localStorage.setItem("accessToken", data.access_token);
        }
        return { ok: res.ok, data };
    },

    async logout() {
        await request("auth/logout", { method: "POST" });
        localStorage.removeItem("accessToken");
    },

    async fillData(payload) {
        return await request("user/fill-data", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async me() {
        return await request("auth/me");
    },

    async register(email, password, captchaToken) {
        return await request("user/register", {
            method: "POST",
            body: JSON.stringify({ email, password, captchaToken }),
        });
    },

    async getDadataSuggest(inn) {
        return await request(`dadata/suggest/${inn}`);
    },

    getAccessToken() {
        return localStorage.getItem("accessToken");
    },

    isAuthorized() {
        return !!localStorage.getItem("accessToken");
    }
};
