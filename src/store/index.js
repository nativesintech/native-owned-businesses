import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

const API_URL = 'http://localhost:3001'

const formatUrl = (path) => {
  return `${API_URL}/${path}`
}

const store = new Vuex.Store({
  state: {
    results: null,
    user: undefined
  },
  mutations: {
    set_results (store, results) {
      store.results = results
    },
    handle_user (store, user) {
      store.user = user
    }
  },
  actions: {
    async fetch_all_businesses (store) {
      const businesses = await axios.get(formatUrl('businesses/all'))

      setTimeout(
        () => store.commit('set_results', businesses.data),
        1000)
    }
  },
  modules: {
  },
  devtools: process.env.NODE_ENV !== 'production'
})

export default store
