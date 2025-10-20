<template>
  <section class="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-12 py-12 bg-gradient-to-br from-sky-50 to-white">
    <!-- Left -->
    <div class="flex-1 space-y-6">
      <div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {{ appName }}
        </h1>
        <p class="mt-3 text-gray-600 text-lg">
This mini-app store demo was created as part of the recruitment process at PT. Istana Group Indonesia.
        </p>
      </div>

      <div class="flex flex-wrap gap-4 pt-4">
        <NuxtLink to="/products">
          <BaseButton variant="primary" class="px-6 py-3 text-lg">Browse Products</BaseButton>
        </NuxtLink>

        <NuxtLink v-if="!logged" to="/login">
          <BaseButton class="px-6 py-3 text-lg">Login</BaseButton>
        </NuxtLink>

        <NuxtLink v-else to="/cart">
          <BaseButton class="px-6 py-3 text-lg">Cart</BaseButton>
        </NuxtLink>

        <NuxtLink v-if="isAdmin" to="/admin">
          <BaseButton variant="secondary" class="px-6 py-3 text-lg">Admin Dashboard</BaseButton>
        </NuxtLink>

        <BaseButton v-if="logged" variant="ghost" @click="handleLogout" class="px-6 py-3 text-lg">
          Logout
        </BaseButton>
      </div>

      <p v-if="logged" class="text-sm text-gray-500 mt-2">
        Logged in as <b>{{ user?.username }}</b> — role: <b>{{ role }}</b>
      </p>
    </div>

    <!-- Right: Demo account box -->
    <div
      class="flex-1 max-w-md w-full bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <p class="font-semibold text-gray-800 text-lg mb-4 text-center border-b pb-2">
        Demo Account
      </p>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="rounded-xl border border-sky-100 bg-sky-50/50 p-4 hover:shadow transition">
          <p class="font-medium text-sky-700">Admin</p>
          <ul class="mt-2 text-sm text-gray-700 space-y-1">
            <li>
              Username:
              <code class="bg-gray-100 px-2 py-0.5 rounded text-sky-800">admin</code>
            </li>
            <li>
              Password:
              <code class="bg-gray-100 px-2 py-0.5 rounded text-sky-800">$$991122</code>
            </li>
          </ul>
        </div>

        <div class="rounded-xl border border-amber-100 bg-amber-50/50 p-4 hover:shadow transition">
          <p class="font-medium text-amber-700">User</p>
          <ul class="mt-2 text-sm text-gray-700 space-y-1">
            <li>
              Username:
              <code class="bg-gray-100 px-2 py-0.5 rounded text-amber-800">johnd</code>
            </li>
            <li>
              Password:
              <code class="bg-gray-100 px-2 py-0.5 rounded text-amber-800">m38rmF$</code>
            </li>
          </ul>
        </div>
      </div>

      <p class="text-xs text-gray-500 mt-4 text-center">
        login <b>admin</b> only for username <code>admin</code>;  
        login <b>user</b> use <code>johnd</code>.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { public: { appName } } = useRuntimeConfig()
const { role, user, logged, isAdmin, logout } = useAuth()

async function handleLogout() {
  await logout()
  await navigateTo('/')
}
</script>