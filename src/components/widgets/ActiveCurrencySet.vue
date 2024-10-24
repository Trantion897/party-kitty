<script setup>

import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();

const changeCurrency = function(name) {
    kittyStore.changeCurrencySet(name);
}

</script>

<template>
	<div class="input-group mb3">
        <span class="input-group-text">Using currency set</span>
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" area-expanded="false">
            {{currencyStore.currency.name}}
        </button>
        <ul class="dropdown-menu">
            <li>
                <a class="dropdown-item" href="#" @click.prevent="changeCurrency('dnd5e')">D&D 5th Edition</a>
            </li>
            <li>
                <a class="dropdown-item" href="#" @click.prevent="changeCurrency('pf2e')">Pathfinder 2nd Edition</a>
            </li>
        </ul>
    </div>
</template>

