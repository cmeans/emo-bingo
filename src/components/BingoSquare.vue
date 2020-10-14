<template>
  <v-card
    outlined
    elevation="2"
    style="background-color: goldenrod"
  >
  <div class="square-container">
    <div class="square" v-for="letter in 'B I N G O'.split(' ')" :key="letter">
      <BingoCell :text="letter"></BingoCell>
    </div>
  </div>
  <div class="square-container">
    <div class="square" v-for="row in [1,2,3,4,5]" :key="row">
      <div class="square" v-for="col in [1,2,3,4,5]" :key="col">
        <BingoCell class="cell mb-2">
          <template v-slot:emotion>
            <v-card-text>
              <div align="center">
                <div class="d-none d-md-flex justify-center">
                  {{ emotion().name }}
                </div>
                <v-img
                  contain
                  :src=lastEmotion.icon
                  v-bind:style="{height: size, width: size}"
                />
              </div>
            </v-card-text>
          </template>
        </BingoCell>
      </div>
    </div>
  </div>
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
      size() {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs':
          case 'sm':
            return '20px';
        }

        return '60px';
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
<style scoped>
  .square-container {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1rem;
      margin: 1rem;
  }

  .square .cell {
      height: 100%;
      width: 100%;
  }
</style>
