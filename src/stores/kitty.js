import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useCurrencyStore } from '@/stores/currency';


export const useKittyStore = defineStore('kitty', () => {
    const currencyStore = useCurrencyStore();
    
    // The amount in the kitty when we started the app
    const startAmount = ref(currencyStore.zero());
    
    // The amount in the kitty when we last updated from the server
    const lastUpdateFromServer = ref({});
    
    // All transactions since we started
    const transactions = ref([]);
    
    // The current total
    const total = ref({});
    
    function addTransaction(amount) {
        if (amount == transactions.value[transactions.value.length - 1]) {
            if (!confirm("You just added the same amount to the kitty. Add it again?")) {
                return;
            }
        }
        transactions.value.push(amount);
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