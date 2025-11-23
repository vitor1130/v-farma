<script setup>
import { onMounted, ref } from 'vue'

// Recebe qual foi o método escolhido (Crédito, Débito, Pix)
const props = defineProps({
  method: String,
})

const emit = defineEmits(['finish']) // Evento de finalização
const status = ref('Iniciando comunicação...') // Texto que muda na tela

onMounted(() => {
  // [SIMULAÇÃO DE MAQUININHA]

  // 1 segundo depois: pede senha
  setTimeout(() => {
    if (props.method === 'PIX') {
      status.value = 'Gerando QR Code...'
    } else {
      status.value = 'Insira sua senha na maquininha...'
    }
  }, 1500)

  // 4 segundos depois: processando banco
  setTimeout(() => {
    status.value = 'Validando transação...'
  }, 4000)

  // 6 segundos depois: ACABOU!
  setTimeout(() => {
    emit('finish')
  }, 6000)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full text-center animate-fade-in">
    <div
      class="w-20 h-20 border-8 border-slate-100 border-t-emerald-500 rounded-full animate-spin mb-8"
    ></div>

    <h2 class="text-3xl font-bold text-slate-800 mb-2">Processando</h2>
    <h3 class="text-xl font-bold text-emerald-600 mb-6">{{ method }}</h3>

    <p
      class="text-lg text-slate-600 bg-slate-50 px-8 py-4 rounded-xl border border-slate-200 shadow-sm transition-all"
    >
      {{ status }}
    </p>

    <p class="mt-8 text-sm text-slate-400">Não remova o cartão</p>
  </div>
</template>
