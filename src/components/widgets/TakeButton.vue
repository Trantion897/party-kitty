<script setup>

import { useKittyStore } from '@/stores/kitty';
import { useCurrencyStore } from '@/stores/currency';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();
const props = defineProps({
	amount: Object
});

/**
 * Add the amount in the prop to the kitty store
 */
const doTake = function(amount) {
    // Turn this into a negative amount
    const negative = {};
    
    for (const cur of currencyStore.currencies) {
        negative[cur] = amount[cur] * -1;
    }
    
    kittyStore.addTransaction(negative);
}

</script>

<template>
    <button type="button" class="btn btn-primary" @click="doTake(props.amount)">Take from kitty</button>
</template>
