// server/api/carts/create.post.ts
import { $fetch } from 'ofetch'
export default defineEventHandler(async (event) => {
  const body = await readBody<{ userId:number; date:string; products:{productId:number;quantity:number}[] }>(event)
  const { fakestoreApi } = useRuntimeConfig()
  const token = getCookie(event, 'fs_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  return await $fetch(`${fakestoreApi}/carts`, {
    method: 'POST',
    body,
    headers: { Authorization: `Bearer ${token}` },
  })
})