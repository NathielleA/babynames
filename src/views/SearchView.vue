<script>
import MyTopSearchBar from '@/components/searchs/MyTopSearchBar.vue';
import NavBar from '@/components/home/NavBar.vue';
import MySearchNameResult from '@/components/searchs/MySearchNameResult.vue'
import MySearchMainResult from '@/components/searchs/MySearchMainResult.vue'
//import names from '../services/names'
import users from '@/services/users';
import action from '@/services/action';
import { mapGetters,mapActions } from 'vuex';

export default {
    data() {
        return {
            responseData: null,
            lat : null,
            lon : null,
            userId : null
        };
    },
    computed : {
      ...mapGetters(['getName','getSimiliarNames','getRecommededNames']),
      name(){
        return this.getName;
      },
      similiarNames(){
        return this.getSimiliarNames;
      },
      recommendedNames(){
        return this.getRecommededNames;
      }

    },
    methods: {
      ...mapActions(['getNewNames']),
    /*
        async getasyncNames() {
            console.log('getasyncNames called');
            try {
                let n = this.$route.params.name;
                let response = await names.getNames(n,);

                this.responseData = response.data.data;
                this.name = this.responseData.name;
                this.similiarNames = this.responseData.similiarNames;
                console.log(this.responseData)
            }
            catch (error) {
                console.error('Error fetching names:', error);
            }
        },

*/
        async checkUserID() {
              const userLocalStorage = localStorage.getItem("userID");

              if (userLocalStorage === null) {
                const newUserID = this.generateUserID();
                localStorage.setItem("userID", newUserID);
                console.log("Novo usuário criado! ID: " + newUserID);
                this.saveUserIDOnServer(newUserID);
                this.userId = userLocalStorage;
              } else {
                console.log("Usuário reconhecido! ID: " + userLocalStorage);
                this.userId = userLocalStorage;
              }
            },

        async getLoc(){
          this.checkUserID();
            if (navigator.geolocation){
              navigator.geolocation.getCurrentPosition(
                  (position) => {
                    this.lat = position.coords.latitude;
                    this.lon = position.coords.longitude;
                    console.log(this.lat + this.lon)
                  },
                  (error) => {
                    console.error("Erro ao obter localização:", error.message);
                  }
                );
              } else {
                console.error("Geolocalização não é suportada neste navegador.");
              }
        },

      async saveUserIDOnServer(userID) {
        try {
          let response = await users.setUserId(userID);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
    },

    async postSearchAction() {
        // Altera o estado de 'isClicked' quando o botão é clicado
        try{
       // console.log("This is thumpub" + this.lat);
        const userLocalStorage = localStorage.getItem("userID");
        let response = await action.postAction(this.$route.params.name,2,userLocalStorage,this.lat,this.lon,0);
        console.log(response)
          }catch(e){
            console.log(e)
          }
      },

    generateUserID() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    },
    created() {
      
        console.log(this.$route.params.name);
       // this.checkUserID();
        //this.getLoc()
        //this.getasyncNames();
        let n = this.$route.params.name;
        this.getNewNames(n)

    },
    mounted(){
      //this.postSearchAction();
    },
  
    components: { NavBar, MyTopSearchBar, MySearchNameResult, MySearchMainResult}
};
</script>

<template>
  <div>
    <NavBar class="is-hidden-mobile"/>
    <div class="container is-fluid" style="overflow: hidden;">
      <MyTopSearchBar style="margin-bottom: 10px;"/>
      <MySearchMainResult :name="this.name" :similiarNames="this.similiarNames" style="margin-top: 10px; margin-bottom: 10px;"/>
      <ul style="list-style: none; padding: 0;">
        <li v-for="(name,index) in recommendedNames" :key="index" style="margin-bottom: 10px;">
          <MySearchNameResult :name="name"/>
        </li>
      </ul>
    </div>
  </div>
</template>



