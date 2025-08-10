export interface UserResponse {
    email: string
    created_at: string
    is_verified: boolean
    is_member: boolean
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
    captcha: string
}