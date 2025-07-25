export enum Theme {
    Light = 'neurop-light',
    Dark = 'neurop-dark',
}

export enum Language {
    Russian = 'ru',
    English = 'en',
}

export enum EnterpriseType {
    Individual = 'Физ. лицо',
    Legal = 'ИП',
    LegalEntity = 'Юр. лицо'
}

export enum MemberRole {
    OWNER = "owner", // Владелец компании
    ADMIN = "admin", // Администратор
    MANAGER = "manager", // Руководитель отдела / проекта
    EMPLOYEE = "employee", // Обычный сотрудник
    INTERN = "intern", // Стажёр
    OTHER = "other"
}

export enum MemberStatus {
    INVITED = "invited", // Приглашён, но не принял приглашение
    ACTIVE = "active", // Активный член компании
    SUSPENDED = "suspended", // Временно отстранён
    LEFT = "left", // Вышел из компании
    REMOVED = "removed" // Был удалён админом/владельцем
}
