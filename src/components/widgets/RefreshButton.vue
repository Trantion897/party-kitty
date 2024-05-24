<script setup>
    import { useKittyStore } from '@/stores/kitty.js';
    const kittyStore = useKittyStore();
    
    const refresh = function() {
        kittyStore.refresh();
    }
</script>

<template>
	<button type="button" class="refresh btn btn-outline-primary bi bi-arrow-clockwise" @click="refresh"><span>&nbsp;Refresh</span></button>
</template>

<style scoped>
    @media (max-width:30rem) {
        .btn span {
            display:none;
        }
    }
</style>