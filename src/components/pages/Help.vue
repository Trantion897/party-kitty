<script setup>
import { ref } from 'vue';
import { useKittyStore } from '@/stores/kitty.js';
import { useCurrencyStore } from '@/stores/currency.js';

import MoneyInputGroup from '@/components/widgets/currencyHandlers/MoneyInputGroup.vue';
import AddButton from '@/components/widgets/AddButton.vue';

const kittyStore = useKittyStore();
const currencyStore = useCurrencyStore();

const amount = ref(currencyStore.zero());

const updateAmount = function(value) {
    amount.value = value;
}

</script>

<template>
    <section>
        <h3>Help</h3>
        <h4>What is this for?</h4>
        <p>
            This tool is designed to help manage shared money in role-playing games, i.e. money that doesn't belong to any one player.
            Money can be added or removed from the store, which is synced to the server. A random name will be generated, which anyone can use to access the same store.
        </p>
        <h4>Basic use</h4>
        <p>
            Choose <i>Split</i> to share money equally between all players with an optional share to the shared kitty.
            <i>Add</i> to add money directly to the kitty, and <i>Take</i> to take money from the kitty.
        </p>
        <p>
            You can enter any number of entries at once, for example if you find "300 gold, 200 silver; plus gems worth 100 gold & ornaments worth 150 gold",
            you might make one entry for the coins, one for the gems, and one for the ornaments.
            All of these entries will be added up, and everything converted to the largest possible denomination of the currency.
        </p>
        <p>
            If optional currencies are available, these can be toggled for each transaction.
            There may also be options to enable automatic conversion: from the optional currency to a normal currency, and/or vice-versa.
            If automatic conversion <i>from</i> this currency is enabled, it will be converted to the relevant base currency; and may be converted to other denominations by the normal rules.
            Otherwise, the optional currency will not be converted.
            If automatic conversion <i>to</i> this currency is enabled, money in the standard currencies can be converted to the optional currency under the normal rules.
        </p>
        <h5>Splitting money</h5>
        <p>
            When splitting money between players, the total of all entries are added up first. The coins are then distributed between the players and the shared kitty; coins will not be divided.
            The remainder of the division will be given to the players or the shared kitty as applicable.
            Therefore it's possible that some money will go to the kitty even if you set the kitty proportion to zero.
        </p>
        <h4>Saving & syncing</h4>
        <p>
            When you add a transaction to the kitty, it will be saved to the server.
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