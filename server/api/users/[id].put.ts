// server/api/users/[id].put.ts
import { $fetch } from 'ofetch'
import { fsBase } from "../../../app/utils/fakestore";

export default defineEventHandler(async (event) => {
  const { base, headers } = fsBase(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  return await $fetch(`${base}/users/${id}`, { method: 'PUT', headers, body })
})