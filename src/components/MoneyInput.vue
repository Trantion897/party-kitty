<script setup>
import { ref, onMounted } from 'vue';
import { useCurrencyStore } from '@/stores/currency.js';

import CurrencyInput from './CurrencyInput.vue'

const currencyStore = useCurrencyStore();

const emit = defineEmits(['change']);
    
const inputAmount = ref(currencyStore.zero());

const changeValue = function(currency, value) {
	inputAmount.value[currency] = value;
    emit("change", inputAmount.value);
}

onMounted(() => {
	console.log(currencyStore);
})
</script>

<template>
	<div class="row">
		<div class="input-group mb-3 col" v-for="currency in currencyStore.currencies">
	    	<currency-input :currency="currency" :amount="inputAmount[currency]" @change="changeValue"></currency-input>
		</div>
	</div>
</template>
