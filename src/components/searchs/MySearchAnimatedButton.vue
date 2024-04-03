<template>
    <div>
      <button @click="animateAndReturn" :disabled="isLoading" class="button-custom" :class="{ 'is-loading': isLoading, 'is-hidden': showMessage }">
        <span v-if="!isLoading">Veja mais informações</span>
        <span v-else>Carregando...</span>
      </button>
      <transition name="fade">
      <div v-if="showMessage">    
        <div class="media-content">
          <div class="content">
            <p>
              <strong><small>Origem: {{ this.origin }}</small></strong> <small class="is-size-7 has-text-grey-light">Nomes Similares: </small><small class="is-size-7 has-text-grey-light" v-for="(name,index) in this.similiarNames" :key="index">{{"\t"}}{{name}} |</small>
              <br />
                {{ this.meaning }}
            </p>
          </div>
        </div>
</div>
      </transition>
    </div>
  </template>
  
  <script>
  //import { mapGetters,mapActions } from 'vuex';
  import names from '@/services/names';

  export default {
    data() {
      return {
        isLoading: false,
        showMessage: false,
        message: "",
        similiarNames : "",
        recommendedNames : "",
        origin : "",
        meaning : "",
        n : ""
      };
    },
    props:["query"],
    methods: {
      animateAndReturn() {
        this.isLoading = true;
        // Simulando uma requisição assíncrona

        this.getNames()
        setTimeout(() => {
          this.isLoading = false;
          this.showMessage = true;
          this.message = "Ação concluída!";
         // setTimeout(() => {
          //  this.showMessage = false;
          //}, 2000); // Tempo para mostrar a mensagem antes de desaparecer
        }, 2000); // Tempo simulado da requisição
      },

      async getNames(){
        try {
          //let n = this.$route.params.name;
          let response = await names.getNames(this.query);
          console.log(response.data.data.similiarNames)
          this.n = response.data.data.name;
          this.similiarNames = response.data.data.similiarNames;
          this.recommendedNames = response.data.data.recommendedNames;
          this.origin = response.data.data.origin;
          this.meaning = response.data.data.meaning;
      }
      catch(e){
        console.log("We have problems");
        console.log(e)
      }
    }}
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
  