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
			enabledSpecialCurrencies: [],
			enabledConversions: [],
		}
	},
	
	getters: {
		enabledCurrencies: (state) => {
			const sortedCurrencies = [];
			state.currencies.forEach((stdCurrency) => {
				// Get any special currencies that go before this standard currency
				const specialCurrenciesHere = state.specialCurrencies.filter((sc) => state.enabledSpecialCurrencies.includes(sc.name) && sc.convertsTo == stdCurrency);
				if (specialCurrenciesHere && specialCurrenciesHere.length > 0) {
					specialCurrenciesHere.forEach((sc) => sortedCurrencies.push(sc.name));
				}
				sortedCurrencies.push(stdCurrency);
			});
			return sortedCurrencies;
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
	        
	        // Special handling if TO or FROM is a special currency
	        const fromSpecial = this.specialCurrencies.find((sc) => sc.name == startCurrencyName);
	        const toSpecial = this.specialCurrencies.find((sc) => sc.name == endCurrencyName);
	         
	        if (fromSpecial != undefined) {
	        	// Converting from a special currency, we have to convert to its related currency first, and only if allowed to
	        	if (fromSpecial.enableConversion == 'yes' || (fromSpecial.enableConversion == 'ask' && this.isConversionEnabled(fromSpecial.name, fromSpecial.convertsTo))) {
	        		// Convert to the related currency, then recurse
	        		const inRelatedCurrency = amount * fromSpecial.conversionRate;
	        		const result = this.currencyConvert([fromSpecial.convertsTo, endCurrencyName], inRelatedCurrency);
	        		return result;
	        	}
	        }
	        
	        if (toSpecial != undefined) {
	        	// Converting to a special currency, we have to get everything into its related currency first, and only if allowed to
	        	if (toSpecial.enableGeneration != 'no') {
	        		const result = this.currencyConvert([startCurrencyName, toSpecial.convertsTo], amount);
	        		const inRelatedCurrency = result[toSpecial.convertsTo];
	        		result[endCurrencyName] = Math.floor(inRelatedCurrency / toSpecial.conversionRate);
	        		result[toSpecial.convertsTo] = inRelatedCurrency % toSpecial.conversionRate;
	        	}
	        }
	         
	        if (!cur.every((c) => this.currencies.includes(c))) {
		        const result = {};
		        result[startCurrencyName] = amount;
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
	        for (const i in this.allCurrencies) {
	            const cur = this.allCurrencies[i];
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
	    	for (const i in this.allCurrencies) {
	            const cur = this.allCurrencies[i];
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
	    },
	    
	    enableConversion(from, to) {
	    	if (!this.enabledConversions.includes([from, to])) {
	    		this.enabledConversions.push([from, to]);
	    	}
	    },
	    
	    disableConversion(from, to) {
	    	this.enabledConversions = this.enabledConversions.filter((ec) => ec[0] != from || ec[1] != to);
	    },
	    
	    toggleConversion(from, to) {
	    	if (this.isConversionEnabled(from, to)) {
	    		this.disableConversion(from, to);
	    	} else {
	    		this.enableConversion(from, to);
	    	}
	    },
	    
	    isConversionEnabled(from, to) {
	    	return (this.enabledConversions.some((ec) => ec[0] == from && ec[1] == to));
	    }
    
    }
});
