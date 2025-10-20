<template>
  <section class="min-h-[60vh] bg-gradient-to-b from-white to-sky-50/30 px-4 md:px-10 py-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ $t('admin.title') }}</h1>
          <p class="text-sm text-gray-500 mt-1">
{{ $t('admin.subtitle') }}
          </p>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="mt-6 grid sm:grid-cols-2 gap-4">
        <!-- Products -->
        <NuxtLink
          to="/admin/products"
          class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm
                 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-cyan-400"></div>

          <div class="flex items-center gap-4">
            <div
              class="shrink-0 h-12 w-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center
                     group-hover:bg-sky-200 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M20.25 7.5l-8.25-4.5-8.25 4.5m16.5 0L12 12m8.25-4.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9" />
              </svg>
            </div>

            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ $t('admin.cards.products.title') }}</p>
              <p class="text-sm text-gray-500">{{ $t('admin.cards.products.desc') }}</p>
            </div>

            <div
              class="opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Users -->
        <NuxtLink
          to="/admin/users"
          class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm
                 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400"></div>

          <div class="flex items-center gap-4">
            <div
              class="shrink-0 h-12 w-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center
                     group-hover:bg-amber-200 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6v-2a4 4 0 00-4-4H8m9-6a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>

            <div class="flex-1">
              <p class="font-semibold text-gray-900">{{ $t('admin.cards.users.title') }}</p>
              <p class="text-sm text-gray-500">{{ $t('admin.cards.users.desc') }}</p>
            </div>

            <div
              class="opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="mt-8">
        <NuxtPage />
      </div>
    </div>
  </section>
</template>