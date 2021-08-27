import Vue from 'vue'
import VueRouter from 'vue-router'
import Categories from '../views/Categories.vue'
import Persons from '../views/Persons.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/persons',
    name: 'Persons',
    component: Persons
  }
]

const router = new VueRouter({
  routes
})

export default router
