import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import '@aws-amplify/ui-vue';
// import Amplify from 'aws-amplify';
// import config from './aws-exports';
import VueResizeText from 'vue-resize-text';

Vue.use(VueResizeText);

// Amplify.configure(config);

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
