<script setup>
import { ref } from 'vue';

const emit = defineEmits(['change']);
    
const props = defineProps({
	currency: Object,
	amount: Number
});

const changeValue = function(event) {
    emit("change", props.currency.name, Number(event.target.value));
}
</script>

<template>
	<div class="input-group col">
	    <input type="number" class="form-control" aria-label="Amount in {{currency}}" :value="amount" @change="changeValue" @keyup="changeValue" />
	    <span class="input-group-text">{{currency.name}}</span>
	</div>
</template>
