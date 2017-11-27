import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "./assets/general.css"

Vue.use(BootstrapVue)

import {Nav} from 'bootstrap-vue/es/components'

Vue.use(Nav)

new Vue({
  el: '#app',
  render: h => h(App)
})
