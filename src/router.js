// TODO: Modify or delete, might not be used

import { createWebHashHistory, createRouter } from 'vue-router'

import AddMoney from '@/components/pages/AddMoney.vue'
import ShareMoney from '@/components/pages/ShareMoney.vue'
import TakeMoney from '@/components/pages/TakeMoney.vue'
import KittyHistory from '@/components/pages/KittyHistory.vue'
import Help from '@/components/pages/Help.vue'

const routes = [
  { path: '/share', component: ShareMoney },
  { path: '/add', component: AddMoney },
  { path: '/take', component: TakeMoney },
  { path: '/history', component: KittyHistory },
  { path: '/help', component: Help },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router