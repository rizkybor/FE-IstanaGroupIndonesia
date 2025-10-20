export default defineEventHandler(async (event) => {
  deleteCookie(event, 'fs_token', { path: '/' })
  return { ok: true }
})