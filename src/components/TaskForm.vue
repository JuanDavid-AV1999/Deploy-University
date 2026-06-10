<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Task, TaskDraft } from '@/types'

const props = defineProps<{
	task: Task | null
	loading?: boolean
}>()

const emit = defineEmits<{
	save: [payload: TaskDraft]
	cancel: []
}>()

const emptyForm = (): TaskDraft => ({
	title: '',
	description: '',
	category: 'Estudio',
	priority: 'Media',
	dueDate: '',
	completed: false,
})

const form = reactive<TaskDraft>(emptyForm())

watch(
	() => props.task,
	(task) => {
		Object.assign(
			form,
			task
				? {
						title: task.title,
						description: task.description,
						category: task.category,
						priority: task.priority,
						dueDate: task.dueDate,
						completed: task.completed,
					}
				: emptyForm(),
		)
	},
	{ immediate: true },
)

const hasTask = computed(() => Boolean(props.task))
const title = computed(() => (hasTask.value ? 'Editar tarea' : 'Nueva tarea'))
const modeLabel = computed(() =>
	hasTask.value ? 'Actualiza un pendiente' : 'Crea un nuevo pendiente',
)
const buttonText = computed(() =>
	props.loading ? 'Guardando...' : hasTask.value ? 'Guardar cambios' : 'Agregar tarea',
)

function submitForm() {
	emit('save', {
		title: form.title.trim(),
		description: form.description.trim(),
		category: form.category,
		priority: form.priority,
		dueDate: form.dueDate,
		completed: form.completed,
	})
}
</script>

<template>
	<form class="panel form" @submit.prevent="submitForm">
		<div class="panel-heading">
			<div>
				<p class="eyebrow">{{ modeLabel }}</p>
				<h2>{{ title }}</h2>
			</div>
			<button
				v-if="hasTask"
				type="button"
				class="text-button"
				@click="$emit('cancel')"
			>
				Cancelar edición
			</button>
		</div>

		<div class="field-group">
			<label>
				Título
				<input
					v-model="form.title"
					type="text"
					placeholder="Ej. Entregar informe"
					required
				/>
			</label>

			<label>
				Fecha límite
				<input v-model="form.dueDate" type="date" required />
			</label>
		</div>

		<label>
			Descripción
			<textarea
				v-model="form.description"
				rows="4"
				placeholder="Escribe aquí los detalles de la tarea"
			/>
		</label>

		<div class="field-group">
			<label>
				Categoría
				<select v-model="form.category">
					<option value="Estudio">Estudio</option>
					<option value="Trabajo">Trabajo</option>
					<option value="Personal">Personal</option>
					<option value="Hogar">Hogar</option>
					<option value="Otro">Otro</option>
				</select>
			</label>

			<label>
				Prioridad
				<select v-model="form.priority">
					<option value="Alta">Alta</option>
					<option value="Media">Media</option>
					<option value="Baja">Baja</option>
				</select>
			</label>
		</div>

		<label class="checkbox">
			<input v-model="form.completed" type="checkbox" />
			Marcar como completada
		</label>

		<button class="primary-button" type="submit">
			{{ buttonText }}
		</button>
	</form>
</template>

<style scoped></style>
