<script setup>
import { useKittyStore } from '@/stores/kitty.js';

import MoneyDisplay from '@/components/widgets/currencyHandlers/MoneyDisplay.vue'

const kittyStore = useKittyStore();

</script>

<template>
    <section>
        <h3>Kitty history</h3>
        <p>Transaction history starts from when you loaded the kitty in this session.</p>
        
            <money-display :amount="kittyStore.startAmount">
                <template #prefix>
                    <span class="input-group-text">Starting balance</span>
                </template>
            </money-display>
        
        <ol>
            <li v-for="(transaction, index) in kittyStore.transactions">
                <div class="input-group mb-3">
                    <money-display :amount="transaction">
                        <button class="btn btn-outline-secondary bi bi-arrow-counterclockwise" type="button" @click="kittyStore.revertTransaction(index)">Revert</button>
                    </money-display>
                </div>
            </li>
        </ol>
        <p>
            <money-display :amount="kittyStore.total">
                <template #prefix>
                    <span class="input-group-text">Current balance</span>
                </template>
            </money-display>
        </p>
    </section>
</template>

<style scoped>
    ol {
        margin-bottom:0.8em;
    }
    ol li .mb-3 {
        margin-bottom:0.3em !important;
    }
</style>