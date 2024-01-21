<script>
//import MyArrowDown from "@/components/icons/MyArrowDown.vue";

export default {
  name: 'SeuComponente', // Substitua 'SeuComponente' pelo nome desejado

  props: ['name', 'closersNames']
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
      <nav class="breadcrumb has-succeeds-separator" aria-label="breadcrumbs">
        <ul>
          <li><a href="#" style="text-decoration: none;">Nomes Alternativos</a></li>
          <li v-for="alternativeName in closersNames" :key="alternativeName">{{ alternativeName }}</li>
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
</style>
