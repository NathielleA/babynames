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
            fraseAtual: null,
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
    
    watch: {
        '$route'(to, from) {
            // Atualiza os dados quando a rota mudar
            const phraseQuery = to.query.phrase;
            if (phraseQuery) {
                try {
                    const parsedPhrase = JSON.parse(decodeURIComponent(phraseQuery));
                    this.fraseAtual = parsedPhrase;
                    this.$store.commit('setPhrase', parsedPhrase);
                    console.log("Frase atualizada via watch:", this.fraseAtual);
                    this.debugFraseAtual();
                } catch (e) {
                    console.error("Erro ao decodificar a frase no watch:", e);
                }
            }
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

        // Método para debug
        debugFraseAtual() {
            console.log("=== DEBUG FRASE ATUAL ===");
            console.log("fraseAtual:", this.fraseAtual);
            console.log("Query da rota:", this.$route.query.phrase);
            console.log("Tem associedNames?", this.fraseAtual?.associedNames);
            console.log("Quantidade de nomes:", this.fraseAtual?.associedNames?.length);
            
            // Verifica outras propriedades possíveis
            if (this.fraseAtual) {
                console.log("Todas as propriedades da frase:", Object.keys(this.fraseAtual));
            }
        },

        // Método para obter nomes associados de forma mais robusta
        getAssociatedNames() {
            if (!this.fraseAtual) return [];
            
            // Verifica diferentes possibilidades de estrutura
            return this.fraseAtual.associedNames || 
                   this.fraseAtual.associatedNames || 
                   this.fraseAtual.names || 
                   this.fraseAtual.nomes || 
                   [];
        }
    },
    created() {
        this.$store.commit('setPage', 1);
        
        // Processa a frase da query string
        const phraseQuery = this.$route.query.phrase;
        console.log('Frase recebida:', phraseQuery);

        if (phraseQuery) {
            try {
                const parsedPhrase = JSON.parse(decodeURIComponent(phraseQuery));
                this.fraseAtual = parsedPhrase;
                this.$store.commit('setPhrase', parsedPhrase);
                console.log("Frase atual:", this.fraseAtual);
                
                // Chama o método de debug
                this.debugFraseAtual();
            } catch (e) {
                console.error("Erro ao decodificar a frase:", e);
            }
        }

        // Só busca novos nomes se não tiver uma frase específica
        if (!this.fraseAtual) {
            this.getNewNames();
        }

        // Atualiza assinatura e frases sempre que carregar a página
        // this.updateUserAssignature();
        // this.updateUserPhrases();
    },
    components: {
        NavBar,
        MyTopSearchBar,
        MySearchNameResult,
        PhrasesNotification
    }
};
</script>

<template>
    <div>
      <NavBar class="is-hidden-mobile"/>
      <div class="container is-fluid" style="overflow: hidden;">
        <MyTopSearchBar @search="getNewNames" style="margin-bottom: 10px;" />
        
        <!-- Botão para debug (remover depois) -->
        <button @click="debugFraseAtual" class="button is-small is-info" style="margin-bottom: 10px;">
            Debug Frase Atual
        </button>
        
        <h2>Recomendações para a frase: <b>{{ fraseAtual?.Frase || 'Carregando...' }}</b></h2>

        <div v-if="fraseAtual && getAssociatedNames().length > 0">
            <ul class="is-compact" style="list-style: none; padding: 0; margin: 0;">
                <li v-for="(name,index) in getAssociatedNames()" :key="index" style="margin-bottom: -20px !important;">
                    <MySearchNameResult :name="name" :indice="index"/>
                </li>
            </ul>
        </div>
        
        <div v-else-if="fraseAtual && getAssociatedNames().length === 0">
            <p>Nenhum nome associado encontrado para esta frase.</p>
        </div>
        
        <div v-else>
            <p>Carregando recomendações...</p>
        </div>

        <!-- </div> -->
  
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
  