import { ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { useCurrencyStore } from '@/stores/currency';


export const useKittyStore = defineStore('kitty', () => {
    const currencyStore = useCurrencyStore();
    
    // The amount in the kitty when we started the app
    const startAmount = currencyStore.zero();
    
    // The timestamp of the last server update, as reported by the server
    const lastUpdateTimestamp = ref({});
    
    // All transactions since we started
    const transactions = [];
    
    // The current total
    const total = ref({});
    
    const serversideName = ref(null);
    
    const serverUrl = "https://localhost/kitty_api.php";
    
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
        
        // TODO: Set a timeout to prevent excessive saving?
        save();
    };
    
    function deleteTransaction(index) {
        const removed = transactions.value.splice(index, 1);
        removed.forEach((r) => currencyStore.subtractFrom(total.value, r));
        
        // TODO: Set a timeout to prevent excessive saving?
        save();
    };
    
    async function save() {
        const saveData = {
            currency: currencyStore.name,
            amount: total.value,
            partySize: 0,
            splitRatio: 0,
            config: {},
        };
        
        if (serversideName.value != null) {
            saveData.name = serversideName.value;
        }
        fetch(serverUrl, {
            body: JSON.stringify(saveData),
            method: "PUT",
        }).then((response) => {
            if (!response.ok) {
                console.log(response);
            }
            return response.json();
        }).then((result) => {
            serversideName.value = result.name;
            lastUpdateTimestamp.value = result.last_update;
            // TODO: Handle the user updating while waiting for the server's response
            // TODO: Maybe store the value we expected before sending the request, and compare that.
            // TODO: And/or the server could use a response code to indicate if it's been changed
            total.value = result.amount;
        
        });
    }
    
    async function load(kittyName) {
        fetch(serverUrl + "?name="+kittyName).then((response) => {
            if (!response.ok) {
                console.log(response);
            }
            return response.json();
        }).then((result) => {
            serversideName.value = result.name;
            lastUpdateTimestamp.value = result.last_update;
            total.value = result.amount;
            // TODO: Update party size, split ratio & other config
        });
    }
    
    // function updateTotal() {
        
    // }
    
    return {
        startAmount,
        total,
        transactions,
        addTransaction,
        deleteTransaction,
        serversideName,
        load
    }
    
});