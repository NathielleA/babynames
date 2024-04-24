<template>
    <div>
        <span v-if="!showMessage">Veja mais informações</span>
        <span v-else></span>
      <transition name="fade">
      <div v-if="showMessage">    
        <div class="media-content">
          <div class="content">
            <p>
              <strong><small>Origem: {{ this.origin }}</small></strong> 
            </p>
            <p>
              <small class="is-size-7 has-text-grey-light">Nomes Similares: </small><small class="is-size-7 has-text-grey-light" v-for="(name,index) in this.Names" :key="index">{{"\t"}}{{name}} |</small>
              <br />
            </p>
            <p>
              <small ></small>
              </p>
          </div>
        </div>
</div>
      </transition>
    </div>
  </template>
  
  <script>
  //import { mapGetters,mapActions } from 'vuex';

  export default {
    data() {
      return {
        
      };
    },
  
    props:["query", "isLoading", "showMessage","similiarNames","origin", "meaning", "Names"],

  };
  </script>
  
  <style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active abaixo da versão 2.1.8 */ {
    opacity: 0;
  }
  .button-custom {
    border: none;
    background-color: transparent;
    color: #333; /* Cor do texto */
    padding: 0; /* Remover padding */
    cursor: pointer;
  }
  .message {
    background-color: #e5ffe5;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
  }
  .is-hidden {
    display: none;
  }
  </style>
  