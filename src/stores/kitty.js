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
    
    // Number of members in the party
    const partySize = ref(1);
    
    // Split ratio used in last split
    const splitRatio = ref(0);
    
    const serversideName = ref(null);
    
    const serverUrl = "http://localhost/kitty_api.php";
    
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
    
    function setPartySize(size) {
        partySize.value = size;
    }
    
    function setSplitRatio(ratio) {
        splitRatio.value = ratio;
    }
    
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
            partySize: partySize.value,
            splitRatio: splitRatio.value,
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
            let newSave = false;
            if (serversideName.value == null) {
                newSave = true;
            }
            serversideName.value = result.name;     
            lastUpdateTimestamp.value = result.last_update;
            // TODO: Handle the user updating while waiting for the server's response
            // TODO: Maybe store the value we expected before sending the request, and compare that.
            // TODO: And/or the server could use a response code to indicate if it's been changed
            total.value = result.amount;
            
            if (newSave) {
                document.location.search = "name=" + serversideName.value;
            }
        });
    }
    
    async function load(kittyName) {
        // Parse any whitespace or separator characters to hyphens
        const parsedName = kittyName.split(/[^A-z]/).join("-");
        // TODO: Handle invalid names
        
        fetch(serverUrl + "?name="+parsedName).then((response) => {
            if (!response.ok) {
                console.log(response);
            }
            return response.json();
        }).then((result) => {
            serversideName.value = result.name;
            lastUpdateTimestamp.value = result.last_update;
            total.value = result.amount;
            partySize.value = result.partySize;
            splitRatio.value = result.splitRatio;
            // TODO: Update party size, split ratio & other config
        });
    }
    
    function clear() {
        lastUpdateTimestamp.value = {};
        transactions.length = 0;
        total.value = startAmount;
        serversideName.value = null;
        splitRatio.value = null;
        partySize.value = null;
        
    }
    
    // function updateTotal() {
        
    // }
    
    return {
        startAmount,
        total,
        partySize,
        splitRatio,
        transactions,
        addTransaction,
        setPartySize,
        setSplitRatio,
        deleteTransaction,
        serversideName,
        load,
        clear
    }
    
});