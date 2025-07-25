import type { TranslationSchema } from './schema'

const ru: TranslationSchema = {
    welcome: 'Добро пожаловать',
    register: 'Регистрация',
    register_button: 'Зарегистрироваться',
    login: 'Вход',
    login_button: 'Войти',
    email: 'Электронная почта',
    email_placeholder: 'example@example.com', // ✅ добавлено
    password: 'Пароль',
    confirm_password: 'Подтвердите пароль',
    show_password: 'Показать пароль',
    hide_password: 'Скрыть пароль',
    password_mismatch: 'Пароли не совпадают',
    registration_failed: 'Ошибка при регистрации',
    accept_terms: 'Я принимаю',
    privacy_policy: 'условия использования',
    already_have_account: 'Уже есть аккаунт?',
    no_account: 'Нет аккаунта?',
    captcha_required: 'Пожалуйста, подтвердите, что вы не робот',
    captcha_error: 'Ошибка при проверке капчи',
    login_failed: 'Неверный логин или пароль',

    email_sent: {
        title: 'Письмо отправлено!',
        description: 'Пожалуйста, перейдите в вашу почту, чтобы подтвердить адрес.',
        open_email: 'Открыть почту'
    },

    not_found: {
        title: 'Страница не найдена',
        description: 'Страница не найдена или вы перешли по некорректной ссылке.',
        back_home: 'Вернуться на главную'
    },

    form: {
        legal_entity: 'Юридическое лицо',
        ip: 'ИП',
        legal: 'Юридическое лицо',
        choose_title: 'Кто вы?',
        inn: 'ИНН',
        ogrn: 'ОГРН',
        ip_fullname: 'ФИО предпринимателя',
        org_name: 'Название организации',
        kpp: 'КПП',
        opf_full: 'ОПФ (полное)',
        opf_short: 'ОПФ (сокр.)',
        manager: 'Руководитель',
        individual: 'Физическое лицо',
        first_name: 'Имя',
        last_name: 'Фамилия',
        patronymic: 'Отчество',
        contacts: 'Контактные данные',
        city: 'Город',
        address: 'Адрес',
        phone: 'Телефон',
        create: 'Создать',
        delete: 'Удалить',
        errors: {
            inn_digits: 'ИНН должен содержать только 10–12 цифр'
        },
        back: 'Назад',
        edit: 'Редактировать'
    },

    cookies: {
        message:
            'Этот сайт использует куки-файлы для корректной работы. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием.',
        ok: 'Ок, понял'
    },

    create_or_join: {
        title: "Выберите, кто вы",
        join_title: "Я сотрудник",
        join_description: "Присоединиться к существующей компании",
        create_title: "Я компания",
        create_description: "Создать новую компанию"
    },
    join_form: {
        inn: "ИНН компании",
        token: "Токен приглашения",
        submit: "Присоединиться",
        inn_invalid: "Введите корректный ИНН (10–12 цифр)",
        token_required: "Токен обязателен",
        back: "Назад"
    },
    join_success: {
        title: "Успешное присоединение!",
        description: "Вы успешно присоединились к компании. Теперь вы можете перейти в личный кабинет.",
        go_to_profile: "Перейти в кабинет"
    },
    create_success: {
        title: "Компания успешно создана!",
        description: "Вы успешно зарегистрировали компанию. Теперь вы можете перейти в личный кабинет.",
        go_to_profile: "Перейти в кабинет"
    },
    company_name_form: {
        company_name: "Наименование компании",
        company_name_placeholder: "Введите наименование",
        company_name_hint: "Укажите юридическое или условное название компании"
    },
    personal_cabinet: {
        title: "Персональный кабинет",
        profile: "Профиль",
        settings: {
            title: "Настройки",
            transfer_owner: "Передать права владельца",
            select_member: "Выберите сотрудника",
            transfer: "Передать",
            change_type: "Изменить тип организации",
            convert_to_ip: "Преобразовать в ИП",
            danger_zone: "Опасная зона",
            delete_company: "Удалить компанию",
            edit: "Редактировать"
        },
        invite: {
            title: "Пригласить сотрудников",
            by_email: "По email",
            by_token: "По токену",
            send: "Отправить",
            token_count: "Количество токенов",
            generate: "Сгенерировать",
            generated_tokens: "Сгенерированные токены",
            copy: "Копировать"
        },
        members: {
            title: "Сотрудники",
            email: "Email",
            role: "Роль",
            status: "Статус",
            remove: "Удалить"
        },
        actions: {
            edit: "Редактировать",
            delete: "Удалить",
            save: "Сохранить",
            cancel: "Отмена"
        }
    }
}

export default ru
