import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseReady } from './firebase'
import type { AppUser } from '@/types'

const USERS_KEY = 'taskcontrol-auth-users'
const SESSION_KEY = 'taskcontrol-auth-session'

interface LocalUserRecord extends AppUser {
	password: string
}

const safeParse = <T>(value: string | null, fallback: T): T => {
	if (!value) return fallback
	try {
		return JSON.parse(value) as T
	} catch {
		return fallback
	}
}

const loadUsers = (): LocalUserRecord[] => {
	return safeParse<LocalUserRecord[]>(localStorage.getItem(USERS_KEY), [])
}

const saveUsers = (users: LocalUserRecord[]): void => {
	localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

const saveSession = (user: AppUser | null): void => {
	if (!user) {
		localStorage.removeItem(SESSION_KEY)
		return
	}
	localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function getSession(): AppUser | null {
	return safeParse<AppUser | null>(localStorage.getItem(SESSION_KEY), null)
}

const mapFirebaseUser = (user: {
	uid: string
	email: string | null
	displayName: string | null
}): AppUser => {
	return {
		uid: user.uid,
		email: user.email ?? '',
		displayName: user.displayName?.trim() || user.email?.split('@')[0] || 'Usuario',
		provider: 'firebase',
	}
}

const mapLocalUser = (user: LocalUserRecord): AppUser => {
	return {
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		provider: 'local',
	}
}

export const getInitialUser = (): AppUser | null => {
	if (isFirebaseReady && auth?.currentUser) {
		return mapFirebaseUser(auth.currentUser)
	}

	return getSession()
}

export const registerUser = async (
	email: string,
	password: string,
	displayName: string,
): Promise<AppUser> => {
	if (isFirebaseReady && auth) {
		const credential = await createUserWithEmailAndPassword(auth, email, password)
		if (credential.user && displayName) {
			await updateProfile(credential.user, { displayName })
		}
		return mapFirebaseUser(credential.user)
	}

	const users = loadUsers()
	const existing = users.find(
		(user) => user.email.toLowerCase() === email.toLowerCase(),
	)
	if (existing) {
		throw new Error('Ese correo ya está registrado en el modo local.')
	}

	const user: LocalUserRecord = {
		uid: crypto.randomUUID(),
		email,
		displayName: displayName.trim() || email.split('@')[0],
		password,
		provider: 'local',
	}

	users.unshift(user)
	saveUsers(users)
	const session = mapLocalUser(user)
	saveSession(session)
	return session
}

export const loginUser = async (email: string, password: string): Promise<AppUser> => {
	if (isFirebaseReady && auth) {
		const credential = await signInWithEmailAndPassword(auth, email, password)
		return mapFirebaseUser(credential.user)
	}

	const users = loadUsers()
	const found = users.find(
		(user) =>
			user.email.toLowerCase() === email.toLowerCase() &&
			user.password === password,
	)

	if (!found) {
		throw new Error('Correo o contraseña incorrectos en el modo local.')
	}

	const session = mapLocalUser(found)
	saveSession(session)
	return session
}

export const logoutUser = async (): Promise<void> => {
	if (isFirebaseReady && auth) {
		await signOut(auth)
		return
	}

	saveSession(null)
}

export const onSessionChange = (
	callback: (user: AppUser | null) => void,
): (() => void) => {
	if (isFirebaseReady && auth) {
		return onAuthStateChanged(auth, (user) => {
			callback(user ? mapFirebaseUser(user) : null)
		})
	}

	callback(getSession())
	return () => undefined
}
