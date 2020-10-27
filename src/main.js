import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import '@aws-amplify/ui-vue';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import VueResizeText from 'vue-resize-text';
import router from './router';
import VueConfetti from 'vue-confetti'

Vue.use(VueConfetti);
Vue.use(VueResizeText);

Amplify.configure(config);

Vue.config.productionTip = false

const emotionsList = 'HAPPY|SAD|ANGRY|CONFUSED|DISGUSTED|SURPRISED|CALM|FEAR'.toLowerCase().split('|');

const emotionsInfo =
  new Map(
    emotionsList.map((value) =>
    [
      value,
      {
        name: value
      }
    ])
  );

const emotionIcons = Object.fromEntries(
  emotionsList.map((value) =>
  [
    value,
    {
      icon: `/images/emotions/${value}-tight.png`,
      size: 50
    }
  ]));

// Non-emotion for the center grid-cell.
emotionIcons['freebie'] = {
    icon: '/images/jack-o-lantern.png'
  };

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

export { emotionsList, emotionsInfo, emotionIcons };
