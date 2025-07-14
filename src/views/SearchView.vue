<script>
import MyTopSearchBar from '@/components/searchs/MyTopSearchBar.vue';
import NavBar from '@/components/home/NavBar.vue';
import MySearchNameResult from '@/components/searchs/MySearchNameResult.vue'
// import MySearchMainResult from '@/components/searchs/MySearchMainResult.vue'
import PhrasesNotification from '@/components/home/PhrasesNotification.vue';

//import names from '../services/names'
import users from '@/services/users';
import { mapGetters,mapActions } from 'vuex';
import phrases from '@/services/phrases';
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
      ...mapGetters(['getName','getSimiliarNames','getRecommededNames', 'getLat','getLon','getID', 'getActualPhrase']),
      name(){
        return this.getName;
      },
      phrases(){
        return this.getActualPhrase;
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
            const response = await fetch(`https://adam-serveless-babynames.vercel.app/update_user_assignature?userId=${userId}`);
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
            const response = await fetch(`https://adam-serveless-babynames.vercel.app/update_user_phrases?userId=${userId}`);
            const data = await response.json();
            console.log("Frases atualizadas:", data);
            } catch (error) {
            console.error("Erro ao atualizar frases:", error);
            }
        },

    async searchRecommendedNames(){
      this.getNewNames();
    },

    generateUserID() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },

    clearNameResults() {
      // Limpa os resultados de nome quando uma frase é selecionada
      this.$store.commit('setName', null);
      this.$store.commit('setRecommendedNames', []);
    },

    testPhraseSearch() {
      // Método de teste para verificar se a busca por frases está funcionando
      console.log('Testando busca por frases...');
      console.log('Frase atual:', this.phrases);
      if (this.phrases) {
        this.$store.dispatch('searchByPhrase', this.phrases);
      }
    },

    },
    created() {
      
      this.$store.commit('setPage',1);

      this.getNewNames()

      // Garante que o usuário seja carregado primeiro
      this.$store.dispatch('getUser').then(() => {
        // Depois carrega as frases do usuário
        this.$store.dispatch('getPhrases');
      });

      // Atualiza assinatura e frases sempre que carregar a página
      this.updateUserAssignature();
      this.updateUserPhrases();
    },
    mounted(){
      //this.postSearchAction();
    },
    watch: {
      phrases(newPhrase) {
        console.log('Frase atualizada:', newPhrase);
        // Quando a frase mudar, força a atualização da interface
        this.$forceUpdate();
      },
    },
  
    components: { NavBar, MyTopSearchBar, MySearchNameResult,  PhrasesNotification}
};
</script>

<template>
  <div>
    <NavBar class="is-hidden-mobile"/>
    <div class="container is-fluid" style="overflow: hidden;">
      <MyTopSearchBar @search="getNewNames" style="margin-bottom: 10px;"/>

      <!-- Botão de teste para debug -->
      <button @click="testPhraseSearch" class="button is-small is-info" style="margin-bottom: 10px;">
        Testar Busca por Frase
      </button>

      <!-- Informações de debug -->
      <div v-if="phrases" style="margin-bottom: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
        <h3>Debug - Frase Atual:</h3>
        <pre>{{ JSON.stringify(phrases, null, 2) }}</pre>
      </div>

      <!-- Recomendados por nome pesquisado -->
      <div v-if="name && recommendedNames && recommendedNames.length > 0">
        <h1> Nomes recomendados para <b>{{ name }}</b>:</h1>
        <ul class="is-compact" style="list-style: none; padding: 0; margin: 0;">
          <li v-for="(name, index) in recommendedNames" :key="index" style="margin-bottom: -20px !important;">
            <MySearchNameResult :name="name" :indice="index" />
          </li>
        </ul>
      </div>

      <!-- Recomendados pela frase selecionada -->
      <div v-if="phrases && phrases.Frase" style="margin-top: 30px;">
        <h2>Recomendações para a frase: <b>"{{ phrases.Frase }}"</b></h2>
        <div v-if="phrases.associedNames && phrases.associedNames.length > 0">
          <ul style="list-style: none; padding: 0;">
            <li v-for="(name, index) in phrases.associedNames" :key="'phrase-' + index" style="margin-bottom: -20px !important;">
              <MySearchNameResult :name="name" :indice="index" />
            </li>
          </ul>
        </div>
        <div v-else>
          <p style="color: #666; font-style: italic;">Nenhum nome encontrado para esta frase ainda.</p>
        </div>
      </div>

      <PhrasesNotification class="pn"/>
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
