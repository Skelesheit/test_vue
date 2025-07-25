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
        back: string
        errors: {
            inn_digits: string
        }
        edit: string
    }

    cookies: {
        message: string,
        ok: string,
    }

    create_or_join: {
        title: string,
        join_title: string,
        join_description: string,
        create_title: string,
        create_description: string,
    },

    join_form: {
        inn: string,
        token: string,
        submit: string,
        inn_invalid: string,
        token_required: string,
        back: string
    },

    join_success: {
        title: string,
        description: string,
        go_to_profile: string
    },

    create_success: {
        title: string,
        description: string,
        go_to_profile: string
    },

    company_name_form: {
        company_name: string
        company_name_placeholder: string
        company_name_hint: string
    },
    personal_cabinet: {
        title: string
        profile: string
        settings: {
            title: string
            transfer_owner: string
            select_member: string
            transfer: string
            change_type: string
            convert_to_ip: string
            danger_zone: string
            delete_company: string
            edit: string
        }
        invite: {
            title: string
            by_email: string
            by_token: string
            send: string
            token_count: string
            generate: string
            generated_tokens: string
            success_copy: string
            copy: string
            email_sent_success: string
        }
        members: {
            title: string
            email: string
            role: string
            status: string
            remove: string
            confirm_remove: string
        }
        actions: {
            edit: string
            delete: string
            save: string
            cancel: string
        }
    }
}
