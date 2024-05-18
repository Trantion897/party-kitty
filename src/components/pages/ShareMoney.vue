<script setup>
import { ref, watch, computed } from 'vue';
import { useKittyStore } from '@/stores/kitty';
import { useCurrencyStore } from '@/stores/currency';

import MoneyInputGroup from '@/components/widgets/currencyHandlers/MoneyInputGroup.vue'
import MoneyDisplay from '@/components/widgets/currencyHandlers/MoneyDisplay.vue'
import SplitControl from '@/components/widgets/SplitControl.vue'
import AddButton from '@/components/widgets/AddButton.vue'

const currencyStore = useCurrencyStore();
const kittyStore = useKittyStore()

const amount = ref({
	GP: 0,
	SP: 0,
	CP: 0
});

const partySize = computed(() => {
	return kittyStore.partySize;
});

const splitRatio = computed(() => {
	return kittyStore.splitRatio;
});

const playerShare = ref("...");
const partyShare = ref("...");

const onChangePartySize = function(newSize) {
	newSize = parseInt(newSize);
	kittyStore.setPartySize(newSize);
    updateSplit();
}

const onChangeSplitRatio = function(newRatio) {
	console.log("Before: "+newRatio);
	newRatio = parseInt(newRatio);
	console.log("After: "+newRatio);
	kittyStore.setSplitRatio(newRatio);
    updateSplit();
}

const onChangeMoneyInput = function(newInput) {
	const normalised = {}
	for (const cur in newInput) {
		const amountThisCur = newInput[cur];
		const convertedInput = currencyStore.currencyConvert([cur, currencyStore.currencies[0]], amountThisCur);
		
		currencyStore.addTo(normalised, convertedInput);
	}
	
    amount.value = normalised;
    updateSplit();
}

const calculateSplit = function(totalMoney, numPlayers) {
    const equalProportion = 1 / (numPlayers+1); // Equal split between the players and party kitty
    let kittyProportion;
    
    // Calculate how much money is going to the kitty:
    // 0 = no money to kitty
    // 33 = kitty proportion is equal to one player (kitty_proportion = total / num_players)
    // 66 = kitty proportion is 50%
    // 99 = all money to kitty
    // If num_players == 1, all values from 33 to 66 are 50%
    // All values change linearly between these points
    if (splitRatio.value == 0) {
    	kittyProportion = 0;
    } else if (splitRatio.value <= 33) {
    	kittyProportion = equalProportion * splitRatio.value / 33;
    } else if (splitRatio.value <= 66) {
    	const halfMinusEqualProportion = 0.5 - equalProportion;
    	const proportionExtra = (splitRatio.value - 33) / 33;
    	kittyProportion = equalProportion + halfMinusEqualProportion * proportionExtra
    } else {
    	const proportionExtra = (splitRatio.value - 66) / 33;
    	kittyProportion = 0.5 + 0.5 * proportionExtra;
    }
    
    // First, put the money from the kittyProportion into the kitty, rounded down
    // Then, divide the remaining money among the party members
    // Finally, put the remainder into the kitty
    let kittyMoney = Math.floor(totalMoney * kittyProportion);
    const sharedMoney = totalMoney - kittyMoney;
    const playerMoney = Math.floor(sharedMoney / numPlayers);
    kittyMoney += (sharedMoney - (playerMoney * numPlayers));
    
    return {
    	kitty: kittyMoney,
    	player: playerMoney
    }
}

const updateSplit = function() {
	const playerSplit = {};
	const partySplit = {};
	currencyStore.currencies.forEach((currency) => {
		const split = calculateSplit(amount.value[currency], partySize.value);
		playerSplit[currency] = split.player;
		partySplit[currency] = split.kitty;
	});
	
	playerShare.value = playerSplit;
	partyShare.value = partySplit;
}

</script>

<template>
	<section>
		<h3>Share money</h3>
		<money-input-group @change="onChangeMoneyInput"></money-input-group>
		<p><strong>Total</strong> <money-display :amount="amount"></money-display></p>
		<split-control :partySize="partySize" @changePartySize="onChangePartySize" :splitRatio="splitRatio" @changeSplitRatio="onChangeSplitRatio"></split-control>
		
		<p class="split-result">
			<span class="label">Each player receives</span>
			<money-display :amount="playerShare"></money-display>
		</p>
		<p class="split-result">
		    <span class="label">Party kitty receives</span>
		    <money-display :amount="partyShare"></money-display>
		    <add-button :amount="partyShare"></add-button>
		</p>
	</section>
</template>

<style scoped>
	.split-result {
		
	}
	.split-result .label {
		display:inline-block;
		width:150px;
		font-weight:bold;
	}
	
</style>