<template>
  <div 
    class="phrases-notification" 
    @mousedown="startDrag" 
    @mouseup="stopDrag" 
    @mouseleave="stopDrag"
    v-if="this.isVisible"
    :style="draggingStyle">
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

        <!-- Lista dos nomes recomendados -->
        <div v-if="phrase && phrase.NomesRecomendados && phrase.NomesRecomendados.length > 0" class="names-container">
          <div class="column">
            <div 
              v-for="(name, index) in firstColumn" 
              :key="'left-' + index"
              class="name-item"
              @click="searchName(name)">
              {{ name }}
            </div>
          </div>
          <div class="column">
            <div 
              v-for="(name, index) in secondColumn" 
              :key="'right-' + index"
              class="name-item"
              @click="searchName(name)">
              {{ name }}
            </div>
          </div>
        </div>
      </div>
     </article>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      isDragging: false,
      top: null,
      left: null,
      offsetX: 0,
      offsetY: 0,
      isVisible : true
    };
  },
  computed: {
    ...mapGetters(['getActualPhrase', 'userToken', 'userObjectId', 'getLat', 'getLon', 'getUserAssignature']),
    
    draggingStyle() {
      if (this.top !== null && this.left !== null) {
        return { top: this.top + 'px', left: this.left + 'px', position: 'fixed' };
      }
      return { bottom: '20px', right: '20px', position: 'fixed' };
    },

    phrase() { return this.getActualPhrase; },
    token() { return this.userToken; },
    objectId() { return this.userObjectId; },
    latitude() { return this.getLat; },
    longitude() { return this.getLon; },
    assignature() { return this.getUserAssignature; },

    firstColumn() {
      return this.phrase?.NomesRecomendados?.slice(0, 5) || [];
    },
    secondColumn() {
      return this.phrase?.NomesRecomendados?.slice(5, 10) || [];
    }
  },

  methods: {
    ...mapActions(['setNameQuery', 'getNewNames']),

    goToPhraseRecommendations() {
      if (this.phrase && this.phrase.Frase) {
        const encodedPhrase = encodeURIComponent(JSON.stringify(this.phrase));
        this.$router.push({ name: 'RecommendationPage', query: { phrase: encodedPhrase } });
      }
    },

    searchName(name) {
      this.setNameQuery(name);
      this.getNewNames();
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
    close() { this.isVisible = false; },

    handleResize() {
      const outOfBounds = this.left + 100 > window.innerWidth || this.top + 100 > window.innerHeight || this.left < -100 || this.top < -100;
      if (outOfBounds) { this.top = null; this.left = null; }
    },
  },

  created() {
    this.$store.dispatch('fetchUserAssignature');
    this.$store.dispatch('getPhrases');
    this.refreshData();
  },

  mounted() { window.addEventListener('resize', this.handleResize); },
  beforeUnmount() { window.removeEventListener('resize', this.handleResize); },
};
</script>

<style scoped>
.phrases-notification {
  z-index: 1000;
  background-color: transparent;
  padding: 10px;
  cursor: move;
  user-select: none;
  width: 350px;
  max-width: 90vw;
  overflow: hidden;
}

.names-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.column {
  width: 48%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name-item {
  padding: 4px 6px;
  border: 1px solid #3273dc;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  background-color: #f5faff;
  transition: background-color 0.2s;
}

.name-item:hover {
  background-color: #e1ecf9;
}
</style>

