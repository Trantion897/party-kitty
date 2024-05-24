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
	<span class="bi bi-circle-fill">&nbsp;{{ displayAmount }}</span> <span>{{ currency }}</span>
</template>

<style scoped>
	/* TODO: Currency styles need to be defined in currency data */
	ol li.currency-PP span.bi::before {
		color:#bcbcbc;
	}
	ol li.currency-GP span.bi::before {
		color:#e19d1e;
	}
	ol li.currency-EP span.bi::before {
		color:#8fa2af;
	}
	ol li.currency-SP span.bi::before {
		color:#a6a09a;
	}
	ol li.currency-CP span.bi::before {
		color:#b57b66;
	}
</style>