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
                    <money-display :amount="transaction" class="input-group-text"></money-display>
                    <button class="btn btn-outline-secondary bi bi-trash" type="button" @click="kittyStore.deleteTransaction(index)">Delete</button>
                </div>
            </li>
        </ol>
    </section>
</template>