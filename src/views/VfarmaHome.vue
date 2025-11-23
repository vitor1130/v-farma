<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'
import ProductCard from '@/components/catalog/ProductCard.vue'
import VfarmaButton from '@/components/ui/VfarmaButton.vue'

const couponInput = ref('')
const isValidating = ref(false)
const couponMessage = ref('')
const isError = ref(false)
const router = useRouter()
const cartStore = useCartStore()
//VARIÁVEIS PARA O CUPOM

//FUNÇÃO Que chama a Promise da Store
const handleApplyCoupon = async () => {
  // 1. Limpa mensagens e inicia o loading
  isValidating.value = true
  couponMessage.value = ''
  isError.value = false

  try {
    // 2. Chama a Store e espera a resposta
    // O código "espera" a resposta por 1.5s
    const response = await cartStore.applyCoupon(couponInput.value)

    // 3. Se deu certo (resolve):
    couponMessage.value = response.message
    isError.value = false
  } catch (error) {
    // 4. Se deu errado:
    couponMessage.value = error // "Cupom inválido"
    isError.value = true
  } finally {
    // 5. Sempre executa no final
    isValidating.value = false
  }
}

const products = ref([
  {
    id: 1,
    name: 'Dipirona 500mg 10 comprimidos',
    manufacturer: 'Genérico',
    price: 4.5,
    requiresPrescription: false,
    image: '/img/dipirona.jpg',
  },
  {
    id: 2,
    name: 'Vitamina C Redoxon 1g 30 comprimidos',
    manufacturer: 'Redoxon',
    price: 42.9,
    requiresPrescription: false,
    image: '/img/redoxon.jpg',
  },
  {
    id: 3,
    name: 'Amoxicilina 500mg',
    manufacturer: 'Germed',
    price: 22.0,
    requiresPrescription: true,
    image: '/img/amox.jpg',
  },
  {
    id: 4,
    name: 'Dorflex',
    manufacturer: 'Sanofi',
    price: 8.9,
    requiresPrescription: false,
    image: '/img/dorflex.jpg',
  },
  {
    id: 5,
    name: 'Ibuprofeno 400mg',
    manufacturer: 'Advil',
    price: 12.5,
    requiresPrescription: true,
    image: '/img/ibuprofeno.jpg',
  },
  {
    id: 6,
    name: 'Omeprazol 20mg 40 cápsulas',
    manufacturer: 'Nexium',
    price: 18.75,
    requiresPrescription: false,
    image: '/img/omeprazol.jpg',
  },
  {
    id: 7,
    name: 'Desvenlafaxina 50 mg ',
    manufacturer: 'Pristiq',
    price: 45.0,
    requiresPrescription: true,
    image: '/img/desvenlafaxina.jpg',
  },
  {
    id: 8,
    name: 'Duloxetina 30mg 30 cápsulas',
    manufacturer: 'Germed',
    price: 39.9,
    requiresPrescription: true,
    image: '/img/duloxetina.jpg',
  },
  {
    id: 9,
    name: 'Sertralina',
    manufacturer: 'medley',
    price: 29.5,
    requiresPrescription: true,
    image: '/img/sertralina.jpg',
  },
  {
    id: 10,
    name: 'Hidroxicloroquina',
    manufacturer: 'Plaquenil',
    price: 55.0,
    requiresPrescription: true,
    image: '/img/cloroquina.jpg',
  },
  {
    id: 11,
    name: 'Viagra 50mg',
    manufacturer: 'Pfizer',
    price: 69.99,
    requiresPrescription: true,
    image: '/img/viagra.jpg',
  },
  {
    id: 12,
    name: 'Cialis 20mg',
    manufacturer: 'cialis',
    price: 19.99,
    requiresPrescription: true,
    image: '/img/tadala.jpg',
  },
])
</script>

<template>
  <div class="flex h-screen bg-slate-100">
    <main class="flex-1 p-6 overflow-y-auto flex flex-col">
      <div class="mb-8 flex items-center justify-between">
        <img src="/img/vfarma.jpg" alt="Logo Vfarma" class="h-16 w-auto object-contain" />
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="prod in products"
          :key="prod.id"
          :product="prod"
          @add="cartStore.addToCart"
        />
      </div>
    </main>

    <aside class="w-1/3 bg-white p-6 border-l border-slate-200 flex flex-col z-10 shadow-xl">
      <h2 class="text-2xl font-bold mb-4">Sua Cesta ({{ cartStore.items.length }})</h2>

      <div class="flex-1 overflow-y-auto space-y-2 mb-4">
        <div v-if="cartStore.items.length === 0" class="text-slate-400 text-center mt-10">
          Sua cesta está vazia.
        </div>
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="flex justify-between border-b py-2"
        >
          <div class="flex flex-col">
            <span class="font-bold text-slate-700">{{ item.name }}</span>
            <span class="text-sm text-slate-500"
              >{{ item.quantity }}x R$ {{ item.price.toFixed(2) }}</span
            >
          </div>
          <button @click="cartStore.removeFromCart(item.id)" class="text-red-500 font-bold px-2">
            X
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
            placeholder="Digite aqui..."
            class="flex-1 px-3 py-2 rounded-lg border border-slate-300 uppercase text-slate-700 focus:outline-emerald-500"
            :disabled="isValidating"
          />
          <button
            @click="handleApplyCoupon"
            :disabled="isValidating || !couponInput"
            class="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 disabled:opacity-50"
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

      <div class="pt-4 border-t">
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

        <div class="text-3xl font-bold text-right mb-4 text-emerald-800">
          R$ {{ cartStore.total.toFixed(2) }}
        </div>

        <VfarmaButton
          label="Finalizar Compra"
          @click="router.push('/checkout')"
          :disabled="cartStore.items.length === 0"
        />
      </div>
    </aside>
  </div>
</template>
