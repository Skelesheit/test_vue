// crud.ts
import { request } from '@/services/api'

type Primitive = string | number | boolean | null | undefined

export function createCrudApi<Out, Create, Update>(base: string) {
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
        list:   async (params?: Record<string, Primitive>): Promise<Out[]> =>
            (await request(withParams(base, params))).json(),

        get:    async (id: number): Promise<Out> =>
            (await request(`${base}/${id}`)).json(),

        create: async (payload: Create): Promise<Out> =>
            (await request(base, { method: 'POST', body: JSON.stringify(payload) })).json(),

        update: async (id: number, payload: Update): Promise<Out> =>
            (await request(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(payload) })).json(),

        delete: async (id: number): Promise<void> =>
            void (await request(`${base}/${id}`, { method: 'DELETE' })),
    }
}
