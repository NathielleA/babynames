<template>
  <nav class="navbar is-flex" role="navigation" aria-label="main navigation" id="navback">
    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <router-link :to="homeRoute || '/'" class="navbar-item">
          Home
        </router-link>
        <!--
        <router-link to="/" class="navbar-item">
          Info
        </router-link> -->
      </div>

      <div class="navbar-end">
        <div class="navbar-brand">
          <router-link class="navbar-item" :to="homeRoute || '/'">
            <img src="../../assets/warfare.png" width="112" height="28">
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    homeRoute: {
      type: String,
      default: '/'
    }
  }
}
</script>


<style>


#title{
    font-family:"Valorax";
    src:url("../../assets/valorax-font/Valorax-lg25V.otf") format("otf");
}

</style>