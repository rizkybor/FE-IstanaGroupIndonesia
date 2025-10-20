// server/api/users/index.post.ts
import { $fetch } from 'ofetch'
import { fsBase } from "../../../app/utils/fakestore";

export default defineEventHandler(async (event) => {
  const { base, headers } = fsBase(event)
  const body = await readBody(event)
  return await $fetch(`${base}/users`, { method: 'POST', headers, body })
})