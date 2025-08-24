import type {TranslationSchema} from './schema'

const en: TranslationSchema = {
    common: {
        create: 'Create',
        edit: 'Edit',
        view: 'View',
        save: 'Save',
        cancel: 'Cancel',
        select_placeholder: 'Select…',
    },
    welcome: 'Welcome',
    register: 'Sign up',
    register_button: 'Register',
    login: 'Login',
    login_button: 'Log in',
    email: 'Email',
    email_placeholder: 'example@example.com',
    password: 'Password',
    confirm_password: 'Confirm password',
    show_password: 'Show password',
    hide_password: 'Hide password',
    password_mismatch: 'passwords do not match',
    registration_failed: 'Registration failed',
    accept_terms: 'I accept the',
    privacy_policy: 'privacy policy',
    already_have_account: 'Already have an account?',
    no_account: "Don't have an account?",
    captcha_required: 'Please verify that you are not a robot',
    captcha_error: 'Captcha verification failed',
    login_failed: 'Incorrect email or password',
    email_sent: {
        title: 'Email Sent!',
        description: 'Please check your inbox to confirm your email address.',
        open_email: 'Open Mail'
    },
    not_found: {
        title: 'Page not found',
        description: 'The page could not be found or the link is invalid.',
        back_home: 'Go back to home'
    },
    form: {
        legal_entity: 'Legal Entity',
        ip: 'Individual Entrepreneur',
        legal: 'Legal Entity',
        choose_title: 'Who are you?',
        inn: 'INN',
        ogrn: 'OGRN',
        ip_fullname: 'Full Name of Entrepreneur',
        org_name: 'Organization Name',
        kpp: 'KPP',
        opf_full: 'Full Legal Form',
        opf_short: 'Short Legal Form',
        manager: 'Manager',
        individual: 'Individual',
        first_name: 'First Name',
        last_name: 'Last Name',
        patronymic: 'Middle Name',
        contacts: 'Contact Information',
        city: 'City',
        address: 'Address',
        phone: 'Phone',
        create: 'Create',
        delete: 'Delete',
        back: 'Back',
        errors: {
            inn_digits: 'INN must contain only 10–12 digits'
        },
        edit: "edit"
    },
    cookies: {
        message:
            'This site uses cookies to ensure you get the best experience. By continuing to use the site, you agree to our use of cookies.',
        ok: 'OK, got it'
    },
    create_or_join: {
        title: "Choose your role",
        join_title: "I am an employee",
        join_description: "Join an existing company",
        create_title: "I am a company",
        create_description: "Create a new company"
    },
    join_form: {
        inn: "Company INN",
        token: "Invitation token",
        submit: "Join company",
        inn_invalid: "Enter a valid INN (10–12 digits)",
        token_required: "Token is required",
        back: "back"
    },
    join_success: {
        title: "Successfully joined!",
        description: "You have successfully joined the company. You can now go to your profile.",
        go_to_profile: "Go to dashboard"
    },
    create_success: {
        title: "Company successfully created!",
        description: "You have successfully created a company. You can now go to your dashboard.",
        go_to_profile: "Go to dashboard"
    },

    company_name_form: {
        company_name: "Company Name",
        company_name_placeholder: "Enter company name",
        company_name_hint: "Specify the legal or working name of your company"
    },
    personal_cabinet: {
        title: "Personal Cabinet",
            profile: "Profile",
            assortment : {
                btn_text: "Assortment"
            },
            settings: {
            title: "Settings",
                transfer_owner: "Transfer Ownership",
                select_member: "Select Member",
                transfer: "Transfer",
                change_type: "Change Organization Type",
                convert_to_ip: "Convert to IP",
                danger_zone: "Danger Zone",
                delete_company: "Delete Company",
                edit: "Edit"
        },
        invite: {
            title: "Invite Members",
                by_email: "By Email",
                by_token: "By Token",
                send: "Send",
                token_count: "Token Count",
                generate: "Generate",
                generated_tokens: "Generated Tokens",
                success_copy: "Token successfully copied",
                copy: "Copy",
                email_sent_success: "Email sent successfully",
        },
        members: {
            title: "Members",
            email: "Email",
            role: "Role",
            status: "Status",
            remove: "Remove",
            confirm_remove: "Are you sure to remove employee?"

        },
        actions: {
            edit: "Edit",
                delete: "Delete",
                save: "Save",
                cancel: "Cancel"
        }
    },
    errors: {
        bad_request: 'Bad request',
        unauthorized: 'Unauthorized',
        forbidden: 'Forbidden',
        not_found: 'Not found',
        conflict: 'Conflict',
        unprocessable: 'Unprocessable entity',
        server: 'Server error',
        generic: 'Something went wrong',
    },
    resources: {
        dialog: {
            cancel: "Cancel",
            delete_text: "Are you want to delete model?",
            delete_confirm: "Agree",
            delete_title: "Confirm to delete"
        },
        notifications: {
            created: 'Created successfully',
            updated: 'Updated successfully',
            deleted: 'Deleted successfully',
        },
        table : {
            delete: "Delete",
            create: "Create",
            edit: "Edit",
            view_tooltip: "View",
            refresh: "Refresh",
            actions: "Action",
            loading: "Loading",
            add: "Add",
            save: "Save",
            close: "Exit"
        },
        navigation: {
            shortName: 'Short name',
            menu: 'Menu',
            material_category: 'Material category',
            material: 'Material',
            operation_type: 'Operation type',
            operation: 'Operation',
            method: 'Method',
            machine_type: 'Machine type',
            machine: 'Machine',
            tooling: 'Tooling',
            tool: 'Tool',
            gost: 'GOST',
            assortment_type: 'Assortment type',
            gost_assortment: 'GOST assortment',
            assortment: 'Assortment',
        },
        material: {
            id: "ID",

            add_category: "Add category",
            add_assortment_type: "Add assortment type",

            assortment_type: "Assortment type",
            quantity: "Quantity",
            price: "Price, RUB",
            DB: "D/B, mm",
            height: "Height",
            length: "Length",
            strength: "Width",

            brand: "Brand",
            dense: "Density",
            hardness: "Hardness",
            tear_resistance: "Tear resistance",
            elongation: "Elongation",
            category: "Category",
            filter_placeholder: "search by brand",
            no_data: "No materials",

            comment: "Comment",
            comment_en: "Comment (EN)",

            create_title: "Material",
            edit_title: "Material",
            subtitle: "Fill in material parameters",

            sections: {
                classification: "Classification",
                identity: "Identity",
                geometry: "Geometry",
                mechanics: "Mechanical properties",
                notes: "Notes",
            },
        },
        material_category: {
            id: "Id",
            name: "Name",
            material_type: "Material type",
            no_data: "there isn't your categories"
        },
        operation_type: {
            id: "Id",
            name: "Name",
            no_data: "there isn't your operation types"
        },
        method: {
            id: "Id",
            name: "Name",
            operation_type_id: "Operation type id",
            no_data: "there isn't your methods"
        },
        machine_type: {
            id: "Id",
            name: "Name",
            method_id: "Method id",
            no_data: "there isn't your machines type"
        },
        machine: {
            id: "Id",
            name: "Name",
            machine_type_id: "Machine type id",
            count: "Count",
            X: "X",
            Y: "Y",
            Z: "Z",
            H: "H",
            D: "D",
            no_data: "there isn't your machines"
        },
        tooling: {
            id: "Id",
            name: "Name",
            mark: "Mark",
            gost: "Gost",
            machine_id: "Machine id",
            h_d_foot: "H d foot",
            B: "B",
            L: "L",
            A: "A",
            h_d: "H d",
            no_data: "there isn't your tooling",
        },
        tool: {
            id: "Id",
            name: "Name",
            mark: "Mark",
            gost: "Gost",
            machine_id: "Machine id",
            K_H_D: "K h d",
            alpha_B_d: "Alpha b d",
            L: "L",
            I_max_cut: "I max cut",
            S: "S",
            no_data: "there isn't your tools",
        },
        gost: {
            id: "Id",
            number: "Number",
            no_data: "there isn't your GOST",
        },
        assortment_type: {
            id: "Id",
            name: "Name",
            no_data: "there isn't your assortment type",
        },
        gost_assortment: {
            id: "Id",
            gost: "Gost",
            assortment_type: "Assortment type",
            no_data: "there isn't your gost with assortment",
        },
        assortment: {
            id: "Id",
            gost: "Gost",
            B_D: "B d",
            height: "Height",
            strength: "Strength",
            length: "Length",
            no_data: "there isn't your assortments"
        }
    },
}

export default en
