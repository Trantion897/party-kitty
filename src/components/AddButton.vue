<script setup>

import { useKittyStore } from '@/stores/kitty';

const kittyStore = useKittyStore();
const props = defineProps({
	amount: Object
});

/**
 * Add the amount in the prop to the kitty store
 */
const doAdd = function() {
    kittyStore.change(props.amount);
}

</script>

<template>
    <button type="button" class="btn btn-primary" @click.once="doAdd">Add to kitty</button>
</template>