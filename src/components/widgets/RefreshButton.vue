<script setup>
    import { useKittyStore } from '@/stores/kitty.js';
    const kittyStore = useKittyStore();
    
    const refresh = function() {
        kittyStore.refresh();
    }
</script>

<template>
	<button type="button" class="refresh btn btn-primary bi bi-arrow-clockwise" @click="refresh">&nbsp;Refresh</button>
</template>