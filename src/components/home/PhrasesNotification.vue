<template>
  <div 
    class="phrases-notification" 
    @mousedown="startDrag" 
    @mouseup="stopDrag" 
    @mouseleave="stopDrag"
    v-if="this.isVisible"
    :style="{ top: top + 'px', left: left + 'px' }">
    <!-- Conteúdo do componente -->
     <article class="message is-info">    
      <div class="message-header">  Olá, eu sou Hera.  <button @click="close" class="delete" aria-label="delete"></button>
      </div>
      <div class="message-body"><a @click="callstate" style="text-decoration: none;">{{ phrase.frase }}</a>
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
      top: window.innerHeight - 250, // Inicialmente na parte inferior
      left: window.innerWidth - 350, // Inicialmente na parte direita
      offsetX: 0,
      offsetY: 0,
      isVisible : true
    };
  },
  computed:{
    ...mapGetters(['getActualPhrase']),
    phrase(){
      return this.getActualPhrase;
    }
  },
  methods: {
    startDrag(event) {
      this.isDragging = true;
      this.offsetX = event.clientX - this.left;
      this.offsetY = event.clientY - this.top;
      window.addEventListener('mousemove', this.onDrag);
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

    }
  }
};
</script>

<style scoped>
.phrases-notification {
  position: fixed;
  z-index: 1000;
  background-color: transparent; /* Torna o fundo transparente */
  padding: 10px;
  border-radius: 0; /* Remove o arredondamento das bordas */
  box-shadow: none; /* Remove a sombra da caixa */
  cursor: move;
  user-select: none;
  width: 300px; /* Define uma largura fixa */
  height: 150px; /* Define uma altura fixa */
  overflow: hidden; /* Garante que o conteúdo não extrapole o tamanho da div */
}
</style>
