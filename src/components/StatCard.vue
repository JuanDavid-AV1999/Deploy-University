<script setup lang="ts">
defineProps<{
	label: string
	value: string | number
	icon: string
}>()
</script>

<template>
	<article class="stat-card">
		<div class="stat-icon">{{ icon }}</div>
		<div>
			<p class="stat-label">{{ label }}</p>
			<strong class="stat-value">{{ value }}</strong>
		</div>
	</article>
</template>

<style scoped></style>
