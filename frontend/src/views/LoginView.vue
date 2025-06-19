<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-4">
            <div>
                <h1 class="mb-14 text-center text-6xl font-black text-gray-900">
                    Klontong
                </h1>
            </div>
            <div>
                <h2 class="mb-6 text-center text-2xl font-semibold text-gray-900">
                    {{ isLoginMode ? 'Sign in' : 'Create an account' }}
                </h2>
            </div>
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div v-if="!isLoginMode">
                        <label for="name" class="sr-only">Name</label>
                        <input id="name" v-model="form.name" name="name" type="text" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Full name" />
                    </div>
                    <div>
                        <label for="email" class="sr-only">Email address</label>
                        <input id="email" v-model="form.email" name="email" type="email" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            :class="{ 'rounded-t-md': isLoginMode, 'rounded-none': !isLoginMode }"
                            placeholder="Email address" />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input id="password" v-model="form.password" name="password" type="password" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password" />
                    </div>
                </div>

                <div v-if="error" class="text-red-600 text-sm text-center">
                    {{ error }}
                </div>

                <div>
                    <button type="submit" :disabled="loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {{ loading ? 'Processing...' : (isLoginMode ? 'Sign in' : 'Sign up') }}
                    </button>
                </div>

                <div class="text-center">
                    <button type="button" @click="toggleMode" class="text-indigo-600 hover:text-indigo-500 text-sm">
                        {{ isLoginMode ? 'Need an account? Sign up' : 'Already have an account? Sign in' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from "vue-toastification"

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()

const isLoginMode = ref(true)
const loading = ref(false)
const error = ref('')

const form = reactive({
    name: '',
    email: '',
    password: ''
})

const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value
    error.value = ''
    Object.assign(form, { name: '', email: '', password: '' })
}

const handleSubmit = async () => {
    loading.value = true
    error.value = ''

    try {
        if (isLoginMode.value) {
            const result = await authStore.login(form.email, form.password)
            if (result.success) {
                toast.success('Login success!')
                router.push('/')
            } else {
                error.value = result.error || 'Login failed'
            }
        } else {
            const result = await authStore.register(form.name, form.email, form.password)
            if (result.success) {
                error.value = ''
                isLoginMode.value = true
                Object.assign(form, { name: '', email: '', password: '' })

                toast.success('Sign up success! Please sign in.')
                router.push('/login')
            } else {
                error.value = result.error || 'Registration failed'
            }
        }
    } finally {
        loading.value = false
    }
}
</script>