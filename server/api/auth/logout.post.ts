// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  deleteCookie(event, 'fs_token', { path: '/' })
  deleteCookie(event, 'fs_role',  { path: '/' })
  return { ok: true }
})