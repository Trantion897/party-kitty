import { ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { useCurrencyStore } from '@/stores/currency';
import { useRoute, useRouter } from 'vue-router'; // TODO: Excess coupling? Should this be moved to a component?


export const useKittyStore = defineStore('kitty', () => {
    const defaultConfig = {
        partySize: 4,
        splitRatio: 33
    };
    
    const currencyStore = useCurrencyStore();
    const router = useRouter();
    
    // The amount in the kitty when we started the app
    const startAmount = ref({});
    
    // The timestamp of the last server update, as reported by the server
    const lastUpdateTimestamp = ref(null);
    
    // The amount in the kitty the last time we synchronised with the server
    const lastUpdateAmount = ref({});
    
    // All transactions since we started
    const transactions = [];
    
    // The current total
    const total = ref({});
    
    // Number of members in the party
    const partySize = ref(null);
    
    // Split ratio used in last split
    const splitRatio = ref(null);
    
    const serversideName = ref(null);
    
    const serverUrl = "http://localhost/kitty_api.php";
    
    const error = ref(null);
    
    function compareTransactions(t1, t2) {
        for (const cur of currencyStore.allCurrencies) {
            if (t1[cur.name] > t2[cur.name]) {
                return 1;
            } else if (t1[cur.name] < t2[cur.name]) {
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
    
    function revertTransaction(index) {
        const toRevert = transactions[index];
        const revert = currencyStore.zero();
        currencyStore.allCurrencies.forEach((i) => {
            if (Object.hasOwn(toRevert, i.name)) {
                revert[i.name] = toRevert[i.name]*-1
            }
        });
        revert.note = "Revert previous transaction";
        addTransaction(revert);
        
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
            config: {}
        };
        
        if (lastUpdateTimestamp.value != null) {
            saveData['lastUpdate'] = lastUpdateTimestamp.value.toISOString();
            saveData['lastUpdateAmount'] = lastUpdateAmount.value;
        }
        
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
                switch (response.status) {
                    case 304:
                        // TODO - Don't parse the nonexistent JSON, but don't display an error
                        return;
                    case 404:
                        throw new errorNotFound(parsedName);
                    case 429:
                        throw new errorRateLimit();
                    default:
                        throw new errorUnknown();
                }
            }
            return response.json();
        }).then((result) => {
            let newSave = false;
            if (serversideName.value == null) {
                newSave = true;
            }
            
            handleServerUpdate(result);
            
            if (newSave) {
                router.push({params: {name: serversideName.value}});
            }
        }).catch((err) => {
            error.value = err;
        });
    }
    
    async function load(kittyName) {
        clearError();
        
        // Parse any whitespace or separator characters to hyphens
        const parsedName = kittyName.split(/[^A-z]/).join("-");
        // TODO: Handle invalid names
        
        const headers = new Headers();
        if (lastUpdateTimestamp.value) {
            headers.append("If-Modified-Since", lastUpdateTimestamp.value.toUTCString());
        }
        
        fetch(serverUrl + "?name="+parsedName, {
            headers: headers,
            method: "GET",
        }).then((response) => {
            if (!response.ok) {
                switch (response.status) {
                    case 304:
                        // TODO - Don't parse the nonexistent JSON, but don't display an error
                        return;
                    case 404:
                        throw new errorNotFound(parsedName);
                    case 429:
                        // TODO: Get the number of seconds
                        throw new errorRateLimit();
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
    
    function refresh() {
        if (!serversideName.value) {
            throw new Exception ("No server-side connection"); // TODO
        }
        
        load(serversideName.value);
    }
    
    function handleServerUpdate(result) {
        if (!currencyStore.isEqual(result.amount, total.value)) {
            // Amount on the server changed between updates
            const diff = currencyStore.makeDiff(total.value, result.amount);
            diff.note = "Update from server";
            transactions.push(diff);
        }
        serversideName.value = result.name;
        lastUpdateTimestamp.value = new Date();
        lastUpdateTimestamp.value.setTime(Date.parse(result.lastUpdate));
        // Need to make separate deep copies of the amount
        startAmount.value = JSON.parse(JSON.stringify(result.amount));
        total.value = JSON.parse(JSON.stringify(result.amount));
        lastUpdateAmount.value = JSON.parse(JSON.stringify(result.amount));
        if (result.partySize) {
            partySize.value = result.partySize;
        }
        if (result.splitRatio) {
            splitRatio.value = result.splitRatio;
        }
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
    
    function errorRateLimit(retryDelay) {
        return {
            type: "error",
            title: "Rate limited",
            text: "You've hit the rate limit. Please try again in a few minutes."
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
        startAmount.value = currencyStore.zero();
        init();
    }
    
    function init() {
        lastUpdateTimestamp.value = null;
        transactions.length = 0;
        total.value = startAmount.value;
        serversideName.value = null;
        splitRatio.value = defaultConfig.splitRatio;
        partySize.value = defaultConfig.partySize;
    }
    
    // function updateTotal() {
        
    // }
    
    init();
    
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
        revertTransaction,
        serversideName,
        load,
        init,
        clear,
        error,
        refresh,
    }
    
});