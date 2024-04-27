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
            userId : null
        };
    },
    computed : {
      ...mapGetters(['getName','getSimiliarNames','getRecommededNames', 'getLat','getLon','getID']),
      name(){
        return this.getName;
      },
      similiarNames(){
        return this.getSimiliarNames;
      },
      recommendedNames(){
        return this.getRecommededNames;
      },
      lat(){
        return this.getLat;
      },
      lon(){
        return this.getLon;
      },
      ID(){
        return this.getID;
      }

    },
    methods: {
      ...mapActions(['getNewNames','getPosix','setMainResultID']),

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
        let response = await action.postAction(this.name,2,userLocalStorage,this.lat,this.lon,0);
        console.log(response)
          }catch(e){
            console.log(e)
          }
      },

    async searchRecommendedNames(){
      this.getNewNames();
      this.setMainResultID(this.ID)
    },

    generateUserID() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
    },
    created() {
      
      this.checkUserID();
      this.getPosix()
      this.getNewNames()
      this.postSearchAction();
      this.setMainResultID(this.ID);
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
      <MyTopSearchBar @search="getNewNames" style="margin-bottom: 10px;"/>
      <MySearchMainResult :name="this.name" :similiarNames="this.similiarNames" style="margin-top: 10px; margin-bottom: 10px;"/>
      <ul  class="is-compact"  style="list-style: none; padding: 0; margin: 0;">
        <li v-for="(name,index) in recommendedNames" :key="index" style="margin-bottom: -20px !important;">
          <MySearchNameResult :name="name"/>
        </li>
      </ul>
    </div>
    <footer class="myfooter">
  <div class="content has-text-centered">
    <p>
      <strong>Hera</strong> by <a href="https://github.com/laraesquivel/babynames">Lara Esquivel and João B. Rocha-Junior</a>. The source code is licensed
      <a href="http://opensource.org/licenses/mit-license.php">Open Source</a>. The website is project from <a href="https://sites.google.com/uefs.br/adam/home">ADAM UEFS</a>.
    </p>
  </div>
</footer>
  </div>
</template>


<style>
    .myfooter{
      margin-top: 5%
    }

</style>
