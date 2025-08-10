// router/index.ts
import {createRouter, createWebHistory, Router} from 'vue-router'
import {
    requireAuth,
    requireMembership,
    requireNoMembership
} from '@/services/guard'

// Lazy-загрузка страниц
const Personal = () => import("@/Pages/Personal/PersonalCabinet.vue")
const SuccessCreate = () => import("@/Pages/SuccessCreate.vue")
const SuccessJoin =() => import("@/Pages/SuccessJoin.vue")
const JoinEnterprise = () => import("@/Pages/JoinEnterprise.vue")
const JoinOrCreate = () => import('@/Pages/JoinOrCreate.vue')
const CreateEnterprise = () => import("@/Pages/CreateEnterprise.vue");
const LoginPage = () => import('@/Pages/Login.vue')
const RegisterPage = () => import('@/Pages/Register.vue')
const NotFound = () => import('@/Pages/NotFound.vue')
const Layout = () => import('@/layout/Layout.vue')
const EmailNotification = () => import('@/Pages/EmailNotification.vue')
const EmailConfirmed = () => import('@/Pages/EmailConfirmed.vue')
const Resources = () => import('@/Pages/Resources/ResourcePage.vue')

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

            // Маршруты только для не-членов (еще не выбрали компанию)
            {
                path: '/join-or-create',
                component: JoinOrCreate,
                meta: {requiresAuth: true, requiresNoMembership: true},
            },
            {
                path: '/join-to-company',
                component: JoinEnterprise,
                meta: {requiresAuth: true, requiresNoMembership: true},
            },
            {
                path: '/create-enterprise',
                component: CreateEnterprise,
                meta: {requiresAuth: true, requiresNoMembership: true}
            },
            // Маршруты только для членов (уже выбрали компанию)
            {
                path: '/success-to-create',
                component: SuccessCreate,
                meta: {requiresAuth: true, requiresMembership: true},
            },
            {
                path: '/success-to-join',
                component: SuccessJoin,
                meta: {requiresAuth: true, requiresMembership: true},
            },
            {
                path: '/personal',
                component: Personal,
                meta: {requiresAuth: true, requiresMembership: true}
            },
            {
                path: '/resources',
                component: Resources,
                meta: {requiresAuth: true, requiresMembership: true}
            },
            {path: '/:pathMatch(.*)*', component: NotFound}, // 404
        ]
    }
]

export const router: Router = createRouter({
    history: createWebHistory(),
    routes,
})

// Применяем гварды в правильном порядке
router.beforeEach(requireAuth)
router.beforeEach(requireNoMembership) // Сначала проверяем "не член"
router.beforeEach(requireMembership)   // Потом проверяем "член"