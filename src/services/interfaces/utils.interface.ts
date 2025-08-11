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

export interface RequestOptions extends RequestInit {
    noRetry?: boolean
}