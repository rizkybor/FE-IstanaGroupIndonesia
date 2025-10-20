export default defineNuxtRouteMiddleware((to) => {
  const { logged, role } = useAuth()
  const needAuth = ['/products', '/cart', '/admin']
  if (needAuth.some(p => to.path.startsWith(p)) && !logged.value) return navigateTo('/login')
  if (to.path.startsWith('/admin') && role.value !== 'admin') return navigateTo('/')
})