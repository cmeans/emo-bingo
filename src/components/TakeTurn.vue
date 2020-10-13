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
  import BingoCell from './BingoCell';

  export default {
    name: 'BingoCard',

    components: {
      BingoCell
    },
    props: [
      'items'
    ],
    data: () => ({
      lastEmotion: null
    }),
    computed: {
      width() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return 40;
        }

        return 100;
      }
    },
    methods: {
      getRandomItem() {
        return this.items[Math.floor(Math.random() * this.items.length)];
      },
      emotion() {
        this.lastEmotion = this.getRandomItem();
        return this.lastEmotion;
      }
    }
  }
</script>
