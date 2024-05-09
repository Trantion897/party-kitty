<script setup>
import { ref, computed } from 'vue';

import { useKittyStore } from '@/stores/kitty';

const kittyStore = useKittyStore();

kittyStore.$subscribe((mutation, state) => {  
    updateNameFromStore(state.serversideName);
});

const updateNameFromStore = function(serversideName) {
    if (serversideName != null && serversideName) {
        activeName.value = serversideName;
        inputBoxName.value = serversideName;
    }
}

const activeName = ref();
const inputBoxName = ref();

const loadKitty = function() {
    if (inputBoxName == activeName || inputBoxName == '') {
        return;
    }
    kittyStore.load(inputBoxName.value);
    // TODO: Use router to change URL without reload
};

const labelText = computed(() => {
    if (activeName.value) {
        return "Kitty name";
    } else {
        return "Load existing kitty";
    }
});

</script>

<template>
    <form class="row g-3" @submit.prevent="loadKitty">
        <div class="input-group mb-3">
            <span class="input-group-text">{{ labelText }}</span>
            <input type="text" class="form-control" aria-label="Load existing kitty" v-model="inputBoxName">
            <input class="btn btn-secondary" type="submit" value="Load">
        </div>
    </form>
</template>