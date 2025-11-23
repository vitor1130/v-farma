<script setup>
defineProps({
  active: Boolean,
  label: String,
  icon: String,
})
</script>

<template>
  <button
    class="h-40 rounded-2xl border-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 bg-white hover:bg-slate-50"
    :class="active ? 'border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-600'"
  >
    <span class="text-4xl">{{ icon }}</span>
    <span class="text-xl font-bold uppercase">{{ label }}</span>
  </button>
</template>
