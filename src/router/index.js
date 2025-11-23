import { createRouter, createWebHistory } from 'vue-router'

// Importando as telas (Views)
import VfarmaHome from '../views/VfarmaHome.vue'
import CheckoutView from '../views/checkoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // Quando o link for "/" (Raiz), abre a Home
      path: '/',
      name: 'home',
      component: VfarmaHome,
    },
    {
      // Quando o link for "/checkout", abre a tela de Pagamento
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
  ],
})

export default router
