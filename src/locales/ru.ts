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
        }
    },

    cookies: {
        message:
            'Этот сайт использует куки-файлы для корректной работы. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием.',
        ok: 'Ок, понял'
    }
}

export default ru
