<script setup>
import { ref } from 'vue';
import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

import MoneyInput from './MoneyInput.vue';
import AddButton from './AddButton.vue';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();

const amount = ref(currencyStore.zero());

const updateAmount = function(value) {
    amount.value = value;
}

</script>

<template>
    <h3>Add to Kitty</h3>
    <money-input @change="updateAmount"></money-input>
    
	<add-button :amount="amount"></add-button>
</template>