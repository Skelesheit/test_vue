import { createRouter, createWebHistory } from 'vue-router'

// Lazy-загрузка страниц
const LoginPage = () => import('@/pages/Login.vue')
const RegisterPage = () => import('@/pages/Register.vue')
const NotFound = () => import('@/pages/NotFound.vue')
const Layout = () => import('@/layout/Layout.vue')
const EmailNotification = () => import('@/pages/EmailNotification.vue')
const FillForm = () => import('@/pages/FillForm.vue')
const routes = [
    {
     path: '/',
     component: Layout,
     children: [
         { path: '/', redirect: '/register' },
         { path: '/login', component: LoginPage },
         { path: '/register', component: RegisterPage },
         { path: '/email-notify', component: EmailNotification },
         { path: '/email-confirmed', component: EmailNotification },
         { path: '/fill-form', component: FillForm },
         { path: '/:pathMatch(.*)*', component: NotFound }, // 404
     ]
    }

]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
