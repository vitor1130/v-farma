import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  
  // --- DADOS (O que eu preciso guardar) ---
  const items = ref([]);       // Lista de produtos que o cliente escolheu
  const discount = ref(0);     // O desconto que ele ganhou (ex: 0.10 é 10%)

  // --- CÁLCULOS (O computador faz sozinho) ---
  
  // Calcula o preço total sem desconto (Soma tudo)
  const subtotal = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  // Calcula o valor final (Subtotal menos o desconto)
  const total = computed(() => {
    return subtotal.value - (subtotal.value * discount.value);
  });

  // Segurança: O sistema olha a lista e avisa se tem remédio controlado (Tarja Preta/Vermelha)
  const needsPrescription = computed(() => {
    return items.value.some(item => item.requiresPrescription === true);
  });

  // --- AÇÕES (O que o sistema faz) ---

  // Aqui eu usei PROMISE para fingir que o sistema está verificando o cupom na internet
  function applyCoupon(code) {
    return new Promise((resolve, reject) => {
      // O setTimeout faz esperar 1.5 segundos, simulando a demora da rede
      setTimeout(() => {
        const codigoLimpo = code.toUpperCase().trim(); // Arruma o texto (tira espaços)

        if (codigoLimpo === 'VFARMA10') {
          discount.value = 0.10; // Dá 10% de desconto
          resolve({ message: 'Oba! Desconto de 10% aplicado!' });
        } else {
          discount.value = 0;
          reject('Cupom inválido.'); // Avisa que deu erro
        }
      }, 1500);
    });
  }

  // Adiciona no carrinho (se já existe, só aumenta a quantidade)
  function addToCart(product) {
    const existing = items.value.find(i => i.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  }

  // Tira do carrinho
  function removeFromCart(productId) {
    const index = items.value.findIndex(i => i.id === productId);
    if (index !== -1) items.value.splice(index, 1);
    
    // Se o carrinho ficar vazio, eu tiro o desconto
    if (items.value.length === 0) discount.value = 0;
  }

  // Limpa tudo (para o próximo cliente)
  function clearCart() {
    items.value = [];
    discount.value = 0;
  }

  return { items, subtotal, total, discount, needsPrescription, applyCoupon, addToCart, removeFromCart, clearCart };
});