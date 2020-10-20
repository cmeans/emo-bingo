<template>
  <div>
    <v-slide-y-transition>
      <v-card-text v-show="playing">
        <TakeTurn :playedEmotions="availableEmotions" />
      </v-card-text>
    </v-slide-y-transition>
    <v-slide-x-transition>
      <BingoSquare v-show="!playing" :gameState="state" />
    </v-slide-x-transition>
  </div>
</template>

<script>
import TakeTurn from './TakeTurn';
import BingoSquare from './BingoSquare';
import { emotionsList, emotionsInfo, emotionIcons } from '../main';

export default {
  name: 'Game',

  components: {
    TakeTurn,
    BingoSquare
  },
  created() {
    this.$root.$on('take-a-turn', () => {
      this.playing = !this.playing;
    });

    this.initGameState();
    this.initAvailableEmotions();
  },
  data() {
    return {
      playing: false,
      availableEmotions: [],
      state: []
    }
  },
  methods: {
    initAvailableEmotions() {
      emotionsInfo.forEach((value) => {
        this.availableEmotions.push(
          {
            selected: false,
            ...emotionIcons[value.name],
            ...value
          });
      });
    },
    getRandomEmotionName() {
      return emotionsList[Math.floor(Math.random() * emotionsList.length)];
    },
    // initEmotionNames() {
    //   this.emotionNames = Array.from(emotionInfo.keys());
    // },
    initGameState() {
      this.state = new Array(24);

      let positions = [...Array(24).keys()];

      for (let i = 0; i < 3; i++) {
        for (let e = 0; e < emotionsList.length; e++) {
          const position = Math.floor(Math.random() * positions.length);
          const item = emotionsInfo.get(emotionsList[e]);
          this.state[positions[position]] = {
            i: positions[position],
            ...item
          };

          positions.splice(position, 1);
        }
      }

      this.state.splice(12, 0, {
          i: 12,
          name: 'freebie',
          emotion: 'freebie'
      });
    }
  }
}
</script>
