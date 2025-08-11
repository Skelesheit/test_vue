// services/crudApi.ts
import { request } from '@/services/api'

type Primitive = string | number | boolean | null | undefined

export function createCrudApi<Out, Create, Update>(base: string) {
    async function handle<T>(promise: Promise<Response>): Promise<T> {
        const res = await promise

        if (res.ok) {
            if (res.status === 204) return undefined as T
            return await res.json()
        }

        let msg = `${res.status} ${res.statusText}`
        try {
            const body = await res.json()
            const detail = Array.isArray(body?.detail) ? body.detail[0]?.msg : body?.detail
            msg = (detail ?? body?.message ?? body?.error ?? msg) as string
        } catch {
            /* ignore parse errors */
        }

        throw new Error(msg)
    }

    function withParams(url: string, params?: Record<string, Primitive>) {
        if (!params) return url
        const qs = new URLSearchParams()
        for (const [k, v] of Object.entries(params)) {
            if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
        }
        const s = qs.toString()
        return s ? `${url}?${s}` : url
    }

    return {
        list:   (params?: Record<string, Primitive>) =>
            handle<Out[]>(request(withParams(base, params))),
        get:    (id: number) =>
            handle<Out>(request(`${base}/${id}`)),
        create: (payload: Create) =>
            handle<Out>(request(base, { method: 'POST', body: JSON.stringify(payload) })),
        update: (id: number, payload: Update) =>
            handle<Out>(request(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(payload) })),
        delete: (id: number) =>
            handle<void>(request(`${base}/${id}`, { method: 'DELETE' })),
    }
}
