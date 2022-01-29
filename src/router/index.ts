import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import ViewerPage from '../views/ViewerPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/viewer/:mode/:startFrom',
    name: 'Viewer',
    component: ViewerPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
