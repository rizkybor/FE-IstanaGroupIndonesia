<template>
  <div
    class="min-h-screen bg-gradient-to-b from-sky-50/40 to-white px-4 md:px-10 py-8"
  >
    <div
      class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
    >
      <div>
        <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">
          🛍️ Catalog Product
        </h1>
        <p class="text-sm text-gray-500">
          Explore various interesting products from Fake Store API
        </p>
      </div>

      <div class="relative w-full md:w-64">
        <input
          v-model="q"
          type="text"
          placeholder="🔍 Cari produk..."
          class="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 pl-10 shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none transition"
        />
        <span class="absolute left-3 top-2.5 text-gray-400">
          <i class="i-heroicons-magnifying-glass w-5 h-5"></i>
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending || !data" class="flex justify-center py-20">
      <Spinner />
    </div>

    <!-- Error -->
    <EmptyState v-else-if="error">
      An error occurred while loading the product.
    </EmptyState>

    <!-- Kosong -->
    <EmptyState v-else-if="filtered.length === 0">
      No products found.
    </EmptyState>

    <!-- Grid -->
    <transition-group
      v-else
      tag="div"
      name="fade"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <ProductCard
        v-for="p in paginated"
        :key="p.id"
        :product="p"
        class="transform transition hover:scale-[1.02] hover:shadow-xl rounded-2xl"
        style="cursor: pointer"
        @add="addToCart"
      />
    </transition-group>

    <!-- Pagination -->
    <div
      v-if="pages > 1"
      class="mt-10 flex items-center justify-center gap-3 text-sm font-medium"
    >
      <button
        class="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition disabled:opacity-40"
        style="cursor: pointer"
        :disabled="page === 1"
        @click="goPrev"
      >
        ‹ Prev
      </button>

      <div class="flex items-center gap-2">
        <span
          v-for="n in pages"
          :key="n"
          @click="page = n"
          class="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200"
          :class="[
            page === n
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
          ]"
        >
          {{ n }}
        </span>
      </div>

      <button
        class="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition disabled:opacity-40"
        style="cursor: pointer"
        :disabled="page === pages"
        @click="goNext"
      >
        Next ›
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const { data, pending, error } = await useAsyncData("products", () =>
  $api("/products")
);

const { logged } = useAuth();
const cart = useState<any[]>("cart", () => []);
const q = ref("");
const perPage = 8;
const page = ref(1);

const filtered = computed(() => {
  const list = data.value || [];
  return q.value
    ? list.filter((x: any) =>
        x.title.toLowerCase().includes(q.value.toLowerCase())
      )
    : list;
});

const pages = computed(() => Math.ceil(filtered.value.length / perPage));

const paginated = computed(() => {
  const start = (page.value - 1) * perPage;
  return filtered.value.slice(start, start + perPage);
});

watch(filtered, () => {
  page.value = 1;
});

function goPrev() {
  if (page.value > 1) page.value--;
  scrollToTop();
}

function goNext() {
  if (page.value < pages.value) page.value++;
  scrollToTop();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addToCart(item: any) {
  if (!logged.value) {
    router.push(`/login?next=${encodeURIComponent(route.fullPath)}`);
    return;
  }
  cart.value.push({ ...item, qty: 1 });
  toast("Added to cart");
}

function toast(msg: string) {
  const el = document.createElement("div");
  el.className =
    "fixed bottom-6 right-6 bg-sky-600 text-white px-4 py-2 rounded-xl shadow-lg animate-fade-in text-sm font-medium";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}
</script>

<style scoped>
/* Fade animation untuk grid */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.25s ease-out;
}
</style>
