import { defineStore } from 'pinia';
import currency from '@/data/currencies/dnd5e';

export const useCurrencyStore = defineStore('currency', {
	state: () => {
		return {
			currency: currency,
			enabledSpecialCurrencies: [],
			enabledConversions: [],
		}
	},
	
	getters: {
		enabledCurrencies: (state) => {
			const sortedCurrencies = state.combinedCurrencies((sc) => state.enabledSpecialCurrencies.includes(sc.name));
			return sortedCurrencies;
		},
		
		allCurrencies: (state) => {
			return state.combinedCurrencies(x => true);
		}
	},
	
	actions: {
		/**
		 * Normalise a money amount by changing smaller currencies to larger ones
		 *
		 * E.g. in D&D 5e currency, 10CP becomes 1SP, etc.
		 * Special currencies are converted if conversion is enabled.
		 */
		normaliseCurrencies(amount) {
			const normalised = {}
			for (const cur in amount) {
				const amountThisCur = amount[cur];
				const convertedInput = this.currencyConvert([cur, this.currency.currencies[0].name], amountThisCur);
				
				this.addTo(normalised, convertedInput);
			}
			return normalised;
		},
	    
	    /**
         * Convert from one currency to another
         *
         * @param cur array of currency *names*, [FROM, TO]
         * @param amount int Amount of money in starting currency
         * @return object Converted value in target currency, and remainder (if any) in all smaller denominations
         */
	    currencyConvert(cur, amount) {
	        const startCurrencyName = cur[0];
	        const endCurrencyName = cur[1];
	        
	        // Special handling if TO or FROM is a special currency
	        const fromSpecial = this.currency.specialCurrencies.find((sc) => sc.name == startCurrencyName);
	        const toSpecial = this.currency.specialCurrencies.find((sc) => sc.name == endCurrencyName);
	         
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
	        
	        // If any of the currencies are not known, bail out and return unchanged values
	        if (!cur.every((c) => this.currency.currencies.some((el) => el.name == c))) {
		        const result = {};
		        result[startCurrencyName] = amount;
		        return result;
	        }
	         
	        const fromIndex = this.currency.currencies.findIndex(c => c.name == cur[0]);
	        const toIndex = this.currency.currencies.findIndex(c => c.name == cur[1]);
	        const step = (fromIndex < toIndex) ? 1 : -1;
	         
	        const result = {};
	         
	        let stepsRun = 0;
	         
	        for (let i = fromIndex; i != toIndex; i += step) {
		        const convertingFrom = this.currency.currencies[i];
		          
		        if (toIndex > fromIndex) {
			        // Reducing demonination, multiply the amount
			        const conv = this.currency.currencies[i].conversionRate;
			        amount = amount * conv;
		        } else {
			        // Increasing denomination, divide and store the remainder
			        const conv = this.currency.currencies[i-1].conversionRate;
			        const converted = Math.floor(amount / conv);
			        const remainder = amount % conv;
			         
			        result[convertingFrom.name] = remainder;
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
	            const cur = this.allCurrencies[i].name;
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
	            const cur = this.allCurrencies[i].name;
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
	    		z[this.allCurrencies[i].name] = 0;
	    	}
	    	return z;
	    },
	    
	    isEqual(a, b) {
	    	for (const i of this.allCurrencies) {
	    		// Different if the currency exists on both sides, and it's different
	    		if (a[i.name] && b[i.name] && a[i.name] != b[i.name]) {
	    			return false;
	    		}
	    	}
	    	return true;
	    },
	    
	    makeDiff(before, after) {
	    	const diff = {};
	    	this.currency.currencies.forEach((c) => {
	    		diff[c.name] = after[c.name] - before[c.name];
	    	});
	    	return diff;
	    },
	    
	    enableCurrency(name) {
	    	if (this.enabledSpecialCurrencies.indexOf(name) === -1 && this.currency.specialCurrencies.some(x => x.name == name)) {
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
	    },
	    
	    usedCurrencies(amount) {
	    	return this.combinedCurrencies((sc) => Object.hasOwn(amount, sc.name) && amount[sc.name] != 0);
	    },
	    
	    /**
	     * Combines normal and special currencies, in order, 
	     * filtering the special currencies according to the callback method defined in filterCallback.
	     * filterCallback must take a single parameter, which is the special currency as defined in specialCurrencies.
	     */
	    combinedCurrencies(filterCallback) {
	    	const sortedCurrencies = [];
			this.currency.currencies.forEach((stdCurrency) => {
				// Get any special currencies that go before this standard currency
				const specialCurrenciesHere = this.currency.specialCurrencies.filter((sc) => sc.convertsTo == stdCurrency.name && filterCallback(sc));
				if (specialCurrenciesHere && specialCurrenciesHere.length > 0) {
					specialCurrenciesHere.forEach((sc) => sortedCurrencies.push(sc));
				}
				sortedCurrencies.push(stdCurrency);
			});
			return sortedCurrencies;
	    }
    
    }
});
