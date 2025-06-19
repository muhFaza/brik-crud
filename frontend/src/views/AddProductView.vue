<template>
    <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <div class="flex items-center space-x-4">
                        <button @click="$router.push('/')" class="text-gray-500 hover:text-gray-700">
                            <v-icon name="io-arrow-back-sharp" />
                        </button>
                        <h1 class="text-3xl font-bold text-gray-900">Add New Product</h1>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <form @submit.prevent="handleSubmit" class="p-6">
                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">
                                    Product Name <span class="text-red-500">*</span>
                                </label>
                                <input id="name" v-model="form.name" type="text" required
                                    class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Chitato Lite" />
                            </div>

                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700">
                                    Deskripsi
                                </label>
                                <textarea id="description" v-model="form.description" rows="4"
                                    class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Chitato Lite tersedia dalam beberapa varian rasa, yaitu salmon teriyaki, rumput laut, sapi panggang, saus krim bawang, dan truffle."></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="price" class="block text-sm font-medium text-gray-700">
                                        Harga <span class="text-red-500">*</span>
                                    </label>
                                    <input id="price" v-model.number="form.price" type="number" step="0.01" min="0"
                                        required
                                        class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="0.00" />
                                        
                                </div>

                                <div>
                                    <label for="stock" class="block text-sm font-medium text-gray-700">
                                        Jumlah Stok <span class="text-red-500">*</span>
                                    </label>
                                    <input id="stock" v-model.number="form.stock" type="number" min="0" required
                                        class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="0" />
                                </div>
                            </div>

                            <div>
                                <label for="imageUrl" class="block text-sm font-medium text-gray-700">
                                    Link Gambar
                                </label>
                                <input id="imageUrl" v-model="form.imageUrl" type="url"
                                    class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="https://example.com/image.jpg" />
                                <div v-if="form.imageUrl" class="mt-3">
                                    <img :src="form.imageUrl" alt="Preview"
                                        class="h-32 w-auto rounded-md border border-gray-300"
                                        @error="handleImageError" />
                                </div>
                            </div>

                            <div class="flex items-center">
                                <input id="isActive" v-model="form.isActive" type="checkbox"
                                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <label for="isActive" class="ml-2 block text-sm text-gray-900">
                                    Produk aktif dan siap dijual
                                </label>
                            </div>
                        </div>

                        <div v-if="error" class="mt-4 text-red-600 text-sm">
                            {{ error }}
                        </div>

                        <div class="mt-6 flex justify-end space-x-3">
                            <button type="button" @click="$router.push('/')"
                                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Cancel
                            </button>
                            <button type="submit" :disabled="loading"
                                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {{ loading ? 'Creating...' : 'Create' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useToast } from "vue-toastification"

const toast = useToast()
const router = useRouter()
const productsStore = useProductsStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    isActive: true
})

const handleSubmit = async () => {
    loading.value = true
    error.value = ''

    const result = await productsStore.createProduct({
        name: form.name,
        description: form.description || undefined,
        price: form.price,
        stock: form.stock,
        imageUrl: form.imageUrl || undefined,
        isActive: form.isActive
    })

    if (result.success) {
        toast.success('Produk berhasil dibuat!')
        router.push('/')
    } else {
        error.value = result.error || 'Failed to create product'
    }

    loading.value = false
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
}
</script>