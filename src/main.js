import Vue from 'vue'
import VueApollo from 'vue-apollo'
import VueSelect from 'vue-select'

import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

Vue.config.productionTip = false

Vue.use(VueApollo)
Vue.component('v-select', VueSelect)

const getHeaders = () => {
  const headers = {}
  const token = window.localStorage.getItem('apollo-token')

  if (token) {
    headers.authorization = `Bearer ${token}`
  }

  return headers
}

const link = new HttpLink({
  uri: 'http://157.230.200.94:8080/v1/graphql',
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
  render: h => h(App)
}).$mount('#app')
