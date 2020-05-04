import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'holderjs'
import 'vue-awesome/icons'

import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import VueLogger from 'vuejs-logger';
const options = {
  isEnabled: true,
  logLevel : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : false,
  separator: '|',
  showConsoleColors: true
};
Vue.use(VueLogger, options);

import Icon from 'vue-awesome/components/Icon'
Vue.component('v-icon', Icon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
