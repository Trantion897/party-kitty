<script setup>
import { ref, watch } from 'vue';

import MoneyInput from './MoneyInput.vue'
import MoneyDisplay from './MoneyDisplay.vue'
import SplitControl from './SplitControl.vue'

const currencies = ['GP', 'SP', 'CP'];
const amount = ref({
	GP: 0,
	SP: 0,
	CP: 0
});
const partySize = ref(1);
const splitRatio = ref(33); 

const playerShare = ref("...");
const partyShare = ref("...");

const onChangePartySize = function(newSize) {
    partySize.value = parseInt(newSize);
    updateSplit();
}

const onChangeSplitRatio = function(newRatio) {
    splitRatio.value = parseInt(newRatio);
    updateSplit();
}

const onChangeMoneyInput = function(currency, newValue) {
    amount.value[currency] = newValue;
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
	currencies.forEach((currency) => {
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
		<h3>Add money</h3>
		<money-input :currencies="currencies" :amounts="amount" @change="onChangeMoneyInput"></money-input>
		<split-control :partySize="partySize" @changePartySize="onChangePartySize" :splitRatio="splitRatio" @changeSplitRatio="onChangeSplitRatio"></split-control>
		
		<dl>
		    <dt>Each player receives</dt>
		    <dd><money-display :currencies="currencies" :amounts="playerShare"></money-display></dd>
		    <dt>Party kitty receives</dt>
		    <dd><money-display :currencies="currencies" :amounts="partyShare"></money-display></dd>
		</dl>
	</section>
</template>					