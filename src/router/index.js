import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Business from '../views/Business.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/b/:id',
    name: 'business',
    component: Business,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
