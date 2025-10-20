⸻

🛍️ IstanaGroupStore — Nuxt 3 Mini App

A demo mini-store application built as part of the recruitment process for PT Istana Group Indonesia.
Developed using Nuxt 3 + TailwindCSS + @nuxtjs/i18n, featuring a simple cookie-based authentication system.

⸻

🚀 Getting Started

1️⃣ Requirements

Make sure the following are installed on your system:

node -v        # >= 18.17 (compatible : using node v20.19.5 (npm v10.8.2))
pnpm -v        # or npm / yarn
git --version


⸻

2️⃣ Clone the Repository

git clone https://github.com/rizkybor/FE-IstanaGroupIndonesia.git
cd <repo>


⸻

3️⃣ Install Dependencies

pnpm install
# or:
npm install
# or:
yarn install


⸻

4️⃣ Create a .env File

Copy the example below to the project root:

# App info
NUXT_PUBLIC_APP_NAME="🛍️ IstanaGroupStore"

# Environment info
FAKESTORE_API=https://fakestoreapi.com

# Optional: Port (default: 3000)


⸻

5️⃣ Run the Development Server

pnpm dev
# or npm run dev / yarn dev

Open the browser and visit: http://localhost:3000

⸻

🧩 Project Structure

.
├─ locales/        # Translation files (id.json, en.json)
├─ middleware/     # auth.ts
├─ pages/          # index.vue, products.vue, cart.vue, admin.vue, login.vue
├─ components/     # NavBar.vue, BaseButton.vue, etc.
├─ composables/    # useAuth.ts
├─ app.vue
├─ nuxt.config.ts
└─ package.json

⸻

# Additional Info

Sort, Search, and Pagination features are available.
Multi Language Available.

⸻

🪪 License

**

⸻