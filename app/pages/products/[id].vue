<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-sky-50/30 px-4 md:px-12 py-10">
    <!-- Loading -->
    <div v-if="pending" class="flex justify-center py-20">
      <Spinner />
    </div>

    <!-- Error -->
    <EmptyState v-else-if="error">Produk tidak ditemukan.</EmptyState>

    <!-- Content -->
    <div v-else
      class="grid md:grid-cols-2 gap-10 items-start max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      <div
        class="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner">
        <img :src="product.image" :alt="product.title"
          class="w-full max-w-sm h-[400px] object-contain drop-shadow-sm transition-transform hover:scale-[1.03]" />
      </div>

      <div class="flex flex-col">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">
            {{ product.title }}
          </h1>
          <p class="mt-1 inline-block bg-sky-100 text-sky-700 text-xs font-medium px-3 py-1 rounded-full capitalize">
            {{ product.category }}
          </p>
        </div>

        <div class="mt-6">
          <p class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-700">
            {{ money(product.price) }}
          </p>
        </div>

        <p class="mt-6 text-gray-700 leading-relaxed">
          {{ product.description }}
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <BaseButton v-if="role !== 'admin'"
            class="flex-1 py-3 text-lg font-semibold shadow-md transition hover:shadow-lg" style="cursor: pointer;"
            variant="primary" @click="addToCart(product)">
            🛒 {{ $t('product.addToCart') }}
          </BaseButton>

          <NuxtLink to="/products">
            <BaseButton variant="ghost" class="flex-1 py-3 text-lg border-gray-300 hover:bg-gray-50 transition"
              style="cursor: pointer;">
              ← {{ $t('product.back') }}
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { role } = useAuth()
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const { data, pending, error } = await useAsyncData(() => $api(`/products/${route.params.id}`))
const product = computed(() => data.value)
const cart = useState<any[]>('cart', () => [])
const { logged } = useAuth()

const { locale } = useI18n()
const CONVERT_MODE = true
const USD_TO_IDR = 15500
const IDR_TO_USD = 1 / USD_TO_IDR

const currency = computed<'IDR' | 'USD'>(() => (locale.value === 'id' ? 'IDR' : 'USD'))
const formatLocale = computed(() => (currency.value === 'USD' ? 'en-US' : 'id-ID'))

function formatCurrency(baseUsdValue: number) {
  const v = Number(baseUsdValue || 0)
  const displayValue = CONVERT_MODE
    ? (currency.value === 'IDR' ? v * USD_TO_IDR : v)
    : v

  return new Intl.NumberFormat(formatLocale.value, {
    style: 'currency',
    currency: currency.value,
    minimumFractionDigits: currency.value === 'USD' ? 2 : 0
  }).format(displayValue)
}

function money(n: number | { valueOf(): number }) {
  const val = typeof n === 'number' ? n : Number(n.valueOf())
  return formatCurrency(val)
}

function addToCart(item: any) {
  if (!logged.value) {
    router.push(`/login?next=${encodeURIComponent(route.fullPath)}`)
    return
  }
  const existing = cart.value.find(p => p.id === item.id)
  if (existing) {
    existing.qty += 1
    toast(`${useI18n().t('cart.updatedQty')}: ${existing.qty}`)
  } else {
    cart.value.push({ ...item, qty: 1 })
    toast(useI18n().t('cart.added').toString())
  }
}

function toast(msg: string) {
  const el = document.createElement('div')
  el.className =
    'fixed bottom-6 right-6 bg-sky-600 text-white px-4 py-2 rounded-xl shadow-lg animate-fade-in text-sm font-medium'
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1300)
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(5px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.25s ease-out; }
</style>