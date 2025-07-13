// Типы для auth/login ответа

// Универсальный тип для опций запроса
export interface RequestOptions extends RequestInit {
    noRetry?: boolean
}

export interface LoginResponse {
    access_token?: string
    [key: string]: unknown
}

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    email: string
    password: string
    captchaToken: string
}

export interface FillDataPayload {
    [key: string]: unknown // можешь позже заменить на конкретный интерфейс
}