<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',

  beforeCreate(){
    this.$store.dispatch('getUser');
    this.$store.dispatch('getPosix');
    this.$store.dispatch('getPhrases');
    this.$store.commit('setClickedName', 0);
    this.$store.commit('setPage', 0);
  },
};
</script>

<style>
/* Adicione estilos conforme necessário */
</style>
