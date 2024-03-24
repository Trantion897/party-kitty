<script setup>
import { computed } from 'vue';

const props = defineProps({
	currency: String,
	amount: Number
});

const displayAmount = computed(() => {
	if (props.amount) {
		return props.amount;
	} else {
		return 0;
	}
})
</script>

<template>
	<span>{{ displayAmount }}</span> <span>{{ currency }}</span>
</template>