<template>
  <v-app>
    <v-container fluid>
      <router-link class="menuelement px-3" to="/">Kategóriák</router-link>
      <router-link class="menuelement px-3" to="/people">Címzettek</router-link>
    </v-container>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
.menuelement {
  text-align: right;
  text-decoration: none;
  color: black !important;
  font-size: large;
}
.v-btn {
  text-transform: unset !important;
}
</style>
