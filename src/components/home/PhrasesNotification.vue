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
        <p><strong>Frase: </strong> 
          <template v-if="phrase && phrase.Frase">
            <a @click="toggleNames" style="cursor: pointer; text-decoration: underline;">
              {{ phrase.Frase }}
            </a>
          </template>
          <template v-else>
            Nenhuma frase associada ainda.
          </template>
        </p>

        <!-- Lista animada dos nomes recomendados -->
        <transition-group name="chat" tag="div" class="chat-container" v-if="showNames">
          <div 
            v-for="(name, index) in phrase.associedNames"
            :key="name"
            class="chat-bubble"
            @click="searchName(name)">
            {{ name }}
          </div>
        </transition-group>
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
      isVisible : true,
      showNames: false // controla se os nomes estão visíveis
    };
  },
  computed: {
    ...mapGetters(['getActualPhrase']),
    
    draggingStyle() {
      if (this.top !== null && this.left !== null) {
        return { top: this.top + 'px', left: this.left + 'px', position: 'fixed' };
      }
      return { bottom: '20px', right: '20px', position: 'fixed' };
    },

    phrase() { return this.getActualPhrase; },
  },

  methods: {
    ...mapActions(['setNameQuery', 'getNewNames']),

    toggleNames() {
      this.showNames = !this.showNames;
    },

    searchName(name) {
      this.setNameQuery(name);
      this.getNewNames();
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

.chat-container {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 8px;
}

/* bolhas de chat */
.chat-bubble {
  align-self: flex-start;
  background-color: #f5faff;
  border: 1px solid #3273dc;
  border-radius: 12px;
  padding: 6px 10px;
  max-width: 80%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-bubble:hover {
  background-color: #e1ecf9;
}

/* animação */
.chat-enter-active, .chat-leave-active {
  transition: all 0.3s ease;
}
.chat-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
