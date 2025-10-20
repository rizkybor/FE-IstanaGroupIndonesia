<!-- pages/index.vue -->
<template>
  <section
    class="min-h-[80vh] flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-12 py-12 bg-gradient-to-br from-sky-50 to-white"
  >
    <!-- Left -->
    <div class="flex-1 space-y-6">
      <div>
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {{ t('home.title', { appName }) }}
        </h1>
        <p class="mt-3 text-gray-600 text-lg">
          {{ t('home.subtitle') }}
        </p>
      </div>

      <div class="flex flex-wrap gap-4 pt-4">
        <NuxtLink :to="localePath('/products')">
          <BaseButton variant="primary" class="px-6 py-3 text-lg">
            {{ t('home.cta.browse') }}
          </BaseButton>
        </NuxtLink>

        <NuxtLink v-if="!logged" :to="localePath('/login')">
          <BaseButton class="px-6 py-3 text-lg">
            {{ t('app.login') }}
          </BaseButton>
        </NuxtLink>

        <NuxtLink v-else :to="localePath('/cart')">
          <BaseButton class="px-6 py-3 text-lg">
            {{ t('app.cart') }}
          </BaseButton>
        </NuxtLink>

        <NuxtLink v-if="isAdmin" :to="localePath('/admin')">
          <BaseButton variant="secondary" class="px-6 py-3 text-lg">
            {{ t('home.cta.admin') }}
          </BaseButton>
        </NuxtLink>

        <BaseButton
          v-if="logged"
          variant="ghost"
          @click="handleLogout"
          class="px-6 py-3 text-lg"
        >
          {{ t('app.logout') }}
        </BaseButton>
      </div>

      <p v-if="logged" class="text-sm text-gray-500 mt-2">
        {{ t('home.loggedAs') }}
        <b>{{ user?.username }}</b> — {{ t('home.role') }} <b>{{ role }}</b>
      </p>
    </div>

    <!-- Right: Demo account box -->
    <div class="flex-1 max-w-md w-full bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <p class="font-semibold text-gray-800 text-lg mb-4 text-center border-b pb-2">
        {{ t('home.demo.title') }}
      </p>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="rounded-xl border border-sky-100 bg-sky-50/50 p-4 hover:shadow transition">
          <p class="font-medium text-sky-700">{{ t('home.demo.admin') }}</p>
          <ul class="mt-2 text-sm text-gray-700 space-y-1">
            <li>
              {{ t('home.demo.username') }}:
              <code class="bg-gray-100 px-2 py-0.5 rounded text-sky-800">admin</code>
            </li>
            <li>
              {{ t('home.demo.password') }}:
              <code class="bg-gray-100 px-2 py-0.5 rounded text-sky-800">$$991122</code>
            </li>
          </ul>
        </div>

        <div class="rounded-xl border border-amber-100 bg-amber-50/50 p-4 hover:shadow transition">
          <p class="font-medium text-amber-700">{{ t('home.demo.user') }}</p>
          <ul class="mt-2 text-sm text-gray-700 space-y-1">
            <li>
              {{ t('home.demo.username') }}:
              <code class="bg-gray-100 px-2 py-0.5 rounded text-amber-800">johnd</code>
            </li>
            <li>
              {{ t('home.demo.password') }}:
              <code class="bg-gray-100 px-2 py-0.5 rounded text-amber-800">m38rmF$</code>
            </li>
          </ul>
        </div>
      </div>

      <p class="text-xs text-gray-500 mt-4 text-center">
        {{ t('home.demo.note') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const {
  public: { appName },
} = useRuntimeConfig()
const { role, user, logged, isAdmin, logout } = useAuth()

// i18n + route helper
const { t } = useI18n()
const localePath = useLocalePath()

async function handleLogout() {
  await logout()
  await navigateTo(localePath('/'))
}
</script>