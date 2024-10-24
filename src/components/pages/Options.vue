<script setup>
import { ref } from 'vue';
import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

import MoneyInputGroup from '@/components/widgets/currencyHandlers/MoneyInputGroup.vue';
import AddButton from '@/components/widgets/AddButton.vue';

import ActiveCurrencySet from '@/components/widgets/ActiveCurrencySet.vue';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();

const amount = ref(currencyStore.zero());

const updateAmount = function(value) {
    amount.value = value;
}

</script>

<template>
    <section>
        <h3>Options</h3>
        <active-currency-set></active-currency-set>
    </section>
    <section>
        <h3>Help</h3>
        <h4>What is this for?</h4>
        <p>
            This tool is designed to help manage shared money in role-playing games, i.e. money that doesn't belong to any one player.
            Money can be added or removed from the store, which is synced to the server. A random name will be generated, which anyone can use to access the same store.
        </p>
        <h4>Basic use</h4>
        <dl>
            <dt>Split</dt>
            <dd>Share money equally between all players with an optional share to the shared kitty</dd>
            <dt>Add</dt>
            <dd>Add money directly to the kitty</dd>
            <dt>Take</dt>
            <dd>Take money from the kitty</dd>
        </dl>
        <p>Enter any number of items in a single transaction; they will all be added up and converted to the largest possible denomination.</p>
        <p>
            Optional currencies may be available, which are considered to be currencies that are less often used, and may or may not be convertible to other currencies.
            The currencies can be toggled for each transaction, and if conversion is possible to or from other currencies, this can also be toggled (unless it is always enabled).
        </p>
        <h5>Splitting money</h5>
        <ol>
            <li>The total of all entries are added up and converted to the largest applicable currency</li>
            <li>Coins are distributed between the players and the shared kitty; coins will not be split or converted to a smaller currency.</li>
            <li>The remainder of the division will be given to the players or the shared kitty as applicable.</li>
        </ol>
        <ul>
            <li>It's possible that some money will go to the kitty even if you set the kitty proportion to zero.</li>
            <li>If the split is equal, the amount going to the players and the kitty may not be equal if it can't be divided equally.</li>
        </ul>
        <h4>Saving & syncing</h4>
        <p>
            Transactions are saved to the server as soon as they are added to the kitty.
            If you're creating a new kitty, a name will be generated and will appear in the kitty name field.
            You can then share this name with anyone else who need to access the same kitty.
            <strong>Only the total amount in the shared kitty is stored; not individual transactions or the amount each player has.</strong>
        </p>
        <p>
            If someone else modifies the kitty at the same time, 
            these changes will be synchonised when you save a transaction to the kitty or when you click the manual <i>Refresh</i> button.
            A new entry will appear in the history showing the total of all changes on the server.
        </p>
        <h4>History</h4>
        <p>
            The <i>History</i> page shows all transactions in the current session. It starts with the balance already in the kitty when it was opened (if any),
            then lists all transactions since then.
        </p>
        <p>
            Any transaction can be reverted, which simply adds another transaction that is the invert of the previous transaction.
            For example, if you revert a transaction to add 50 gold, a new transaction is added to remove 50 gold.
        </p>
    </section>
</template>
