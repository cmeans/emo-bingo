<template>
  <v-footer
    app
    dark
    paddless
    absolute
    fixed
  >
    <v-container fluid class="ps-a">
    <v-row>
      <v-col
        class="white--text text-left pa-0 ml-2"
        cols="2"
      >
        &copy; {{ new Date().getFullYear() }} <strong><a href="mailto:Chris Means <cmeans@enova.com>">Chris Means</a></strong>
      </v-col>
      <v-col cols="8" class="white--text text-right pa-0">
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
