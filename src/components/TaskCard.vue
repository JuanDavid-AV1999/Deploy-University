<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types'

const props = defineProps<{
	task: Task
}>()

defineEmits<{
	toggle: []
	edit: []
	remove: []
}>()

const priorityClass = computed(() => {
	if (props.task.priority === 'Alta') return 'high'
	if (props.task.priority === 'Media') return 'medium'
	return 'low'
})

const formattedDate = computed(() =>
	new Intl.DateTimeFormat('es-CO', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(new Date(props.task.dueDate)),
)
</script>

<template>
	<article class="task-card" :class="{ done: task.completed }">
		<div class="task-main">
			<div class="task-header">
				<div>
					<p class="eyebrow">{{ task.category }}</p>
					<h3>{{ task.title }}</h3>
				</div>

				<span class="priority-pill" :class="priorityClass">{{
					task.priority
				}}</span>
			</div>

			<p class="task-description">
				{{ task.description || 'Sin descripción adicional.' }}
			</p>

			<div class="task-meta">
				<span>📅 {{ formattedDate }}</span>
				<span>🕒 {{ task.completed ? 'Completada' : 'Pendiente' }}</span>
			</div>
		</div>

		<div class="task-actions">
			<button class="action-button" @click="$emit('toggle')">
				{{ task.completed ? 'Reabrir' : 'Completar' }}
			</button>
			<button class="action-button secondary" @click="$emit('edit')">Editar</button>
			<button class="action-button danger" @click="$emit('remove')">
				Eliminar
			</button>
		</div>
	</article>
</template>

<style scoped></style>
