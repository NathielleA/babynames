<template>
    <button class="button is-small is-icon is-borderless" @click="handleButtonClick">
      <span class="icon" :class="{ 'clicked': isClicked }">
        <svg-icon type="mdi" :path="path"></svg-icon>
      </span>
    </button>
  </template>
  
  <script>
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiThumbDownOutline } from '@mdi/js';
  import action from '@/services/action';
  import { mapGetters } from 'vuex';

  export default {
    name: "MyThumbDown",
    components: {
      SvgIcon
    },
    data() {
      return {
        path: mdiThumbDownOutline,
        isClicked : false,
        lat : null,
        lon : null
      }
    },
    computed : {
      ...mapGetters(['getName']),
      relationalName(){
        return this.getName;
      }},
    props : ['name'],
    created(){
      if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
          },
          (error) => {
            console.error("Erro ao obter localização:", error.message);
          }
        );
      } else {
        console.error("Geolocalização não é suportada neste navegador.");
      }
    },
    methods: {
      async handleButtonClick() {
        // Adicione aqui o código a ser executado quando o botão for clicado
        console.log("Botão clicado!");
        this.isClicked = !this.isClicked; 
        try{
          
        const userLocalStorage = localStorage.getItem("userID");
        let response = await action.postAction(this.name,0,userLocalStorage,this.lat,this.lon,2,this.relationalName);
        console.log(response)
          }catch(e){
            console.log(e)
          }
          
      },

    }
  }
  </script>
  
  <style scoped>
  /* Adicione estilos conforme necessário para o botão usando classes do Bulma */
   /* Adicione estilos conforme necessário para o botão usando classes do Bulma */
   .button.is-icon.is-borderless {
    border: none !important;
    outline: none !important; /* Remova a borda do botão */
    box-shadow : none !important;
  }
  
  /* Adicione estilos para a cor do ícone quando clicado */
  .icon.clicked {
    color:  #b43e61; 
    border: none;/* Substitua pela cor desejada */
  }
  </style>
  