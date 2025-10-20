// middleware/auth.ts  (atau auth.global.ts)
export default defineNuxtRouteMiddleware((to) => {
  const needAuth = ['/cart', '/checkout', '/admin']

  const { logged, role } = useAuth()
  const roleCookie = useCookie<'admin' | 'user' | null>('fs_role')
  const token = useCookie<string | null>('fs_token')

  if (!logged.value && token.value) logged.value = true
  if (!role.value && roleCookie.value) role.value = roleCookie.value

  const isAuthed = import.meta.server ? !!token.value : logged.value

  // --- Util prefix bahasa ---
  const prefixMatch = to.path.match(/^\/([a-z]{2})(?=\/|$)/i)
  const currentPrefix = prefixMatch?.[1] ?? ''  
  const withPrefix = (p: string) => (currentPrefix ? `/${currentPrefix}${p}` : p)

  const basePath = to.path.replace(/^\/[a-z]{2}(?=\/|$)/i, '') || '/'

  const needsAuth = needAuth.some((p) => basePath.startsWith(p))
  if (needsAuth && !isAuthed) {
    return navigateTo(withPrefix('/login'))
  }

  if (basePath.startsWith('/admin') && role.value !== 'admin') {
    return navigateTo(withPrefix('/'))
  }

  if (basePath === '/login' && isAuthed) {
    return navigateTo(withPrefix('/products'))
  }
})