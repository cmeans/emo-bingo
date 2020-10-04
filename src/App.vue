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
    <v-content>
      <div class="d-flex justify-center">
        <amplify-authenticator v-if="authState !== 'signedin'">
          <amplify-sign-in header-text="emo-Bingo Sign In" slot="sign-in"></amplify-sign-in>
        </amplify-authenticator>
      </div>
      <amplify-authenticator v-if="authState == 'signedin'">
        <EmoImages/>
      </amplify-authenticator>
    </v-content>
  </v-app>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import EmoImages from './components/EmoImages';

export default {
  name: 'App',

  components: {
    EmoImages,
  },

  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    })
  },
  data: () => ({
    user: undefined,
    authState: undefined
  }),
  beforeDestroy() {
    return onAuthUIStateChange;
  }
};
</script>
