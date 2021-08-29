import Vue from 'vue'
import VueRouter from 'vue-router'
import Categories from '../views/Categories.vue'
import People from '../views/People.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/people',
    name: 'People',
    component: People
  }
]

const router = new VueRouter({
  routes
})

export default router
