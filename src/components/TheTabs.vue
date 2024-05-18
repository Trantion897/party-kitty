<script setup>
    import { ref } from 'vue';
    
    import ShareMoney from '@/components/pages/ShareMoney.vue';
    import KittyHistory from '@/components/pages/KittyHistory.vue';
    import AddMoney from '@/components/pages/AddMoney.vue';
    import TakeMoney from '@/components/pages/TakeMoney.vue';
    
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
  <nav>
	<ul class="nav">
	    <li class="nav-item" :class="{active: activeTab == tabShare}">
	       <a class="bi bi-share" @click.stop="setActiveTab(tabShare)" href="#">Split</a>
	    </li>
	    <li class="nav-item" :class="{active: activeTab == tabAdd}">
	       <a class="bi bi-plus-circle" @click.stop="setActiveTab(tabAdd)" href="#">Add</a>
	    </li>   
	    <li class="nav-item" :class="{active: activeTab == tabTake}">
	       <a class="bi bi-dash-circle" @click.stop="setActiveTab(tabTake)" href="#">Take</a>
	    </li>
	    <li class="nav-item" :class="{active: activeTab == tabHistory}">
	       <a class="bi bi-clock-history" @click.stop="setActiveTab(tabHistory)" href="#">History</a>
	    </li>
	</ul>
  </nav>
	
	<share-money v-show="activeTab == tabShare"></share-money>
	<kitty-history v-show="activeTab == tabHistory"></kitty-history>
	<add-money v-show="activeTab == tabAdd"></add-money>
	<take-money v-show="activeTab == tabTake"></take-money>
	
	
</template>

<style scoped>
  nav {
    border-bottom: 1px solid #ccc;
  }
  nav ul {
    list-style-type: none;
	display:inline-block;
    margin-bottom:-1px;
    padding: 0 6px;
  }
  
  nav ul li {
    border: 1px solid #ccc;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border-bottom:none;
    display:inline-block;
    margin: 0px;
  }
  nav ul li.active {
    position:relative;
  }
  nav ul li.active::after {
    position:absolute;
    left:0;
    right:0;
    bottom:-1px;
    height:3px;
    content:" ";
    display:block;
    background-color:#fff;
  }
  nav ul li a {
    display:inline-block;
    padding: 5px;
  }
  nav ul li a.bi::before {
    padding-right:5px;
  }
  nav ul li.active a{
    padding-top:10px;
  }
  nav ul li a:hover,
  nav ul li a:active {
    padding-top: 10px;
  }
</style>

