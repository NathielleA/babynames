<script>
import { mapGetters,mapActions } from 'vuex';

export default {
    data() {
        return {
            querys: '',
        };
    },
    computed : {
      ...mapGetters(['getName']),
      name(){
        return this.getName
      }
    },
    props : ['lat','lon','userId', 'searchRoute'],

    methods: {
        ...mapActions(['setNameQuery']),
        search() {
            console.log('Pesquisar por:', this.querys);

            this.setNameQuery(this.querys);
            this.$store.commit('setIsPhraseSearch', false); // ADDED: Explicitly set to false for new name searches
            const route = this.searchRoute || '/search';
            this.$router.push(route)
        }
    }

};
</script>
<template>
  <div class="search-bar" style="margin-top: 10%;">
    <div class="block">
      <figure class="image is-128x128">
        <img class="is-rounded" src="../../assets/hera2.jpeg" alt="Logo">
      </figure>
    </div>
    <div class="block">
      <p>Hera ajuda você a escolher um nome para o seu bebê!</p>
    </div>
    <div class="block">
      <div class="search-input">
        <input class="input is-medium is-rounded" type="text" v-model="querys" @input="updateQuery" @keypress.enter="search" placeholder="Pesquise um nome">
          <button class="button is-custom-color is-medium is-rounded" @click="search">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/></svg>
            </span>
          </button>
      </div>
        <div class="block">
          <div class="content has-text-centered" style="margin-top: 20%;">
          <p>
            <strong>Hera</strong> by <a href="https://github.com/laraesquivel/babynames">Lara Esquivel, Nathielle C. Alves and João B. Rocha-Junior</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">Open Source</a>. The website is project from <a href="https://sites.google.com/uefs.br/adam/home">ADAM UEFS</a>.
          </p>
    </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


.search-input {
  display: flex;
  align-items: center;
  justify-content: center; /* Added to horizontally center */
}

/* Added margin-right to create space between the button and the search bar */
.input {
  margin-right: 8px; /* You can adjust the value as needed */
}


/* Additional style for the icon image, if necessary */
.icon {
  width: 24px;
  height: 24px;
}

.is-custom-color {
  background-color: #b43e61
; /* Replace with desired color */
  color: #fff; /* Text color on the button */
  /* Add any additional desired styles */
}

/* Additional style for button color on hover */
.is-custom-color:hover {
  background-color: #420024; /* Replace with desired color on hover */
}
</style>