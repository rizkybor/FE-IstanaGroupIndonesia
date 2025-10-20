export function fsBase(event?: any) {
  const { fakestoreApi } = useRuntimeConfig()
  const token = event ? getCookie(event, 'fs_token') : null
  const headers: Record<string,string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return { base: fakestoreApi as string, headers }
}