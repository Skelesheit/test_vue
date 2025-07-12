import {api} from "@/services/api.js";

export async function requireAuth(to, from, next) {

    if (to.path === '/login') {
        return next(); // логин — всегда доступен
    }
    const authorized = await api.isAuthorized()
    console.log('Guard check:', to.fullPath, '| authorized:', authorized);
    if (!authorized) {
        return next({ path: '/login', query: { redirect: to.fullPath } });
    }
    return next();
}
