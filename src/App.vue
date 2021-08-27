<template>
  <v-app class="appmain">
    <v-container fluid>
      <router-link class="menuelement px-3" to="/">Kategóriák</router-link>
      <router-link class="menuelement px-3" to="/persons">Címzettek</router-link>
    </v-container>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
.appmain {
  background-color: lightgrey;
}
.title {
  font-family: 'Bebas Neue', cursive;
}
.menuelement {
  text-decoration: none;
  color: black !important;
  font-weight: bold;
}
.v-btn {
  text-transform: unset !important;
}
</style>
