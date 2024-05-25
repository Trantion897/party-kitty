// TODO: Modify or delete, might not be used

import { createWebHashHistory, createRouter } from 'vue-router'

import AddMoney from '@/components/pages/AddMoney.vue'
import ShareMoney from '@/components/pages/ShareMoney.vue'
import TakeMoney from '@/components/pages/TakeMoney.vue'
import KittyHistory from '@/components/pages/KittyHistory.vue'
import Help from '@/components/pages/Help.vue'

const routes = [
  { path: '/:name?/share', component: ShareMoney },
  { path: '/:name?/add', component: AddMoney },
  { path: '/:name?/take', component: TakeMoney },
  { path: '/:name?/history', component: KittyHistory },
  { path: '/:name?/help', component: Help },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router