<template>
  <div>
    <span v-if="!showMessage" @click="showText">
          <span>
            
            <p v-if="this.meaning" class="">
              {{ this.meaning.slice(0,80) }}...
            <span  style="cursor: pointer;" class="icon is-medium" icon-text custom-span>
              <i class="fas">  
                <svg xmlns="http://www.w3.org/2000/svg"  v-if="!this.iconChanged" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
              </i> 
            </span>
            </p>
            <p v-else>
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
            <!--
            <p v-if="this.origin">
              <small class="is-size-7 has-text-grey-light">Nomes Similares: </small><small class="is-size-7 has-text-grey-light" v-for="(nameS,index) in this.similiarNames" :key="index">{{"\t"}}{{nameS}} |</small>
              <br />
            </p> -->
            <p v-if="this.meaning" >
              <small>{{ this.meaning }}</small>
              

              <span @click="showText" class = "icon is-medium" icon-text custom-span>
                  <i class="fas">
                    <svg xmlns="http://www.w3.org/2000/svg"  height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
                  </i>
                </span>

              </p>

              



          </div>
        </div>
        
</div>

      </transition>
    </div>
  </template>
  
  <script>

  //import { mapGetters,mapActions } from 'vuex';
  //import names from '@/services/names';
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
      '$store.state.recommendedNames'(novoValor){
        if (novoValor && novoValor[this.indice]) {
          this.clear();

          console.log("Olhem o array recommendedNames:", novoValor);
          // console.log("Indice atual:", this.indice);
          // console.log("Item atual:", novoValor[this.indice]);
          
          this.origin = novoValor[this.indice].origin || '';
          this.meaning = novoValor[this.indice].meaning || '';
          //this.similiarNames = novoValor[this.indice].similiarNames;
         // this.recommendNames = novoValor[this.indice].recommendNames;
        }
      },
      
      '$store.state.actualPhrase'(novaFrase){
        if (novaFrase && novaFrase.associedNames && novaFrase.associedNames[this.indice]) {
          this.clear();
          console.log("Nomes da frase:", novaFrase.associedNames);
          
          // this.origin = novaFrase.associedNames[this.indice].origin || '';
          // this.meaning = novaFrase.associedNames[this.indice].meaning || '';
        }
      },
    },
    data() {
      return {
        origin : '',
        meaning : '',
        //similiarNames : '',
      //  recommendNames : [],
        showMessage : false,
        iconChanged: false,
        message : !this.showMessage ? "Veja mais informaçãoes" : '',
  
      };
    },

    methods : {
      async showText(){
        let count = 0;
        this.showMessage = !this.showMessage;
        if (count == 0){
          //this.getInfoAboutNames();
          count+=1
        }
        else{
          count = 0;
        }

      },

      async getInfoAboutNames(){
 
      },

      clear(){
        
          this.showMessage = false
        },

      initializeData() {
        const recommendedNames = this.$store.state.recommendedNames;
        const actualPhrase = this.$store.state.actualPhrase;
        
        if (recommendedNames && recommendedNames[this.indice]) {
          this.origin = recommendedNames[this.indice].origin || '';
          this.meaning = recommendedNames[this.indice].meaning || '';
        } else if (actualPhrase && actualPhrase.associedNames && actualPhrase.associedNames[this.indice]) {
          this.origin = actualPhrase.associedNames[this.indice].origin || '';
          this.meaning = actualPhrase.associedNames[this.indice].meaning || '';
        }
      }
    },

    created() {
      // Inicializa os dados quando o componente é criado
      this.initializeData();
    },
    
  
    props:["indice"],

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

  p {
    font-size: 14px; /* Ou qualquer tamanho desejado */
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
