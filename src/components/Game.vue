<template>
  <div>
    <v-slide-y-transition>
      <v-card-text v-show="playing">
        <TakeTurn :playedEmotions="playedEmotions" />
      </v-card-text>
    </v-slide-y-transition>
    <v-slide-x-transition>
      <BingoSquare v-show="!playing" :playedEmotions="playedEmotions" />
    </v-slide-x-transition>
  </div>
</template>

<script>
import TakeTurn from './TakeTurn';
import BingoSquare from './BingoSquare';
import { EMOTION_INFO } from '../main';

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

    this.initPlayedEmotions();
  },
  data() {
    return {
      playing: false,
      playedEmotions: []
    }
  },
  methods: {
    initPlayedEmotions() {
      EMOTION_INFO.forEach((value) => {
        this.playedEmotions.push(
          {
            selected: false,
            ...value
          });
      })
    }
  }
}
</script>
