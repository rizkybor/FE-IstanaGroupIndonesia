<template>
  <nav class="sticky top-0 z-20 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div class="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
      <!-- brand -->
      <NuxtLink :to="localePath('/')" class="font-extrabold text-lg md:text-xl tracking-tight hover:text-sky-600 transition">
        {{ t('app.brand') }}
      </NuxtLink>

      <div class="flex items-center gap-2 md:gap-4">
        <!-- Products -->
        <NuxtLink :to="localePath('/products')" :class="linkClass('/products')">
          {{ t('app.products') }}
        </NuxtLink>

        <!-- Cart (non-admin) -->
        <div v-if="role !== 'admin'" class="relative">
          <NuxtLink :to="localePath('/cart')" :class="linkClass('/cart')">
            {{ t('app.cart') }}
          </NuxtLink>
          <span
            v-if="cartQty > 0"
            class="absolute -top-2 -right-3 min-w-[1.1rem] h-5 px-1 rounded-full
                   bg-sky-600 text-white text-[10px] leading-5 text-center shadow ring-2 ring-white"
            :aria-label="t('app.itemsInCart')"
          >{{ cartQty }}</span>
        </div>

        <!-- Admin -->
        <NuxtLink v-if="logged && role === 'admin'" :to="localePath('/admin')" :class="linkClass('/admin')">
          {{ t('app.admin') }}
        </NuxtLink>

        <!-- Auth -->
        <template v-if="logged">
          <span class="hidden sm:inline text-sm text-gray-500">| {{ user?.username }}</span>
          <BaseButton variant="ghost" class="px-3 py-1.5" @click="onLogout">
            {{ t('app.logout') }}
          </BaseButton>
        </template>
        <template v-else>
          <NuxtLink :to="localePath('/login')" :class="linkClass('/login')">
            {{ t('app.login') }}
          </NuxtLink>
        </template>

        <!-- Language Switcher (ID/EN) -->
        <button
          style="cursor: pointer"
          @click="toggleLocale"
          class="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200
                 bg-white/70 shadow-sm text-sm font-medium text-slate-700
                 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700
                 active:scale-[0.97] active:shadow-inner
                 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700
                 transition-all duration-150"
          :title="t('app.lang')"
        >
          <img
            v-if="locale === 'id'"
            src="https://flagcdn.com/w20/id.png"
            alt="Indonesia"
            class="w-5 h-3 rounded-sm shadow-sm"
          />
          <img
            v-else
            src="https://flagcdn.com/w20/gb.png"
            alt="English"
            class="w-5 h-3 rounded-sm shadow-sm"
          />
          <span class="tracking-wide">
            {{ locale.toUpperCase() === 'ID' ? 'ID → EN' : 'EN → ID' }}
          </span>
          <span class="absolute inset-0 rounded-full bg-sky-100 opacity-0 group-hover:opacity-10 transition-opacity"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { role, user, logged, logout } = useAuth()

// i18n
const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()

// product count
type CartItem = { qty?: number }
const items = useState<CartItem[]>('cart', () => [])
const cartQty = computed(() =>
  (items.value || []).reduce((s, x) => s + (x.qty ?? 1), 0)
)

// active link helper (aware i18n prefix)
function linkClass(path: string) {
  const target = localePath(path) as string
  const active = route.fullPath.startsWith(target)
  return [
    'relative px-2 py-1 rounded-md font-medium transition',
    'text-gray-700 hover:text-sky-700 hover:bg-sky-50',
    active && 'text-sky-700 bg-sky-50 ring-1 ring-sky-200'
  ]
}

async function onLogout() {
  await logout()
  navigateTo(localePath('/'))
}

function toggleLocale() {
  setLocale(locale.value === 'id' ? 'en' : 'id')
}
</script>