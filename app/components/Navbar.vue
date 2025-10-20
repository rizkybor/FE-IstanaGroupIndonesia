<template>
  <nav class="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
    <div class="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="font-bold">🛍️ FakeStore</NuxtLink>
      <div class="flex items-center gap-3">
        <NuxtLink to="/products" class="hover:underline">Products</NuxtLink>
        <NuxtLink to="/cart" class="hover:underline">Cart</NuxtLink>
        <template v-if="logged">
          <NuxtLink v-if="role==='admin'" to="/admin" class="hover:underline">Admin</NuxtLink>
          <span class="text-sm text-gray-500">| {{ user?.username }}</span>
          <BaseButton variant="ghost" @click="onLogout">Logout</BaseButton>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="hover:underline">Login</NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
const { role, user, logged, logout } = useAuth()
async function onLogout(){ await logout(); navigateTo('/') }
</script>