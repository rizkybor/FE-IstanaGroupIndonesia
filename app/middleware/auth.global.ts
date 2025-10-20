export default defineNuxtRouteMiddleware((to) => {
  const needAuth = ['/cart', '/checkout', '/admin']

  const { logged, role } = useAuth()
  const roleCookie = useCookie<'admin' | 'user' | null>('fs_role')

  if (import.meta.server) {
    const token = useCookie<string | null>('fs_token')
    if (!logged.value && token.value) logged.value = true
    if (!role.value && roleCookie.value) role.value = roleCookie.value
  } else {
    if (!role.value && roleCookie.value) role.value = roleCookie.value
  }

  const isAuthed = import.meta.server
    ? !!useCookie<string | null>('fs_token').value
    : logged.value

  if (needAuth.some(p => to.path.startsWith(p)) && !isAuthed)
    return navigateTo('/login')

  if (to.path.startsWith('/admin') && role.value !== 'admin')
    return navigateTo('/')

  if (to.path === '/login' && isAuthed)
    return navigateTo('/products')
})