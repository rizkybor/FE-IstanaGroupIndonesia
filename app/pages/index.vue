<template>
  <div class="grid gap-6 md:grid-cols-2 items-start">
    <div>
      <h1 class="text-3xl md:text-4xl font-extrabold mb-2">{{ appName }}</h1>
      <p class="text-gray-600">Demo mini-app Nuxt: login, products, detail, cart, admin.</p>

      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink to="/products">
          <BaseButton variant="primary">Browse Products</BaseButton>
        </NuxtLink>

        <NuxtLink v-if="!logged" to="/login">
          <BaseButton>Login</BaseButton>
        </NuxtLink>

        <NuxtLink v-else to="/cart">
          <BaseButton>Cart</BaseButton>
        </NuxtLink>

        <NuxtLink v-if="isAdmin" to="/admin">
          <BaseButton>Admin Dashboard</BaseButton>
        </NuxtLink>

        <BaseButton v-if="logged" variant="ghost" @click="handleLogout">
          Logout
        </BaseButton>
      </div>

      <p v-if="logged" class="mt-3 text-sm text-gray-500">
        Logged in as: <b>{{ user?.username }}</b> — role: <b>{{ role }}</b>
      </p>
    </div>

    <div class="rounded-2xl border bg-white p-6">
      <p class="font-semibold mb-3">Akun Demo</p>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="rounded-xl border p-4">
          <p class="font-medium">Admin</p>
          <ul class="mt-2 text-sm text-gray-700 space-y-1">
            <li>Username:
              <code class="bg-gray-100 px-2 py-0.5 rounded">admin</code>
            </li>
            <li>Password:
              <code class="bg-gray-100 px-2 py-0.5 rounded">$$991122</code>
            </li>
          </ul>
        </div>
        <div class="rounded-xl border p-4">
          <p class="font-medium">User</p>
          <ul class="mt-2 text-sm text-gray-700 space-y-1">
            <li>Username:
              <code class="bg-gray-100 px-2 py-0.5 rounded">johnd</code>
            </li>
            <li>Password:
              <code class="bg-gray-100 px-2 py-0.5 rounded">m38rmF$</code>
            </li>
          </ul>
        </div>
      </div>
      <p class="text-xs text-gray-500 mt-4">
        Role: <b>admin</b> hanya untuk username <code>admin</code>; <b>user</b> untuk <code>johnd</code>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { public: { appName } } = useRuntimeConfig()
const { role, user, logged, isAdmin, logout } = useAuth()

async function handleLogout() {
  await logout()
  await navigateTo('/')
}
</script>