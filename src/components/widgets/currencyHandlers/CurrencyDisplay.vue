<script setup>
import { computed } from 'vue';

const props = defineProps({
	currency: Object,
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
	<span class="bi bi-circle-fill" :style="`color:${currency.colour}`">&nbsp;</span><span>{{ displayAmount }}</span> <span class='currency'>{{ currency.name }}</span>
</template>

<style scoped>
	@media (max-width:30rem) {
		ol li span.currency {
			display:none;
		}
	}
</style>