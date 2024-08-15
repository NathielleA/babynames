<script>
import SearchBar from '../components/home/SearchBar.vue';
import NavBar from '../components/home/NavBar.vue';
import PhrasesNotification from '@/components/home/PhrasesNotification.vue';

export default {
  components: { SearchBar, NavBar,PhrasesNotification },
};
</script>

<template>
  <div>
    <NavBar/>
    <div class="container is-fluid" style="overflow: hidden; position: fixed;">
      <div class="column is-offset-1 is-10 is-offset-1" style="min-height: 100vh;">
        <SearchBar/>
           <PhrasesNotification class="pn"/>
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
.pn {
  position: fixed;
  bottom: 20px; /* Distância da parte inferior da janela */
  right: 20px;  /* Distância da borda direita da janela */
  z-index: 1000; /* Alta prioridade para estar acima de outros elementos */
  background-color: #f5f5f5; /* Cor de fundo */
  padding: 10px; /* Espaçamento interno */
  border-radius: 5px; /* Bordas arredondadas */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra para destacar */
}
</style>
