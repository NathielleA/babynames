import { createStore } from 'vuex'
import names from '@/services/names'
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    name : null,
    id :  null,
    similiarNames : [],
    recommendedNames : [],
    lat : null,
    lon : null,
    origin : null,
    meaning : null,
    mainResultID : null,
  },
  plugins : [createPersistedState()],
  getters: {
    getName : state => state.name,
    getSimiliarNames : state => state.similiarNames,
    getRecommededNames : state => state.recommendedNames,
    getLat : state => state.lat,
    getLon : state => state.lon,
    getOrigin : state => state.origin,
    getMeaning : state => state.meaning,
    getID : state => state.id,
    getMainResultID : state => state.id
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
    },
    setID(state,id){
      state.id = id;
    },
    setMainResultID(state, mainResultID){
        state.mainResultID = mainResultID;
    }
  },
  actions: {

    setNameQuery2({commit}, name){
      commit('setName',name);
    },

    async setNameQuery({commit},name){
      commit('setName',name);
    },
    async getNewNames({commit}){
      console.log('getasyncNames called');
      try {
          //let n = this.$route.params.name;
          let response = await names.getNames(this.state.name);
          console.log(response.data[0].name)
          
          let n = response.data[0].name;
          let associedDetails = response.data[0].associedDetails;
          let similiarNames = response.data[0].similiarNames;
          //let recommendedNames = response.data[0].recommendedNames;
          let origin = response.data[0].origin;
          let meaning = response.data[0].meaning;
          let id = response.data.id;

          commit('setName',n);
          commit('setSimiliarNames',similiarNames);
          commit('setRecommendedNames',associedDetails);
          commit('setOrigin', origin);
          commit('setMeaning', meaning)
          commit('setID',id)
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
