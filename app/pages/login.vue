<template>
  <div class="mx-auto max-w-md">
    <h1 class="text-2xl font-bold mb-4">Login</h1>
    <form @submit.prevent="onSubmit" class="space-y-3">
      <input v-model="username" placeholder="username" class="w-full rounded-xl border p-3" />
      <input v-model="password" type="password" placeholder="password" class="w-full rounded-xl border p-3" />
      <BaseButton class="w-full" variant="primary" :disabled="pending">
        <div class="flex items-center gap-2 justify-center">
          <span>Sign In</span>
          <Spinner v-if="pending" />
        </div>
      </BaseButton>
      <p class="text-sm text-gray-500">Demo: <b>johnd</b> / <b>m38rmF$</b></p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </div>
</template>
<script setup lang="ts">
const { logged, login } = useAuth()
const router = useRouter()
const username = ref('johnd')
const password = ref('m38rmF$')
const pending = ref(false)
const error = ref<string | null>(null)

onMounted(() => { if (logged.value) router.push('/products') })

async function onSubmit() {
  error.value = null; pending.value = true
  try {
    await login(username.value, password.value)
    router.push('/products')
  } catch (e:any) {
    error.value = 'Login gagal. Periksa username/password.'
  } finally { pending.value = false }
}
</script>