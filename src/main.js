import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import '@aws-amplify/ui-vue';
// import Amplify from 'aws-amplify';
// import config from './aws-exports';
import Home from './components/About.vue';
import About from './components/About.vue';
import Help from './components/Help.vue';
import VueResizeText from 'vue-resize-text';

Vue.use(VueResizeText);

// Amplify.configure(config);

Vue.config.productionTip = false

const routes = [
  { path:'/', component: Home },
  { path:'/help', component: Help },
  { path:'/about', component: About },
]

const EMOTIONS = 'HAPPY|SAD|ANGRY|CONFUSED|DISGUSTED|SURPRISED|CALM|FEAR'.toLowerCase().split('|');

const emotionInfo =
  new Map(
    EMOTIONS.map((value) =>
    [
      value,
      {
        icon: `/images/emotions/${value}-tight.png`,
        size: 50,
        name: value
      }
    ]));

new Vue({
  vuetify,
  router: new ({ routes }),
  render: h => h(App)
}).$mount('#app')

export { emotionInfo };

