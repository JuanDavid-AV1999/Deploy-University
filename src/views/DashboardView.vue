<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainShell from '@/components/MainShell.vue'
import StatCard from '@/components/StatCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/task'
import { isFirebaseReady } from '@/services/firebase'
import type { Task, TaskDraft } from '@/types'

const auth = useAuthStore()
const tasks = useTaskStore()
const router = useRouter()
const editingTask = ref<Task | null>(null)

const firebaseReady = computed(() => isFirebaseReady)

onMounted(async () => {
	if (auth.user) {
		await tasks.load(auth.user.uid)
	}
})

const saveTask = async (payload: TaskDraft): Promise<void> => {
	if (!auth.user) return

	if (editingTask.value) {
		await tasks.updateTask(editingTask.value.id, payload)
	} else {
		await tasks.addTask(payload)
	}

	editingTask.value = null
}

const startEditing = (task: Task): void => {
	editingTask.value = task
	window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEditing = (): void => {
	editingTask.value = null
}

const remove = async (taskId: string): Promise<void> => {
	await tasks.deleteTask(taskId)
	if (editingTask.value?.id === taskId) editingTask.value = null
}

const handleLogout = async (): void => {
	await auth.logout()
	await router.push('/login')
}
</script>

<template>
	<MainShell :user="auth.user" :firebase-ready="firebaseReady" @logout="handleLogout">
		<section class="hero-grid" id="stats">
			<StatCard label="Total tareas" :value="tasks.total" icon="📋" />
			<StatCard label="Pendientes" :value="tasks.pending" icon="⏳" />
			<StatCard label="Completadas" :value="tasks.completed" icon="✅" />
			<StatCard label="Progreso" :value="`${tasks.completionRate}%`" icon="📈" />
		</section>

		<section class="dashboard-grid" id="tasks">
			<TaskForm
				:task="editingTask"
				:loading="tasks.loading"
				@save="saveTask"
				@cancel="cancelEditing"
			/>

			<div class="panel">
				<div class="panel-heading">
					<div>
						<p class="eyebrow">Lista principal</p>
						<h2>Tareas guardadas</h2>
					</div>
					<button class="text-button" @click="tasks.resetFilters()">
						Limpiar filtros
					</button>
				</div>

				<div class="filters">
					<input
						v-model="tasks.search"
						type="search"
						placeholder="Buscar tarea..."
					/>
					<select v-model="tasks.status">
						<option value="all">Todas</option>
						<option value="pending">Pendientes</option>
						<option value="completed">Completadas</option>
					</select>
					<select v-model="tasks.priority">
						<option value="all">Todas las prioridades</option>
						<option value="Alta">Alta</option>
						<option value="Media">Media</option>
						<option value="Baja">Baja</option>
					</select>
					<select v-model="tasks.sortBy">
						<option value="recent">Más recientes</option>
						<option value="dueDate">Por fecha</option>
						<option value="priority">Por prioridad</option>
					</select>
				</div>

				<div class="task-list" v-if="tasks.filteredTasks.length">
					<TaskCard
						v-for="task in tasks.filteredTasks"
						:key="task.id"
						:task="task"
						@toggle="tasks.toggleTask(task)"
						@edit="startEditing(task)"
						@remove="remove(task.id)"
					/>
				</div>

				<div v-else class="empty-state">
					<h3>No hay tareas para mostrar</h3>
					<p>Crea una nueva tarea para comenzar a organizar tus pendientes.</p>
				</div>
			</div>
		</section>
	</MainShell>
</template>

<style scoped></style>
