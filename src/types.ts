export type TaskPriority = 'Alta' | 'Media' | 'Baja'
export type TaskCategory = 'Estudio' | 'Trabajo' | 'Personal' | 'Hogar' | 'Otro'
export type TaskStatusFilter = 'all' | 'pending' | 'completed'
export type TaskSort = 'recent' | 'dueDate' | 'priority'

export interface AppUser {
	uid: string
	email: string
	displayName: string
	provider: 'firebase' | 'local'
}

export interface AuthResult {
	user: AppUser
}

export interface TaskDraft {
	title: string
	description: string
	category: TaskCategory
	priority: TaskPriority
	dueDate: string
	completed: boolean
}

export interface Task extends TaskDraft {
	id: string
	ownerId: string
	createdAt: string
	updatedAt: string
}
