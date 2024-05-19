<script setup>
import { ref, onMounted } from 'vue';
import { useCurrencyStore } from '@/stores/currency.js';

import CurrencyInput from '@/components/widgets/currencyHandlers/CurrencyInput.vue'

const currencyStore = useCurrencyStore();

const emit = defineEmits(['change']);
    
const inputAmount = ref(currencyStore.zero());

const changeValue = function(currency, value) {
	inputAmount.value[currency] = value;
    emit("change", inputAmount.value);
}

</script>

<template>
	<div class="money-input">
		<div class="currency" v-for="currency in currencyStore.enabledCurrencies">
	    	<currency-input :currency="currency" :amount="inputAmount[currency]" @change="changeValue"></currency-input>
		</div>
	</div>
</template>

<style>
	.money-input {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	
	.money-input .currency {
		margin: 5px;
	}
	
	.money-input .currency input {
		width: 80px;
	}
</style>