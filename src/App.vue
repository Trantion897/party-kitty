<script setup>
import TheKitty from './components/TheKitty.vue'
import TheTabs from './components/TheTabs.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <TheKitty />
    </div>
  </header>

  <main>
      <the-tabs />
  </main>
</template>

<style>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (max-width:512px) {
  .input-group-text {
    padding-left:.375rem;
    padding-right:.375rem;
  }
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
