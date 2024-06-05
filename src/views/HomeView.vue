<script>
import SearchBar from '../components/home/SearchBar.vue';
import NavBar from '../components/home/NavBar.vue';

export default {
  components: { SearchBar, NavBar },
};
</script>

<template>
  <div>
    <NavBar/>
    <div class="container is-fluid" style="overflow: hidden; position: fixed;">
      <div class="column is-offset-1 is-10 is-offset-1" style="min-height: 100vh;">
        <SearchBar/>
      </div>
    </div>
    <RouterView/>
  </div>
</template>

<style scoped>
body, html {
  overflow: hidden;
}

.logo {
  width: 80px;
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}
#container {
  margin-right: 0;
  margin-left: 0;
}
</style>
