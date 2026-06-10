<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async (): Promise<void> => {
	await auth.login(email.value, password.value)
	await router.push('/dashboard')
}
</script>

<template>
	<section class="auth-page">
		<div class="auth-card">
			<div class="auth-copy">
				<p class="eyebrow">TaskControl</p>
				<h1>Inicia sesión</h1>
				<p>
					Accede a tu panel para organizar tareas, prioridades y fechas de
					entrega en un solo lugar.
				</p>
			</div>

			<form class="auth-form" @submit.prevent="handleLogin">
				<label>
					Correo
					<input
						v-model="email"
						type="email"
						placeholder="correo@ejemplo.com"
						required
					/>
				</label>

				<label>
					Contraseña
					<input
						v-model="password"
						type="password"
						placeholder="••••••••"
						required
					/>
				</label>

				<p v-if="auth.error" class="error-box">{{ auth.error }}</p>

				<button class="primary-button" :disabled="auth.loading">
					{{ auth.loading ? 'Ingresando...' : 'Entrar' }}
				</button>

				<router-link class="text-link" to="/register">
					Crear una cuenta nueva
				</router-link>
			</form>
		</div>
	</section>
</template>

<style scoped></style>
