import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type User } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      token.value = response.data.access_token
      user.value = response.data.user
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      await authApi.register({ name, email, password })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  }
})