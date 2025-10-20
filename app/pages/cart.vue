<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Cart</h1>
    <EmptyState v-if="items.length===0">Keranjang kosong.</EmptyState>

    <div v-else class="space-y-4">
      <div v-for="(it,idx) in items" :key="idx" class="flex items-center gap-4 p-3 bg-white rounded-xl border">
        <img :src="it.image" class="h-16 w-16 object-contain" />
        <div class="flex-1">
          <p class="font-medium line-clamp-1">{{ it.title }}</p>
          <p class="text-sm text-gray-500">$ {{ it.price }}</p>
        </div>
        <input type="number" min="1" v-model.number="it.qty" class="w-20 rounded-xl border p-2" />
        <BaseButton @click="remove(idx)">Remove</BaseButton>
      </div>

      <div class="flex items-center justify-between p-4 rounded-xl bg-gray-100">
        <p class="font-semibold">Total</p>
        <p class="text-xl font-bold">$ {{ total }}</p>
      </div>

      <BaseButton variant="primary" class="w-full" @click="checkout">Checkout (dummy)</BaseButton>
      <p v-if="message" class="text-green-700">{{ message }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
const items = useState<any[]>('cart', () => [])
const total = computed(()=> items.value.reduce((s,x)=> s + x.price*(x.qty??1), 0).toFixed(2))
const message = ref('')
function remove(i:number){ items.value.splice(i,1) }
function checkout(){ message.value='Checkout success (dummy).'; items.value=[] }
</script>