<script>
import MyTopSearchBar from '@/components/searchs/MyTopSearchBar.vue';
import NavBar from '@/components/home/NavBar.vue';
import MySearchNameResult from '@/components/searchs/MySearchNameResult.vue'
// import MySearchMainResult from '@/components/searchs/MySearchMainResult.vue'
import PhrasesNotification from '@/components/home/PhrasesNotification.vue';

//import names from '../services/names'
import users from '@/services/users';
import { mapGetters,mapActions } from 'vuex';
//import MyChat from '@/components/searchs/MyChat.vue'
export default {
    data() {
        return {
            responseData: null,
            userId : null,
            posix : 0,
        };
    },
    computed : {
      ...mapGetters(['getName','getSimiliarNames','getRecommededNames', 'getLat','getLon','getID', 'getIsPhraseSearch']),
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
      },
      isPhraseSearch() { return this.getIsPhraseSearch; }

    },
    methods: {
      ...mapActions(['getNewNames','getPosix','setMainResultID','setNameQuery']),

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

      async updateUserAssignature() {
            try {
            const userId = localStorage.getItem("userID");
            if (!userId) return;
            const response = await fetch(`https://adam-serveless-babynames.vercel.app/update_user_assignature?userId=${userId}&timestamp=${Date.now()}`);
            const data = await response.json();
            console.log("Assinatura atualizada:", data);
            } catch (error) {
            console.error("Erro ao atualizar assinatura:", error);
            }
        },

      async updateUserPhrases() {
            try {
            const userId = localStorage.getItem("userID");
            if (!userId) return;
            const response = await fetch(`https://adam-serveless-babynames.vercel.app/update_user_phrases?userId=${userId}&timestamp=${Date.now()}`);
            const data = await response.json();
            console.log("Frases atualizadas:", data);
            } catch (error) {
            console.error("Erro ao atualizar frases:", error);
            }
      },

      async searchRecommendedNames(){
        this.$store.commit('setIsPhraseSearch', false);
        if (this.$store.state.isPhraseSearch) {
          // Se for frase, não chama a API
          return;
        }
        
        await this.getNewNames(); // continua chamando a API quando for nome
      },

      generateUserID() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      },

      refreshPopup() {
        this.$refs.popup?.refreshData(); // se usar ref
        // ou:
        this.$store.dispatch('fetchUserAssignature');
        this.$store.dispatch('getPhrases');
      },

      async handleNameClick(name) {
        // atualiza a assinatura do usuário
        await this.updateUserAssignature();

        // atualiza as frases do usuário
        await this.updateUserPhrases();

        // atualiza o popup
        this.refreshPopup();
      }

    },

    created() {
      
      this.$store.commit('setPage',1);

      this.getNewNames()

      // Atualiza assinatura e frases sempre que carregar a página
      // this.updateUserAssignature();
      // this.updateUserPhrases();
    },
    mounted(){
      //this.postSearchAction();
    },
  
    components: { NavBar, MyTopSearchBar, MySearchNameResult, PhrasesNotification}
};
</script>

<template>
  <div>
    <NavBar class="is-hidden-mobile" homeRoute="/interface-a"/>
    <div class="container is-fluid" style="overflow: hidden;">
      <MyTopSearchBar @search="getNewNames" style="margin-bottom: 10px;"/>

      <h1>
        <template v-if="$store.getters.getIsPhraseSearch">
          Nomes recomendados para a frase <b>{{ $store.getters.getActualPhrase.Frase }}</b>:
        </template>
        <template v-else>
          Nomes recomendados para <b>{{ name }}</b>:
        </template>
      </h1>

      <ul  class="is-compact"  style="list-style: none; padding: 0; margin: 0;">
        <li v-for="(name,index) in recommendedNames" :key="index" style="margin-bottom: -20px !important;">
          <MySearchNameResult :name="name" :indice="index" @click.native="handleNameClick(name)"/>
        </li>
      </ul>
      <PhrasesNotification class="pn" @refresh-phrases="refreshPopup"/>
    </div>
    <footer class="myfooter">
  <div class="content has-text-centered">
    <p>
      <strong>Hera</strong> by <a href="https://github.com/laraesquivel/babynames">Lara Esquivel, Nathielle C. Alves and João B. Rocha-Junior</a>. The source code is licensed
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
