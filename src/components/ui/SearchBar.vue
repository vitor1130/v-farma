<script setup>
// Recebe o valor digitado e avisa quando muda (Two-way binding)
defineProps(['modelValue']); 
defineEmits(['update:modelValue']); 
</script>

<template>
  <div class="relative w-full mb-6">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <span class="text-2xl opacity-40">🔍</span>
    </div>
    
    <input 
      type="text" 
      class="w-full h-16 pl-14 pr-4 rounded-xl border-2 border-slate-200 bg-white text-xl outline-none focus:border-emerald-500 transition-all"
      placeholder="Busque por nome do remédio..."
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>