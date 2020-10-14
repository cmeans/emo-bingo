<template>
  <v-card
    outlined
    elevation="2"
    class="card"
  >
  <div class="square-container">
    <div class="square" v-for="letter in 'B I N G O'.split(' ')" :key="letter">
      <BingoCell :text="letter"></BingoCell>
    </div>
  </div>
  <div class="square-container">
    <div class="square" v-for="entry in entries" :key="entry.i">
        <v-card class="cell mb-2">
          <v-card-text>
            <div align="center">
              <div class="d-none d-md-flex justify-center">
                {{ entry.name }}
              </div>
              <v-img
                contain
                :src="entry.icon"
                v-bind:style="{height: size, width: size}"
              />
            </div>
          </v-card-text>
        </v-card>
    </div>
    <!-- <div class="square" v-for="col in [0,1,2,3,4]" :key="col">
      <div class="square" v-for="row in [0,1,2,3,4]" :key="row">
        <v-card class="cell mb-2">
          <v-card-text>
            <div align="center">
              <div class="d-none d-md-flex justify-center">
                {{ entry[parseInt(row)*5].name }}
              </div>
              <v-img
                contain
                src="entries[(row * 5) + col].icon"
                v-bind:style="{height: size, width: size}"
              />
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div> -->
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
      entries: []
    }),
    created() {
      this.initBingoCardCells();
    },
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
      initBingoCardCells() {
        for (let i = 0; i < 25; i++) {
          const item = this.getRandomItem();
          this.entries.push({ i, ...item });
        }
      },
      entry(row, col) {
        return this.entries[row * 5 + col];
      }
    }
  }
</script>
<style scoped>
  .card {
    background-color: goldenrod;
  }

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
