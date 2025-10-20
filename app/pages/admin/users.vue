<template>
  <section class="min-h-screen bg-gradient-to-b from-white to-sky-50/30 px-4 md:px-10 py-8">
    <div class="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Users</h1>
        <p class="text-sm text-gray-500">Tampilan tabel dengan sort, search, dan pagination.</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <input v-model="q" placeholder="🔍 Cari nama/username/email…"
            class="w-64 rounded-xl border border-gray-200 bg-white px-4 py-2 pl-10 shadow-sm focus:ring-2 focus:ring-sky-400 focus:outline-none transition" />
          <span class="absolute left-3 top-2.5 text-gray-400">⌕</span>
        </div>
        <BaseButton style="cursor: pointer;" variant="primary" class="shadow-md hover:shadow-lg" @click="openCreate()">+
          New User</BaseButton>
      </div>
    </div>

    <!-- Loading & Error -->
    <div v-if="pending" class="flex justify-center py-16">
      <Spinner />
    </div>
    <EmptyState v-else-if="error">Gagal memuat users.</EmptyState>

    <!-- Table -->
    <div v-else class="max-w-6xl mx-auto overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full border-separate border-spacing-0">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr
              class="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:text-sm [&>th]:font-semibold [&>th]:text-gray-600">
              <th class="w-12">#</th>
              <th class="cursor-pointer select-none" @click="toggleSort('name')">
                Name
                <SortIcon :active="sortKey === 'name'" :dir="sortDir" />
              </th>
              <th class="cursor-pointer select-none" @click="toggleSort('username')">
                Username
                <SortIcon :active="sortKey === 'username'" :dir="sortDir" />
              </th>
              <th class="cursor-pointer select-none" @click="toggleSort('email')">
                Email
                <SortIcon :active="sortKey === 'email'" :dir="sortDir" />
              </th>
              <th class="w-48">Phone</th>
              <th class="w-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="[&>tr]:border-t [&>tr]:border-gray-100">
            <tr v-for="(u, i) in paginated" :key="u.id" class="hover:bg-sky-50/40 transition">
              <td class="px-4 py-3 text-sm text-gray-500">{{ (page - 1) * perPage + i + 1 }}</td>
              <td class="px-4 py-3">
                <p class="font-medium text-gray-800">
                  {{ u.name?.firstname }} {{ u.name?.lastname }}
                </p>
                <p class="text-xs text-gray-500 capitalize">{{ u.address?.city }}</p>
              </td>
              <td class="px-4 py-3 text-sm">{{ u.username }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ u.email }}</td>
              <td class="px-4 py-3 text-sm text-gray-600">{{ u.phone }}</td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <BaseButton style="cursor: pointer;" size="sm" @click="openEdit(u)">Edit</BaseButton>
                  <BaseButton style="cursor: pointer;" size="sm" variant="ghost" @click="removeUser(u.id)">Delete
                  </BaseButton>
                </div>
              </td>
            </tr>
            <tr v-if="paginated.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-gray-500">
                Tidak ada data untuk kata kunci: <b>{{ q }}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
        <p class="text-sm text-gray-600">
          Showing <b>{{ startRow + 1 }}</b>–<b>{{ endRow }}</b> of <b>{{ filtered.length }}</b>
        </p>
        <div class="flex items-center gap-3">
          <select v-model.number="perPage" class="rounded-lg border px-2 py-1 text-sm">
            <option :value="6">6 / page</option>
            <option :value="12">12 / page</option>
            <option :value="24">24 / page</option>
          </select>
          <div class="flex items-center gap-2 select-none">
            <button style="cursor: pointer;"
              class="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 transition disabled:opacity-40"
              :disabled="page === 1" @click="goPrev">‹ Prev</button>
            <div class="hidden sm:flex items-center gap-1">
              <button style="cursor: pointer;" v-for="n in pages" :key="n" @click="page = n"
                class="w-8 h-8 rounded-md text-sm"
                :class="n === page ? 'bg-sky-600 text-white' : 'bg-gray-100 hover:bg-gray-200'">
                {{ n }}
              </button>
            </div>
            <button style="cursor: pointer;"
              class="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 transition disabled:opacity-40"
              :disabled="page === pages || pages === 0" @click="goNext">Next ›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <dialog ref="dlg" style="inset:0;margin:auto"
      class="rounded-2xl p-0 border w-full max-w-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm">
      <form @submit.prevent="save" class="p-6 bg-white rounded-2xl space-y-4 shadow-lg">
        <h2 class="text-xl font-bold text-gray-900 border-b pb-2">
          {{ form.id ? 'Edit User' : 'New User' }}
        </h2>

        <div class="grid gap-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">First name <span class="text-red-500">*</span></label>
              <input v-model="form.name.firstname" placeholder="First name"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" required />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Last name <span class="text-red-500">*</span></label>
              <input v-model="form.name.lastname" placeholder="Last name"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" required />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">Username <span class="text-red-500">*</span></label>
              <input v-model="form.username" placeholder="Username"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" required />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
              <input v-model="form.email" type="email" placeholder="Email"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" required />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">
              Password <span v-if="!form.id" class="text-red-500">*</span>
            </label>
            <input v-model="form.password" type="password" placeholder="Password" :required="!form.id"
              class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700">Phone</label>
            <input v-model="form.phone" placeholder="Phone"
              class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-sm font-medium text-gray-700">City</label>
              <input v-model="form.address.city" placeholder="City"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Street</label>
              <input v-model="form.address.street" placeholder="Street"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Number</label>
              <input v-model.number="form.address.number" type="number" min="0" placeholder="No."
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Zipcode</label>
              <input v-model="form.address.zipcode" placeholder="Zipcode"
                class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
        </div>

        <div class="flex gap-2 justify-end pt-4 border-t">
          <BaseButton style="cursor: pointer;" type="button" variant="ghost" @click="closeDlg">Cancel</BaseButton>
          <BaseButton style="cursor: pointer;" variant="primary" type="submit" class="shadow-md hover:shadow-lg">
            {{ saving ? 'Saving…' : 'Save' }}
          </BaseButton>
        </div>
      </form>
    </dialog>
  </section>
