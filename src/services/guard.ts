import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {api} from "@/services/api";

export async function requireAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): Promise<void> {
    // Если маршрут не требует авторизации, пропускаем
    if (!to.matched.some(record => record.meta.requiresAuth)) {
        return next()
    }

    // Разрешаем доступ к странице логина
    if (to.path === '/login') {
        return next()
    }

    const authorized = await api.isAuthorized()
    console.log('Guard check:', to.fullPath, '| authorized:', authorized)

    if (!authorized) {
        return next({path: '/login', query: {redirect: to.fullPath}})
    }

    return next()
}

export async function requireMembership(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): Promise<void> {
    // Проверяем только маршруты, требующие членства
    if (!to.matched.some(record => record.meta.requiresMembership)) {
        return next()
    }

    try {
        const userData = await api.me(true) // ← Это УЖЕ объект данных, не Response!
        if (userData) {
            console.log("is member: ", userData.is_member)
            if (userData.is_member) {
                return next() // Пользователь - член, можно продолжать
            } else {
                // Не член - редирект на выбор
                return next('/join-or-create')
            }
        }
    } catch (error) {
        console.error('Error checking membership:', error)
    }

    return next('/join-or-create')
}

export async function requireNoMembership(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): Promise<void> {
    // Проверяем только маршруты, доступные только не-членам
    if (!to.matched.some(record => record.meta.requiresNoMembership)) {
        return next()
    }

    try {
        const userData = await api.me(true) // ← Это УЖЕ объект данных
        if (userData) {
            if (!userData.is_member) {
                return next() // Пользователь не член, можно продолжать
            } else {
                // Уже член - редирект в личный кабинет
                return next('/personal')
            }
        }
    } catch (error) {
        console.error('Error checking membership:', error)
    }

    return next('/personal')
}