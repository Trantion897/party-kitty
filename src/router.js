// TODO: Modify or delete, might not be used

import { createWebHashHistory, createRouter } from 'vue-router'

import AddMoney from '@/components/pages/AddMoney.vue'
import ShareMoney from '@/components/pages/ShareMoney.vue'
import TakeMoney from '@/components/pages/TakeMoney.vue'
import KittyHistory from '@/components/pages/KittyHistory.vue'
import Options from '@/components/pages/Options.vue'

const routes = [
  { name: 'root', path: '/:name?', redirect: {name: 'share'}},
  { name: 'share',   path: '/:name?/share',   component: ShareMoney },
  { name: 'add',     path: '/:name?/add',     component: AddMoney },
  { name: 'take',    path: '/:name?/take',    component: TakeMoney },
  { name: 'history', path: '/:name?/history', component: KittyHistory },
  { name: 'options',    path: '/:name?/options',    component: Options},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
