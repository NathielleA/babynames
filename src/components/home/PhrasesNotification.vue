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
        <p><strong>
          <template v-if="phrase && phrase.Frase">
            <a @click="goToPhraseRecommendations" style="cursor: pointer; text-decoration: underline;">
              {{ phrase.Frase }}
            </a>
          </template>
          <template v-else>
            Nenhuma frase associada ainda.
          </template>
          </strong> 
        </p>
      </div>

      <!-- Overlay de carregamento -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <span>Carregando nomes...</span>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import newNames from '@/services/names';

export default {
  data() {
    return {
      isDragging: false,
      top: null,
      left: null,
      offsetX: 0,
      offsetY: 0,
      isVisible: true,
      loading: false
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
      this.loading = true;

      try {
        // trava a frase e marca busca por frase
        this.$store.commit('setClickedPhrase', this.phrase);
        this.$store.commit('setPhrase', this.phrase);
        this.$store.commit('setIsPhraseSearch', true);

        // busca nomes associados via action (comita setRecommendedNames)
        await this.$store.dispatch('fetchNamesFromPhrase', this.phrase.associedNames.filter(n => n != null));
      } catch (err) {
        console.error("Erro ao buscar detalhes dos nomes:", err);
      } finally {
        this.loading = false;
        if (this.$router.currentRoute.path !== '/search') {
          this.$router.push({ path: '/search' });
        }
      }
    },
    refreshData() {
      this.$store.dispatch('fetchUserAssignature');
      //this.$store.dispatch('getPhrases');
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
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 2000;
}

.loading-content {
  text-align: center;
  color: #3273dc;
  font-weight: bold;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3273dc;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
