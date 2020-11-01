<template>
  <v-footer
    app
    dark
    padless
    fixed
  >
    <v-container fluid class="pa-0 ma-0">
    <v-row class="pa-1 ma-0">
      <v-col
        class="white--text text-left pa-0 ma-0 no-wrap"
        style="vertical-align: bottom"
        cols="4"
        v-resize-text="{ratio:1.0, minFontSize: '10px', maxFontSize: '20px', delay: 0}"
      >
        &copy; {{ new Date().getFullYear() }} <a href="mailto:Chris Means <cmeans@enova.com>">Chris Means</a>
      </v-col>
      <v-col
        cols="8"
        class="white--text text-right pa-0 ma-0"
        v-resize-text="{ratio:1.0, minFontSize: '10px', maxFontSize: '20px', delay: 0}"
      >
        {{ message }}
      </v-col>
    </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  import ResizeText from 'vue-resize-text';

  export default {
    name: 'Footer',
    directives: {
      ResizeText
    },
    data: () => ({
      message: ''
    }),
    mounted() {
      this.$root.$on(
        'status-message',
        this.setMessage);
    },
    beforeDestroy() {
      this.$root.$off(
        'status-message',
        this.setMessage);
    },
    methods: {
      setMessage(text) {
        this.message = text;
      }
    }
  }
</script>
