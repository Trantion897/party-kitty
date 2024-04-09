import { ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { useCurrencyStore } from '@/stores/currency';


export const useKittyStore = defineStore('kitty', () => {
    const currencyStore = useCurrencyStore();
    
    // The amount in the kitty when we started the app
    const startAmount = currencyStore.zero();
    
    // The amount in the kitty when we last updated from the server
    const lastUpdateFromServer = {};
    
    // All transactions since we started
    const transactions = [];
    
    // The current total
    const total = ref({});
    
    function compareTransactions(t1, t2) {
        for (const cur of currencyStore.currencies) {
            if (t1[cur] > t2[cur]) {
                return 1;
            } else if (t1[cur] < t2[cur]) {
                return -1;
            }
        }
        
        return 0;
    };
    
    function addTransaction(amount) {
        if (transactions.length > 0 && compareTransactions(amount, transactions[transactions.length - 1]) == 0) {
            if (!confirm("You just added the same transaction to the kitty. Repeat it?")) {
                return;
            }
        }
        transactions.push(structuredClone(toRaw(amount)));
        currencyStore.addTo(total.value, amount);
    };
    
    function deleteTransaction(index) {
        const removed = transactions.value.splice(index, 1);
        removed.forEach((r) => currencyStore.subtractFrom(total.value, r));
    }
    
    // function updateTotal() {
        
    // }
    
    return {
        startAmount,
        total,
        transactions,
        addTransaction,
        deleteTransaction,
    }
    
});