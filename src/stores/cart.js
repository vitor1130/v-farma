import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  
  // --- DADOS ---
  const items = ref([]);       // Produtos no carrinho
  const activeCoupon = ref(null); // Guarda o cupom ativo inteiro.

  // --- CÁLCULOS ---
  
  // 1. Soma o preço normal de todos os itens
  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  // 2. Calcula o total aplicando descontos item por item
  const total = computed(() => {
    return items.value.reduce((acc, item) => {
      let itemPrice = item.price;

      // REGRA do cupom específico 
      if (activeCoupon.value && activeCoupon.value.targetId === item.id) {
        const desconto = item.price * activeCoupon.value.percent;
        itemPrice = item.price - desconto;
      }
      // REGRA 2 do cupom global 
      else if (activeCoupon.value && !activeCoupon.value.targetId) {
        const desconto = item.price * activeCoupon.value.percent;
        itemPrice = item.price - desconto;
      }

      return acc + (itemPrice * item.quantity);
    }, 0);
  });

  // 3. Calcula quanto foi economizado (para exibir na tela)
  const discount = computed(() => {
    return subtotal.value - total.value;
  });

  // Verifica se precisa de receita
  const needsPrescription = computed(() => {
    return items.value.some(item => item.requiresPrescription === true);
  });

  // --- AÇÕES ---

  // APLICA CUPOM
  function applyCoupon(code) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const codigoLimpo = code.toUpperCase().trim();

        // LISTA DE CUPONS VÁLIDOS (Simulação de Banco de Dados)
        const validCoupons = [
          { code: 'VFARMA10', percent: 0.10, targetId: null }, // 10% Global
          { code: 'CPW7', percent: 0.70, targetId: null }, // 15% Global
          { code: 'IMBROXAVEL22', percent: 0.22, targetId: 11 },   // 22% só no Viagra (ID 11)
          { code: 'NEYMAR20', percent: 0.20, targetId: 4 },  // 20% só no Dorflex (ID 4)
          { code: 'EMA19', percent: 0.19, targetId: 10 }   // 19% só na cloroquina (ID 7)
        ];
        // Verifica se o cupom é válido
        const couponFound = validCoupons.find(c => c.code === codigoLimpo);
        // Aplica o cupom ou rejeita
        if (couponFound) {
          activeCoupon.value = couponFound;
          
          if (couponFound.targetId) {
            resolve({ message: 'Cupom aplicado ao produto da promoção!' });
          } 
          if (!couponFound.targetId) {
            resolve({ message: `Desconto de ${couponFound.percent * 100}% aplicado!` }); 
          }
        } else {
          activeCoupon.value = null;
          reject('Cupom inválido ou expirado.');
        }
      }, 1500);
    });
  }
  // ADICIONA AO CARRINHO
  function addToCart(product) {
    const existing = items.value.find(i => i.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  }
  // REMOVE DO CARRINHO
  function removeFromCart(productId) {
    const index = items.value.findIndex(i => i.id === productId);
    if (index !== -1) items.value.splice(index, 1);
    
    // Se esvaziar o carrinho, remove o cupom
    if (items.value.length === 0) activeCoupon.value = null;
  }
    //liMPA O CARRINHO
  function clearCart() {
    items.value = [];
    activeCoupon.value = null;
  }

  return { items, subtotal, total, discount, needsPrescription, applyCoupon, addToCart, removeFromCart, clearCart };
});