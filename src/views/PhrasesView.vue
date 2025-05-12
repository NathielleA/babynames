<script>
import MyTopSearchBar from '@/components/searchs/MyTopSearchBar.vue';
import NavBar from '@/components/home/NavBar.vue';
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
          'getSimiliarNames',
          'getRecommededNames',
          'getLat',
          'getLon',
          'getID',
          'getPhrase' 
        ]),
        name() {
            return this.getName;
        },
        similiarNames() {
            return this.getSimiliarNames;
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
        phrases() {
            return this.$store.getters.getPhrase;
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

        async searchRecommendedNames() {
            this.getNewNames();
        },

        generateUserID() {
            return Math.random().toString(36).substring(2, 15) +
                   Math.random().toString(36).substring(2, 15);
        },
    },
    created() {
        this.$store.commit('setPage', 1);
        this.getNewNames();
        const phrase = this.$route.query.phrase;
        console.log('Frase recebida:', phrase);

        const phraseQuery = this.$route.query.phrase;
        console.log('Frase recebida via URL:', phraseQuery);

    },
    components: {
        NavBar,
        MyTopSearchBar,
        PhrasesNotification
    }
};
</script>

<template>
    <div>
      <NavBar class="is-hidden-mobile"/>
      <div v-if="phrases && phrases.associedNames">
        <h2>Recomendações para a frase: <b>{{ phrases.Frase }}</b></h2>
        <ul style="list-style: none; padding: 0;">
            <li 
            v-for="(name, nameIndex) in phrases.associedNames" 
            :key="nameIndex"
            style="margin-bottom: 5px;"
            >
            {{ name }}
            </li>
        </ul>
        </div>
  
        <PhrasesNotification class="pn"/>
      </div>
  
      <footer class="myfooter">
        <div class="content has-text-centered">
          <p>
            <strong>Hera</strong> by 
            <a href="https://github.com/laraesquivel/babynames">Lara Esquivel, Nathielle C. Alves and João B. Rocha-Junior</a>.
            The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">Open Source</a>.
            The website is project from 
            <a href="https://sites.google.com/uefs.br/adam/home">ADAM UEFS</a>.
          </p>
        </div>
      </footer>
    </div>
  </template>
  