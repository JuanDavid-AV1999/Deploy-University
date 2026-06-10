import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
	getInitialUser,
	loginUser,
	logoutUser,
	onSessionChange,
	registerUser,
} from '@/services/auth'
import type { AppUser } from '@/types'

let initialized = false

export const useAuthStore = defineStore('auth', () => {
	const user = ref<AppUser | null>(getInitialUser())
	const ready = ref(false)
	const loading = ref(false)
	const error = ref('')

	const initialize = (): void => {
		if (initialized) {
			ready.value = true
			return
		}

		initialized = true
		onSessionChange((sessionUser) => {
			user.value = sessionUser
			ready.value = true
			loading.value = false
		})
	}

	const login = async (email: string, password: string): Promise<void> => {
		loading.value = true
		error.value = ''
		try {
			user.value = await loginUser(email, password)
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : 'No se pudo iniciar sesión.'
			throw err
		} finally {
			loading.value = false
			ready.value = true
		}
	}

	const register = async (
		email: string,
		password: string,
		displayName: string,
	): Promise<void> => {
		loading.value = true
		error.value = ''
		try {
			user.value = await registerUser(email, password, displayName)
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : 'No se pudo registrar el usuario.'
			throw err
		} finally {
			loading.value = false
			ready.value = true
		}
	}

	const logout = async (): Promise<void> => {
		loading.value = true
		error.value = ''
		try {
			await logoutUser()
			user.value = null
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'No se pudo cerrar sesión.'
			throw err
		} finally {
			loading.value = false
		}
	}

	return {
		user,
		ready,
		loading,
		error,
		isAuthenticated: computed(() => user.value !== null),
		initialize,
		login,
		register,
		logout,
	}
})
