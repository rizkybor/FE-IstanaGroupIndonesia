<template>
  <section class="min-h-screen bg-gradient-to-b from-white to-sky-50/30 px-4 md:px-10 py-8">
    <div class="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ $t('adminProducts.title') }}</h1>
        <p class="text-sm text-gray-500">{{ $t('adminProducts.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input
            v-model="q"
            :placeholder="$t('adminProducts.searchPlaceholder')"
            class="w-56 rounded-xl border border-gray-200 bg-white px-4 py-2 pl-10 shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
          />
        </div>
        <BaseButton style="cursor: pointer;" variant="primary" class="shadow-md hover:shadow-lg" @click="openCreate()">
          {{ $t('adminProducts.newBtn') }}
        </BaseButton>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="pending" class="flex justify-center py-16"><Spinner /></div>
    <EmptyState v-else-if="error">{{ $t('adminProducts.error') }}</EmptyState>

    <!-- Table -->
    <div v-else class="max-w-6xl mx-auto overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-0">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr class="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-gray-600">
              <th class="w-12">{{ $t('adminProducts.table.no') }}</th>
              <th class="w-20">{{ $t('adminProducts.table.image') }}</th>
              <th class="cursor-pointer select-none" @click="toggleSort('title')">
                {{ $t('adminProducts.table.title') }} <SortIcon :active="sortKey === 'title'" :dir="sortDir" />
              </th>
              <th class="cursor-pointer select-none w-28" @click="toggleSort('price')">
                {{ $t('adminProducts.table.price') }} <SortIcon :active="sortKey === 'price'" :dir="sortDir" />
              </th>
              <th class="cursor-pointer select-none w-44" @click="toggleSort('category')">
                {{ $t('adminProducts.table.category') }} <SortIcon :active="sortKey === 'category'" :dir="sortDir" />
              </th>
              <th class="w-40 text-right">{{ $t('adminProducts.table.actions') }}</th>
            </tr>
          </thead>

          <tbody class="[&>tr]:border-t [&>tr]:border-gray-100">
            <tr v-for="(p, i) in paginated" :key="p.id" class="hover:bg-sky-50/40 transition">
              <td class="px-4 py-3 text-sm text-gray-500">{{ (page - 1) * perPage + i + 1 }}</td>
              <td class="px-4 py-3">
                <img :src="p.image" :alt="p.title" class="h-12 w-12 object-contain bg-gray-50 rounded-md border" />
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-gray-800 line-clamp-2">{{ p.title }}</p>
              </td>
              <td class="px-4 py-3 font-semibold text-sky-700">
                {{ displayPrice(p.price) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ p.category }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <BaseButton style="cursor: pointer;" size="sm" @click="openEdit(p)">
                    {{ $t('adminProducts.table.edit') }}
                  </BaseButton>
                  <BaseButton style="cursor: pointer;" size="sm" variant="ghost" @click="remove(p.id)">
                    {{ $t('adminProducts.table.delete') }}
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-if="paginated.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-gray-500">
                {{ $t('adminProducts.table.emptyFiltered') }} <b>{{ q }}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
        <p class="text-sm text-gray-600">
          {{ $t('adminProducts.pagination.showing') }}
          <b>{{ startRow + 1 }}</b>–<b>{{ endRow }}</b> of <b>{{ filtered.length }}</b>
        </p>

        <div class="flex items-center gap-3">
          <select v-model.number="perPage" class="rounded-lg border px-2 py-1 text-sm">
            <option :value="6">6 / page</option>
            <option :value="12">12 / page</option>
            <option :value="24">24 / page</option>
          </select>

          <div class="flex items-center gap-2 select-none">
            <button
              style="cursor: pointer;"
              class="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 transition disabled:opacity-40"
              :disabled="page === 1"
              @click="goPrev"
            >
              {{ $t('adminProducts.pagination.prev') }}
            </button>
            <div class="hidden sm:flex items-center gap-1">
              <button
                style="cursor: pointer;"
                v-for="n in pages"
                :key="n"
                @click="page = n"
                class="w-8 h-8 rounded-md text-sm"
                :class="n === page ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'"
              >
                {{ n }}
              </button>
            </div>
            <button
              style="cursor: pointer;"
              class="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 transition disabled:opacity-40"
              :disabled="page === pages || pages === 0"
              @click="goNext"
            >
              {{ $t('adminProducts.pagination.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <dialog
      ref="dlg"
      style="inset:0;margin:auto"
      class="rounded-2xl p-0 border w-full max-w-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <form @submit.prevent="save" class="p-6 bg-white rounded-2xl space-y-4 shadow-lg">
        <h2 class="text-xl font-bold text-gray-900 border-b pb-2">
          {{ form.id ? $t('adminProducts.modal.editTitle') : $t('adminProducts.modal.newTitle') }}
        </h2>

        <div class="grid gap-3">
          <label class="text-sm font-medium text-gray-700">
            {{ $t('adminProducts.modal.fields.title') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            :placeholder="$t('adminProducts.modal.fields.titlePh')"
            class="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />

          <label class="text-sm font-medium text-gray-700">
            {{ $t('adminProducts.modal.fields.description') }}
          </label>
          <textarea
            v-model="form.description"
            :placeholder="$t('adminProducts.modal.fields.descriptionPh')"
            class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500"
            rows="3"
          />

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">
                {{ $t('adminProducts.modal.fields.price') }} <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputmode="decimal"
                v-model="priceDisplay"
                :placeholder="$t('adminProducts.modal.fields.pricePh')"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500"
                required
                @input="onInputPrice"
                @paste="onPastePrice"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">
                {{ $t('adminProducts.modal.fields.category') }}
              </label>
              <input
                v-model="form.category"
                :placeholder="$t('adminProducts.modal.fields.categoryPh')"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <label class="text-sm font-medium text-gray-700">
            {{ $t('adminProducts.modal.fields.image') }}
          </label>
          <input
            v-model="form.image"
            placeholder="https://example.com/image.jpg"
            class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div class="flex gap-2 justify-end pt-4 border-t">
          <BaseButton style="cursor: pointer;" type="button" variant="ghost" @click="closeDlg">
            {{ $t('adminProducts.modal.cancel') }}
          </BaseButton>
          <BaseButton style="cursor: pointer;" variant="primary" type="submit" class="shadow-md hover:shadow-lg">
            {{ saving ? $t('adminProducts.modal.saving') : $t('adminProducts.modal.save') }}
          </BaseButton>
        </div>
      </form>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { h, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

/** Fetch products */
const { $api } = useNuxtApp()
const { data, pending, error } = await useAsyncData('admin-products', () => $api('/products'))
const products = computed<any[]>(() => data.value || [])

/** Search */
const q = ref('')

/** Sorting */
type SortKey = 'title' | 'price' | 'category'
const sortKey = ref<SortKey>('title')
const sortDir = ref<'asc' | 'desc'>('asc')
function toggleSort(k: SortKey) {
  if (sortKey.value === k) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = k; sortDir.value = 'asc' }
}

/** filtered + sorted */
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  const base = term
    ? products.value.filter((p) =>
        (p.title || '').toLowerCase().includes(term) ||
        (p.category || '').toLowerCase().includes(term)
      )
    : products.value

  return [...base].sort((a: any, b: any) => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    if (sortKey.value === 'price') return (a.price - b.price) * dir
    const ka = (a[sortKey.value] ?? '').toString().toLowerCase()
    const kb = (b[sortKey.value] ?? '').toString().toLowerCase()
    return ka < kb ? -1 * dir : ka > kb ? 1 * dir : 0
  })
})

/** Pagination */
const page = ref(1)
const perPage = ref(12)
const pages = computed(() => Math.ceil(filtered.value.length / perPage.value))
watch([filtered, perPage], () => { page.value = 1 })
const startRow = computed(() => (page.value - 1) * perPage.value)
const endRow = computed(() => Math.min(filtered.value.length, startRow.value + perPage.value))
const paginated = computed(() => filtered.value.slice(startRow.value, endRow.value))
function goPrev() { if (page.value > 1) page.value-- }
function goNext() { if (page.value < pages.value) page.value++ }

/** Modal Create/Edit */
const dlg = ref<HTMLDialogElement | null>(null)
const form = reactive<any>({ id: null, title: '', description: '', price: 0, category: '', image: '' })
const saving = ref(false)

/** I18n & Currency */
const { locale } = useI18n()
const CONVERT_MODE = true
const USD_TO_IDR = 15500
const IDR_TO_USD = 1 / USD_TO_IDR

const currency = computed<'IDR' | 'USD'>(() => (locale.value === 'id' ? 'IDR' : 'USD'))
const formatLocale = computed(() => (currency.value === 'USD' ? 'en-US' : 'id-ID'))

function formatCurrencyForDisplay(baseUsdValue: number) {
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

function displayPrice(baseUsdValue: number) {
  return formatCurrencyForDisplay(baseUsdValue)
}

function parseDisplayToUsd(rawInput: string): number {
  const cleaned = rawInput.replace(/[^\d.,-]/g, '')
  let normalized = cleaned

  if (formatLocale.value === 'id-ID') {
    normalized = normalized.replace(/\./g, '').replace(',', '.')
  } else {
    normalized = normalized.replace(/,/g, '')
  }

  const localNumber = Number(normalized || '0')
  if (isNaN(localNumber)) return 0

  if (CONVERT_MODE && currency.value === 'IDR') {
    return Number((localNumber * IDR_TO_USD).toFixed(6))
  }
  return localNumber
}

const priceDisplay = ref('')

watch([() => form.price, currency], ([val]) => {
  priceDisplay.value = formatCurrencyForDisplay(Number(val || 0))
}, { immediate: true })

function onInputPrice(e: Event) {
  const input = e.target as HTMLInputElement
  const usdValue = parseDisplayToUsd(input.value)
  form.price = usdValue
  priceDisplay.value = formatCurrencyForDisplay(usdValue)
}

function onPastePrice(e: ClipboardEvent) {
  e.preventDefault()
  const t = e.clipboardData?.getData('text') ?? ''
  const usdValue = parseDisplayToUsd(t)
  form.price = usdValue
  priceDisplay.value = formatCurrencyForDisplay(usdValue)
}

/** Dialog Controls */
function openCreate() {
  Object.assign(form, { id: null, title: '', description: '', price: 0, category: '', image: '' })
  priceDisplay.value = formatCurrencyForDisplay(form.price)
  dlg.value?.showModal()
}
function openEdit(p: any) {
  Object.assign(form, p)
  priceDisplay.value = formatCurrencyForDisplay(form.price)
  dlg.value?.showModal()
}
function closeDlg() { dlg.value?.close() }

/** Notifier */
function notify(msg: string, type: 'success' | 'error' = 'success') {
  const el = document.createElement('div')
  el.className = [
    'fixed bottom-6 right-6 z-[60] min-w-[220px] max-w-sm px-4 py-2 rounded-xl shadow-lg',
    'text-sm font-medium text-white animate-fade-in-up',
    type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
  ].join(' ')
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1800)
}

/** Save */
async function save() {
  if (!form.title?.trim()) return notify('Harap isi judul produk.', 'error')
  if (form.price <= 0) return notify('Harga produk harus lebih dari 0.', 'error')
  if (!form.category?.trim()) return notify('Harap isi kategori produk.', 'error')
  if (!form.image?.trim()) return notify('Harap isi URL gambar produk.', 'error')

  saving.value = true
  try {
    let res, newData
    if (form.id) {
      res = await $api(`/products/${form.id}`, { method: 'PUT', body: form })
      newData = res.data || res
      const idx = products.value.findIndex(p => p.id === form.id)
      if (idx !== -1) products.value[idx] = newData
    } else {
      res = await $api('/products', { method: 'POST', body: form })
      newData = res.data || res
      products.value.unshift(newData)
    }
    notify(res.message || res.statusText || 'Berhasil disimpan!', 'success')
    closeDlg()
  } catch (e: any) {
    notify(e?.data?.message || e?.message || 'Gagal menyimpan data.', 'error')
  } finally {
    saving.value = false
  }
}

/** Remove */
async function remove(id: number) {
  if (!confirm('Yakin ingin menghapus produk ini?')) return
  try {
    const res = await $api(`/products/${id}`, { method: 'DELETE' })
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) products.value.splice(idx, 1)
    notify(res.message || res.statusText || 'Produk berhasil dihapus.', 'success')
  } catch (e: any) {
    notify(e?.data?.message || e?.message || 'Gagal menghapus produk.', 'error')
  }
}

/** DynamicSortIcon */
const SortIcon = defineComponent({
  props: { active: { type: Boolean, default: false }, dir: { type: String as () => 'asc' | 'desc', default: 'asc' } },
  setup(props) {
    return () =>
      h('span',
        { class: ['inline-block align-middle ml-1 text-xs', props.active ? 'text-sky-600' : 'text-gray-300'] },
        props.active ? (props.dir === 'asc' ? '▲' : '▼') : '△'
      )
  }
})
</script>

<style lang="css" scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.25s ease-out; }
</style>