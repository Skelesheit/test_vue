import {
    DadataOrganization,
    EnterpriseResponse,
    FillDataPayload,
    InviteTokensResponse,
    JoinTokenIn,
    LoginResponse,
    RegisterPayload,
    RequestOptions,
    UserResponse
} from '@/services/interfaces/'

const API_URL = import.meta.env.VITE_APP_API_URL

// Универсальный запрос
export async function request(endpoint: string, options: RequestOptions = {}): Promise<Response> {
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> ?? {})
    }
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`
    }
    console.log(`endpoint: ${API_URL}/${endpoint}`)
    const response = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        credentials: 'include'
    })
    if (options.noRetry) {
        return response
    }
    if (response.status === 401) {
        const refreshed = await tryRefreshToken()
        if (refreshed) {
            return request(endpoint, options)
        } else {
            localStorage.removeItem('accessToken')
        }
    }
    return response
}

// Обновление access token
async function tryRefreshToken(): Promise<boolean> {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'GET',
        credentials: 'include'
    })
    if (!res.ok) return false
    try {
        const data = (await res.json()) as { access_token?: string }
        if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token)
            return true
        }
    } catch {
        return false
    }
    return false
}

export const api = {
    async login(email: string, password: string): Promise<{ ok: boolean; data: LoginResponse }> {
        const res = await request('user/login', {
            method: 'POST',
            body: JSON.stringify({email, password})
        })

        let data: LoginResponse = {}
        try {
            data = await res.json()
        } catch {
            data = {}
        }

        if (res.ok && data.access_token) {
            localStorage.setItem('accessToken', data.access_token)
        }

        return {ok: res.ok, data}
    },

    async logout(): Promise<void> {
        await request('auth/logout', {method: 'POST'})
        localStorage.removeItem('accessToken')
    },

    async fillData(payload: FillDataPayload): Promise<Response> {
        return await request('enterprise/create', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
    },

    async me(noRetry = false): Promise<UserResponse | null> {
        try {
            const response = await request('auth/me', { noRetry })
            if (!response.ok) {
                return null
            }
            return await response.json() // ← Уже распарсенный JSON!
        } catch (error) {
            console.error('Error fetching user data:', error)
            return null
        }
    },

    async register(email: string, password: string, captcha: string): Promise<Response> {
        const payload: RegisterPayload = {email, password, captcha}
        return await request('user/register', {
            method: 'POST',
            body: JSON.stringify(payload)
        })
    },

    async getDadataSuggest(inn: string): Promise<DadataOrganization> {
        const res =  await request(`client/dadata/${inn}`)
        if (!res.ok) throw new Error('Ошибка при запросе Dadata')
        return await res.json()
    },
    async getEnterprise(): Promise<EnterpriseResponse> {
        const res = await request('enterprise/personal')
        if (!res.ok) throw new Error('Ошибка получения данных компании')
        return await res.json()
    },

    async revokeMember(memberId: number): Promise<{ ok: boolean; message?: string }> {
        const res = await request(`enterprise/revoke/${memberId}`)
        if (!res.ok) {
            const msg = await res.text()
            return { ok: false, message: msg }
        }
        const data = await res.json()
        return { ok: true, message: data.message }
    },

    async generateTokens(count: number): Promise<InviteTokensResponse> {
        const res = await request(`enterprise/generate-tokens/${count}`)
        if (!res.ok) throw new Error('Ошибка генерации токенов')
        return await res.json()
    },

    async joinToCompany(data: JoinTokenIn): Promise<{ ok: boolean; message?: string }> {
        const res = await request('enterprise/join-to-enterprise', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!res.ok) {
            const msg = await res.text()
            return { ok: false, message: msg }
        }
        return { ok: true }
    },

    async inviteByEmail(email: string): Promise<{ ok: boolean; message?: string }> {
        const res = await request(`enterprise/invite-by-email?email=${encodeURIComponent(email)}`)
        if (!res.ok) {
            const msg = await res.text()
            return { ok: false, message: msg }
        }
        return { ok: true }
    },

    async isAuthorized(): Promise<boolean> {
        try {
            const response = await request('auth/me', { noRetry: true })
            return response.ok
        } catch (error) {
            console.error('Authorization check failed:', error)
            return false
        }
    }
}
