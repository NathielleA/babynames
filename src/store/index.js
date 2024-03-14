import { createStore } from 'vuex'
import names from '@/services/names'

export default createStore({
  state: {
    name : null,
    similiarNames : [],
    recommendedNames : [],
    lat : null,
    lon : null,
  },
  getters: {
    getName : state => state.name,
    getSimiliarNames : state => state.similiarNames,
    getRecommededNames : state => state.recommendedNames,
    getLat : state => state.lat,
    getLon : state => state.lon,

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

          commit('setName',n);
          commit('setSimiliarNames',similiarNames);
          commit('setRecommendedNames',recommendedNames);
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
