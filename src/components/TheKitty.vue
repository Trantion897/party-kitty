<script setup>
import MoneyDisplay from './MoneyDisplay.vue';
import LoadKitty from './LoadKitty.vue';
import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();

</script>

<template>
	<section>
		<h3>Party kitty</h3>
		<money-display :amount="kittyStore.total"></money-display>
		<load-kitty></load-kitty>
	</section>
</template>

