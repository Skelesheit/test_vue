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

// types/dadata.ts
export interface DadataOrganization {
    ogrn?: string
    inn?: string
    kpp?: string
    management?: {
        name?: string
    }
    name?: {
        full_with_opf?: string
    }
    opf?: {
        full?: string
        short?: string
    }
    address?: {
        value?: string
        data?: {
            city?: string
        }
    }
}



export interface ContactPayload {
    city: string
    address: string
    phone: string
}

export interface IndividualPayload {
    last_name: string
    first_name: string
    patronymic: string
}

export interface LegalPayload {
    inn: string
    ogrn: string
    management_name: string
}

export interface LegalEntityPayload {
    org_name: string
    kpp: string
    opf_full: string
    opf_short: string
}

// payload, который уходит на сервер
export interface FillDataPayload {
    user_type: UserType
    contact: ContactFormData
    fill: IndividualFormData | (
        LegalFormData & {
        legal_entity_profile?: LegalEntityProfileData
    })
}

