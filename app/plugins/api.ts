import { ofetch } from 'ofetch'
export default defineNuxtPlugin(() => {
  const api = ofetch.create({ baseURL: '/api' })
  return { provide: { api } }
})