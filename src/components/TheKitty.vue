<script setup>
import MoneyDisplay from '@/components/widgets/currencyHandlers/MoneyDisplay.vue';
import LoadKitty from '@/components/widgets/LoadKitty.vue';
import RefreshButton from '@/components/widgets/RefreshButton.vue';

import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

const kittyStore = useKittyStore();

</script>

<template>
	<section>
		<h3>Party kitty</h3>
		<money-display :amount="kittyStore.total">
			<refresh-button></refresh-button>
		</money-display>
		<load-kitty></load-kitty>
	</section>
</template>

