<template>
  <div 
    class="phrases-notification" 
    @mousedown="startDrag" 
    @mouseup="stopDrag" 
    @mouseleave="stopDrag"
    v-if="isVisible"
    :style="draggingStyle"
  >
    <article class="message is-info">    
      <div class="message-header">  
        Olá, eu sou Hera.  
        <button @click="close" class="delete" aria-label="delete"></button>
      </div>
      <div class="message-body">
        <p><strong>Token do Usuário:</strong> {{ token }}</p>
        <p><strong>ID do Usuário:</strong> {{ objectId }}</p>
        <p><strong>Latitude:</strong> {{ latitude }}</p>
        <p><strong>Longitude:</strong> {{ longitude }}</p>
        <p><strong>Assinatura:</strong> {{ assignature }}</p>
        <p><strong>Frase: </strong> 
          <template v-if="phrase && phrase.Frase">
            <a @click="goToPhraseRecommendations" style="cursor: pointer; text-decoration: underline;">
              {{ phrase.Frase }}
            </a>
          </template>
          <template v-else>
            Nenhuma frase associada ainda.
          </template>
        </p>
      </div>
    </article>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import newNames from '@/services/names'; // serviço já usado no store para pegar nomes

export default {
  data() {
    return {
      isDragging: false,
      top: null,
      left: null,
      offsetX: 0,
      offsetY: 0,
      isVisible: true
    };
  },
  computed: {
    ...mapGetters([
      'getActualPhrase',
      'userToken',
      'userObjectId',
      'getLat',
      'getLon',
      'getUserAssignature'
    ]),
    draggingStyle() {
      if (this.top !== null && this.left !== null) {
        return { top: this.top + 'px', left: this.left + 'px', position: 'fixed' };
      }
      return { bottom: '20px', right: '20px', position: 'fixed' };
    },
    phrase() {
      return this.getActualPhrase;
    },
    token() {
      return this.userToken;
    },
    objectId() {
      return this.userObjectId;
    },
    latitude() {
      return this.getLat;
    },
    longitude() {
      return this.getLon;
    },
    assignature() {
      return this.getUserAssignature;
    },
  },
  methods: {
    async goToPhraseRecommendations() {
      if (!this.phrase || !this.phrase.associedNames) return;

      // Buscar detalhes dos nomes recomendados pela frase
      const namesDetails = [];
      for (const n of this.phrase.associedNames) {
        if (n != null){
          try {
            const response = await newNames.getNames(n);
            namesDetails.push(response.data); // formato igual ao da pesquisa por nome
          } catch (err) {
            console.error(`Erro ao buscar detalhes para o nome ${n}:`, err);
          }
        } else {
          console.warn("Nome nulo encontrado na frase, pulando...");
        }
      }

      // Atualiza o estado Vuex
      this.$store.commit('setRecommendedNames', namesDetails);
      this.$store.commit('setPhrase', this.phrase);
      this.$store.commit('setIsPhraseSearch', true);
    },

    refreshData() {
      this.$store.dispatch('fetchUserAssignature');
      this.$store.dispatch('getPhrases');
    },

    startDrag(event) {
      if (this.top === null || this.left === null) {
        const rect = event.currentTarget.getBoundingClientRect();
        this.top = rect.top;
        this.left = rect.left;
      }
      this.isDragging = true;
      this.offsetX = event.clientX - this.left;
      this.offsetY = event.clientY - this.top;
      window.addEventListener('mousemove', this.onDrag);
    },
    onDrag(event) {
      if (this.isDragging) {
        this.left = Math.min(Math.max(event.clientX - this.offsetX, 0), window.innerWidth - 200);
        this.top = Math.min(Math.max(event.clientY - this.offsetY, 0), window.innerHeight - 100);
      }
    },
    stopDrag() {
      this.isDragging = false;
      window.removeEventListener('mousemove', this.onDrag);
    },
    close() {
      this.isVisible = false;
    },
    handleResize() {
      const outOfBounds =
        this.left + 100 > window.innerWidth ||
        this.top + 100 > window.innerHeight ||
        this.left < -100 ||
        this.top < -100;
      if (outOfBounds) {
        this.top = null;
        this.left = null;
      }
    }
  },
  created() {
    this.refreshData();
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>

<style scoped>
.phrases-notification {
  z-index: 1000;
  background-color: transparent;
  padding: 10px;
  cursor: move;
  user-select: none;
  width: 300px;
  max-width: 90vw;
  overflow: hidden;
}
</style>
