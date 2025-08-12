<template>
  <div id="app">
    <router-view></router-view>
    <!-- Dashboard de Analytics (só aparece em desenvolvimento) -->
    <AnalyticsDashboard />
  </div>
</template>

<script>
import AnalyticsDashboard from '@/components/AnalyticsDashboard.vue'

export default {
  name: 'App',
  components: {
    AnalyticsDashboard
  },

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
