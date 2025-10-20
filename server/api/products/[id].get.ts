import { $fetch } from 'ofetch'
export default defineEventHandler(async (event) => {
  const { fakestoreApi } = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const token = getCookie(event, 'fs_token')
  return await $fetch(`${fakestoreApi}/products/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
})