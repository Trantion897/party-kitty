<script setup>
    import { ref, onMounted } from 'vue';
    import { useCurrencyStore } from '@/stores/currency';
    
    import MoneyInput from './MoneyInput.vue'
    
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
    })
    
    const onChangeMoneyInput = function(index, input) {
        
        inputAmounts.value[index] = {...inputAmounts.value[index], ...input};
        const currencies = currencyStore.currencies;
        
        // Clear any row that is all zeros and not at the end
        function isNotEmpty(amount) {
            let isEmpty = true;
            
            for (const i in currencies) {
                const cur = currencies[i];
                if (cur in amount && amount[cur] != 0) {
                    isEmpty = false;
                    break;
                }
            }
            return !isEmpty;
        }
        
        inputAmounts.value = inputAmounts.value.filter(isNotEmpty);
        
        totalAmount.value = Object.fromEntries(currencies.map(cur => [cur, 0]));
        for (const i in inputAmounts.value) {
            const amount = inputAmounts.value[i];
            for (const i in currencies) {
                const cur = currencies[i];
                totalAmount.value[cur] += amount[cur];
            }
        }
        
        
        
        // Add a new row at the end if all rows are in use
        inputAmounts.value.push(createBlankRow());
        
        emit('change', totalAmount.value);
    }
</script>

<template>
    <ul>
        <li v-for="amount, index in inputAmounts" :key="amount.key">
            <money-input :amount="amount" @change="onChangeMoneyInput(index, $event)"></money-input>
        </li>
    </ul>
</template>

<style scoped>
    ul {
        list-style-type: none;
        padding:0;
        margin:0;
    }
</style>