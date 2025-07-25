// Универсальный тип для опций запроса
import {EnterpriseType, MemberRole, MemberStatus} from "@/services/enums";

export interface RequestOptions extends RequestInit {
    noRetry?: boolean
}

export interface UserResponse{
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

export interface Contact {
    phone: string
    city: string
    address: string
}

export interface IndividualProfile {
    first_name: string
    last_name: string
    patronymic: string
}

export interface LegalEntityProfile {
    org_name: string
    kpp: string
    opf_full: string
    opf_short: string
}

export interface LegalEntity {
    inn: string
    ogrn: string
    management_name: string
    legal_entity_profile?: LegalEntityProfile
}

export interface EnterpriseMemberOut {
    id: number
    email: string
    role: MemberRole
    status: MemberStatus
}

export interface EnterpriseResponse {
    id: number
    name: string
    enterprise_type: string
    contact?: Contact
    individual_profile?: IndividualProfile
    legal_entity?: LegalEntity
    members: EnterpriseMemberOut[]
}

export interface InviteTokensResponse {
    tokens: string[]
}

export interface JoinTokenIn {
    inn: string
    token: string
}

// payload, который уходит на сервер
export interface FillDataPayload {
    name: string
    enterprise_type: EnterpriseType
    contact: ContactPayload
    fill: IndividualPayload | (
        LegalPayload & {
        legal_entity_profile?: LegalEntityPayload
        }
    )
}



