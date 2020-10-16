<template>
  <v-app>
    <v-app-bar
      app
      color="black"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="HERP DERP logo"
          class="shrink mr-2"
          contain
          src="/images/herpderp.png"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>emo-Bingo</v-toolbar-title>
      </div>

      <v-btn class="ml-2">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
      <v-btn class="ml-2">
        <v-icon>mdi-help</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn class="ml-2" v-on:click="playing = !playing">Play</v-btn>

      <div v-if="authState === 'signedin' && user">
        <div class="d-flex align-center">
          <div class="pr-2">Hello, {{user.username}}</div>
          <amplify-sign-out></amplify-sign-out>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <!-- <div class="d-flex justify-center">
        <amplify-authenticator v-if="authState !== 'signedin'">
          <amplify-sign-in header-text="emo-Bingo Sign In" slot="sign-in"></amplify-sign-in>
        </amplify-authenticator>
      </div>
      <amplify-authenticator v-if="authState == 'signedin'">
      </amplify-authenticator> -->
        <v-container>
          <v-slide-y-transition>
            <v-card-text v-show="playing">
              <TakeTurn :playedEmotions="playedEmotions" />
            </v-card-text>
          </v-slide-y-transition>
          <v-slide-x-transition>
            <BingoCard v-if="!playing" :playedEmotions="playedEmotions" />
          </v-slide-x-transition>
        </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
// import NewEntry from './components/NewEntry';
// import EmoImages from './components/EmoImages';
import BingoCard from './components/BingoSquare';
import TakeTurn from './components/TakeTurn';
import { emotionInfo } from './main';

// import Spinner from './components/Spinner';

// const EMOTIONS = 'HAPPY|SAD|ANGRY|CONFUSED|DISGUSTED|SURPRISED|CALM|FEAR'.toLowerCase().split('|');

// const ITEMS = EMOTIONS.map((value) => {
//   return {
//     icon: `/images/emotions/${value}-tight.png`,
//     size: 50,
//     name: value
//   }
// })

export default {
  name: 'App',

  components: {
    // NewEntry,
    // EmoImages,
    BingoCard,
    TakeTurn
  },

  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });

    this.initPlayedEmotions();
  },
  data: () => ({
    user: undefined,
    authState: undefined,
    // items: ITEMS,
    playing: false,
    playedEmotions: []
  }),
  beforeDestroy() {
    return onAuthUIStateChange;
  },
  methods: {
    initPlayedEmotions() {
      emotionInfo.forEach((value) => {
        this.playedEmotions.push(
          {
            selected: false,
            ...value
          });
      })
    }
  }
};
</script>
