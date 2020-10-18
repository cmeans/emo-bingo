import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import '@aws-amplify/ui-vue';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import VueResizeText from 'vue-resize-text';
import router from './router';

Vue.use(VueResizeText);

Amplify.configure(config);

Vue.config.productionTip = false

const EMOTIONS_LIST = 'HAPPY|SAD|ANGRY|CONFUSED|DISGUSTED|SURPRISED|CALM|FEAR'.toLowerCase().split('|');

const EMOTION_INFO =
  new Map(
    EMOTIONS_LIST.map((value) =>
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
  router,
  render: h => h(App)
}).$mount('#app')

export { EMOTIONS_LIST, EMOTION_INFO };
