<script setup>
import { useKittyStore } from '@/stores/kitty.js';

import MoneyDisplay from '@/components/widgets/currencyHandlers/MoneyDisplay.vue'

const kittyStore = useKittyStore();

</script>

<template>
    <section>
        <h3>Kitty history</h3>
        <p>Transaction history starts from when you loaded the kitty in this session.</p>
        <p>Starting balance: <money-display :amount="kittyStore.startAmount"></money-display></p>
        <ol>
            <li v-for="(transaction, index) in kittyStore.transactions">
                <div class="input-group mb-3">
                    <money-display :amount="transaction">
                        <button class="btn btn-outline-secondary bi bi-arrow-counterclockwise" type="button" @click="kittyStore.revertTransaction(index)">Revert</button>
                    </money-display>
                </div>
            </li>
        </ol>
    </section>
</template>

<style scoped>
    ol li .mb-3 {
        margin-bottom:0.3em !important;
    }
</style>