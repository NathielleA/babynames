<template>
    <button class="button is-small is-icon is-borderless" @click="handleButtonClick">
      <span class="icon" :class="{ 'clicked': isClicked }">
        <svg-icon type="mdi" :path="path"></svg-icon>
      </span>
    </button>
  </template>
  
  <script>
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiThumbUpOutline } from '@mdi/js';
  import action from '@/services/action';
  import { mapGetters } from 'vuex';

  export default {
    name: "MyThumbUp",
    components: {
      SvgIcon
    },
    data() {
      return {
        path: mdiThumbUpOutline,
        isClicked: false,
        lat : null,
        lon : null
      }
    },
    props : ['name'],
    computed : {
      ...mapGetters(['getName']),
      relationalName(){
        return this.getName;
      }},
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
        // Altera o estado de 'isClicked' quando o botão é clicado
        this.isClicked = !this.isClicked;
        try{
       // console.log("This is thumpub" + this.lat);
        const userLocalStorage = localStorage.getItem("userID");
        let response = await action.postAction(this.name,1,userLocalStorage,this.lat,this.lon,2,this.relationalName);
        console.log(response)
          }catch(e){
            console.log(e)
          }
      }
    }
  }
  </script>
  
  <style scoped>
  /* Adicione estilos conforme necessário para o botão usando classes do Bulma */
  .button.is-icon.is-borderless {
    border: none !important;
    outline: none !important; /* Remova a borda do botão */
    box-shadow : none !important;
  }
  
  /* Adicione estilos para a cor do ícone quando clicado */
  .icon.clicked {
    color:  #47bed2; 
    border: none;/* Substitua pela cor desejada */
  }
  </style>
  
  