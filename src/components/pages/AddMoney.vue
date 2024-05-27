<script setup>
import { ref } from 'vue';
import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

import MoneyInputGroup from '@/components/widgets/currencyHandlers/MoneyInputGroup.vue';
import AddButton from '@/components/widgets/AddButton.vue';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();

const amount = ref(currencyStore.zero());

const updateAmount = function(value) {
    amount.value = currencyStore.normaliseCurrencies(value);
}

</script>

<template>
    <section>
        <h3>Add to Kitty</h3>
        <money-input-group @change="updateAmount"></money-input-group>
        
	   <add-button :amount="amount"></add-button>
    </section>
</template>