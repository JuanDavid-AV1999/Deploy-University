import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

const loadTaskMetrics = async () => {
	const source = await readFile(
		new URL('../src/utils/taskMetrics.ts', import.meta.url),
		'utf8',
	)
	const { outputText } = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.ES2022,
			target: ts.ScriptTarget.ES2022,
		},
	})
	const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
	return import(moduleUrl)
}

const { calculateCompletionRate, countCompletedTasks } = await loadTaskMetrics()

test('countCompletedTasks counts only completed tasks', () => {
	const tasks = [
		{ completed: true },
		{ completed: false },
		{ completed: true },
	]

	assert.equal(countCompletedTasks(tasks), 2)
})

test('calculateCompletionRate returns a rounded percentage', () => {
	assert.equal(calculateCompletionRate(3, 2), 67)
})

test('calculateCompletionRate returns zero when there are no tasks', () => {
	assert.equal(calculateCompletionRate(0, 0), 0)
})
