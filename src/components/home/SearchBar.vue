<script>
import action from '@/services/action';

export default {
    data() {
        return {
            querys: '',
        };
    },
    props : ['lat','lon','userId'],
    methods: {
        updateQuery() {
            // Pode adicionar lógica adicional aqui, se necessário
        },
        search() {
            // Adicione a lógica de pesquisa aqui (pode redirecionar para uma página de resultados, etc.)
            console.log('Pesquisar por:', this.querys);
            this.$router.push(`/search/${this.querys}`)
        },
        async postAction(){
          try{
              let response = await action.postAction(this.querys,2,this.userId,this.lat,this.lon,1)
              console.log(response)
          }catch(e){
            console.log(e)
          }
        }
    },
    beforeUnmount(){
      this.postAction()
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
            <strong>Hera</strong> by <a href="https://jgthms.com">Lara Esquivel and João B. Rocha-Junior</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">Open Source</a>. The website is project from <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">ADAM UEFS</a>.
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
  justify-content: center; /* Adicionado para centralizar horizontalmente */
}

/* Adicionado margin-right para criar espaço entre o botão e a barra de pesquisa */
.input {
  margin-right: 8px; /* Você pode ajustar o valor conforme necessário */
}


/* Estilo adicional para a imagem do ícone, se necessário */
.icon {
  width: 24px;
  height: 24px;
}

.is-custom-color {
  background-color: #b43e61
; /* Substitua pela cor desejada */
  color: #fff; /* Cor do texto no botão */
  /* Adicione qualquer estilo adicional desejado */
}

/* Estilo adicional para a cor do botão ao passar o mouse */
.is-custom-color:hover {
  background-color: #420024; /* Substitua pela cor desejada ao passar o mouse */
}
</style>
