<!-- Button.vue -->
<template>
    <span  class="icon is-small">
        <span class="icon is-small">
            <i class="fas">  <svg @click="toggleIcon" xmlns="http://www.w3.org/2000/svg"  v-if="!this.iconChanged" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
            <svg  @click="toggleIcon2" xmlns="http://www.w3.org/2000/svg" v-else height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
        </i>
        </span>

    </span>
  </template>
  
  <script>

  export default {
    data() {
      return {
        iconChanged: false
      };
    },
    methods: {
      toggleIcon() {
        this.iconChanged = !this.iconChanged;
        this.$emit('icon-changed', this.iconChanged);
      },
      toggleIcon2(){
        this.iconChanged = !this.iconChanged;
        this.$emit('icon-change2')
      }
    }
  };
  </script>
  