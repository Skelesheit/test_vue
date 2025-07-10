import {api} from "@/services/api.js";

export function requireAuth(to, from, next) {
    console.log('Guard check:', to.fullPath, '| authorized:', api.isAuthorized());
    if (to.meta.requiresAuth && !api.isAuthorized()) {
        next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
        next();
    }
}
