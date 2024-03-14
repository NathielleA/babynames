import { createStore } from 'vuex'
import names from '@/services/names'

export default createStore({
  state: {
    name : null,
    similiarNames : [],
    recommendedNames : []
  },
  getters: {
    getName : state => state.name,
    getSimiliarNames : state => state.similiarNames,
    getRecommededNames : state => state.recommendedNames

  },
  mutations: {
    setName(state, name){
      state.name = name;
    },
    setSimiliarNames(state,similiarNames){
      state.similiarNames = similiarNames;
    },
    setRecommendedNames(state, recommendedNames){
      console.log(recommendedNames);
      state.recommendedNames = recommendedNames;

    }
  },
  actions: {
    async getNewNames({commit},name){
      console.log('getasyncNames called');
      try {
          //let n = this.$route.params.name;
          let response = await names.getNames(name);
          //console.log(response.data.data.similiarNames)
          let n = response.data.data.name;
          let similiarNames = response.data.data.similiarNames;
          let recommendedNames = response.data.data.recommendedNames;

          commit('setName',n);
          commit('setSimiliarNames',similiarNames);
          commit('setRecommendedNames',recommendedNames);
      }
      catch (error) {
          console.error('Error fetching names:', error);
      }
    },

    async postActions(){

    }

  },
  modules: {
  }
})
