<template>
  <v-footer
    app
    dark
    padless
    _absolute
    _fixed
  >
    <v-container fluid class="pa-0 ma-0">
    <v-row class="pa-1 ma-0">
      <v-col
        class="white--text text-left pa-0 ma-0 no-wrap"
        cols="2"
      >
        &copy; {{ new Date().getFullYear() }} <strong><a href="mailto:Chris Means <cmeans@enova.com>">Chris Means</a></strong>
      </v-col>
      <v-col cols="10" class="white--text text-right pa-0 ma-0">
        {{ message }}
      </v-col>
    </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'Footer',

    data: () => ({
      message: ''
    }),
    created() {
      this.$root.$on('status-message', text => {
        this.message = text;
      });
    }
  }
</script>
