import type {NavigationGuardNext, RouteLocationNormalized} from 'vue-router'

import {api} from '@/services/api'

export async function requireAuth(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
): Promise<void> {
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
