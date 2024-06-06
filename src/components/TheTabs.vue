<script setup>
    import { ref, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    
    const router = useRouter();
    const route = useRoute();
    
    const tabShare = "share";
    const tabAdd = "add";
    const tabTake = "take";
    const tabHistory = "history";
    const tabOptions = "options";
</script>

<template>
  <nav>
	<ul class="nav">
	    <li class="nav-item" :class="{active: route.name == tabShare}">
	       <RouterLink to="share" class="bi bi-share">Split</RouterLink>
	    </li>
	    <li class="nav-item" :class="{active: route.name == tabAdd}">
	       <RouterLink to="add" class="bi bi-plus-circle">Add</RouterLink>
	    </li>   
	    <li class="nav-item" :class="{active: route.name == tabTake}">
	       <RouterLink to="take" class="bi bi-dash-circle">Take</RouterLink>
	    </li>
	    <li class="nav-item" :class="{active: route.name == tabHistory}">
	       <RouterLink to="history" class="bi bi-clock-history">History</RouterLink>
	    </li>
	    <li class="nav-item" :class="{active: route.name == tabHelp}">
	       <RouterLink to="options" class="bi bi-gear">Options</RouterLink>
	    </li>
	</ul>
  </nav>
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

