type Role = 'admin' | 'user'

export const useAuthRole = () => useState<Role | null>('fs_role', () => null)
export const useAuthUser = () =>
  useState<{ username: string } | null>('fs_user', () => null)
export const useLoggedIn = () => useState<boolean>('fs_logged', () => false)

export function useAuth() {
  const role = useAuthRole()
  const user = useAuthUser()
  const logged = useLoggedIn()

  const isAdmin = computed(() => role.value === 'admin')
  const isUser  = computed(() => role.value === 'user')

  async function login(username: string, password: string) {
    try {
      const res = await $fetch<{ role: Role; ok: boolean }>('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      })

      user.value = { username }
      role.value = res.role
      logged.value = true
    } catch (e) {
      throw new Error('Login gagal. Periksa username/password.')
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    role.value = null
    logged.value = false
  }

  return { role, user, logged, isAdmin, isUser, login, logout }
}