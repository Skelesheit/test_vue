// api/error.ts
export class ApiError extends Error {
    status: number
    details?: unknown
    constructor(status: number, message: string, details?: unknown) {
        super(message)
        this.status = status
        this.details = details
    }
}

export function statusMessage(t: (k:string)=>string, status: number, fallback?: string) {
    switch (status) {
        case 400: return t('errors.bad_request')       // "Некорректный запрос"
        case 401: return t('errors.unauthorized')      // "Не авторизован"
        case 403: return t('errors.forbidden')         // "Доступ запрещён"
        case 404: return t('errors.not_found')         // "Не найдено"
        case 409: return t('errors.conflict')          // "Конфликт данных"
        case 422: return t('errors.unprocessable')     // "Форма заполнена неверно"
        case 500: return t('errors.server')            // "Внутренняя ошибка сервера"
        default:  return fallback || t('errors.generic')// "Что‑то пошло не так"
    }
}
