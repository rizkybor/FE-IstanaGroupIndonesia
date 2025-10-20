<template>
  <div class="group rounded-2xl border bg-white p-4 hover:shadow-lg transition">
    <NuxtLink :to="`/products/${product.id}`" class="block">
      <img :src="product.image" :alt="product.title" class="h-44 w-full object-contain" />
      <div class="mt-3 space-y-1">
        <h3 class="line-clamp-2 font-medium group-hover:underline">{{ product.title }}</h3>
        <p class="text-sky-700 font-semibold">$ {{ product.price }}</p>
      </div>
    </NuxtLink>
    <BaseButton class="mt-3 w-full" variant="primary" @click="$emit('add', product)">
      Add to Cart
    </BaseButton>
  </div>
</template>
<script setup lang="ts">
defineProps<{ product:any }>()
defineEmits(['add'])
</script>