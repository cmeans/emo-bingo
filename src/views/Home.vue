<template>
  <div>
    <div class="d-flex justify-center">
      <amplify-authenticator v-if="authState !== 'signedin'">
        <amplify-sign-in header-text="emo-Bingo Sign In" slot="sign-in"></amplify-sign-in>
      </amplify-authenticator>
    </div>
    <amplify-authenticator v-if="authState == 'signedin'">
      <Game />
    </amplify-authenticator>
  </div>
</template>

<script>
import Game from '@/components/Game.vue'
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

export default {
  name: 'Home',

  components: {
    Game
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
    }
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  }
}
</script>
