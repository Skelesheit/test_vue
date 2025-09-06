export interface TranslationSchema {
    common: {
        create: string
        delete: string
        loading: string
        edit: string
        view: string
        save: string
        cancel: string
        select_placeholder: string
        actions: string
        any: string
        resetFilters: string
        nothingFound: string
        select_parent_first: string;
        close: string,
        search_by_name: string,

        common: string,
        name: string,
    }



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
    notifications: {
        created: string
        updated: string
        deleted: string
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

        assortment : {
            btn_text: string
        },
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
    },
    errors: {
        bad_request: string
        unauthorized: string
        forbidden: string
        not_found: string
        conflict: string
        unprocessable: string
        server: string
        generic: string
    }
    resources: {
        reference: {
            title: string,
            search_placeholder: string,
            create_category: string,
            create_assortment: string,
            create_gost: string,
            empty: string,
        },
        notifications: {
            created: string
            updated: string
            deleted: string
        },
        dialog: {
            cancel: string,
            delete_text: string,
            delete_confirm: string,
            delete_title: string,
        },
        table : {
            save: string,
            create: string,
            delete: string,
            edit: string,
            view_tooltip: string
            edit_tooltip: string,
            delete_tooltip: string,
            refresh: string,
            actions: string,
            loading: string,
            add: string,
            close: string,
        },



        navigation : {
            shortName: string,
            menu: string,
            material_category: string,
            material: string,
            operation_type: string,
            operation: string,
            method: string,
            machine_type: string,
            machine: string,
            tooling: string,
            tool: string,
            gost: string,
            assortment_type: string,
            gost_assortment: string,
            assortment: string,
        },
        material: {
            id: string,
            no_data: string,

            add_category: string,
            add_assortment_type: string,

            mark: string,
            dense: string,
            hardness: string,
            tear_resistance: string,
            elongation: string,
            category: string,
            filter_placeholder: string,
            create_title: string
            edit_title: string
            subtitle: string

            assortment_type: string
            quantity: string
            price: string

            DB: string
            height: string
            length: string
            strength: string

            comment: string
            comment_en: string

            material_category: string,
            material_type: string,

            sections: {
                classification: string
                identity: string
                geometry: string
                mechanics: string
                notes: string
            }
        }

        material_category: {
            id: string;
            name: string;
            material_type: string;
            no_data: string;

            create_title: string,
            title: string,

            material_type_options: {
                FERROUS: string,
                NONFERROUS: string,
                NONMETALLIC: string,
            },
        };
        operation_type: {
            id: string;
            title: string;
            name: string;
            no_data: string;
        };
        method: {
            id: string;
            title: string;
            name: string;
            operation_type_id: string;
            no_data: string;
        };
        machine_type: {
            id: string;
            name: string;title: string,

            method_id: string;
            no_data: string;
        };
        machine: {
            id: string;
            name: string;
            count: string;

            method: string;
            operation_type: string;
            machine_type: string;

            amortization_price: string,
            price_in_time: string,

            X: string;
            Y: string;
            Z: string;
            H: string;
            D: string;
            no_data: string;

            dictionaries: string;

            add_operation_type: string
            add_method: string;
            add_machine_type: string;

            dialogs: {
                createTitle: string,
                editTitle: string
                viewTitle: string,
            }

            sections: {
                classification: string,
                general: string,
                price: string,
                geometric: string,
                extra: string,
            }

            custom_fields: {
                key: string,
                value: string,
                key_ph: string,
                value_ph: string,
                add_field: string,
                key_duplicate: string
            },
        };
        tooling: {
            id: string;
            name: string;
            mark: string;
            gost: string;
            machine_id: string;
            h_d_foot: string;
            B: string;
            L: string;
            A: string;
            h_d: string;
            no_data: string;
        };
        tool: {
            id: string;
            name: string;
            mark: string;
            gost: string;
            machine_id: string;
            K_H_D: string;
            alpha_B_d: string;
            L: string;
            I_max_cut: string;
            S: string;
            no_data: string;
        };
        gost: {
            id: string;
            number: string;
            no_data: string;

            create_title: string;
            title: string,
            name: string,

        };
        assortment_type: {
            id: string;
            name: string;
            no_data: string;

            create_title: string,
        };
        gost_assortment: {
            id: string;
            gost: string;
            assortment_type: string;
            no_data: string;
        };
        assortment: {
            id: string;
            gost: string;
            B_D: string;
            height: string;
            strength: string;
            length: string;
            no_data: string;
        };
    };
}
