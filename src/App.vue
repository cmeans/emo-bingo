<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-toolbar-title>emo-Bingo</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

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
        <div>
          <NewEntry/>
        </div>
        <EmoImages />
      </amplify-authenticator> -->
      <v-container>
        <v-btn v-on:click="playing = !playing">Play</v-btn>
        <SpinningWheel v-if="playing" :items="items" />
        <BingoCard v-if="!playing" :items="items" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
// import NewEntry from './components/NewEntry';
// import EmoImages from './components/EmoImages';
import BingoCard from './components/BingoCard';
// import Spinner from './components/Spinner';
import SpinningWheel from './components/SpinningWheel';

const EMOTIONS = 'HAPPY|SAD|ANGRY|CONFUSED|DISGUSTED|SURPRISED|CALM|FEAR'.toLowerCase().split('|');

const ITEMS = EMOTIONS.map((value) => {
  return {
    icon: `/images/emotions/${value}.png`,
    size: 64,
    name: value
  }
})

export default {
  name: 'App',

  components: {
    // NewEntry,
    // EmoImages,
    BingoCard,
    SpinningWheel
  },

  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    })
  },
  data: () => ({
    user: undefined,
    authState: undefined,
    items: ITEMS,
    playing: false
  }),
  beforeDestroy() {
    return onAuthUIStateChange;
  }
};
</script>
