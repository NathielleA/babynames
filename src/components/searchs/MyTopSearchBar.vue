<script>
import { mapGetters,mapActions } from 'vuex';

export default {
  data() {
    return {
      querys: '',
      componentKey : 0,
    };
  },

  computed:{
    ...mapGetters(['getName']),
    name(){
      return this.getName;
    }
  },

  methods: {
    ...mapActions(['setNameQuery']),
    search() {      
      this.setNameQuery(this.querys);
      this.$emit('search',this.querys);
    }
  },
}
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation" :key="componentKey">
    <div class="navbar-brand">
      <figure class="image is-64x64 is-hidden-mobile">
        <img class="is-rounded" src="../../assets/hera2.jpeg" alt="Logo">
      </figure>
    </div>

    <div class="navbar-item">
      <div class="block">
        <div class="search-input is-flex">
          <a class="is-hidden-desktop mr-1" style="margin-top:9px">
            <figure>
              <img src="../../assets/warfare.png">
            </figure>
          </a>
          <input class="input is-rounded ml-3-desktop is-extra-small-mobile" type="text" v-model="querys" placeholder="Pesquise um nome">
          <button class="button is-custom-color is-extra-small-mobile is-rounded ml-2" @click="search">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
                <path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/>
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.is-custom-color {
  background-color: #b43e61; /* Substitua pela cor desejada */
  color: #fff; /* Cor do texto no botão */
}

/* Estilo adicional para a cor do botão ao passar o mouse */
.is-custom-color:hover {
  background-color: #420024; /* Substitua pela cor desejada ao passar o mouse */
}
</style>
