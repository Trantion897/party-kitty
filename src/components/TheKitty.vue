<script setup>
import MoneyDisplay from './MoneyDisplay.vue'
</script>

<template>
	<section>
		<h3>Party kitty</h3>
		<ol>
			<li>
				<money-display currency="GP" :amount="10"></money-display>
			</li>
			<li>
				<money-display currency="SP" :amount="0"></money-display>
			</li>
			<li>
				<money-display currency="CP" :amount="0"></money-display>
			</li>
		</ol>
	</section>
</template>					