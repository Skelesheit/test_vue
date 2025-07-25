import type {TranslationSchema} from './schema'

const en: TranslationSchema = {
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
                copy: "Copy"
        },
        members: {
            title: "Members",
                email: "Email",
                role: "Role",
                status: "Status",
                remove: "Remove"
        },
        actions: {
            edit: "Edit",
                delete: "Delete",
                save: "Save",
                cancel: "Cancel"
        }
    }
}

export default en
