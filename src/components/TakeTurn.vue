<template>
  <v-card
    outlined
    elevation="2"
    class="d-flex flex-1"
  >
  <v-card-title>
    Next Turn
  </v-card-title>
  <v-img
    src="@public/images/selfie.png"
    height="200"
  />
  <v-card-text>
    Click the spinner to see which emotion you must present.
  </v-card-text>
  <v-card-actions>
    <v-btn>Submit Your Selfie</v-btn>
  </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'TakeTurn',

    components: {
    },
    props: [
      'items'
    ],
    data: () => ({
    })
  }
</script>
