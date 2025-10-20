export const useCart = () => {
  const items = useState<any[]>('cart', () => [])

  function add(item: any, qty = 1) {
    const existing = items.value.find(p => p.id === item.id)
    if (existing) {
      existing.qty += qty
      toast(`Updated quantity: ${existing.qty}`)
    } else {
      items.value.push({ ...item, qty })
      toast('Added to cart')
    }
  }

  function remove(index: number) {
    items.value.splice(index, 1)
  }

  function clear() {
    items.value = []
  }

  // Hindari spam toast
  let toastTimeout: NodeJS.Timeout | null = null
  function toast(msg: string) {
    if (toastTimeout) return
    const el = document.createElement('div')
    el.className =
      'fixed bottom-6 right-6 bg-sky-600 text-white px-4 py-2 rounded-xl shadow-lg animate-fade-in text-sm font-medium'
    el.textContent = msg
    document.body.appendChild(el)
    toastTimeout = setTimeout(() => {
      el.remove()
      toastTimeout = null
    }, 1300)
  }

  return { items, add, remove, clear }
}