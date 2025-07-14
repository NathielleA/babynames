<template>
  <div 
    class="phrases-notification" 
    @mousedown="startDrag" 
    @mouseup="stopDrag" 
    @mouseleave="stopDrag"
    v-if="this.isVisible"
    :style="draggingStyle">
    <!-- Conteúdo do componente -->
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
            <a @click="goToPhraseRecommendations" style="cursor: pointer; text-decoration: underline; color: #3273dc;" title="Clique para buscar nomes baseados nesta frase">
              {{ phrase.Frase }}
            </a>
          </template>
          <template v-else>
            Nenhuma frase associada ainda.
          </template>
        </p>

        <!-- <a @click="callstate" style="text-decoration: none;">{{ phrase }}</a> -->
      </div>
     </article>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isDragging: false,
      top: null, // Inicialmente na parte inferior
      left: null, // Inicialmente na parte direita
      offsetX: 0,
      offsetY: 0,
      isVisible : true
    };
  },
  computed: {
    ...mapGetters(['getActualPhrase', 'userToken', 'userObjectId', 'getLat', 'getLon', 'getUserAssignature']), // Adicione os getters de latitude e longitude
    
    draggingStyle() {
      if (this.top !== null && this.left !== null) {
        return {
          top: this.top + 'px',
          left: this.left + 'px',
          position: 'fixed'
        };
      }
      // Posição padrão no canto inferior direito
      return {
        bottom: '20px',
        right: '20px',
        position: 'fixed'
      };
    },

    phrase() {
      return this.getActualPhrase;
    },
    token() {
      return this.userToken; // Retorna o token do usuário
    },
    objectId() {
    return this.userObjectId; // Retorna o ID do objeto do usuário
    },
    latitude() {
      return this.getLat; // Retorna a latitude do usuário
    },
    longitude() {
      return this.getLon; // Retorna a longitude do usuário
    },
    assignature() {
    return this.getUserAssignature; // Retorna a assinatura do usuário
    },
  },
  methods: {
    goToPhraseRecommendations() {
      if (this.phrase && this.phrase.Frase) {
        console.log('Clicou na frase:', this.phrase.Frase);
        console.log('Estrutura completa da frase:', this.phrase);
        this.$store.commit('setActualPhrase', this.phrase); // atualiza a frase globalmente
        this.$store.dispatch('searchByPhrase', this.phrase); // busca nomes baseados na frase
      }
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

      // this.isDragging = true;
      // this.offsetX = event.clientX - this.left;
      // this.offsetY = event.clientY - this.top;
      // window.addEventListener('mousemove', this.onDrag);
    },
    onDrag(event) {
      if (this.isDragging) {
        this.left = Math.min(Math.max(event.clientX - this.offsetX, 0), window.innerWidth - 200); // Ajuste para o tamanho da caixa
        this.top = Math.min(Math.max(event.clientY - this.offsetY, 0), window.innerHeight - 100);
      }
    },
    stopDrag() {
      this.isDragging = false;
      window.removeEventListener('mousemove', this.onDrag);
    },
    close() {
      console.log('close')
      this.isVisible = false;
    },
    callstate(){

    },

    


    handleResize() {
      // margem mínima visível

      const outOfBounds =
        this.left + 100 > window.innerWidth || // passou pra direita
        this.top + 100 > window.innerHeight || // passou pra baixo
        this.left < -100 || // muito à esquerda
        this.top < -100;    // muito acima

      if (outOfBounds) {
        // Reseta pra canto inferior direito
        this.top = null;
        this.left = null;
      }
    },
  },

  created() {
      this.$store.dispatch('fetchUserAssignature'); // Busca a assinatura do usuário
      this.$store.dispatch("getPhrases");
    },

  mounted() {
    window.addEventListener('resize', this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
    
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
