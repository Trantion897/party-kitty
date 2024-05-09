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

const copyToClipboard = function() {
    navigator.clipboard.writeText(document.location.href.split('?')[0] + "?name="+inputBoxName.value);
    console.log("Copied to clipboard"); // TODO: Visual notice  
}

const newKitty = function() {
    inputBoxName.value = "";
    activeName.value = "";
    kittyStore.clear();
}

</script>

<template>
    <form class="row g-3" @submit.prevent="loadKitty">
        <div class="input-group mb-3">
            <span class="input-group-text">{{ labelText }}</span>
            <input type="text" class="form-control" aria-label="Load existing kitty" v-model="inputBoxName">
            <button class="btn btn-outline-primary" type="submit" title="Load existing kitty">
                <span class="bi bi-cloud-download">&nbsp;Load</span>
            </button>
            <button class="btn btn-outline-primary" v-if="activeName" @click="copyToClipboard" title="Copy URL to clipboard">
                <span class="bi bi-clipboard">&nbsp;Copy</span> 
            </button>
            <button class="btn btn-outline-primary" v-if="activeName" @click="newKitty" title="Start new kitty">
                <span class="bi bi-file-earmark">&nbsp;New</span>
            </button>
        </div>
    </form>
</template>