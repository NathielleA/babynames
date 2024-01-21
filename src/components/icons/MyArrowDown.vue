
<template>
<button class="button is-rounded is-outlined">
        <span class="icon">
        <svg-icon type="mdi" :path="path"></svg-icon>
        </span>
  </button>
</template>
import { getName } from 'ionicons/dist/types/components/icon/utils';
  
  <script>
  import SvgIcon from '@jamescoyle/vue-icon';
  import { mdiArrowDownDropCircleOutline } from '@mdi/js';
  
  export default {
    name: "my-component",
    components: {
      SvgIcon
    },
    mmethods : {
        async getName(){
            
        }
    },
    data() {
      return {
         path: mdiArrowDownDropCircleOutline,
      }
    }
  }
  </script>
  