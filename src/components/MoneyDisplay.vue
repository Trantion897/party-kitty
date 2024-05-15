<script setup>
import CurrencyDisplay from './CurrencyDisplay.vue'
import { useCurrencyStore } from '@/stores/currency';

const currencyStore = useCurrencyStore();

const props = defineProps({
	amount: Object
});
</script>

<template>
	<ol>
		<li v-for="currency in currencyStore.currencies" class="input-group-text">
			<currency-display :currency="currency" :amount="amount[currency]"></currency-display>
		</li>
	</ol>
	<span v-if="amount.note" class="note input-group-text">{{ amount.note }}</span>
</template>

<style scoped>
	ol {
		list-style-type:none;
		margin:0 10px 0px;
		padding:0;
		display:inline-block;
	}
	li {
		display:inline-block;
		min-width:50px;
		margin: 0 0 0 10px;
		
	}
</style>