<script setup>
// Props: Recebe qual categoria está selecionada (ex: 'medicamentos')
defineProps({
  selected: String
});

// Emits: Avisa o pai (Home) quando o usuário clica num botão
defineEmits(['select']);

// Lista fixa de categorias para gerar os botões
const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'medicamentos', label: 'Medicamentos' },
  { id: 'controlados', label: 'Controlados' },
  { id: 'vitaminas', label: 'Vitaminas' },
];
</script>

<template>
  <div class="flex gap-2 overflow-x-auto pb-4 mb-2">
    <button 
      v-for="cat in categories" 
      :key="cat.id"
      @click="$emit('select', cat.id)"
      class="px-6 py-3 rounded-full font-bold text-sm uppercase border-2 transition-all whitespace-nowrap"
      :class="selected === cat.id 
        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
        : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'"
    >
      {{ cat.label }}
    </button>
  </div>
</template>