</template>

<script setup lang="ts">
import { h, defineComponent } from 'vue'

const { $api } = useNuxtApp()
const { data, pending, error, refresh } = await useAsyncData('admin-users', () => $api('/users'))
const users = computed<any[]>(() => data.value || [])

/** Search */
const q = ref('')

/** Sorting */
type SortKey = 'name' | 'username' | 'email'
const sortKey = ref<SortKey>('name')
const sortDir = ref<'asc' | 'desc'>('asc')
function toggleSort(k: SortKey) {
  if (sortKey.value === k) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = k; sortDir.value = 'asc' }
}

/** Derived list */
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  const base = term
    ? users.value.filter((u: any) =>
      `${u.name?.firstname} ${u.name?.lastname}`.toLowerCase().includes(term) ||
      (u.username || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term)
    )
    : users.value

  return [...base].sort((a: any, b: any) => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    if (sortKey.value === 'name') {
      const na = `${a.name?.firstname || ''} ${a.name?.lastname || ''}`.toLowerCase()
      const nb = `${b.name?.firstname || ''} ${b.name?.lastname || ''}`.toLowerCase()
      return na < nb ? -1 * dir : na > nb ? 1 * dir : 0
    }
    const ka = (a[sortKey.value] ?? '').toString().toLowerCase()
    const kb = (b[sortKey.value] ?? '').toString().toLowerCase()
    return ka < kb ? -1 * dir : ka > kb ? 1 * dir : 0
  })
})

/** Pagination */
const page = ref(1)
const perPage = ref(12)
const pages = computed(() => Math.ceil(filtered.value.length / perPage.value))
watch([filtered, perPage], () => { page.value = 1 })
const startRow = computed(() => (page.value - 1) * perPage.value)
const endRow = computed(() => Math.min(filtered.value.length, startRow.value + perPage.value))
const paginated = computed(() => filtered.value.slice(startRow.value, endRow.value))
function goPrev() { if (page.value > 1) page.value-- }
function goNext() { if (page.value < pages.value) page.value++ }

