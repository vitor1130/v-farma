<script setup>
import VfarmaButton from '../ui/VfarmaButton.vue'

defineProps({
  product: Object,
})

const emit = defineEmits(['add'])

const formatPrice = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
</script>

<template>
  <div
    class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow"
  >
    <div class="h-6 mb-2">
      <span
        v-if="product.requiresPrescription"
        class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded"
      >
        RECEITA
      </span>
    </div>

    <img :src="product.image" alt="Foto do produto" class="h-32 w-full object-contain mb-4" />

    <div class="flex-grow">
      <h3 class="text-lg font-bold text-slate-800 leading-tight mb-1 line-clamp-2">
        {{ product.name }}
      </h3>
      <p class="text-sm text-slate-500 mb-3">{{ product.manufacturer }}</p>

      <p class="text-2xl font-bold text-emerald-700 mb-4">
        {{ formatPrice(product.price) }}
      </p>
    </div>

    <VfarmaButton label="Comprar" @click="emit('add', product)" />
  </div>
</template>
