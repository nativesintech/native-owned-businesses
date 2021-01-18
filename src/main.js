import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueSelect from 'vue-select'

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import 'typeface-inter'
import './styles/screen.scss'
import 'mapbox-gl/dist/mapbox-gl.css'

Vue.config.productionTip = false

Vue.use(VueApollo)
Vue.component('v-select', VueSelect)

const getHeaders = () => {
  const headers = {}
  const token = window.localStorage.getItem('session')

  if (token) {
    headers.authorization = `Bearer ${token}`
  }

  return headers
}

console.log(process.env.VUE_APP_GRAPHQL_URI, '?')

const link = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_URI,
  fetch,
  headers: getHeaders()
})

const defaultClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache({ addTypename: true })
})

const apolloProvider = new VueApollo({ defaultClient })

new Vue({
  router,
  apolloProvider,
  store,
  render: h => h(App)
}).$mount('#app')
