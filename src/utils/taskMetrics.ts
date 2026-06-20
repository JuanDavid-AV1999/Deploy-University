import type { Task } from '@/types'

export const countCompletedTasks = (
	tasks: Pick<Task, 'completed'>[],
): number => {
	return tasks.filter((task) => task.completed).length
}

export const calculateCompletionRate = (
	totalTasks: number,
	completedTasks: number,
): number => {
	if (totalTasks <= 0) return 0
	return Math.round((completedTasks / totalTasks) * 100)
}
