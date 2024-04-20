<script>
//import MyArrowDown from "@/components/icons/MyArrowDown.vue";

export default {
  name: 'SeuComponente', // Substitua 'SeuComponente' pelo nome desejado

  props: ['name', 'similiarNames'],

  
}
</script>

<template>
  <section class="hero is-small is-info">
    <div class="hero-body">
      <p class="title">
        {{ name }}
      </p>
      <div class="container is-fluid block">
       <!--
        <p class="subtitle">
          Mais informações:
        </p> -->
      </div>
      <nav class="breadcrumb has-succeeds" aria-label="breadcrumbs">
        <ul>
          <li><a href="#" style="text-decoration: none;">Nomes Alternativos</a></li>
          <li v-for="(alternativeName,index) in similiarNames" :key="index">{{ alternativeName }}</li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<style>
.is-custom-color {
  background-color: #b43e61; /* Substitua pela cor desejada */
  color: #fff; /* Cor do texto no botão */
  /* Adicione qualquer estilo adicional desejado */
}

/* Estilo adicional para a cor do botão ao passar o mouse */
.is-custom-color:hover {
  background-color: #420024; /* Substitua pela cor desejada ao passar o mouse */
}

nav {
  overflow: hidden;
}

/* Estilo para a lista dentro do nav */
nav ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

/* Estilo para os itens da lista */
nav ul li {
  float: left;
  padding-left: 10px;
}

/* Estilo para os links dentro dos itens */
nav ul li a {
  display: block;
  padding: 8px 16px;
  text-decoration: none;
  color: black;
}

/* Estilo para o hover dos links */
nav ul li a:hover {
  background-color: #ddd;
}
</style>
