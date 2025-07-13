export interface TranslationSchema {
    welcome: string
    register: string
    register_button: string
    login: string
    login_button: string
    email: string
    email_placeholder: string
    password: string
    confirm_password: string
    show_password: string
    hide_password: string
    password_mismatch: string
    registration_failed: string
    accept_terms: string
    privacy_policy: string
    already_have_account: string
    no_account: string
    captcha_required: string
    captcha_error: string
    login_failed: string

    email_sent: {
        title: string
        description: string
        open_email: string
    }

    not_found: {
        title: string
        description: string
        back_home: string
    }

    form: {
        legal_entity: string
        ip: string
        legal: string
        choose_title: string
        inn: string
        ogrn: string
        ip_fullname: string
        org_name: string
        kpp: string
        opf_full: string
        opf_short: string
        manager: string
        individual: string
        first_name: string
        last_name: string
        patronymic: string
        contacts: string
        city: string
        address: string
        phone: string
        create: string
        delete: string
        errors: {
            inn_digits: string
        }
    }

    cookies: {
        message: string
        ok: string
    }
}
