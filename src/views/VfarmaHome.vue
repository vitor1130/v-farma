<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import ProductCard from '@/components/catalog/ProductCard.vue'
import VfarmaButton from '@/components/ui/VfarmaButton.vue'

const router = useRouter()
const cartStore = useCartStore()

// --- LÓGICA DE BUSCA ---
const searchQuery = ref('')

// --- LÓGICA DO CUPOM ---
const couponInput = ref('')
const isValidating = ref(false)
const couponMessage = ref('')
const isError = ref(false)

const handleApplyCoupon = async () => {
  isValidating.value = true
  couponMessage.value = ''
  isError.value = false
  try {
    const response = await cartStore.applyCoupon(couponInput.value)
    couponMessage.value = response.message
    isError.value = false
  } catch (error) {
    couponMessage.value = error?.message || String(error)
    isError.value = true
  } finally {
    isValidating.value = false
  }
}

// --- DADOS DOS PRODUTOS ---
const products = ref([
  { id: 1, name: 'Dipirona 500mg 10 comprimidos', manufacturer: 'Genérico', price: 4.5, requiresPrescription: false, image: '/img/dipirona.jpg' },
  { id: 2, name: 'Vitamina C Redoxon 1g 30 comprimidos', manufacturer: 'Redoxon', price: 42.9, requiresPrescription: false, image: '/img/redoxon.jpg' },
  { id: 3, name: 'Amoxicilina 500mg', manufacturer: 'Germed', price: 22.0, requiresPrescription: true, image: '/img/amox.jpg' },
  { id: 4, name: 'Dorflex', manufacturer: 'Sanofi', price: 8.9, requiresPrescription: false, image: '/img/dorflex.jpg' },
  { id: 5, name: 'Ibuprofeno 400mg', manufacturer: 'Advil', price: 12.5, requiresPrescription: true, image: '/img/ibuprofeno.jpg' },
  { id: 6, name: 'Omeprazol 20mg 40 cápsulas', manufacturer: 'Nexium', price: 18.75, requiresPrescription: false, image: '/img/omeprazol.jpg' },
  { id: 7, name: 'Desvenlafaxina 50 mg ', manufacturer: 'Pristiq', price: 45.0, requiresPrescription: true, image: '/img/desvenlafaxina.jpg' },
  { id: 8, name: 'Duloxetina 30mg 30 cápsulas', manufacturer: 'Germed', price: 39.9, requiresPrescription: true, image: '/img/duloxetina.jpg' },
  { id: 9, name: 'Sertralina', manufacturer: 'Medley', price: 29.5, requiresPrescription: true, image: '/img/sertralina.jpg' },
  { id: 10, name: 'Hidroxicloroquina', manufacturer: 'Plaquenil', price: 55.0, requiresPrescription: true, image: '/img/cloroquina.jpg' },
  { id: 11, name: 'Viagra 50mg', manufacturer: 'Pfizer', price: 69.99, requiresPrescription: true, image: '/img/viagra.jpg' },
  { id: 12, name: 'Cialis 20mg', manufacturer: 'Cialis', price: 19.99, requiresPrescription: true, image: '/img/tadala.jpg' },
])

// Filtra os produtos pelo nome digitado na busca
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    return product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})
</script>

<template>
  <div class="flex h-screen bg-slate-100 overflow-hidden">
    <main class="flex-1 p-6 overflow-y-auto flex flex-col">
      
      <div class="mb-6">
        <div class="flex items-center justify-between mb-6">
          <img src="/img/vfarma.jpg" alt="Logo Vfarma" class="h-12 w-auto object-contain" />
          <div class="text-right text-sm text-slate-400">
            Terminal 01
          </div>
        </div>

        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div class="relative">
            <span class="absolute left-3 top-3 text-slate-400">🔍</span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Busque por nome do remédio..." 
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-emerald-500 text-slate-700"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
        <ProductCard
          v-for="prod in filteredProducts"
          :key="prod.id"
          :product="prod"
          @add="cartStore.addToCart"
        />
        
        <div v-if="filteredProducts.length === 0" class="col-span-full text-center py-10 text-slate-400">
          Nenhum produto encontrado para "{{ searchQuery }}".
        </div>
      </div>
    </main>

    <aside class="w-1/3 bg-white p-6 border-l border-slate-200 flex flex-col z-10 shadow-xl h-full">
      
      <h2 class="text-2xl font-bold mb-4 text-slate-800">
        {{ cartStore.items.length === 0 ? 'Carrinho vazio' : `Sua Cesta (${cartStore.items.length})` }}
      </h2>

      <div class="flex-1 overflow-y-auto space-y-2 mb-4 pr-2 custom-scrollbar">
        <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-40 text-slate-300">
          <span class="text-4xl mb-2">🛒</span>
          <p>Sua cesta está vazia.</p>
        </div>
        
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="flex justify-between items-center border-b border-slate-100 py-3 animate-fade-in"
        >
          <div class="flex flex-col">
            <span class="font-bold text-slate-700 leading-tight">{{ item.name }}</span>
            <span class="text-sm text-slate-500 mt-1"
              >{{ item.quantity }}x R$ {{ item.price.toFixed(2) }}</span
            >
          </div>
          <button 
            @click="cartStore.removeFromCart(item.id)" 
            class="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
        <label class="text-xs font-bold text-slate-500 uppercase mb-1 block"
          >Cupom de Desconto</label
        >
        <div class="flex gap-2">
          <input
            v-model="couponInput"
            type="text"
            placeholder="CUPOM"
            class="flex-1 px-3 py-2 rounded-lg border border-slate-300 uppercase text-slate-700 focus:outline-emerald-500 text-sm font-mono"
            :disabled="isValidating"
          />
          <button
            @click="handleApplyCoupon"
            :disabled="isValidating || !couponInput"
            class="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 disabled:opacity-50 text-sm"
          >
            <span v-if="isValidating">...</span>
            <span v-else>OK</span>
          </button>
        </div>
        <p
          v-if="couponMessage"
          class="text-xs mt-2 font-bold"
          :class="isError ? 'text-red-500' : 'text-emerald-600'"
        >
          {{ couponMessage }}
        </p>
      </div>

      <div class="pt-4 border-t border-slate-100">
        <div v-if="cartStore.discount > 0" class="flex justify-between text-slate-400 text-sm mb-1">
          <span>Subtotal:</span>
          <span>R$ {{ cartStore.subtotal.toFixed(2) }}</span>
        </div>

        <div
          v-if="cartStore.discount > 0"
          class="flex justify-between text-emerald-600 font-bold text-sm mb-2"
        >
          <span>Desconto:</span>
          <span>- R$ {{ (cartStore.subtotal - cartStore.total).toFixed(2) }}</span>
        </div>

        <div class="flex justify-between items-end mb-6">
          <span class="text-slate-500 font-bold">Total</span>
          <span class="text-3xl font-bold text-emerald-700">
            R$ {{ cartStore.total.toFixed(2) }}
          </span>
        </div>

        <VfarmaButton
          label="COMPRAR"
          @click="router.push('/checkout')"
          :disabled="cartStore.items.length === 0"
        />
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* Scrollbar mais bonita para o carrinho */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>