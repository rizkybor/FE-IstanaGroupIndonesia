// server/api/products/[id].get.ts
import { $fetch } from 'ofetch'
import { fsBase } from "../../../app/utils/fakestore";

export default defineEventHandler(async (event) => {
  const { base, headers } = fsBase(event)
  const id = getRouterParam(event, 'id')!
  return await $fetch(`${base}/products/${id}`, { headers })
})