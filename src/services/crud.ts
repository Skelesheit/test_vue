import { request } from '@/services/api'
import { useNotify } from '@/composables/useNotify'
import { useI18n } from 'vue-i18n'

type Primitive = string | number | boolean | null | undefined

export function createCrudApi<Out, Create, Update>(base: string) {
    const { error: notifyError, success: notifySuccess } = useNotify()
    const { t } = useI18n()

    async function handle<T>(promise: Promise<Response>, successMsg?: string): Promise<T> {
        const res = await promise

        // успех
        if (res.ok) {
            if (successMsg) notifySuccess(successMsg)
            if (res.status === 204) return null as T
            return await res.json()
        }

        // ошибка
        let message = ''
        try {
            const body = await res.json()
            // FastAPI 422
            if (Array.isArray(body?.detail) && body.detail[0]?.msg) {
                message = body.detail[0].msg
            } else if (typeof body?.detail === 'string') {
                message = body.detail
            } else if (body?.message) {
                message = body.message
            }
        } catch {
            message = res.statusText
        }

        // маппинг по статусу
        switch (res.status) {
            case 400: message ||= t('errors.bad_request'); break
            case 401: message ||= t('errors.unauthorized'); break
            case 403: message ||= t('errors.forbidden'); break
            case 404: message ||= t('errors.not_found'); break
            case 409: message ||= t('errors.conflict'); break
            case 422: message ||= t('errors.unprocessable'); break
            case 500: message ||= t('errors.server'); break
            default:  message ||= t('errors.generic')
        }

        notifyError(message)
        return null as T
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
            handle<Out>(request(base, { method: 'POST', body: JSON.stringify(payload) }),
                t('resources.notifications.created')),

        update: (id: number, payload: Update) =>
            handle<Out>(request(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
                t('resources.notifications.updated')),

        delete: (id: number) =>
            handle<void>(request(`${base}/${id}`, { method: 'DELETE' }),
                t('resources.notifications.deleted')),
    }
}
