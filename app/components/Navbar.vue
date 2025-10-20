<template>
  <nav class="sticky top-0 z-20 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div class="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
      <NuxtLink to="/" class="font-extrabold text-lg md:text-xl tracking-tight hover:text-sky-600 transition">
        🛍️ IstanaGroupStore
      </NuxtLink>
      <div class="flex items-center gap-2 md:gap-4">
        <NuxtLink :to="`/products`" :class="linkClass('/products')">Products</NuxtLink>

        <div v-if="role !== 'admin'" class="relative">
          <NuxtLink :to="`/cart`" :class="linkClass('/cart')">
            Cart
          </NuxtLink>
          <span v-if="cartQty > 0" class="absolute -top-2 -right-3 min-w-[1.1rem] h-5 px-1 rounded-full
                   bg-sky-600 text-white text-[10px] leading-5 text-center
                   shadow ring-2 ring-white" aria-label="Items in cart">{{ cartQty }}</span>
        </div>

        <NuxtLink v-if="logged && role === 'admin'" :to="`/admin`" :class="linkClass('/admin')">Admin</NuxtLink>

        <template v-if="logged">
          <span class="hidden sm:inline text-sm text-gray-500">| {{ user?.username }}</span>
          <BaseButton variant="ghost" class="px-3 py-1.5" @click="onLogout">Logout</BaseButton>
        </template>
        <template v-else>
          <NuxtLink :to="`/login`" :class="linkClass('/login')">Login</NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { role, user, logged, logout } = useAuth()

// product count
type CartItem = { qty?: number }
const items = useState<CartItem[]>('cart', () => [])
const cartQty = computed(() =>
  (items.value || []).reduce((s, x) => s + (x.qty ?? 1), 0)
)

function linkClass(path: string) {
  const active = route.path.startsWith(path)
  return [
    'relative px-2 py-1 rounded-md font-medium transition',
    'text-gray-700 hover:text-sky-700 hover:bg-sky-50',
    active && 'text-sky-700 bg-sky-50 ring-1 ring-sky-200'
  ]
}

async function onLogout() {
  await logout()
  navigateTo('/')
}
</script>