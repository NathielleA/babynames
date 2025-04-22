import { createStore } from 'vuex'
import newNames from '@/services/names'
import action from '@/services/action';
import createPersistedState from 'vuex-persistedstate';
import users from '@/services/users';

export default createStore({
  state: {
    name : null,
    before_name : null,
    id :  null,
    // similiarNames : [],
    recommendedNames : [],
    lat : null,
    lon : null,
    origin : null,
    meaning : null,
    mainResultID : null,
    action_identifier : null,
    userToken : null,
    userObjectId : null,
    userAssignature: null, // Adiciona o estado para a assinatura do usuário
    page : 0,
    relationalNameID : null,
    relationalName : null,
    clickedName : 0,
    actualPhrase : null,
    otherPhrases : null

  },
  plugins : [createPersistedState()],

  getters: {
    getName : state => state.name,
    // getSimiliarNames : state => state.similiarNames,
    getRecommededNames : state => state.recommendedNames,
    getLat : state => state.lat,
    getLon : state => state.lon,
    getOrigin : state => state.origin,
    getMeaning : state => state.meaning,
    getID : state => state.id,
    getMainResultID : state => state.id,
    action_identifier : state => state.action_identifier,
    userToken : state => state.userToken,
    userObjectId : state => state.userObjectId,
    getUserAssignature: state => state.userAssignature, // Getter para a assinatura do usuário
    getPage : state => state.page,
    getRelationaName : state => state.relationalName,
    getRelationalNameID : state => state.relationalNameID,
    getActualPhrase : state => state.actualPhrase,
    getOtherPhrases : state =>state.otherPhrases
  },
  mutations: {
    setName(state, name){
      state.name = name;
    },
    // setSimiliarNames(state,similiarNames){
    //   state.similiarNames = similiarNames;
    // },
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
    },

    setActionIdentifier(state, action_identifier){
      state.action_identifier = action_identifier;
    },
    setUserToken(state, userToken){
      state.userToken = userToken;
    },
    setUserTokenID(state, userObjectId){
      state.userObjectId = userObjectId;
    },
    setUserAssignature(state, assignature) {
      state.userAssignature = assignature; // Atualiza o estado com a assinatura
    },
    setPage(state, page) {
      state.page = page;
    },
    setRelationalName (state, relationalName){
      state.relationalName = relationalName;
    },
    setRelationalNameID(state, relationalNameID){
      state.relationalNameID = relationalNameID;
    },
    setClickedName(state,clickedName){
      state.clickedName = clickedName
    },
    setBeforeName(state, before_name){
      state.before_name = before_name;
    },
    setPhrase(state, phrase){
      state.actualPhrase = phrase;
    },
    setOtherPhrase(state, others){
      state.otherPhrases = others;
    }

  },
  actions: {

    setNameQuery2({commit}, name){
      commit('setName',name);
    },

    async setNameQuery({commit},name){
      commit('setName',name);
    },
    async getNewNames({dispatch}){
     // await dispatch('updateRelationalName');
      await dispatch('updateNames');
      await dispatch('postNewAction');

    },

    async updateNames({commit}){
      console.log('getasyncNames called');
      try {
          //let n = this.$route.params.name;
          //let response = await names.getNames(this.state.name);
          commit('setRelationalNameID', this.state.id);
          commit('setRelationalName', this.state.before_name);

          let response = await newNames.getNames(this.state.name)
          console.log(response)
          
          let n = response.data.name;
          let associedDetails = response.data.associedDetails;
          //let similiarNames = response.data.similiarNames;
          //let recommendedNames = response.data[0].recommendedNames;
          let origin = response.data.origin;
          let meaning = response.data.meaning;
          let id = response.data.id;

          commit('setName',n);
          commit('setBeforeName',n);
          //commit('setSimiliarNames',similiarNames);
          commit('setRecommendedNames',associedDetails);
          commit('setOrigin', origin);
          commit('setMeaning', meaning)
          commit('setID',id)
         }
      catch (error) {
          console.error('Error fetching names:', error);
      }
    },

    async postNewAction() {

      try{
        let response = await action.postAction(this.state.name,
          this.state.id,this.state.clickedName, this.state.userObjectId,this.state.lat, this.state.lon,
          this.state.page,this.state.relationalNameID, this.state.relationalName
        );
        console.log(response)
      }
      catch(error){
        console.log(error)
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

    async getUser({commit}){

          const userLocalStorage = localStorage.getItem("userID");
          const newUserID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); //Corrigir metodo posteriormennte

          if (userLocalStorage === null) {
            localStorage.setItem("userID", newUserID);
            console.log("Novo usuário criado! ID: " + newUserID);
            commit('setUserToken', newUserID)
          } else {
            console.log("Usuário reconhecido! ID: " + userLocalStorage);
            commit('setUserToken',userLocalStorage);
          
          }
          try {
            let response = await users.setUserId(this.state.userToken);
            console.log(response.data._id);
            commit('setUserTokenID', response.data._id)
          } catch (error) {
            console.log(error);
          }      

    },

    async fetchUserAssignature({ commit, state }) {
      try {
        let response = await users.getUserId(state.userToken); // Faz a requisição ao servidor
        let assignature = response.data.assignature; // Obtém a assinatura do usuário
        console.log("Assinatura do usuário: ", assignature.data.assignature)
        commit('setUserAssignature', assignature); // Atualiza o estado Vuex
      } catch (error) {
        console.error('Erro ao buscar a assinatura do usuário:', error);
      }
    },

    async getPhrases({commit}){
      let userId = this.state.userToken;
      let phrase = this.state.actualPhrase;
      if (!phrase){
      let numeroAleatorio = Math.floor(Math.random() * 10);
      try{
        let response = await users.getUserId(userId);
        console.log("Frase: ", response)
        let frase = response.data.phrases[numeroAleatorio];
        console.log(frase)
        commit('setPhrase', frase);
        commit('setOtherPhrase',response.data.phrases)
      }
      catch(error){
        console.log(error)
      }}
      else{
        console.log('aqui estou')
        let numeroAleatorio = Math.floor(Math.random() * 10);
        console.log(numeroAleatorio);
        let frase = this.state.otherPhrases[numeroAleatorio];
        console.log(frase)
        commit('setPhrase', frase);
      }
      
    }




  },

})
