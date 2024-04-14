import { defineStore } from 'pinia';

export const useCurrencyStore = defineStore('currency', {
	state: () => {
		return {
			name: "dnd5e",
			currencies: ['GP', 'SP', 'CP'],
			conversionRates: [10, 10]
			
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
	    	for (const i in this.currencies) {
	    		z[this.currencies[i]] = 0;
	    	}
	    	return z;
	    }
    }
})
