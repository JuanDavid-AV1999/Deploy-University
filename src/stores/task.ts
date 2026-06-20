import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getTasks, removeTask, saveTask, toggleTaskCompletion } from '@/services/task'
import { calculateCompletionRate, countCompletedTasks } from '@/utils/taskMetrics'
import type {
	Task,
	TaskCategory,
	TaskDraft,
	TaskPriority,
	TaskSort,
	TaskStatusFilter,
} from '@/types'

export const useTaskStore = defineStore('tasks', () => {
	const tasks = ref<Task[]>([])
	const loading = ref(false)
	const currentUserId = ref<string>('')

	const search = ref('')
	const status = ref<TaskStatusFilter>('all')
	const priority = ref<'all' | TaskPriority>('all')
	const sortBy = ref<TaskSort>('recent')
	const error = ref('')

	const load = async (userId: string): Promise<void> => {
		currentUserId.value = userId
		loading.value = true
		error.value = ''
		try {
			tasks.value = await getTasks(userId)
		} catch (err) {
			error.value =
				err instanceof Error ? err.message : 'No se pudieron cargar las tareas.'
		} finally {
			loading.value = false
		}
	}

	const addTask = async (draft: TaskDraft): Promise<void> => {
		const task = await saveTask(currentUserId.value, draft)
		tasks.value = [task, ...tasks.value]
	}

	const updateTask = async (taskId: string, draft: TaskDraft): Promise<void> => {
		const updated = await saveTask(currentUserId.value, draft, taskId)
		tasks.value = tasks.value.map((task) => (task.id === taskId ? updated : task))
	}

	const toggleTask = async (task: Task): Promise<void> => {
		const updated = await toggleTaskCompletion(currentUserId.value, task)
		tasks.value = tasks.value.map((item) => (item.id === task.id ? updated : item))
	}

	const deleteTask = async (taskId: string): Promise<void> => {
		await removeTask(currentUserId.value, taskId)
		tasks.value = tasks.value.filter((task) => task.id !== taskId)
	}

	const resetFilters = (): void => {
		search.value = ''
		status.value = 'all'
		priority.value = 'all'
		sortBy.value = 'recent'
	}

	const filteredTasks = computed(() => {
		const searchTerm = search.value.trim().toLowerCase()

		const filtered = tasks.value.filter((task) => {
			const matchesSearch =
				!searchTerm ||
				task.title.toLowerCase().includes(searchTerm) ||
				task.description.toLowerCase().includes(searchTerm)

			const matchesStatus =
				status.value === 'all' ||
				(status.value === 'pending' && !task.completed) ||
				(status.value === 'completed' && task.completed)

			const matchesPriority =
				priority.value === 'all' || task.priority === priority.value

			return matchesSearch && matchesStatus && matchesPriority
		})

		const priorityWeight: Record<TaskPriority, number> = {
			Alta: 3,
			Media: 2,
			Baja: 1,
		}

		return filtered.sort((a, b) => {
			if (sortBy.value === 'dueDate') {
				return a.dueDate.localeCompare(b.dueDate)
			}

			if (sortBy.value === 'priority') {
				return priorityWeight[b.priority] - priorityWeight[a.priority]
			}

			return b.createdAt.localeCompare(a.createdAt)
		})
	})

	const total = computed(() => tasks.value.length)
	const completed = computed(() => countCompletedTasks(tasks.value))
	const pending = computed(() => total.value - completed.value)
	const completionRate = computed(() =>
		calculateCompletionRate(total.value, completed.value),
	)

	const categories = computed(() => {
		const counts: Record<TaskCategory, number> = {
			Estudio: 0,
			Trabajo: 0,
			Personal: 0,
			Hogar: 0,
			Otro: 0,
		}

		for (const task of tasks.value) {
			counts[task.category] += 1
		}

		return counts
	})

	return {
		tasks,
		loading,
		error,
		search,
		status,
		priority,
		sortBy,
		filteredTasks,
		total,
		completed,
		pending,
		completionRate,
		categories,
		load,
		addTask,
		updateTask,
		toggleTask,
		deleteTask,
		resetFilters,
	}
})
