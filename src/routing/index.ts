import {createRouter, createWebHistory, Router} from 'vue-router'
import {requireAuth} from '@/services/guard'

// Lazy-загрузка страниц
const Personal = () => import("@/Pages/Personal/PersonalCabinet.vue")
const SuccessCreate = () => import("@/Pages/SuccessCreate.vue")
const SuccessJoin =() => import("@/Pages/SuccessCreate.vue")
const JoinEnterprise = () => import("@/Pages/JoinEnterprise.vue")
const JoinOrCreate = () => import('@/Pages/JoinOrCreate.vue')
const CreateEnterprise = () => import("@/Pages/CreateEnterprise.vue");
const LoginPage = () => import('@/Pages/Login.vue')
const RegisterPage = () => import('@/Pages/Register.vue')
const NotFound = () => import('@/Pages/NotFound.vue')
const Layout = () => import('@/layout/Layout.vue')
const EmailNotification = () => import('@/Pages/EmailNotification.vue')
const End = () => import('@/Pages/End.vue')
const EmailConfirmed = () => import('@/Pages/EmailConfirmed.vue')
const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {path: '/', redirect: '/register'},
            {path: '/login', component: LoginPage},
            {path: '/register', component: RegisterPage},
            {path: '/email-notify', component: EmailNotification},
            {path: '/email-confirmed', component: EmailConfirmed},
            {
                path: '/join-or-create',
                component: JoinOrCreate,
                meta: {requireAuth: true},
            },
            {
              path: '/success-to-create',
              component: SuccessCreate,
              meta: {requireAuth: true},
            },
            {
                path: '/success-to-join',
                component: SuccessJoin,
                meta: {requireAuth: true},
            },
            {
                path: '/join-to-company',
                component: JoinEnterprise,
                meta: {requireAuth: true},
            },
            {
                path: '/create-enterprise',
                component: CreateEnterprise,
                meta: {requiresAuth: true}
            },
            {
                path: '/personal',
                component: Personal,
                meta: {requireAuth: true}
            },

            {
                path: '/all-ok',
                component: End,
                meta: {requiresAuth: true}
            },
            {path: '/:pathMatch(.*)*', component: NotFound}, // 404
        ]
    }
]

export const router: Router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(requireAuth)
