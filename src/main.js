import Vue from 'vue'
import App from './App.vue'
import './assets/css/columnSelector21.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import SvgIcon from 'vue-svgicon'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas)
Vue.use(SvgIcon, {
  tagName: 'svg-icon'
})
Vue.use(ElementUI)
Vue.component("font-awesome-icon", FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
