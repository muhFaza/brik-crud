import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productsApi, type Product, type CreateProductData } from '@/services/api'

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const pagination = ref<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null
  })

  const fetchProducts = async (searchQuery?: string, page: number = 1, limit: number = 10) => {
    loading.value = true
    try {
      const params: any = {
        page,
        limit
      }
      
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
  
      const response = await productsApi.getAll(params)
      
      if (response.data.products && response.data.pagination) {
        products.value = response.data.products
        pagination.value = response.data.pagination
      } else {
        products.value = response.data
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      loading.value = false
    }
  }

  const goToPage = async (page: number, searchQuery?: string) => {
    await fetchProducts(searchQuery, page, pagination.value.itemsPerPage)
  }

  const nextPage = async (searchQuery?: string) => {
    if (pagination.value.hasNextPage) {
      await goToPage(pagination.value.currentPage + 1, searchQuery)
    }
  }

  const prevPage = async (searchQuery?: string) => {
    if (pagination.value.hasPrevPage) {
      await goToPage(pagination.value.currentPage - 1, searchQuery)
    }
  }

  const changeItemsPerPage = async (newLimit: number, searchQuery?: string) => {
    await fetchProducts(searchQuery, 1, newLimit)
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
      await productsApi.create(data)
      await fetchProducts(undefined, pagination.value.currentPage, pagination.value.itemsPerPage)
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
      await fetchProducts(undefined, pagination.value.currentPage, pagination.value.itemsPerPage)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete product' }
    }
  }

  return {
    products,
    currentProduct,
    loading,
    pagination,
    fetchProducts,
    goToPage,
    nextPage,
    prevPage,
    changeItemsPerPage,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
})