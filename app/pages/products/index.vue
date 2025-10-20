<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Products</h1>
      <input v-model="q" placeholder="Cari..." class="rounded-xl border p-2 w-60" />
    </div>

    <div v-if="pending" class="flex justify-center py-20"><Spinner /></div>
    <EmptyState v-else-if="error">Terjadi kesalahan memuat produk.</EmptyState>
    <EmptyState v-else-if="filtered.length===0">Tidak ada produk.</EmptyState>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" @add="addToCart" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const { data, pending, error } = await useAsyncData('products', () => $api('/products'))
const q = ref('')

const filtered = computed(() => {
  const list = data.value || []
  return q.value ? list.filter((x:any) => x.title.toLowerCase().includes(q.value.toLowerCase())) : list
})

const cart = useState<any[]>('cart', () => [])
function addToCart(item:any){ cart.value.push({ ...item, qty: 1 }); toast('Added to cart') }

function toast(msg:string){
  const el = document.createElement('div')
  el.className = 'fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded-xl'
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(()=>el.remove(),1200)
}
</script>