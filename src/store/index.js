import { createStore } from 'vuex'
import names from '@/services/names'

export default createStore({
  state: {
    name : null,
    similiarNames : [],
    recommendedNames : [],
    lat : null,
    lon : null,
    origin : null,
    meaning : null
  },
  getters: {
    getName : state => state.name,
    getSimiliarNames : state => state.similiarNames,
    getRecommededNames : state => state.recommendedNames,
    getLat : state => state.lat,
    getLon : state => state.lon,
    getOrigin : state => state.origin,
    getMeaning : state => state.meaning

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

    },
    setLat(state,lat){
      state.lat = lat;
    },
    setLon(state,lon){
      state.lon = lon;
    },
    setOrigin(state, origin){
      state.origin = origin;
    },
    setMeaning(state, meaning){
      state.meaning = meaning;
    }
  },
  actions: {
    async setNameQuery({commit},name){
      commit('setName',name);
    },
    async getNewNames({commit}){
      console.log('getasyncNames called');
      try {
          //let n = this.$route.params.name;
          let response = await names.getNames(this.state.name);
          //console.log(response.data.data.similiarNames)
          let n = response.data.data.name;
          let similiarNames = response.data.data.similiarNames;
          let recommendedNames = response.data.data.recommendedNames;
          let origin = response.data.data.origin;
          let meaning = response.data.data.meaning;

          commit('setName',n);
          commit('setSimiliarNames',similiarNames);
          commit('setRecommendedNames',recommendedNames);
          commit('setOrigin', origin);
          commit('setMeaning', meaning)
      }
      catch (error) {
          console.error('Error fetching names:', error);
      }
    },

    async getPosix({commit}){
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (position) => {
              commit('setLat',position.coords.latitude);
              commit('setLon',position.coords.longitude)
            },
            (error) => {
              console.error("Erro ao obter localização:", error.message);
            }
          );
        } else {
          console.error("Geolocalização não é suportada neste navegador.");
        }
    },


  },
  modules: {
  }
})
