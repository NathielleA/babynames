<template>
  <div>
    <span v-if="!showMessage" @click="showText">
          <span>
            <p>
              Veja mais informações
            <span class="icon is-medium" icon-text custom-span>
              <i class="fas">  
                <svg xmlns="http://www.w3.org/2000/svg"  v-if="!this.iconChanged" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
              </i> 
            </span>
            </p>
          </span>
          </span>
          
          <span v-else @click="showText">
            <span>
              <p>Oculte informações

                <span class = "icon is-medium" icon-text custom-span>
                  <i class="fas">
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
                  </i>
                </span>
              </p>
              
            </span>
          </span>
      <transition name="fade">
      <div v-if="showMessage">    
        <div class="media-content">
          <div class="content">
            <p v-if="this.origin">
              <strong><small>Origem: {{ this.origin }}</small></strong> 
            </p>
            <p v-if="this.origin">
              <small class="is-size-7 has-text-grey-light">Nomes Similares: </small><small class="is-size-7 has-text-grey-light" v-for="(name,index) in this.Names" :key="index">{{"\t"}}{{name}} |</small>
              <br />
            </p>
            <p v-if="this.meaning">
              <small>{{ this.meaning }}</small>
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
  //import { watch } from 'vue';
//  import { mapGetters } from 'vuex';

  export default {
  /*
    setup(){
      const searchState = ref(null);
    },
    computed:{
      ...mapGetters('getName'),
      mainNameOfAppp(){
        return this.getName
      },*

    },*/

    watch : {
      '$store.state.name'(novoValor){
        console.log(novoValor);
        this.clear();
      },
    },
    data() {
      return {
        showMessage : false,
        message : !this.showMessage ? "Veja mais informaçãoes" : '',
        similiarNames : [],
        recommendedNames : [],
        origin : '',
        meaning : '',
        id : ''


      };
    },

    methods : {
      async showText(){
        let count = 0;
        this.showMessage = !this.showMessage;
        if (count == 0){
          this.getInfoAboutNames();
          count+=1
        }
        else{
          count = 0;
        }

      },

      async getInfoAboutNames(){
        try{
          let response = await names.getNames(this.query);
          //console.log(response.data.data.similiarNames)
          this.similiarNames = response.data.data.similiarNames;
          this.recommendedNames = response.data.data.recommendedNames;
          this.origin = response.data.data.origin;
          this.meaning = response.data.data.meaning;
          this.id = response.data.id;
        }
        catch(error){
          console.log(error)
        }
      },

      clear(){
        this.similiarNames = [];
          this.recommendedNames = [];
          this.origin = '';
          this.meaning = '';
          this.id = '';
          this.showMessage = false
        }
      },
    
  
    props:["query"],

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

  .custom-span {
  cursor: pointer;
  /* Outros estilos personalizados, se necessário */
}
  </style>
  