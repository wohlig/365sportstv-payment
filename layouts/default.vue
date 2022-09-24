<template>
  <v-main>
    <v-app light>
      <Nuxt />
      <Snackbar></Snackbar>
    </v-app>
  </v-main>
</template>

<script>
import Snackbar from '~/components/Snackbar'
export default {
  name: 'Default',
  components: {
    Snackbar,
  }
}
</script>

<style >
.body {
  background: #fbfbff !important;
}
</style>
