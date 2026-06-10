<script setup lang="ts">
import { computed } from 'vue'
import type { AppUser } from '@/types'

const props = defineProps<{
	user: AppUser | null
	firebaseReady: boolean
}>()

const emit = defineEmits<{
	logout: []
}>()

const userName = computed(() => props.user?.displayName || 'Usuario')
const modeLabel = computed(() => (props.firebaseReady ? 'Firebase activo' : 'Modo local'))
const modeClass = computed(() => (props.firebaseReady ? 'is-online' : 'is-local'))
</script>

<template>
	<div class="shell">
		<aside class="sidebar">
			<div>
				<div class="brand">
					<div class="brand-mark">T</div>
					<div>
						<strong>TaskControl</strong>
						<p>Gestión simple de tareas</p>
					</div>
				</div>

				<nav class="nav">
					<a class="nav-link active" href="#">Dashboard</a>
					<a class="nav-link" href="#tasks">Tareas</a>
					<a class="nav-link" href="#stats">Estadísticas</a>
				</nav>
			</div>

			<button class="ghost-button" @click="emit('logout')">Cerrar sesión</button>
		</aside>

		<main class="content">
			<header class="topbar">
				<div>
					<p class="eyebrow">Aplicación web</p>
					<h1>Bienvenido, {{ userName }}</h1>
					<p class="muted">
						Diseño limpio, simple y funcional para organizar tus pendientes
						diarios.
					</p>
				</div>

				<div class="status-pill" :class="modeClass">
					<span class="dot"></span>
					{{ modeLabel }}
				</div>
			</header>
			<slot />
		</main>
	</div>
</template>

<style scoped></style>
