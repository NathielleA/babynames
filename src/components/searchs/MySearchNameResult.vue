<script>
//import MyThumbDown from "../icons/MyThumbDown.vue";
//import MyThumbUp from "@/components/icons/MyThumbUp.vue";
import MySearchAnimatedButton from '@/components/searchs/MySearchAnimatedButton.vue'
import { mapGetters } from 'vuex';
import action from '@/services/action';

export default {
  name: 'MySearchNameResult',
  components: {
   // MyThumbDown,
   // MyThumbUp,
    MySearchAnimatedButton
  },
  data(){
    return{
      isClicked : false,
      lat : null,
      lon : null,
      isActive : false
    }


  },
  props: ['name'],
  methods: {
    async reaction(){
        // Altera o estado de 'isClicked' quando o botão é clicado
        this.isClicked = !this.isClicked;
        this.toggleActiveLink()
        try{
       // console.log("This is thumpub" + this.lat);
        const userLocalStorage = localStorage.getItem("userID");
        let response = await action.postAction(this.name,1,userLocalStorage,this.lat,this.lon,2,this.relationalNameID);
        console.log(response)
          }catch(e){
            console.log(e)
          }
    },
    toggleActiveLink() {
      const audio = new Audio('/clickconfirm.wav'); // Substitua pelo caminho correto do seu arquivo de som
      audio.play();
      this.isActive = !this.isActive;
      setTimeout(() => {
        this.isActive = false; // Retorna ao tamanho original após 1 segundo (1000 milissegundos)
      }, 1000);
    }
    
  },
  computed : {
      ...mapGetters(['getMainResultID']),
      relationalNameID(){
        return this.getMainResultID;
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
}
</script>

<template>
    <div class="container is-fluid">
        <div class="notification container-verde">
        <div class="level is-small">
          <section class='hero'>
              <a class="hero-subtitle link" :class="{active : isActive}"  @click="reaction">{{ name }}</a>
              <MySearchAnimatedButton :query="this.name"/>
              

          </section>
          <!--
            <div class="block">
                <MyThumbUp :name="this.name" style="margin-right: 10px;"/>
                <MyThumbDown :name="this.name" />
            </div>
          -->

  </div>
      </div>
    </div>
</template>

<style>
.container-verde {
  border: 1px solid transparent; /* Ajuste a espessura da borda conforme necessário */
  background-color: transparent;
}

.button.is-info.is-inverted:hover{
    background-color: #47bed2;
    color : white;
}

.link {
  display: inline-block;
 /* padding: 10px 20px;*/
  text-decoration: none;
  transition: transform 0.3s ease;
  font-family: Arial, sans-serif; /* Fonte padrão */
}

.link.active {
  transform: scale(1.2);
  color: #47bed2;
}


</style>