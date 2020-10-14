<template>
  <v-card
    outlined
    elevation="2"
    class="d-flex"
  >
    <v-card-title>
      Click the spinner to see which emotion you must present.
    </v-card-title>
    <v-card-text>
      <SpinningWheel :items="items" :disabled="!!emotion"/>
    </v-card-text>
    <v-card-actions>
      <v-btn :disabled="!emotion">Take Your "{{ emotion }}" Selfie</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import SpinningWheel from './SpinningWheel';

  export default {
    name: 'TakeTurn',

    components: {
      SpinningWheel
    },
    props: [
      'items'
    ],
    data: () => ({
      emotion: ''
    }),
    mounted() {
      this.$root.$on('emotion', (text) => {
        this.emotion = text;
      });
    }
  }
</script>
<style scoped>
  .selfie {
    background-image: url('/images/selfie.png');
  }
</style>
