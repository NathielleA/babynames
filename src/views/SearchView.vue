<script>
import MyTopSearchBar from '@/components/searchs/MyTopSearchBar.vue';
import NavBar from '@/components/home/NavBar.vue';
import MySearchNameResult from '@/components/searchs/MySearchNameResult.vue'
import MySearchMainResult from '@/components/searchs/MySearchMainResult.vue'
import names from '../services/names'

export default {
    data() {
        return {
            responseData: null,
        };
    },
    methods: {
        async getasyncNames() {
            console.log('getasyncNames called');
            try {
                let response = await names.getNames(this.$route.params.name);
                this.responseData = response.data;
                console.log(this.responseData)
            }
            catch (error) {
                console.error('Error fetching names:', error);
            }
        },
    },
    created() {
        console.log(this.$route.params.name);
        this.getasyncNames();
    },
    components: { NavBar, MyTopSearchBar, MySearchNameResult, MySearchMainResult}
};
</script>

<template>
  <div>
    <NavBar class="is-hidden-mobile"/>
    <div class="container is-fluid" style="overflow: hidden;">
      <MyTopSearchBar style="margin-bottom: 10px;"/>
      <MySearchMainResult :name="responseData.name" :closersNames="responseData.closersNames" style="margin-top: 10px; margin-bottom: 10px;"/>
      <ul style="list-style: none; padding: 0;">
        <li v-for="name in responseData.recommendedNames" :key="name" style="margin-bottom: 10px;">
          <MySearchNameResult :name="name"  :alternativeName="responseData.alternativeNames"/>
        </li>
      </ul>
    </div>
  </div>
</template>



