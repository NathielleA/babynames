<script>
import MyThumbDown from "../icons/MyThumbDown.vue";
import MyThumbUp from "@/components/icons/MyThumbUp.vue";

export default {
  name: 'MySearchNameResult',
  components: {
    MyThumbDown,
    MyThumbUp
  },
  props: ['name', 'closersNames', 'recommendedNames']
}
</script>

<template>
    <div class="container is-fluid">
        <div class="notification container-verde">
        <div class="content is-small">
          <h1>{{ name }}</h1>
            <button class="button is-info is-inverted">Nomes Alternativos</button>
            <h4>Avalie a nossa recomendação!</h4>
            <div class="block">
                <MyThumbUp :name="this.name" style="margin-right: 10px;"/>
                <MyThumbDown :name="this.name"/>
            </div>

  </div>
      </div>
    </div>
</template>

<style>
.container-verde {
  border: 1px solid #47bed2; /* Ajuste a espessura da borda conforme necessário */
  background-color: transparent;
}

.button.is-info.is-inverted:hover{
    background-color: #47bed2;
    color : white;
}


</style>