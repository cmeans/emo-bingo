<template>
  <v-card
    outlined
    elevation="6"
    class="card ma-4"
  >
  <div class="square-container">
    <div class="square" v-for="letter in 'B I N G O'.split(' ')" :key="letter">
      <BingoCell :text="letter"></BingoCell>
    </div>
  </div>
  <div class="square-container">
    <div class="square" v-for="entry in gameState" :key="entry.id">
      <v-card class="cell" @click="showCellInfoDialog(entry.name)">
        <v-card-text class="pa-0 pt-2 pb-2">
          <div align="center">
            <div class="d-none d-md-flex justify-center">
              {{ entry.name }}
            </div>
            <v-img
              contain
              :src="emotionIcons[entry.name].icon"
              v-bind:style="{ width: size }"
            />
          </div>
          <v-overlay :absolute="true" v-show="entry.play != -1">
            <v-img
              _v-show="entry.name != entry.emotion"
              contain
              :src="entryOverlay(entry.play)"
              width="100"
            >
            </v-img>
          </v-overlay>
        </v-card-text>
      </v-card>
    </div>
  </div>
  <CellInfo v-model="showCellInfo" :emotion="showEmotion" />
  </v-card>
</template>

<script>
  import BingoCell from './BingoCell';
  import CellInfo from './CellInfo';
  import { emotionIcons } from '../main';

  export default {
    name: 'BingoSquare',

    components: {
      BingoCell,
      CellInfo
    },
    props: [
      'playedEmotions',
      'gameState'
    ],
    data: () => ({
      emotionIcons,
      showEmotion: null,
      showCellInfo: null
    }),
    created() {
      // this.initEmotionNames();
      // this.initBingoCardCells();
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
      // entry(row, col) {
      //   return this.gameState[row * 5 + col];
      // },
      entryOverlay(play) {
        if (play == 0) {
          return '/images/cross-mark.png' // Miss.
        }
        return '/images/cross-mark.png' // Hit.
      },
      showCellInfoDialog(emotion) {
        this.showEmotion = emotion;
        this.showCellInfo = true;
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
