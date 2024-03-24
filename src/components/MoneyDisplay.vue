<script setup>
import CurrencyDisplay from './CurrencyDisplay.vue'
import { useCurrencyStore } from '@/stores/currency';

const currencyStore = useCurrencyStore();

const props = defineProps({
	amounts: Object
});
</script>

<template>
	<ol>
		<li v-for="currency in currencyStore.currencies">
			<currency-display :currency="currency" :amount="amounts[currency]"></currency-display>
		</li>
	</ol>
</template>

<style scoped>
	ol {
		list-style-type:none;
		margin:0 10px 0px;
		padding:0;
	}
	li {
		display:inline-block;
		min-width:80px;
		margin: 0 10px;
		
	}
</style>