<script setup>
import { ref } from 'vue';

const emit = defineEmits(['change']);
    
const props = defineProps({
	currency: String,
	amount: Number
});

const changeValue = function(event) {
    emit("change", props.currency, event.target.value);
}
</script>

<template>
	<div class="input-group mb-3 col">
	    <input type="number" class="form-control" aria-label="Amount in {{currency}}" :value="amount" @change="changeValue" />
	    <span class="input-group-text">{{currency}}</span>
	</div>
</template>
