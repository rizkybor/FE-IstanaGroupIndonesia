<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-sky-50/40 to-white">
    <div class="w-full max-w-md">
      <div class="rounded-t-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-4 shadow-sm">
        <h1 class="text-xl font-bold">Welcome back</h1>
        <p class="text-white/90 text-sm">Please log in to continue</p>
      </div>

      <!-- Card -->
      <div class="rounded-b-2xl bg-white border border-gray-100 shadow-md p-6 space-y-4">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              v-model="username"
              placeholder="username"
              autocomplete="username"
              class="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                :type="showPass ? 'text' : 'password'"
                v-model="password"
                placeholder="password"
                autocomplete="current-password"
                class="w-full rounded-xl border border-gray-200 p-3 pr-10 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
              <button
                type="button"
                @click="showPass = !showPass"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                aria-label="Toggle password visibility"
              >
                {{ showPass ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="inline-flex items-center gap-2 select-none">
              <input type="checkbox" v-model="remember" class="rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
              <span class="text-gray-600">Remember me</span>
            </label>
            <NuxtLink to="/" class="text-sky-700 hover:underline">Back to Home</NuxtLink>
          </div>

          <BaseButton style="cursor: pointer;" class="w-full py-3 text-base font-semibold shadow-md hover:shadow-lg"
            variant="primary" :disabled="pending">
            <div class="flex items-center gap-2 justify-center">
              <span>Sign In</span>
              <Spinner v-if="pending" />
            </div>
          </BaseButton>

          <!-- Error -->
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        </form>

        <!-- Demo accounts -->
        <div class="mt-2 border-t pt-4">
          <p class="text-xs text-gray-500 mb-2">Quick fill demo account:</p>
          <div class="flex gap-2">
            <button
              type="button"
              @click="fillAdmin()"
              class="flex-1 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
            >Admin (admin/$$991122)</button>
            <button
              type="button"
              @click="fillUser()"
              class="flex-1 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
            >User (johnd/m38rmF$)</button>
          </div>
        </div>
      </div>

      <p class="text-center text-xs text-gray-500 mt-3">
        After logging in, you will be redirected to the previous page (if any).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { logged, login } = useAuth()

const username = ref('johnd')
const password = ref('m38rmF$')
const showPass = ref(false)
const remember = ref(false) 
const error = ref<string | null>(null)
const pending = ref(false)

onMounted(() => {
  if (logged.value) {
    const next = (route.query.next as string) || '/products'
    router.replace(next)
  }
})

async function onSubmit() {
  error.value = null; pending.value = true
  try {
    await login(username.value, password.value)
    if (remember.value) localStorage.setItem('last_username', username.value)
    const next = (route.query.next as string) || '/products'
    router.replace(next)
  } catch (e) {
    error.value = 'Login gagal. Periksa username/password.'
  } finally { pending.value = false }
}

// Autofilled 
function fillAdmin() {
  username.value = 'admin'
  password.value = '$$991122'
}
function fillUser() {
  username.value = 'johnd'
  password.value = 'm38rmF$'
}
</script>