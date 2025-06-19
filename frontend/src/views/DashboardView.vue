<template>
    <div class="min-w-[412px] min-h-screen bg-gray-50">
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <h1 class="text-3xl font-bold text-gray-900">Product Dashboard</h1>
                    <div class="flex items-center gap-3 sm:gap-6">
                        <div class="hidden sm:flex items-center">
                            <v-icon name="fa-user-alt" fill="#374151" width="20" height="20" />
                            <span class="text-gray-700 ml-2">{{ authStore.user?.name }}</span>
                        </div>

                        <button @click="handleLogout" class="text-red-700 hover:text-red-800 flex items-center gap-1">
                            <v-icon name="ri-logout-box-fill" fill="#dc2626" width="20" height="20" />
                            <span class="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 pb-6 sm:px-0">

                <!-- search -->
                <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div class="flex-1 max-w-md">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <v-icon name="ri-search-line" fill="#6b7280" width="20" height="20" />
                            </div>
                            <input
                                v-model="searchQuery"
                                @input="handleSearch"
                                type="text"
                                placeholder="Beras?"
                                class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button
                                    @click="clearSearch"
                                    class="text-gray-400 hover:text-gray-500 focus:outline-none flex items-center"
                                >
                                    <v-icon name="ri-close-line" fill="#6b7280" width="16" height="16" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- items per page -->
                    <div class="flex items-center gap-2">
                        <label class="text-sm text-gray-600">Show:</label>
                        <select
                            v-model="itemsPerPage"
                            @change="handleItemsPerPageChange"
                            class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <span class="text-sm text-gray-600">per page</span>
                    </div>
                </div>

                <!-- link add product -->
                <div class="mb-6 flex justify-center sm:justify-start">
                    <router-link to="/products/new"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add New Product
                    </router-link>
                </div>

                <!-- results info -->
                <div v-if="!loading && productsStore.products.length > 0" class="mb-4 text-sm text-gray-600">
                    Showing {{ getResultsInfo() }}
                </div>

                <!-- loader -->
                <div v-if="loading" class="text-center py-8">
                    <div class="text-gray-500 mb-4">Loading...</div>
                    <v-icon name="ri-loader-4-fill" fill="#374151" animation="spin" width="32" height="32" />
                </div>

                <!-- no products -->
                <div v-else-if="productsStore.products.length === 0" class="text-center py-8">
                    <v-icon name="ri-inbox-line" fill="#9ca3af" width="48" height="48" class="mx-auto mb-4" />
                    <div class="text-gray-500">
                        {{ searchQuery ? 'No products found matching your search.' : 'No products found.' }}
                    </div>
                </div>

                <!-- products loop -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="product in productsStore.products" :key="product.id"
                        class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                        @click="$router.push(`/products/${product.id}`)">
                        <div class="px-4 py-5 sm:p-6">
                            <div class="flex items-center justify-between">
                                <h3 class="text-lg font-medium text-gray-900 truncate">
                                    {{ product.name }}
                                </h3>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3"
                                    :class="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                    {{ product.isActive ? 'Active' : 'Inactive' }}
                                </span>
                            </div>

                            <div class="mt-2">
                                <p class="text-sm text-gray-600 line-clamp-2">
                                    {{ product.description || 'No description available' }}
                                </p>
                            </div>

                            <div class="mt-4 flex items-center justify-between">
                                <div class="text-xs text-gray-400">
                                    {{ new Date(product.createdAt).toLocaleDateString() }}
                                </div>

                                <div class="text-xs text-gray-400">
                                    Stok: {{ product.stock }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- pagination -->
                <div v-if="!loading && productsStore.products.length > 0 && productsStore.pagination.totalPages > 1" 
                     class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div class="text-sm text-gray-600">
                        Page {{ productsStore.pagination.currentPage }} of {{ productsStore.pagination.totalPages }}
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            @click="handlePrevPage"
                            :disabled="!productsStore.pagination.hasPrevPage"
                            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                            <v-icon name="ri-arrow-left-s-line" fill="currentColor" width="16" height="16" />
                            Previous
                        </button>

                        <div class="hidden sm:flex items-center gap-1">
                            <button
                                v-for="page in getVisiblePages()"
                                :key="page"
                                @click="handleGoToPage(page)"
                                :class="[
                                    'px-3 py-2 text-sm font-medium rounded-md',
                                    page === productsStore.pagination.currentPage
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                ]"
                            >
                                {{ page }}
                            </button>
                        </div>

                        <button
                            @click="handleNextPage"
                            :disabled="!productsStore.pagination.hasNextPage"
                            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                        >
                            Next
                            <v-icon name="ri-arrow-right-s-line" fill="currentColor" width="16" height="16" />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()
const productsStore = useProductsStore()

const loading = computed(() => productsStore.loading)

const searchQuery = ref('')
const itemsPerPage = ref(10)
let searchTimeout: NodeJS.Timeout | null = null

onMounted(() => {
    loadItemsPerPageFromStorage()
    productsStore.fetchProducts(undefined, 1, itemsPerPage.value)
})

const handleSearch = () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
    
    searchTimeout = setTimeout(() => {
        productsStore.fetchProducts(searchQuery.value, 1, itemsPerPage.value)
    }, 300)
}

const clearSearch = () => {
    searchQuery.value = ''
    productsStore.fetchProducts(undefined, 1, itemsPerPage.value)
}

// START OF PAGINATION METHODS
const loadItemsPerPageFromStorage = () => {
    const stored = localStorage.getItem('productsItemsPerPage')
    if (stored) {
        const parsed = parseInt(stored)
        if ([5, 10, 20, 50].includes(parsed)) {
            itemsPerPage.value = parsed
        }
    }
}

const saveItemsPerPageToStorage = (value: number) => {
    localStorage.setItem('productsItemsPerPage', value.toString())
}

const handleItemsPerPageChange = () => {
    saveItemsPerPageToStorage(itemsPerPage.value)
    productsStore.changeItemsPerPage(itemsPerPage.value, searchQuery.value)
}

const handleGoToPage = (page: number) => {
    productsStore.goToPage(page, searchQuery.value)
}

const handleNextPage = () => {
    productsStore.nextPage(searchQuery.value)
}

const handlePrevPage = () => {
    productsStore.prevPage(searchQuery.value)
}

const getResultsInfo = () => {
    const { currentPage, itemsPerPage: limit, totalItems } = productsStore.pagination
    const startItem = (currentPage - 1) * limit + 1
    const endItem = Math.min(currentPage * limit, totalItems)
    return `${startItem}-${endItem} of ${totalItems} products`
}

const getVisiblePages = () => {
    const { currentPage, totalPages } = productsStore.pagination
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
        }
    } else {
        let start = Math.max(1, currentPage - 2)
        let end = Math.min(totalPages, currentPage + 2)
        
        if (end - start < maxVisible - 1) {
            if (start === 1) {
                end = Math.min(totalPages, start + maxVisible - 1)
            } else {
                start = Math.max(1, end - maxVisible + 1)
            }
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
    }
    
    return pages
}

// END OF PAGINATION METHODS

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>