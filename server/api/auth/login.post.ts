// server/api/auth/login.post.ts
import { $fetch } from 'ofetch'

type Role = 'admin' | 'user'
const isProd = process.env.NODE_ENV === 'production'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username: string; password: string }>(event)
  if (!body?.username || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Username & password required' })
  }

  const { fakestoreApi } = useRuntimeConfig()

  // 1) ADMIN
  if (body.username === 'admin' && body.password === '$$991122') {
    const role: Role = 'admin'

    setCookie(event, 'fs_token', 'admin-local-token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: 60 * 60, // 1h
    })
    setCookie(event, 'fs_role', role, {
      httpOnly: false,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: 60 * 60,
    })

    return { ok: true, role }
  }

  // 2) USER via FakeStore API
  try {
    const res = await $fetch<{ token: string }>(`${fakestoreApi}/auth/login`, {
      method: 'POST',
      body,
    })

    const role: Role = 'user'

    setCookie(event, 'fs_token', res.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: 60 * 60,
    })
    setCookie(event, 'fs_role', role, {
      httpOnly: false,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: 60 * 60,
    })

    return { ok: true, role }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
      data: error,
    })
  }
})