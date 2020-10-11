<template>
  <v-container>
    <v-row>
      <v-col cols="2" v-for="letter in 'B I N G O'.split(' ')" v-bind:key="letter">
        <BingoCell :text="letter"></BingoCell>
      </v-col>
    </v-row>
    <v-row v-for="row in [1,2,3,4,5]" v-bind:key="row">
      <v-col cols="2" v-for="col in [1,2,3,4,5]" v-bind:key="col">
          <BingoCell>{{ emotion() }}</BingoCell>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import BingoCell from './BingoCell';

  const EMOTIONS = 'HAPPY|SAD|ANGRY|CONFUSED|DISGUSTED|SURPRISED|CALM|FEAR'.split('|');

  export default {
    name: 'BingoCard',

    components: {
      BingoCell
    },
    data: () => ({

    }),
    methods: {
      emotion() {
        return EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
      }
    }
  }
</script>
