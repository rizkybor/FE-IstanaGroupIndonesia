// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: {
    fakestoreApi: 'https://fakestoreapi.com',
    public: {
      appName: 'FakeStore Nuxt',
    },
  },
  app: {
    head: {
      title: 'FETEST-IGI',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
});
