<script>
import SearchBar from '../components/home/SearchBar.vue';
import NavBar from '../components/home/NavBar.vue';
import users from '@/services/users.js';

export default {
  components: { SearchBar, NavBar },
  data(){
    return{
      lat : null,
      lon : null,
      userId : null
    }
  },
  created() {
    this.checkUserID();
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lon = position.coords.longitude;
            console.log(this.lat + this.lon)
          },
          (error) => {
            console.error("Erro ao obter localização:", error.message);
          }
        );
      } else {
        console.error("Geolocalização não é suportada neste navegador.");
      }
    
  },
  methods: {
    checkUserID() {
      const userLocalStorage = localStorage.getItem("userID");

      if (userLocalStorage === null) {
        const newUserID = this.generateUserID();
        localStorage.setItem("userID", newUserID);
        console.log("Novo usuário criado! ID: " + newUserID);
        this.saveUserIDOnServer(newUserID);
        this.userId = userLocalStorage;
      } else {
        console.log("Usuário reconhecido! ID: " + userLocalStorage);
        this.userId = userLocalStorage;
      }
    },

    async saveUserIDOnServer(userID) {
      try {
        let response = await users.setUserId(userID);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },

    generateUserID() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    },
  },
};
</script>

<template>
  <div>
    <NavBar/>
    <div class="container is-fluid" style="overflow: hidden; position: fixed;">
      <div class="column is-offset-1 is-10 is-offset-1" style="min-height: 100vh;">
        <SearchBar :lat="this.lat" :lon="this.lon" :user-id="this.userId"/>
      </div>
    </div>
    <RouterView/>
  </div>
</template>

<style scoped>
body, html {
  overflow: hidden;
}

.logo {
  width: 80px;
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}
#container {
  margin-right: 0;
  margin-left: 0;
}
</style>
