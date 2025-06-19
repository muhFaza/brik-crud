import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import AddProductView from '@/views/AddProductView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/products/new',
      name: 'add-product',
      component: AddProductView,
      meta: { requiresAuth: true },
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  // auth guard
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }
  
  if (to.name === 'login' && authStore.isAuthenticated) {
    return '/'
  }
})

export default router
