<script setup>
import { ref } from 'vue';
import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

import MoneyInput from './MoneyInput.vue';
import TakeButton from './TakeButton.vue';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();

const amount = ref(currencyStore.zero());

const updateAmount = function(value) {
    amount.value = value;
}

</script>

<template>
    <section>
        <h3>Take from Kitty</h3>
        <money-input @change="updateAmount"></money-input>
        
	   <take-button :amount="amount"></take-button>
    </section>
</template>
