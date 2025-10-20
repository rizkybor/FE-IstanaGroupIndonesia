// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: {
    fakestoreApi: process.env.FAKESTORE_API,
    public: {
      appName: 'Istana Group Store',
    },
  },
  app: {
    head: {
      title: 'FETEST-IGI',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
  modules: [
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'id', name: 'Bahasa', file: 'id.json' }
    ],
    defaultLocale: 'id',
    strategy: 'prefix_except_default',
    langDir: 'locales',               
    detectBrowserLanguage: { useCookie: true, fallbackLocale: 'en' },
    // lazy: true,
  }
});
