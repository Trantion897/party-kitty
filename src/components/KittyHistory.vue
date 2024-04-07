<script setup>
import { useKittyStore } from '@/stores/kitty.js';

import MoneyDisplay from './MoneyDisplay.vue'

const kittyStore = useKittyStore();

</script>

<template>
    <h3>Kitty history</h3>
    <p>Older transactions may not be displayed</p>
    <p>Starting balance: <money-display :amount="kittyStore.startAmount.value"></money-display></p>
    <ol>
        <li v-for="transaction in kittyStore.transactions">
            <money-display :amount="transaction"></money-display>
        </li>
    </ol>
</template>