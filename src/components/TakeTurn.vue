<template>
  <v-card
    elevation="2"
    height="500"
  >
    <v-card-title>
      Click the spinner to see which emotion you must present.
    </v-card-title>
    <v-card-text>
      <!-- <v-img
        contain
        src="/images/selfie.png"
        height="200"
      /> -->
      <p>
      </p>
      <SpinningWheel :items="items" />
    </v-card-text>
    <v-card-actions>
      <v-btn>Submit Your Selfie</v-btn>
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
    })
  }
</script>
<style scoped>
  .selfie {
    background-image: url('/images/selfie.png');
  }
</style>
