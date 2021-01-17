import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/all/Home.vue'
import About from '../views/all/About.vue'
import Business from '../views/all/Business.vue'
// eslint-disable-next-line import/no-named-default
import { default as OwnerHome } from '../views/owner/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  { path: '/about', name: 'about', component: About },
  {
    path: '/b/:id',
    name: 'business',
    component: Business,
    props: true
  },
  {
    path: '/owner',
    name: 'owner-home',
    component: OwnerHome
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
