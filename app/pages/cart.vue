<template>
    <div class="min-h-screen bg-gradient-to-b from-white to-sky-50/30 px-4 md:px-10 py-8">
        <h1 class="text-2xl md:text-3xl font-extrabold mb-6">Your Cart</h1>

        <!-- Empty -->
        <EmptyState v-if="items.length === 0">
            Keranjang kosong. <NuxtLink to="/products" class="text-sky-600 hover:underline">Belanja sekarang</NuxtLink>.
        </EmptyState>

        <!-- Content -->
        <div v-else class="grid md:grid-cols-3 gap-6">
            <!-- Items -->
            <div class="md:col-span-2 space-y-4">
                <div v-for="(it, idx) in items" :key="idx"
                    class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <img :src="it.image" :alt="it.title" class="h-20 w-20 object-contain bg-white rounded-xl" />
                    <div class="flex-1">
                        <p class="font-semibold line-clamp-2">{{ it.title }}</p>
                        <p class="text-sm text-gray-500 mt-0.5">Price: $ {{ format(it.price) }}</p>
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            class="h-9 w-9 rounded-lg border bg-gray-50 hover:bg-gray-100 transition disabled:opacity-40"
                            style="cursor: pointer;" :disabled="it.qty <= 1" @click="dec(idx)"
                            aria-label="Decrease">–</button>
                        <input type="number" min="1" v-model.number="it.qty"
                            class="w-16 text-center rounded-lg border p-2" />
                        <button class="h-9 w-9 rounded-lg border bg-gray-50 hover:bg-gray-100 transition"
                            style="cursor: pointer;" @click="inc(idx)" aria-label="Increase">+</button>
                    </div>

                    <div class="w-24 text-right">
                        <p class="font-semibold">$ {{ format(lineTotal(it)) }}</p>
                        <button class="text-xs text-gray-500 hover:underline mt-1" @click="remove(idx)">Remove</button>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <aside
                class="md:sticky md:top-20 h-max bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h2 class="font-semibold text-lg">Order Summary</h2>

                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>Items ({{ items.length }})</span>
                        <span>$ {{ format(subtotal) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-500">
                        <span>Estimated Tax</span>
                        <span>$ {{ format(tax) }}</span>
                    </div>
                    <div class="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <hr class="my-2" />
                    <div class="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>$ {{ format(total) }}</span>
                    </div>
                </div>

                <NuxtLink to="/checkout">
                    <BaseButton variant="primary" class="w-full py-3 text-base font-semibold shadow-md hover:shadow-lg"
                        style="cursor: pointer;">
                        Proceed to Checkout
                    </BaseButton>
                </NuxtLink>

                <p v-if="message" class="text-green-700 text-sm">{{ message }}</p>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
type CartItem = { id: number; title: string; price: number; image: string; qty: number }

const items = useState<CartItem[]>('cart', () => [])
const message = ref('')

const lineTotal = (it: CartItem) => it.price * (it.qty ?? 1)
const subtotal = computed(() => items.value.reduce((s, x) => s + lineTotal(x), 0))
const taxRate = 0.1
const tax = computed(() => subtotal.value * taxRate)
const total = computed(() => subtotal.value + tax.value)

/** Helper qty */
function updateQty(i: number, d: 1 | -1) {
    const it = items.value[i]
    if (!it) return
    it.qty = Math.max(1, (it.qty ?? 1) + d)
}

function inc(i: number) { updateQty(i, 1) }
function dec(i: number) { updateQty(i, -1) }

function remove(i: number) { items.value.splice(i, 1) }
function format(n: number) { return n.toFixed(2) }
</script>