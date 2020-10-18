<template>
  <v-app>
    <v-app-bar
      app
      fixed
      elevate-on-scroll
      color="black"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

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

      <v-btn
        class="ml-2"
        v-if="authState === 'signedin' && user && $router.currentRoute.path == '/'"
        v-on:click="$root.$emit('take-a-turn')"
      >
        Play
      </v-btn>

      <v-spacer></v-spacer>

      <div v-if="authState === 'signedin' && user">
        <div class="d-flex align-center">
          <div class="pr-2">Hello, {{user.username}}</div>
          <amplify-sign-out></amplify-sign-out>
        </div>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      _absolute
      app
      fixed
      temporary
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            emo-Bingo
          </v-list-item-title>
          <v-list-item-subtitle>
            Emotional Bingo
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        nav
        dense
      >
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item
            @click="$router.push({ path: '/' }).catch(err => {})"
          >
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="$router.push({ path: '/instructions' }).catch(err => {})"
          >
            <v-list-item-icon>
              <v-icon>mdi-help</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Instructions</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="$router.push({ path: '/about' }).catch(err => {})"
          >
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

export default {
  name: 'App',

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
      drawer: false
    }
  },
  beforeDestroy() {
    return onAuthUIStateChange;
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
