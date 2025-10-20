// server/api/users/[id].delete.ts
import { $fetch } from 'ofetch'
import { fsBase } from "../../../app/utils/fakestore";

export default defineEventHandler(async (event) => {
  const { base, headers } = fsBase(event)
  const id = getRouterParam(event, 'id')!
  return await $fetch(`${base}/users/${id}`, { method: 'DELETE', headers })
})