/** Modal */
const dlg = ref<HTMLDialogElement | null>(null)
const blank = () => ({
  id: null,
  email: '',
  username: '',
  password: '',
  name: { firstname: '', lastname: '' },
  address: { city: '', street: '', number: 0, zipcode: '' },
  phone: '',
})
const form = reactive<any>(blank())
const saving = ref(false)

function openCreate() { Object.assign(form, blank()); dlg.value?.showModal() }
function openEdit(u: any) { Object.assign(form, u, { password: '' }); dlg.value?.showModal() }
function closeDlg() { dlg.value?.close() }

function notify(msg: string, type: 'success' | 'error' = 'success') {
  const el = document.createElement('div')
  el.className = [
    'fixed bottom-6 right-6 z-[60] min-w-[220px] max-w-sm px-4 py-2 rounded-xl shadow-lg',
    'text-sm font-medium text-white animate-fade-in-up',
    type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
  ].join(' ')
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 1800)
}

// async function save() {
//   saving.value = true
//   try {
//     if (form.id) {
//       const payload = { ...form }; if (!payload.password) delete payload.password
//       await $api(`/users/${form.id}`, { method: 'PUT', body: payload })
//     } else {
//       await $api('/users', { method: 'POST', body: form })
//     }
//     closeDlg(); await refresh()
//   } finally { saving.value = false }
// }
// async function removeUser(id: number) {
//   if (!confirm('Delete this user?')) return
//   await $api(`/users/${id}`, { method: 'DELETE' })
//   await refresh()
// }

async function save() {
  if (!form.name.firstname?.trim()) return notify('Harap isi First Name.', 'error')
  if (!form.name.lastname?.trim()) return notify('Harap isi Last Name.', 'error')
  if (!form.username?.trim()) return notify('Harap isi Username.', 'error')
  if (!form.email?.trim()) return notify('Harap isi Email.', 'error')

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(form.email)) return notify('Format email tidak valid.', 'error')

  if (!form.id && (!form.password || form.password.length < 4))
    return notify('Password harus minimal 4 karakter.', 'error')

  saving.value = true
  try {
    let res, newData
    if (form.id) {
      const payload = { ...form }
      if (!payload.password) delete payload.password

      res = await $api(`/users/${form.id}`, { method: 'PUT', body: payload })
      newData = res.data || res
      const idx = users.value.findIndex((u) => u.id === form.id)
      if (idx !== -1) users.value[idx] = newData
    } else {
      res = await $api('/users', { method: 'POST', body: form })
      newData = res.data || res
      users.value.unshift(newData)
    }

    const message = res.message || res.statusText || (form.id ? 'User berhasil diperbarui ✅' : 'User baru berhasil dibuat 🎉')
    notify(message, 'success')
    closeDlg()
  } catch (e: any) {
    const errMsg = e?.data?.message || e?.message || 'Gagal menyimpan data.'
    notify(errMsg, 'error')
  } finally {
    saving.value = false
  }
}

async function removeUser(id: number) {
  if (!confirm('Yakin ingin menghapus user ini?')) return
  try {
    const res = await $api(`/users/${id}`, { method: 'DELETE' })
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) users.value.splice(idx, 1)
    const message = res.message || res.statusText || 'User berhasil dihapus 🗑️'
    notify(message, 'success')
  } catch (e: any) {
    const errMsg = e?.data?.message || e?.message || 'Gagal menghapus user.'
    notify(errMsg, 'error')
  }
}

/** DynamicSortIcon */
const SortIcon = defineComponent({
  props: { active: { type: Boolean, default: false }, dir: { type: String, default: 'asc' } },
  setup(props) {
    return () => h('span',
      { class: ['inline-block align-middle ml-1 text-xs', props.active ? 'text-sky-600' : 'text-gray-300'] },
      props.active ? (props.dir === 'asc' ? '▲' : '▼') : '△'
    )
  }
})

function format(n: number) { return Number(n).toFixed(2) }
</script>