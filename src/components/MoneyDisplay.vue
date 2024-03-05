<script setup>
const props = defineProps({
	currency: String,
	amount: Number
});
</script>

<template>
	<span>{{ amount }}</span> <span>{{ currency }}</span>
</template>