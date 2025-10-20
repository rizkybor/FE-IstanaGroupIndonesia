⸻

🛍️ IstanaGroupStore — Nuxt 3 Mini App

Aplikasi demo mini-store sebagai bagian dari proses rekrutmen PT Istana Group Indonesia.
Dibangun dengan Nuxt 3 + TailwindCSS + @nuxtjs/i18n dan sistem autentikasi sederhana berbasis cookie.

⸻

🚀 Langkah Menjalankan Aplikasi

1️⃣ Prasyarat

Pastikan sudah ter-install:

node -v        # >= 18.17 (cocok : gunakan node v20.19.5 (npm v10.8.2))
pnpm -v        # atau npm / yarn
git --version

2️⃣ Clone Repository

git clone https://github.com/rizkybor/FE-IstanaGroupIndonesia.git
cd <repo>

3️⃣ Install Dependencies

pnpm install
# atau:
npm install
# atau:
yarn install

4️⃣ Buat File .env

Salin contoh berikut ke root proyek:

# App info
NUXT_PUBLIC_APP_NAME="🛍️ IstanaGroupStore"

# Env info
FAKESTORE_API=https://fakestoreapi.com

# Port opsional (default: 3000)

5️⃣ Jalankan Server Development

pnpm dev
# atau npm run dev / yarn dev

Buka di browser: http://localhost:3000

⸻

🧩 Struktur Folder Utama

.
├─ locales/        # File bahasa (id.json, en.json)
├─ middleware/     # auth.ts
├─ pages/          # index.vue, products.vue, cart.vue, admin.vue, login.vue
├─ components/     # NavBar.vue, BaseButton.vue, dst
├─ composables/    # useAuth.ts
├─ app.vue
├─ nuxt.config.ts
└─ package.json

⸻

# Additional Info

Tersedia Fitur Sortir, Cari, dan Halaman.
Tersedia Multi Bahasa.

⸻

🪪 Lisensi

**

⸻