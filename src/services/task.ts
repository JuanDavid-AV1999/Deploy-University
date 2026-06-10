import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	updateDoc,
	type DocumentData,
} from 'firebase/firestore'
import { db, isFirebaseReady } from './firebase'
import type { Task, TaskDraft } from '@/types'

const STORAGE_PREFIX = 'taskcontrol-tasks-'

const safeParse = <T>(value: string | null, fallback: T): T => {
	if (!value) return fallback
	try {
		return JSON.parse(value) as T
	} catch {
		return fallback
	}
}

const localKey = (userId: string): string => {
	return `${STORAGE_PREFIX}${userId}`
}

const loadLocalTasks = (userId: string): Task[] => {
	return safeParse<Task[]>(localStorage.getItem(localKey(userId)), [])
}

const saveLocalTasks = (userId: string, tasks: Task[]): void => {
	localStorage.setItem(localKey(userId), JSON.stringify(tasks))
}

const sortTasks = (tasks: Task[]): Task[] => {
	return [...tasks].sort((a, b) => {
		if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
		return b.updatedAt.localeCompare(a.updatedAt)
	})
}

const toTask = (docData: DocumentData, id: string): Task => {
	return {
		id,
		ownerId: String(docData.ownerId ?? ''),
		title: String(docData.title ?? ''),
		description: String(docData.description ?? ''),
		category: docData.category ?? 'Otro',
		priority: docData.priority ?? 'Media',
		dueDate: String(docData.dueDate ?? ''),
		completed: Boolean(docData.completed ?? false),
		createdAt: String(docData.createdAt ?? new Date().toISOString()),
		updatedAt: String(docData.updatedAt ?? new Date().toISOString()),
	}
}

export const getTasks = async (userId: string): Promise<Task[]> => {
	if (isFirebaseReady && db) {
		const snapshot = await getDocs(collection(db, 'tasks'))
		const tasks = snapshot.docs
			.map((taskDoc) => toTask(taskDoc.data(), taskDoc.id))
			.filter((task) => task.ownerId === userId)

		return sortTasks(tasks)
	}

	return sortTasks(loadLocalTasks(userId))
}

export const saveTask = async (
	userId: string,
	draft: TaskDraft,
	taskId?: string,
): Promise<Task> => {
	const now = new Date().toISOString()
	const payload = {
		ownerId: userId,
		title: draft.title.trim(),
		description: draft.description.trim(),
		category: draft.category,
		priority: draft.priority,
		dueDate: draft.dueDate,
		completed: draft.completed,
		updatedAt: now,
	}

	if (isFirebaseReady && db) {
		if (taskId) {
			const reference = doc(db, 'tasks', taskId)
			await updateDoc(reference, payload)
			return {
				id: taskId,
				...payload,
				createdAt: now,
			}
		}

		const reference = await addDoc(collection(db, 'tasks'), {
			...payload,
			createdAt: now,
		})

		return {
			id: reference.id,
			...payload,
			createdAt: now,
		}
	}

	const tasks = loadLocalTasks(userId)
	if (taskId) {
		const index = tasks.findIndex((task) => task.id === taskId)
		if (index === -1) throw new Error('La tarea no existe.')
		const updated: Task = {
			...tasks[index],
			...payload,
			id: taskId,
			createdAt: tasks[index].createdAt,
			updatedAt: now,
		}
		tasks[index] = updated
		saveLocalTasks(userId, tasks)
		return updated
	}

	const created: Task = {
		id: crypto.randomUUID(),
		...payload,
		createdAt: now,
	}
	tasks.unshift(created)
	saveLocalTasks(userId, tasks)
	return created
}

export const removeTask = async (userId: string, taskId: string): Promise<void> => {
	if (isFirebaseReady && db) {
		await deleteDoc(doc(db, 'tasks', taskId))
		return
	}

	const tasks = loadLocalTasks(userId).filter((task) => task.id !== taskId)
	saveLocalTasks(userId, tasks)
}

export const toggleTaskCompletion = async (userId: string, task: Task): Promise<Task> => {
	return saveTask(userId, { ...task, completed: !task.completed }, task.id)
}
