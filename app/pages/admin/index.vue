<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-bold">Admin Dashboard</h1>

    <section>
      <h2 class="font-semibold mb-3">Users</h2>
      <div v-if="pendingUsers" class="flex justify-center py-10"><Spinner/></div>
      <EmptyState v-else-if="errUsers">Gagal memuat users.</EmptyState>
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="u in users" :key="u.id" class="rounded-xl border bg-white p-4">
          <p class="font-medium">{{ u.name.firstname }} {{ u.name.lastname }}</p>
          <p class="text-sm text-gray-500">{{ u.email }}</p>
          <p class="text-sm text-gray-500">Username: {{ u.username }}</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-semibold mb-3">Carts</h2>
      <div v-if="pendingCarts" class="flex justify-center py-10"><Spinner/></div>
      <EmptyState v-else-if="errCarts">Gagal memuat carts.</EmptyState>
      <div v-else class="space-y-3">
        <details v-for="c in carts" :key="c.id" class="rounded-xl border bg-white p-3">
          <summary class="cursor-pointer">Cart #{{ c.id }} — user {{ c.userId }} — {{ c.date }}</summary>
          <ul class="mt-2 list-disc pl-5 text-sm">
            <li v-for="p in c.products" :key="p.productId">product: {{ p.productId }}, qty: {{ p.quantity }}</li>
          </ul>
        </details>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
const { $api } = useNuxtApp()
const { data: users, pending: pendingUsers, error: errUsers } =
  await useAsyncData('admin-users', () => $api('/users'))
const { data: carts, pending: pendingCarts, error: errCarts } =
  await useAsyncData('admin-carts', () => $api('/carts'))
</script>