<script>
import MyTopSearchBar from '@/components/searchs/MyTopSearchBar.vue';
import NavBar from '@/components/home/NavBar.vue';
import MySearchNameResult from '@/components/searchs/MySearchNameResult.vue';
import PhrasesNotification from '@/components/home/PhrasesNotification.vue';
import users from '@/services/users';
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      responseData: null,
      userId: null,
      posix: 0,
    };
  },
  computed: {
    ...mapGetters([
      'getName',
      'getRecommededNames',
      'getLat',
      'getLon',
      'getID',
      'getActualPhrase',
      'getIsPhraseSearch'
    ]),
    name() {
      return this.getName;
    },
    recommendedNames() {
      return this.getRecommededNames;
    },
    lat() {
      return this.getLat;
    },
    lon() {
      return this.getLon;
    },
    ID() {
      return this.getID;
    },
    phrase() {
      return this.getActualPhrase;
    },
    isPhraseSearch() {
      return this.getIsPhraseSearch;
    }
  },
  methods: {
    ...mapActions(['getNewNames', 'getPosix', 'setMainResultID', 'setNameQuery', 'updateUserAssignature', 'updateUserPhrases']),

    async checkUserID() {
      const userLocalStorage = localStorage.getItem("userID");
      if (userLocalStorage === null) {
        const newUserID = this.generateUserID();
        localStorage.setItem("userID", newUserID);
        this.saveUserIDOnServer(newUserID);
        this.userId = newUserID;
      } else {
        this.userId = userLocalStorage;
      }
    },

    async saveUserIDOnServer(userID) {
      try {
        await users.setUserId(userID);
      } catch (error) {
        console.log(error);
      }
    },

    async searchRecommendedNames() {
      // pesquisa normal por nome
      this.$store.commit('setIsPhraseSearch', false);
      this.getNewNames();
    },

    generateUserID() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },

    refreshPopup() {
      this.$store.dispatch('fetchUserAssignature');
      this.$store.dispatch('getPhrases');
    },

    async handleNameClick() {
      await this.$store.dispatch('updateUserAssignature');
      await this.$store.dispatch('updateUserPhrases');
      this.refreshPopup();
    }
  },

  created() {
    this.$store.commit('setPage', 1);
    this.getNewNames(); // busca inicial
  },

  components: { NavBar, MyTopSearchBar, MySearchNameResult, PhrasesNotification }
};
</script>

<template>
  <div>
    <NavBar class="is-hidden-mobile" homeRoute="/interface-a"/>
    <div class="container is-fluid" style="overflow: hidden;">
      <MyTopSearchBar @search="searchRecommendedNames" style="margin-bottom: 10px;"/>
      <h1>
        Nomes recomendados para
        <b>{{ isPhraseSearch ? phrase?.Frase : name }}</b>:
      </h1>
      <ul class="is-compact" style="list-style: none; padding: 0; margin: 0;">
        <li v-for="(name, index) in recommendedNames" :key="index" style="margin-bottom: -20px !important;">
          <MySearchNameResult :name="name" :indice="index" @click.native="handleNameClick()"/>
        </li>
      </ul>
      <PhrasesNotification class="pn" @refresh="refreshPopup"/>
    </div>
    <footer class="myfooter">
      <div class="content has-text-centered">
        <p>
          <strong>Hera</strong> by 
          <a href="https://github.com/laraesquivel/babynames">
            Lara Esquivel, Nathielle C. Alves and João B. Rocha-Junior
          </a>. 
          The source code is licensed
          <a href="http://opensource.org/licenses/mit-license.php">Open Source</a>.
          The website is project from 
          <a href="https://sites.google.com/uefs.br/adam/home">ADAM UEFS</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<style>
.myfooter {
  margin-top: 5%
}
</style>
