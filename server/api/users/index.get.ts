import { $fetch } from 'ofetch'
export default defineEventHandler(async (event) => {
  const { fakestoreApi } = useRuntimeConfig()
  const token = getCookie(event, 'fs_token')
  return await $fetch(`${fakestoreApi}/users`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
})