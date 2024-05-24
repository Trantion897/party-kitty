<script setup>
import { computed } from 'vue';

import CurrencyDisplay from './CurrencyDisplay.vue'
import { useCurrencyStore } from '@/stores/currency';

const currencyStore = useCurrencyStore();

const props = defineProps({
	amount: Object
});

const usedCurrencies = computed(() => {
	return currencyStore.usedCurrencies(props.amount);
})
</script>

<template>
	<ol>
		<!-- If we already have PP or EP in the bank, we should always show it. Maybe a usedCurrencies method in kitty.js -->
		<li v-for="currency in usedCurrencies" class="input-group-text" :class="`currency-${currency}`">
			<currency-display :currency="currency" :amount="amount[currency]"></currency-display>
		</li>
	</ol>
	<span v-if="amount.note" class="note input-group-text">{{ amount.note }}</span>
	<slot></slot>
</template>

<style scoped>
	ol {
		list-style-type:none;
		margin:0;
		padding:0;
		display:inline-block;
	}
	li {
		display:inline-block;
		min-width:50px;
		margin: 0;
		border-radius: 0;
	}
	span.note {
		background-color:#fff;
	}
</style>