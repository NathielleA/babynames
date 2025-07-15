<script>
//import MyThumbDown from "../icons/MyThumbDown.vue";
//import MyThumbUp from "@/components/icons/MyThumbUp.vue";
import MySearchAnimatedButton from '@/components/searchs/MySearchAnimatedButton.vue'
import { mapGetters,mapActions } from 'vuex';

export default {
  name: 'MySearchNameResult',
  components: {
   // MyThumbDown,
   // MyThumbUp,
    MySearchAnimatedButton,
    
  },
  data(){
    return{
      isClicked : false,
      lat : null,
      lon : null,
      isActive : false,
      isVisible : false,
      iconChanged: false,


      isLoading: false, 
        showMessage: false,
        similiarNames : [],
        recommendedNames : [],
        origin : '',
        meaning : '',
        id : null,
        n : null
    }


  },
  computed:{
    ...mapGetters(['getName','getMainResultID']),
    getname(){
      return this.getName;
    },
    relationalNameID(){
        return this.getMainResultID;
      }
  },
  props: ['name','indice'],
  methods: {

    ...mapActions(['setNameQuery','getNewNames']),
    search() {      
      this.setNameQuery(this.name.name);
      this.$store.commit('setClickedName',1);
      this.$emit('search',this.name.name);
      this.getNewNames();
    },

    toggleActiveLink() {
     
      this.isActive = !this.isActive;
      setTimeout(() => {
        this.isActive = false; // Retorna ao tamanho original após 1 segundo (1000 milissegundos)
      }, 1000);
    },
    toggleText() {
        this.isVisible = !this.isVisible;
      },

    showText(){
      this.getNewNames()
    },

    hideText(){
      this.showMessage = false
    }
    
  },
    created(){

    },
}
</script>

<template>
    <div class="container is-fluid">
        <div class="notification container-verde">
        <div class="level is-small">
          <section class='hero'>
            
              <div><a class="hero-subtitle link" :class="{active : isActive}"  @click="search()">{{ name.name }}</a>
                <MySearchAnimatedButton :indice="this.indice"  />
              </div>
              
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
  transition: transform 0.2s ease;
  font-family: Arial, sans-serif; /* Fonte padrão */
}

.link.active {
  transform: scale(1.2);
  color: #47bed2;
}


</style>