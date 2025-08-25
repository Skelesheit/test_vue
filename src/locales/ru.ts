import type { TranslationSchema } from './schema'

const ru: TranslationSchema = {
    common: {
        create: 'Создать',
        edit: 'Изменить',
        view: 'Просмотр',
        save: 'Сохранить',
        cancel: 'Отмена',
        select_placeholder: 'Выберите…',
    },
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
        assortment : {
            btn_text: "Ассортимент"
        },
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
            success_copy: "Токен успешно скопирован",
            copy: "Копировать",
            email_sent_success: "Пользователю отправлено приглашение"
        },
        members: {
            title: "Сотрудники",
            email: "Email",
            role: "Роль",
            status: "Статус",
            remove: "Удалить",
            confirm_remove: "Вы действительно хотите удалить сотрудника?",
        },
        actions: {
            edit: "Редактировать",
            delete: "Удалить",
            save: "Сохранить",
            cancel: "Отмена"
        },
    },
    errors: {
        bad_request: 'Некорректный запрос',
        unauthorized: 'Не авторизован',
        forbidden: 'Доступ запрещён',
        not_found: 'Не найдено',
        conflict: 'Конфликт данных',
        unprocessable: 'Невалидные данные',
        server: 'Внутренняя ошибка сервера',
        generic: 'Что-то пошло не так',
    },
    resources: {
        dialog: {
            cancel: "Отменить",
            delete_text: "Вы действительно хотите удалить?",
            delete_confirm: "Подтвердить",
            delete_title: "Подтверждение удаления",
        },
        notifications: {
            created: 'Успешно создано',
            updated: 'Успешно обновлено',
            deleted: 'Успешно удалено',
        },
        table : {
            delete: "Удалить",
            create: "Создать",
            edit: "Редактировать",
            view_tooltip: "Просмотр",
            refresh: "Обновить",
            actions: "Действия",
            loading: "Загрузка",
            add: "Создать",
            save: "Сохранить",
            close: "Закрыть"
        },
        navigation: {
            shortName: 'Краткое имя',
            menu: 'Меню',
            material_category: 'Категория материала',
            material: 'Материал',
            operation_type: 'Тип операции',
            operation: 'Операция',
            method: 'Метод',
            machine_type: 'Тип станка',
            machine: 'Станок',
            tooling: 'Оснастка',
            tool: 'Инструмент',
            gost: 'ГОСТ',
            assortment_type: 'Тип сортамента',
            gost_assortment: 'ГОСТ сортамента',
            assortment: 'Сортамент',
        },
        material: {
            id: "ID",

            add_category: "Добавить категорию",
            add_assortment_type: "Добавить тип ассортимента",

            assortment_type: "тип ассортимента",
            quantity: "количество",
            price: "Цена, руб.",
            DB: "D/B, мм",
            height: "высота",
            length: "длина",
            strength: "ширина",

            brand: "Бренд",
            dense: "Плотность",
            hardness: "Твёрдость",
            tear_resistance: "Устойчивость к разрыву",
            elongation: "Удлинение",
            category: "Категория",
            filter_placeholder: "поиск по бренду",
            no_data: "Нет материалов",

            comment: 'Комментарий',
            comment_en: 'Комментарий (EN)',

            create_title: 'Создать материал',
            edit_title: 'Редактировать материал',
            subtitle: 'Заполните параметры материала',

            sections: {
                classification: 'Классификация',
                identity: 'Идентификация',
                geometry: 'Геометрия',
                mechanics: 'Механические свойства',
                notes: 'Примечания',
            },
        },
        material_category: {
            id: "ID",
            name: "Название",
            material_type: "Тип материала",
            no_data: "Нет категорий материалов",
            title: 'Категория материалов',
            create_title: 'Новая категория',
        },
        operation_type: {
            id: "ID",
            name: "Название",
            no_data: "Нет собственных типов операций",
        },
        method: {
            id: "ID",
            name: "Название",
            operation_type_id: "ID операции",
            no_data: "Нет собственных методов материалов",
        },
        machine_type: {
            id: "ID",
            name: "Название",
            method_id: "ID метода",
            no_data: "Нет собственных типов станков",
        },
        machine: {
            id: "ID",
            name: "Название",
            machine_type_id: "Тип станка",
            count: "Количество",
            X: "X",
            Y: "Y",
            Z: "Z",
            H: "H",
            D: "D",
            no_data: "Нет станков",
        },
        tooling: {
            id: "ID",
            name: "Название",
            mark: "Марка",
            gost: "ГОСТ",
            machine_id: "ID станка",
            h_d_foot: "h/d опоры",
            B: "B",
            L: "L",
            A: "A",
            h_d: "h/d",
            no_data: "Нет оснасток",
        },
        tool: {
            id: "ID",
            name: "Название",
            mark: "Марка",
            gost: "ГОСТ",
            machine_id: "ID станка",
            K_H_D: "K_H_D",
            alpha_B_d: "α B/d",
            L: "L",
            I_max_cut: "I max cut",
            S: "S",
            no_data: "Нет инструментов",
        },
        gost: {
            id: "ID",
            number: "Номер",
            no_data: "Нет личных ГОСТ-ов",

            create_title: 'Новый ГОСТ',
            title: 'ГОСТ',
            name: 'Название',
        },
        assortment_type: {
            id: "ID",
            name: "Название",
            no_data: "Нет личных типов ассортимента",

            create_title: 'Новый тип ассортимента',
        },
        gost_assortment: {
            id: "ID",
            gost: "ГОСТ",
            assortment_type: "Тип сортамента",
            no_data: "Нет записей ГОСТ, привязанных к ассортименту",
        },
        assortment: {
            id: "ID",
            gost: "ГОСТ",
            B_D: "B/D",
            height: "Высота",
            strength: "Прочность",
            length: "Длина",
            no_data: "Нет ассортимента",
        }
    },
}

export default ru
