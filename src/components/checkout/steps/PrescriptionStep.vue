<script setup>
import { ref } from 'vue'
import VfarmaButton from '@/components/ui/VfarmaButton.vue'

// EMITE EVENTO DE AVANÇO
const emit = defineEmits(['next'])

// --- ESTADOS ---
const code = ref('') // Guarda o número digitado
const isLoading = ref(false) // Controla o spinner de carregamento
const errorMessage = ref('') // Guarda mensagem de erro se o código for inválido

// --- Lógica do Teclado ---
const addDigit = (n) => {
  if (code.value.length < 10) {
    // Limite de 10 dígitos
    code.value += n
    errorMessage.value = '' // Limpa erro ao digitar
  }
}
// Apaga o último dígito
const backspace = () => {
  code.value = code.value.slice(0, -1)
  errorMessage.value = ''
}

// --- Lógica de Validação (Simulada) ---
const validatePrescription = () => {
  if (code.value.length < 6) {
    errorMessage.value = 'Código muito curto. Verifique a receita.'
    return
  }

  isLoading.value = true

  // Simula validação de API
  setTimeout(() => {
    // Vamos fingir que códigos terminados em "0" são inválidos (pra você testar erro)
    if (code.value.endsWith('0')) {
      isLoading.value = false
      errorMessage.value = 'Receita vencida ou inválida.'
    } else {
      // Sucesso!
      isLoading.value = false
      emit('next')
    }
  }, 2000) // Demora 2 segundos processando
}
</script>

<template>
  <div class="flex flex-col items-center w-full animate-fade-in max-w-lg mx-auto">
    <h2 class="text-3xl font-bold text-slate-800 mb-2">Validar Receita Digital</h2>
    <p class="text-slate-500 mb-6 text-center">
      Digite o código numérico presente na sua receita médica.
    </p>

    <div
      class="w-full bg-slate-100 p-4 rounded-xl text-center text-3xl tracking-widest font-mono h-20 flex items-center justify-center border-2 mb-2 relative"
      :class="
        errorMessage ? 'border-red-400 text-red-600 bg-red-50' : 'border-slate-200 text-slate-700'
      "
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-slate-100/80 rounded-xl"
      >
        <div
          class="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"
        ></div>
      </div>

      <span v-else>{{ code || '____' }}</span>
    </div>

    <div class="h-8 mb-4 text-red-500 font-bold text-sm text-center w-full">
      {{ errorMessage }}
    </div>

    <div class="grid grid-cols-3 gap-3 w-full mb-6">
      <button
        v-for="n in 9"
        :key="n"
        @click="addDigit(n)"
        :disabled="isLoading"
        class="h-16 bg-white border-2 border-slate-200 rounded-lg text-2xl font-bold text-slate-600 active:bg-slate-100 active:scale-95 shadow-sm disabled:opacity-50"
      >
        {{ n }}
      </button>

      <button
        @click="code = ''"
        :disabled="isLoading"
        class="h-16 text-slate-400 font-bold text-sm uppercase"
      >
        Limpar
      </button>

      <button
        @click="addDigit(0)"
        :disabled="isLoading"
        class="h-16 bg-white border-2 border-slate-200 rounded-lg text-2xl font-bold text-slate-600 active:bg-slate-100 shadow-sm disabled:opacity-50"
      >
        0
      </button>

      <button
        @click="backspace"
        :disabled="isLoading"
        class="h-16 bg-slate-200 rounded-lg text-xl font-bold text-slate-600 disabled:opacity-50"
      >
        ⌫
      </button>
    </div>

    <div class="w-full">
      <VfarmaButton
        :label="isLoading ? 'Validando...' : 'Validar Código'"
        @click="validatePrescription"
        :disabled="isLoading || code.length === 0"
      />
    </div>
  </div>
</template>
