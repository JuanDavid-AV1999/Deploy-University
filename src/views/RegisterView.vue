<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const displayName = ref('')
const email = ref('')
const password = ref('')

const handleRegister = (): Promise<void> => {
	await auth.register(email.value, password.value, displayName.value)
	await router.push('/dashboard')
}
</script>

<template>
	<section class="auth-page">
		<div class="auth-card">
			<div class="auth-copy">
				<p class="eyebrow">TaskControl</p>
				<h1>Crear cuenta</h1>
				<p>
					Regístrate para empezar a usar tu gestor de tareas con una interfaz
					clara y moderna.
				</p>
			</div>

			<form class="auth-form" @submit.prevent="handleRegister">
				<label>
					Nombre
					<input
						v-model="displayName"
						type="text"
						placeholder="Tu nombre"
						required
					/>
				</label>

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
						placeholder="mínimo 6 caracteres"
						required
					/>
				</label>

				<p v-if="auth.error" class="error-box">{{ auth.error }}</p>

				<button class="primary-button" :disabled="auth.loading">
					{{ auth.loading ? 'Creando...' : 'Registrarme' }}
				</button>

				<router-link class="text-link" to="/login">
					Ya tengo una cuenta
				</router-link>
			</form>
		</div>
	</section>
</template>

<style scoped></style>
