import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/all/Home.vue'
import About from '../views/all/About.vue'
import Business from '../views/all/Business.vue'
// eslint-disable-next-line import/no-named-default
import { default as OwnerHome } from '../views/owner/Home.vue'
import NewBusiness from '../views/owner/NewBusiness.vue'
import EditBusiness from '../views/owner/EditBusiness.vue'
import Login from '../views/all/Login.vue'

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
  },
  {
    path: '/owner/b/new',
    name: 'owner-business-new',
    component: NewBusiness
  },
  {
    path: '/owner/b/:id/edit',
    name: 'owner-business-edit',
    component: EditBusiness
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
