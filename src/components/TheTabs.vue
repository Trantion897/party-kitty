<script setup>
    import { ref } from 'vue';
    
    import ShareMoney from './ShareMoney.vue';
    import KittyHistory from './KittyHistory.vue';
    
    const tabShare = "share";
    const tabAdd = "add";
    const tabTake = "take";
    const tabHistory = "history";
    
    const activeTab = ref(tabShare);
    
    const setActiveTab = function(newTab) {
        activeTab.value = newTab;
    }
</script>

<template>
	<ul class="nav">
	    <li class="nav-item">
	       <a class="nav-link" :class="{active: activeTab == tabShare}" @click.stop="setActiveTab(tabShare)" href="#">Share money</a>
	       <a class="nav-link" :class="{active: activeTab == tabAdd}" href="#">Add to kitty</a>
	       <a class="nav-link" :class="{active: activeTab == tabTake}" href="#">Take from kitty</a>
	       <a class="nav-link" :class="{active: activeTab == tabHistory}" @click.stop="setActiveTab(tabHistory)" href="#">View history</a>
	    </li>
	</ul>
	
	<share-money v-if="activeTab == tabShare"></share-money>
	<kitty-history v-else-if="activeTab == tabHistory"></kitty-history>
	
	
</template>


