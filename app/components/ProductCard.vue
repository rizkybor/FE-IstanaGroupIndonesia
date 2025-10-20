<template>
  <div class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 
           bg-white p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out h-full">
    <NuxtLink :to="`/products/${product.id}`" class="flex-1 block">
      <div class="aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
        <img :src="product.image" :alt="product.title"
          class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
      </div>

      <div class="mt-4 space-y-1">
        <h3
          class="line-clamp-2 text-sm sm:text-base font-semibold text-gray-800 group-hover:text-sky-700 group-hover:underline transition">
          {{ product.title }}
        </h3>
        <p class="text-sky-700 font-bold text-lg">$ {{ product.price.toFixed(2) }}</p>
      </div>
    </NuxtLink>

    <div class="mt-4">
      <BaseButton v-if="role !== 'admin'" class="w-full py-2 font-medium rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-md
               transition-all duration-200 ease-in-out active:scale-[0.97]" style="cursor: pointer;"
        @click="$emit('add', product)">
        <div class="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8h13.2L17 13M7 13h10" />
          </svg>
          <span>Add to Cart</span>
        </div>
      </BaseButton>
    </div>

    <div v-if="product.isNew"
      class="absolute top-3 right-3 bg-sky-100 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full">
      NEW
    </div>
  </div>
</template>

<script setup lang="ts">
const { role } = useAuth()
defineProps<{ product: any }>()
defineEmits(['add'])
</script>