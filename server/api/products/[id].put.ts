// server/api/products/[id].put.ts
import { $fetch } from 'ofetch'
import { fsBase } from "../../../app/utils/fakestore";

export default defineEventHandler(async (event) => {
  const { base, headers } = fsBase(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  return await $fetch(`${base}/products/${id}`, { method: 'PUT', headers, body })
})