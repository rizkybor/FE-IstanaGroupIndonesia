import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string; password: string }>(event)
  if (!body?.username || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Username & password required' })
  }

  const { fakestoreApi } = useRuntimeConfig()

  // ======== 1️⃣ BUAT ADMIN LOCAL LOGIN ==========
  // Bypass FakeStore API untuk akun admin custom
  if (body.username === 'admin' && body.password === '$$991122') {
    setCookie(event, 'fs_token', 'admin-local-token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    })
    return { ok: true, role: 'admin' as const }
  }

  // ======== 2️⃣ LOGIN USER BIASA KE FAKESTORE API ==========
  try {
    const res = await $fetch<{ token: string }>(`${fakestoreApi}/auth/login`, {
      method: 'POST',
      body,
    })

    setCookie(event, 'fs_token', res.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    })

    const role = body.username === 'johnd' ? 'user' : 'user'
    return { ok: true, role }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
      data: error,
    })
  }
})