import Vue from 'vue'
import App from './App.vue'

//引入饿了么UI
import {
  Calendar,
  Row,
  Col,
  Link,
  Button,
  Loading,
  Container,
  Header,
  Footer,
  Main,
  Form,
  Autocomplete,
  Tooltip,
  Card,
  Dialog
}  from 'element-ui';
Vue.use(Calendar)
Vue.use(Row)
Vue.use(Col)
Vue.use(Link)
Vue.use(Button)
Vue.use(Loading)
Vue.use(Container)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Form)
Vue.use(Autocomplete)
Vue.use(Tooltip)
Vue.use(Card)
Vue.use(Main)
Vue.use(Dialog)
import "element-ui/lib/theme-chalk/index.css"

//引入转盘组件
import VueLuckyCanvas from '@lucky-canvas/vue'
Vue.use(VueLuckyCanvas)

//引入axios
import axios from 'axios';
Vue.prototype.$ajax = axios;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
