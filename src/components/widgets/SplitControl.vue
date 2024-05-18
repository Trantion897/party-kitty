<script setup>
    import { ref, computed, watch } from 'vue';
    
    const props = defineProps(['partySize', 'splitRatio']);
    
    const emit = defineEmits(['changePartySize', 'changeSplitRatio']);
    
    const splitRatioDescription = computed(() => {
        if (props.splitRatio == 0) {
            return "No money to party kitty";
        } else if (props.splitRatio < 33) {
            return "Small proportion to party kitty"
        } else if (props.splitRatio == 33) {
            return "Equal proportion to party kitty"
        } else if (props.splitRatio < 66) {
            return "Larger proportion to party kitty"
        } else if (props.splitRatio == 66) {
            return "50/50 between party & members"
        } else if (props.splitRatio < 99) {
            return "Majority to party kitty"
        } else {
            return "All money to party kitty"
        }
        
    });
    
    const setPartySize = function(event) {
        let newSize = event.target.value;
        console.log(newSize)
        if (newSize <= 0) {
            newSize = 1;
        }
        
        emit('changePartySize', newSize);
    }
    
    const changePartySize = function(change) {
        let newSize = props.partySize += change;
        if (newSize < 1) {
            newSize = 1;
        }
        
        emit('changePartySize', newSize);
    }
    
    const changeSplitRatio = function(event) {
        emit('changeSplitRatio', event.target.value);
    }
    
</script>

<template>
	<section>
		<h3>Split between</h3>
        <div class="row gy-2">
            <div class="col-auto">
		        <div class="input-group mb-3">
                    <span class="input-group-text">Party size</span>
                    <button class="btn btn-outline-secondary" type="button" id="party-minus-button" @click="changePartySize(-1)">-</button>
                    <input type="text" class="form-control" aria-label="Number of characters in party" :value="partySize" @input="setPartySize($event)" @keyup.up="changePartySize(1)" @keyup.down="changePartySize(-1)"/>
                    <button class="btn btn-outline-secondary" type="button" id="party-minus-button" @click="changePartySize(1)">+</button>
                </div>
		    </div>
		    <div class="col-auto">
		        <input type="range" class="form-range" :value="splitRatio" min="0" max="99" @input="changeSplitRatio" list="splitMarkers"></input>
		        <datalist id="splitMarkers">
		            <option value="0"></option>
		            <option value="33"></option>
		            <option value="66"></option>
		            <option value="99"></option>
		        </datalist>
		        <span>{{splitRatioDescription}}</span>
		    </div>
        </div>
	</section>
</template>
