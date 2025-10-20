<template>
  <div v-if="pending" class="flex justify-center py-20"><Spinner /></div>
  <EmptyState v-else-if="error">Produk tidak ditemukan.</EmptyState>
  <div v-else class="grid md:grid-cols-2 gap-8">
    <img :src="product.image" :alt="product.title" class="w-full h-[380px] object-contain bg-white rounded-2xl border" />
    <div>
      <h1 class="text-2xl font-bold">{{ product.title }}</h1>
      <p class="text-gray-500 mt-2">{{ product.category }}</p>
      <p class="text-3xl font-extrabold text-sky-700 mt-4">$ {{ product.price }}</p>
      <p class="mt-4 text-gray-700">{{ product.description }}</p>
      <BaseButton class="mt-6" variant="primary" @click="addToCart(product)">Add to Cart</BaseButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const { $api } = useNuxtApp()
const { data, pending, error } = await useAsyncData(() => $api(`/products/${route.params.id}`))
const product = computed(()=>data.value)
const cart = useState<any[]>('cart', () => [])
function addToCart(item:any){ cart.value.push({ ...item, qty: 1 }) }
</script>