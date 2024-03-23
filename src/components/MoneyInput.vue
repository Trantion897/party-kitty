<script setup>
import { ref } from 'vue';

import CurrencyInput from './CurrencyInput.vue'

const emit = defineEmits(['change']);
    
const props = defineProps({
	currencies: Array
});

const inputAmount = ref({
	GP: 0,
	SP: 0,
	CP: 0
});

const changeValue = function(currency, value) {
	inputAmount.value[currency] = value;
    emit("change", inputAmount.value);
}
</script>

<template>
	<div class="row">
		<div class="input-group mb-3 col" v-for="currency in currencies">
	    	<currency-input :currency="currency" :amount="inputAmount[currency]" @change="changeValue"></currency-input>
		</div>
	</div>
</template>
