<template>
  <section class="min-h-screen bg-gradient-to-b from-white to-sky-50/30 px-4 md:px-10 py-8">
    <!-- Stepper -->
    <div class="max-w-5xl mx-auto mb-6">
      <ol class="flex items-center gap-3 text-sm text-gray-500">
        <li class="flex items-center gap-2">
          <span class="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">1</span>
          {{ $t('checkout.stepper.cart') }}
        </li>
        <span class="w-8 h-[2px] bg-gray-200"></span>
        <li class="flex items-center gap-2 font-semibold text-sky-700">
          <span class="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">2</span>
          {{ $t('checkout.stepper.checkout') }}
        </li>
        <span class="w-8 h-[2px] bg-gray-200"></span>
        <li class="flex items-center gap-2">
          <span :class="[
            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition',
            currentStep === 3 ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-600'
          ]">3</span>
          <span :class="currentStep === 3 ? 'text-sky-700 font-semibold' : ''">
            {{ $t('checkout.stepper.confirm') }}
          </span>
        </li>
      </ol>
    </div>

    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl md:text-3xl font-extrabold mb-4">{{ $t('checkout.title') }}</h1>

      <!-- Empty -->
      <EmptyState v-if="items.length === 0">
        {{ $t('checkout.empty') }}
      </EmptyState>

      <!-- Success -->
      <div v-else-if="done"
        class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-3xl mx-auto text-center">
        <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
          ✓
        </div>
        <h2 class="text-xl font-bold">{{ $t('checkout.success.title') }}</h2>
        <p class="text-gray-600 mt-1">
          {{ $t('checkout.success.desc') }} <span class="font-semibold text-gray-800">#{{ done.id }}</span>
        </p>
        <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <NuxtLink to="/products"><BaseButton class="px-6">{{ $t('checkout.success.shopAgain') }}</BaseButton></NuxtLink>
          <NuxtLink to="/"><BaseButton variant="ghost" class="px-6">{{ $t('checkout.success.backHome') }}</BaseButton></NuxtLink>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="grid md:grid-cols-3 gap-6">
        <!-- Items -->
        <div class="md:col-span-2 space-y-4">
          <div v-for="(it, idx) in items" :key="idx"
            class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <img :src="it.image" :alt="it.title" class="h-20 w-20 object-contain bg-white rounded-xl" />
            <div class="flex-1">
              <p class="font-semibold line-clamp-2">{{ it.title }}</p>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ $t('checkout.items.price') ?? $t('cart.price') }}: {{ money(it.price) }}
              </p>
            </div>
            <span class="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {{ $t('checkout.items.qty') }}: {{ it.qty }}
            </span>
            <div class="w-24 text-right font-semibold">
              {{ money(it.price * (it.qty ?? 1)) }}
            </div>
          </div>

          <div ref="shippingRef" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 class="font-semibold">{{ $t('checkout.shipping.title') }}</h3>
            <div class="grid sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">
                  {{ $t('checkout.shipping.fullName') }} <span class="text-red-500">*</span>
                </label>
                <input v-model.trim="shipping.fullName" :placeholder="$t('checkout.shipping.fullNamePh')"
                  :class="inputClass(errors.fullName)" @blur="touch('fullName')" />
                <p v-if="errors.fullName" class="mt-1 text-xs text-red-600">{{ errors.fullName }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">
                  {{ $t('checkout.shipping.phone') }} <span class="text-red-500">*</span>
                </label>
                <input v-model.trim="shipping.phone" :placeholder="$t('checkout.shipping.phonePh')"
                  :class="inputClass(errors.phone)" @blur="touch('phone')" />
                <p v-if="errors.phone" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">
                  {{ $t('checkout.shipping.city') }} <span class="text-red-500">*</span>
                </label>
                <input v-model.trim="shipping.city" :placeholder="$t('checkout.shipping.cityPh')"
                  :class="inputClass(errors.city)" @blur="touch('city')" />
                <p v-if="errors.city" class="mt-1 text-xs text-red-600">{{ errors.city }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1">
                  {{ $t('checkout.shipping.zip') }} <span class="text-red-500">*</span>
                </label>
                <input v-model.trim="shipping.zip" :placeholder="$t('checkout.shipping.zipPh')"
                  :class="inputClass(errors.zip)" @blur="touch('zip')" />
                <p v-if="errors.zip" class="mt-1 text-xs text-red-600">{{ errors.zip }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">
                {{ $t('checkout.shipping.address') }} <span class="text-red-500">*</span>
              </label>
              <textarea v-model.trim="shipping.address" :placeholder="$t('checkout.shipping.addressPh')" rows="3"
                :class="textareaClass(errors.address)" @blur="touch('address')"></textarea>
              <p v-if="errors.address" class="mt-1 text-xs text-red-600">{{ errors.address }}</p>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <aside class="md:sticky md:top-20 h-max bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 class="font-semibold text-lg">{{ $t('checkout.summary.title') }}</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span>{{ $t('checkout.summary.subtotal') }}</span>
              <span>{{ money(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>{{ $t('checkout.summary.tax') }}</span>
              <span>{{ money(tax) }}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>{{ $t('checkout.summary.shipping') }}</span>
              <span>{{ $t('checkout.summary.shippingFree') }}</span>
            </div>
            <hr class="my-2" />
            <div class="flex justify-between text-lg font-bold">
              <span>{{ $t('checkout.summary.total') }}</span>
              <span>{{ money(total) }}</span>
            </div>
          </div>

          <BaseButton class="w-full py-3 text-base font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl
                   shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="loading" @click="submit">
            <div class="flex items-center gap-2 justify-center">
              <span>{{ loading ? $t('checkout.actions.processing') : $t('checkout.actions.confirm') }}</span>
              <Spinner v-if="loading" />
            </div>
          </BaseButton>

          <p class="text-xs text-gray-500 text-center">
            {{ $t('checkout.notice') }}
          </p>
        </aside>
      </div>
    </div>
  </section>

  <!-- Success modal -->
  <div v-if="showThanks" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true">
    <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
      <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">✓</div>
      <h3 class="text-lg font-bold">{{ $t('checkout.thanksModal.title') }}</h3>
      <p class="text-sm text-gray-600 mt-1">{{ $t('checkout.thanksModal.desc') }}</p>
      <div class="mt-5 flex gap-3 justify-center">
        <BaseButton class="px-6" @click="redirectNow">{{ $t('checkout.thanksModal.ok') }}</BaseButton>
      </div>
      <p class="mt-3 text-xs text-gray-500">{{ $t('checkout.thanksModal.redirectInfo') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const items = useState<any[]>('cart', () => [])
const subtotal = computed(() => items.value.reduce((s, x) => s + x.price * (x.qty ?? 1), 0))
const taxRate = 0.1
const tax = computed(() => subtotal.value * taxRate)
const total = computed(() => subtotal.value + tax.value)
const currentStep = ref(2)

const loading = ref(false)
const done = ref<any>(null)
const showThanks = ref(false)
const router = useRouter()

const { locale } = useI18n()
const CONVERT_MODE = true
const USD_TO_IDR = 15500
const IDR_TO_USD = 1 / USD_TO_IDR

const currency = computed<'IDR' | 'USD'>(() => (locale.value === 'id' ? 'IDR' : 'USD'))
const formatLocale = computed(() => (currency.value === 'USD' ? 'en-US' : 'id-ID'))

function formatCurrency(baseUsdValue: number) {
  const v = Number(baseUsdValue || 0)
  const displayValue = CONVERT_MODE ? (currency.value === 'IDR' ? v * USD_TO_IDR : v) : v
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

/** Form & validation */
const shippingRef = ref<HTMLElement | null>(null)
const shipping = reactive({ fullName: '', phone: '', city: '', zip: '', address: '' })
const touched = reactive<Record<keyof typeof shipping, boolean>>({
  fullName: false, phone: false, city: false, zip: false, address: false
})
const errors = reactive<Record<keyof typeof shipping, string | null>>({
  fullName: null, phone: null, city: null, zip: null, address: null
})

function inputClass(err: string | null) {
  return [
    'w-full rounded-xl border p-3 focus:outline-none transition',
    err ? 'border-red-500 focus:ring-2 focus:ring-red-300' : 'border-gray-200 focus:ring-2 focus:ring-sky-400'
  ]
}
function textareaClass(err: string | null) {
  return [
    'w-full rounded-xl border p-3 focus:outline-none transition',
    err ? 'border-red-500 focus:ring-2 focus:ring-red-300' : 'border-gray-200 focus:ring-2 focus:ring-sky-400'
  ]
}

function touch<K extends keyof typeof shipping>(key: K) {
  touched[key] = true
  validateField(key)
}

function validateField<K extends keyof typeof shipping>(key: K) {
  const v = String(shipping[key] ?? '').trim()
  let msg: string | null = null
  if (!v) {
    msg = 'This field is mandatory'
  } else {
    if (key === 'phone') {
      const ok = /^[+]?[\d\s-]{8,15}$/.test(v)
      if (!ok) msg = 'Nomor telepon tidak valid'
    }
    if (key === 'zip') {
      const ok = /^[A-Za-z0-9\-]{4,10}$/.test(v)
      if (!ok) msg = 'Kode pos tidak valid'
    }
  }
  errors[key] = msg
}

function validateAll() {
  (Object.keys(shipping) as (keyof typeof shipping)[]).forEach((k) => {
    touched[k] = true
    validateField(k)
  })
  return Object.values(errors).every((e) => !e)
}

function scrollToShipping() {
  if (shippingRef.value) shippingRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Submit */
function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)) }
async function redirectNow() { await router.push('/products') }

async function submit() {
  if (!validateAll()) {
    scrollToShipping()
    return
  }
  loading.value = true
  try {
    const payload = {
      userId: 1,
      date: new Date().toISOString().slice(0, 10),
      products: items.value.map((x) => ({ productId: x.id, quantity: x.qty ?? 1 })),
      shipping
    }
    const res = await $fetch('/api/carts/create', { method: 'POST', body: payload })
    done.value = res
    items.value = []
    currentStep.value = 3
    showThanks.value = true
    await sleep(1800)
    await router.push('/products')
  } finally {
    loading.value = false
  }
}
</script>