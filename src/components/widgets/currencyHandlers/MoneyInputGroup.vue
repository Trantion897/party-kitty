<script setup>
    import { ref, onMounted } from 'vue';
    import { useCurrencyStore } from '@/stores/currency';
    
    import MoneyInput from '@/components/widgets/currencyHandlers/MoneyInput.vue'
    
    const currencyStore = useCurrencyStore();
    
    const emit = defineEmits(['change']);
    
    const inputAmounts = ref([]);
    
    const totalAmount = ref({});
    
    let maxRowId = 0;
    
    const createBlankRow = function() {
        const newRow = {'key': maxRowId}
        maxRowId++;
        return newRow;
    }
    
    onMounted(() => {
        inputAmounts.value.push(createBlankRow());
    });
    
    /**
     * Checks if a money value is empty in all currencies
     */
    const isEmpty = function(amount) {
        let isEmpty = true;
        
        for (const cur of currencyStore.currencies) {
            if (cur in amount && amount[cur] != 0) {
                isEmpty = false;
                break;
            }
        }
        
        return isEmpty;
    }
    
    const onChangeMoneyInput = function(index, input) {
        
        inputAmounts.value[index] = {...inputAmounts.value[index], ...input};
        const currencies = currencyStore.currencies;
        
        totalAmount.value = Object.fromEntries(currencies.map(cur => [cur, 0]));
        
        for (const i in inputAmounts.value) {
            const amount = inputAmounts.value[i];
            for (const cur of currencies) {
                if (amount[cur]) {
                    totalAmount.value[cur] += amount[cur];
                }
            }
        }
        
        // Add a new row at the end if all rows are in use
        if (!inputAmounts.value.some(isEmpty)) {
            inputAmounts.value.push(createBlankRow());
        }
        
        emit('change', totalAmount.value);
    }
    
    const onBlur = function(index) {
        // If the blurred row is blank or all zeros, and it's not the last row, remove it.
        if (index != inputAmounts.value.length-1 && isEmpty(inputAmounts.value[index])) {
            inputAmounts.value.splice(index, 1);
        }
    }
</script>

<template>
    <ul class='settings'>
        <li v-for="currency in currencyStore.specialCurrencies">
            <label>
                <input type="checkbox" value="1" :name="`enable_${currency.name}`" :value="currencyStore.this.enabledSpecialCurrencies.indexOf(currencies.name) !== -1" @click="currencyStore.toggleCurrency(currency.name)">
                Enable {{currency.name}}
            </label>
            <label v-if="currency.enableConversion == 'ask'" :title="`Enable converting ${currency.name} into other currencies automatically`">
                <input type="checkbox" value="1" :name="`convertFrom_${currency.name}`">
                Convert to {{currency.convertsTo}}
            </label>
            <label v-if="currency.enableGeneration == 'ask'" :title="`Enable converting other currencies into ${currency.name} automatically`">
                <input type="checkbox" value="1" :name="`convertTo_${currency.name}`">
                Convert others to {{currency.name}}
            </label>
        </li>
    </ul>
    <ul class='inputs'>
        <li v-for="amount, index in inputAmounts" :key="amount.key">
            <money-input :amount="amount" @change="onChangeMoneyInput(index, $event)" @focusout="onBlur(index)"></money-input>
        </li>
    </ul>
</template>

<style scoped>
    ul {
        list-style-type: none;
        padding:0;
        margin:0;
    }
    .settings li {
        border: 1px solid #ccc;
        border-radius:3px;
        margin: 2px 0;
        padding: 0 2px;
    }
    .settings label {
        display:inline-block;
        margin:3px;
    }
    .inputs li {
        border-bottom: 1px solid #ccc;
    }
    .inputs li:last-child {
        border-bottom: none;
    }
</style>