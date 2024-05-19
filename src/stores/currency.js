import { defineStore } from 'pinia';

export const useCurrencyStore = defineStore('currency', {
	state: () => {
		return {
			name: "dnd5e",
			currencies: ['GP', 'SP', 'CP'],
			conversionRates: [10, 10],
			specialCurrencies: [
				{
					'name': 'PP',
					'convertsTo': 'GP',
					'conversionRate': 10,
					'enableConversion': 'ask',
					'enableGeneration': 'no',
				},
				{
					'name': 'EP',
					'convertsTo': 'SP',
					'conversionRate': 5,
					'enableConversion': 'ask',
					'enableGeneration': 'no',	
				}
			],
			enabledSpecialCurrencies: []
			
		}
	},
	
	getters: {
		enabledCurrencies: (state) => {
			return state.currencies.concat(state.enabledSpecialCurrencies);
		},
		
		allCurrencies: (state) => {
			return state.currencies.concat(state.specialCurrencies.map((x) => x.name));
		}
	},
	
	actions: {
	    /**
         * Convert from one currency to another
         *
         * @param cur array of currency names, [FROM, TO]
         * @param amount int Amount of money in starting currency
         * @return object Converted value in target currency, and remainder (if any) in all smaller denominations
         */
	    currencyConvert(cur, amount) {
	        const startCurrencyName = cur[0];
	        const endCurrencyName = cur[1];
	         
	        if (!cur.every((c) => this.currencies.includes(c))) {
		        const result = {startCurrencyName: amount};
		        return result;
	        }
	         
	        const fromIndex = this.currencies.indexOf(cur[0]);
	        const toIndex = this.currencies.indexOf(cur[1]);
	        const step = (fromIndex < toIndex) ? 1 : -1;
	         
	        const result = {};
	         
	        let stepsRun = 0;
	         
	        for (let i = fromIndex; i != toIndex; i += step) {
		        const convertingFrom = this.currencies[i];
		          
		        if (toIndex > fromIndex) {
			        // Reducing demonination, multiply the amount
			        const conv = this.conversionRates[i];
			        amount = amount * conv;
		        } else {
			        // Increasing denomination, divide and store the remainder
			        const conv = this.conversionRates[i-1];
			        const converted = Math.floor(amount / conv);
			        const remainder = amount % conv;
			         
			        result[convertingFrom] = remainder;
			        amount = converted;
		        }
	        }
	        result[endCurrencyName] = amount;
	         
	        return result;
	    },
	    
	    /**
	     * Adds each currency in the second parameter to the first, modifying in place
	     */
	    addTo(first, second) {
	        for (const i in this.currencies) {
	            const cur = this.currencies[i];
	            if (cur in second) {
	                if (cur in first) {
	                    first[cur] += second[cur];
	                } else {
	                    first[cur] = second[cur];
	                }
	            }
	        }
	    },
	    /**
	     * Subtracts each currency in the second parameter from the first, modifying in place
	     */
	    subtractFrom(first, second) {
	    	for (const i in this.currencies) {
	            const cur = this.currencies[i];
	            if (cur in second) {
	                if (cur in first) {
	                    first[cur] -= second[cur];
	                } else {
	                    first[cur] = second[cur];
	                }
	            }
	        }
	    },
	    
	    zero() {
	    	const z = {}
	    	for (const i in this.allCurrencies) {
	    		z[this.allCurrencies[i]] = 0;
	    	}
	    	return z;
	    },
	    
	    isEqual(a, b) {
	    	for (const i of this.currencies) {
	    		if (a[i] != b[i]) {
	    			return false;
	    		}
	    	}
	    	return true;
	    },
	    
	    makeDiff(before, after) {
	    	const diff = {};
	    	for (const i of this.currencies) {
	    		diff[i] = after[i] - before[i];
	    	}
	    	return diff;
	    },
	    
	    enableCurrency(name) {
	    	if (this.enabledSpecialCurrencies.indexOf(name) === -1 && this.specialCurrencies.some(x => x.name == name)) {
	    		this.enabledSpecialCurrencies.push(name);
	    	}
	    },
	    
	    disableCurrency(name) {
	    	const idx = this.enabledSpecialCurrencies.indexOf(name);
	    	if (idx !== -1) {
	    		this.enabledSpecialCurrencies.splice(idx, 1);
	    	}
	    },
	    
	    toggleCurrency(name) {
	    	if (this.enabledSpecialCurrencies.indexOf(name) !== -1) {
	    		this.disableCurrency(name);
	    	} else {
	    		this.enableCurrency(name);
	    	}
	    }
    }
});
