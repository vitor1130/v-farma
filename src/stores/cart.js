import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const discount = ref(0) // [NOVO] Guarda a % de desconto (0.10 = 10%)

  // --- GETTERS ---
  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
  })

  // [ATUALIZADO] O Total agora desconta a porcentagem
  const total = computed(() => {
    return subtotal.value - subtotal.value * discount.value
  })

  const needsPrescription = computed(() => {
    return items.value.some((item) => item.requiresPrescription === true)
  })

  // --- ACTIONS ---

  // [NOVO] Ação com PROMISE para validar cupom
  function applyCoupon(code) {
    return new Promise((resolve, reject) => {
      // Simula demora de 1.5 segundos (Internet lenta)
      setTimeout(() => {
        const codigoLimpo = code.toUpperCase().trim()

        if (codigoLimpo === 'VFARMA10') {
          discount.value = 0.1 // 10% de desconto
          resolve({ percent: 10, message: 'Desconto de 10% aplicado!' })
        } else if (codigoLimpo === 'VIP20') {
          discount.value = 0.2 // 20% de desconto
          resolve({ percent: 20, message: 'Desconto VIP de 20% aplicado!' })
        } else {
          discount.value = 0
          reject('Cupom inválido ou expirado.')
        }
      }, 1500)
    })
  }

  function addToCart(product) {
    const existing = items.value.find((i) => i.id === product.id)
    if (existing) existing.quantity++
    else items.value.push({ ...product, quantity: 1 })
  }

  function removeFromCart(productId) {
    const index = items.value.findIndex((i) => i.id === productId)
    if (index !== -1) items.value.splice(index, 1)

    // Se esvaziar o carrinho, remove o desconto
    if (items.value.length === 0) discount.value = 0
  }

  function clearCart() {
    items.value = []
    discount.value = 0
  }

  return {
    items,
    subtotal,
    total,
    discount,
    needsPrescription,
    applyCoupon,
    addToCart,
    removeFromCart,
    clearCart,
  }
})
