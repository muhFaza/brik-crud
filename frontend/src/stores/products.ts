import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productsApi, type Product, type CreateProductData } from '@/services/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)

  const fetchProducts = async (searchQuery?: string) => {
    loading.value = true
    try {
      const params: any = {}
      
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
  
      const response = await productsApi.getAll(params)
      products.value = response.data
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id: number) => {
    loading.value = true
    currentProduct.value = null
    try {
      const response = await productsApi.getById(id)
      currentProduct.value = response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      currentProduct.value = null
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (data: CreateProductData) => {
    try {
      const response = await productsApi.create(data)
      products.value.unshift(response.data)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to create product' }
    }
  }

  const updateProduct = async (id: number, data: Partial<CreateProductData>) => {
    try {
      const response = await productsApi.update(id, data)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = response.data
      }
      currentProduct.value = response.data
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.errors[0]?.msg || error.response?.data?.message || 'Failed to update product' }
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      await productsApi.delete(id)
      products.value = products.value.filter(p => p.id !== id)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete product' }
    }
  }

  return {
    products,
    currentProduct,
    loading,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})