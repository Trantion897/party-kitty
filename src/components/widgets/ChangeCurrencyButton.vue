<script setup>
    import { useKittyStore } from '@/stores/kitty.js';
    const kittyStore = useKittyStore();

    const refresh = function() {
        kittyStore.refresh();
    }
</script>

<template>
	<button type="button" class="change btn btn-outline-primary bi bi-pencil" @click="change"><span>&nbsp;Change currency</span></button>
</template>

<style scoped>
    @media (max-width:40rem) {
        .btn span {
            display:none;
        }
    }
</style>
