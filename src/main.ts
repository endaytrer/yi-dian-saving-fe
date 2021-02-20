import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faShoppingCart,
  faUserFriends,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/accents.css';
import '@/styles/fonts.css';
import '@/themes/green/index.css';

library.add(faHome, faShoppingCart, faUserFriends, faUser);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
