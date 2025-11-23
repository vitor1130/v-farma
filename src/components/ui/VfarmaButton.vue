<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  label: String,
})
</script>

<template>
  <button
    class="w-full h-16 rounded-xl flex items-center justify-center gap-2 font-bold text-xl uppercase transition-transform active:scale-95 shadow-md"
    :class="{
      'bg-emerald-600 text-white hover:bg-emerald-700': variant === 'primary',
      'bg-slate-200 text-slate-800 hover:bg-slate-300': variant === 'secondary',
      'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
    }"
  >
    <slot></slot>
    {{ label }}
  </button>
</template>
