import { createRouter, createWebHistory } from 'vue-router'
import { pinia } from '@/stores/pinia'
import { useAuthStore } from '@/stores/auth'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{ path: '/', redirect: '/dashboard' },
		{
			path: '/login',
			name: 'login',
			component: LoginView,
			meta: { guestOnly: true },
		},
		{
			path: '/register',
			name: 'register',
			component: RegisterView,
			meta: { guestOnly: true },
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			component: DashboardView,
			meta: { requiresAuth: true },
		},
		{ path: '/:pathMatch(.*)*', redirect: '/dashboard' },
	],
})

router.beforeEach(async (to) => {
	const authStore = useAuthStore(pinia)
	if (!authStore.ready) {
		authStore.initialize()
		while (!authStore.ready) {
			await new Promise((resolve) => setTimeout(resolve, 20))
		}
	}

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		return { name: 'login' }
	}

	if (to.meta.guestOnly && authStore.isAuthenticated) {
		return { name: 'dashboard' }
	}

	return true
})

export default router
