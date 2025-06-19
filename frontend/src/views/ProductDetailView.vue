<template>
    <div class="min-h-screen bg-gray-50">
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <div class="flex items-center space-x-4">
                        <button @click="$router.push('/')" class="text-gray-500 hover:text-gray-700">
                            <v-icon name="io-arrow-back-sharp" />
                        </button>
                        <h1 class="text-3xl font-bold text-gray-900">Product Details</h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button v-if="!isEditing" @click="startEdit"
                            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Edit
                        </button>
                        <button @click="handleDelete"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
                <div v-if="loading" class="text-center py-8">
                    <div class="text-gray-500">Loading...</div>
                </div>

                <div v-else-if="!product" class="text-center py-8">
                    <div class="text-red-500">Product not found</div>
                </div>

                <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <form v-if="isEditing" @submit.prevent="handleUpdate" class="p-6">
                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700">Nama</label>
                                <input id="name" v-model="editForm.name" type="text" required
                                    class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>

                            <div>
                                <label for="description"
                                    class="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea id="description" v-model="editForm.description" rows="3"
                                    class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label for="price" class="block text-sm font-medium text-gray-700">Harga</label>
                                    <input id="price" v-model.number="editForm.price" type="number" step="0.01" required
                                        class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>

                                <div>
                                    <label for="stock" class="block text-sm font-medium text-gray-700">Stok</label>
                                    <input id="stock" v-model.number="editForm.stock" type="number" required
                                        class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                            </div>

                            <div>
                                <label for="imageUrl" class="block text-sm font-medium text-gray-700">Link Gambar</label>
                                <input id="imageUrl" v-model="editForm.imageUrl" type="url"
                                    class="mt-1 block w-full border-gray-300 border-b-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>

                            <div class="flex items-center">
                                <input id="isActive" v-model="editForm.isActive" type="checkbox"
                                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <label for="isActive" class="ml-2 block text-sm text-gray-900">
                                    Produk aktif
                                </label>
                            </div>
                        </div>

                        <div v-if="error" class="mt-4 text-red-600 text-sm">
                            {{ error }}
                        </div>

                        <div class="mt-6 flex justify-end space-x-3">
                            <button type="button" @click="cancelEdit"
                                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Cancel
                            </button>
                            <button type="submit" :disabled="updating"
                                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {{ updating ? 'Updating...' : 'Update Product' }}
                            </button>
                        </div>
                    </form>

                    <div v-else class="px-4 py-5 sm:p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">{{ product?.name }}</h3>
                                    <div class="mt-1 flex items-center">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                            :class="product?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                                            {{ product?.isActive ? 'Active' : 'Inactive' }}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Deskripsi</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        {{ product?.description || 'No description available' }}
                                    </dd>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Harga</dt>
                                        <dd class="mt-1 text-lg font-semibold text-gray-900">
                                            Rp. {{ Number(product?.price).toLocaleString() }}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt class="text-sm font-medium text-gray-500">Stok</dt>
                                        <dd class="mt-1 text-lg font-semibold text-gray-900">
                                            {{ product?.stock }}
                                        </dd>
                                    </div>
                                </div>

                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Waktu Dibuat</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        {{ new Date(product?.createdAt).toLocaleString() }}
                                    </dd>
                                </div>

                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Waktu Diperbarui</dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        {{ new Date(product?.updatedAt).toLocaleString() }}
                                    </dd>
                                </div>
                            </div>

                            <div v-if="product?.imageUrl" class="flex justify-center">
                                <img :src="product?.imageUrl" :alt="product?.name"
                                    class="max-w-full h-auto rounded-lg shadow-md" @error="handleImageError" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useToast } from "vue-toastification"

const toast = useToast()
const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const isEditing = ref(false)
const updating = ref(false)
const error = ref('')

const product = computed(() => productsStore.currentProduct)
const loading = computed(() => productsStore.loading)

const editForm = reactive({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    isActive: true
})

onMounted(() => {
    const id = Number(route.params.id)
    productsStore.fetchProduct(id)
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    productsStore.currentProduct = null
    const id = Number(newId)
    productsStore.fetchProduct(id)
  }
}, { immediate: true })

const startEdit = () => {
    if (product.value) {
        Object.assign(editForm, {
            name: product.value.name,
            description: product.value.description || '',
            price: product.value.price,
            stock: product.value.stock,
            imageUrl: product.value.imageUrl || '',
            isActive: product.value.isActive
        })
        isEditing.value = true
    }
}

const cancelEdit = () => {
    isEditing.value = false
    error.value = ''
}

const handleUpdate = async () => {
    if (!product.value) return

    updating.value = true
    error.value = ''

    const result = await productsStore.updateProduct(product.value.id, editForm)

    if (result.success) {
        isEditing.value = false
    } else {
        error.value = result.error || 'Failed to update product'
    }

    updating.value = false
}

const handleDelete = async () => {
    if (!product.value) return

    if (confirm('Apakah anda yakin ingin menghapus produk ini?')) {
        const result = await productsStore.deleteProduct(product.value.id)
        if (result.success) {
            toast.error('Produk berhasil dihapus!')
            router.push('/')
        } else {
            alert('Gagal menghapus produk')
        }
    }
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.style.display = 'none'
}
</script>