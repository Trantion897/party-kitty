<script setup>
import { ref } from 'vue';

import CurrencyInput from './CurrencyInput.vue'

const emit = defineEmits(['change']);
    
const props = defineProps({
	currencies: Array,
	amounts: Object
});

const changeValue = function(currency, value) {
    emit("change", currency, value);
}
</script>

<template>
	<div class="row">
		<div class="input-group mb-3 col" v-for="currency in currencies">
	    	<currency-input :currency="currency" :amount="amounts[currency]" @change="changeValue"></currency-input>
		</div>
	</div>
</template>
