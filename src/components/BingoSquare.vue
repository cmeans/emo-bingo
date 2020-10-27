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
    <div class="square" v-for="entry in boardState" :key="entry.id">
      <v-card
        class="cell"
        :class="pulse(entry.name)"
        @click="showCellInfoDialog(entry.name)"
      >
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
          <transition name="flip" mode="out-in">
            <v-img
              contain
              :src="entryOverlay(entry.play)"
              width="80"
            >
            </v-img>
          </transition>
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
      'activeEmotion',
      'playedEmotions',
      'boardState'
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
      pulse(name) {
        return (name == this.activeEmotion ? 'throb' : '')
      },
      entryOverlay(play) {
        if (play == 0) {
          return '/images/cross-mark.png' // Miss.
        }
        return '/images/check-mark.png' // Hit.
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

  .throb {
    background: goldenrod;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
    transform: scale(1);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
  }
</style>
