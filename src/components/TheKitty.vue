<script setup>
import MoneyDisplay from './MoneyDisplay.vue'
import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();

</script>

<template>
	<section>
		<h3>Party kitty - {{kittyStore.serversideName}}</h3>
		<money-display :amount="kittyStore.total"></money-display>
	</section>
</template>

