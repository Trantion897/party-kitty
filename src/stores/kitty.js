import { ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { useCurrencyStore } from '@/stores/currency';


export const useKittyStore = defineStore('kitty', () => {
    const currencyStore = useCurrencyStore();
    
    // The amount in the kitty when we started the app
    const startAmount = ref({});
    
    // The timestamp of the last server update, as reported by the server
    const lastUpdateTimestamp = ref({});
    
    // The amount in the kitty the last time we synchronised with the server
    const lastUpdateAmount = ref({});
    
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
    
    const error = ref(null);
    
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
        clearError();
        
        const saveData = {
            currency: currencyStore.name,
            amount: total.value,
            partySize: partySize.value,
            splitRatio: splitRatio.value,
            config: {},
            lastUpdate: lastUpdateTimestamp.value,
            lastUpdateAmount: lastUpdateAmount.value,
        };
        
        let method;
        if (serversideName.value != null) {
            saveData.name = serversideName.value;
            method = "POST";
        } else {
            method = "PUT"
        }
        fetch(serverUrl, {
            body: JSON.stringify(saveData),
            method: method,
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
            
            handleServerUpdate(result);
            
            if (newSave) {
                document.location.search = "name=" + serversideName.value;
            }
        });
    }
    
    async function load(kittyName) {
        clearError();
        
        // Parse any whitespace or separator characters to hyphens
        const parsedName = kittyName.split(/[^A-z]/).join("-");
        // TODO: Handle invalid names
        
        fetch(serverUrl + "?name="+parsedName).then((response) => {
            if (!response.ok) {
                switch (response.status) {
                    case 404:
                        throw new errorNotFound(parsedName);
                    default:
                        throw new errorUnknown();
                }
            }
            return response.json();
        }).then((result) => {
            handleServerUpdate(result);
        }).catch((err) => {
            error.value = err;
        });
    }
    
    function handleServerUpdate(result) {
        if (!currencyStore.isEqual(result.amount, total.value)) {
            // Amount on the server changed between updates
            const diff = currencyStore.makeDiff(total.value, result.amount);
            diff.note = "Update from server";
            transactions.push(diff);
        }
        serversideName.value = result.name;
        lastUpdateTimestamp.value = result.lastUpdate;
        // Need to make separate deep copies of the amount
        startAmount.value = JSON.parse(JSON.stringify(result.amount));
        total.value = JSON.parse(JSON.stringify(result.amount));
        lastUpdateAmount.value = JSON.parse(JSON.stringify(result.amount));
        partySize.value = result.partySize;
        splitRatio.value = result.splitRatio;
        // TODO: Update party size, split ratio & other config
    }
    
    function clearError() {
        error.value = null;
    }
    
    function errorNotFound(name) {
        return {
            type: "error",
            title: "Kitty not found",
            text: "No kitty was found with the name <code>" + name + "</code>. Please check and try again."
        };
    }
    
    function errorUnknown(msg) {
        let text = "An unknown error occurred.";
        
        if (msg) {
            text += "<br><code>"+msg+"</code>";
        }
        return  {
            type: "error",
            title: "Unknown error",
            text: text
        }
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
        lastUpdateTimestamp,
        lastUpdateAmount,
        partySize,
        splitRatio,
        transactions,
        addTransaction,
        setPartySize,
        setSplitRatio,
        deleteTransaction,
        serversideName,
        load,
        clear,
        error
    }
    
});