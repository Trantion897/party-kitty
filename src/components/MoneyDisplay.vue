<script setup>
import CurrencyDisplay from './CurrencyDisplay.vue'
const props = defineProps({
	currencies: Array,
	amounts: Object
});
</script>

<template>
	<ol>
		<li v-for="currency in currencies">
			<currency-display :currency="currency" :amount="amounts[currency]"></currency-display>
		</li>
	</ol>
</template>