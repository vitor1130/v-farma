<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart.js'

// Componentes
import VfarmaButton from '@/components/ui/VfarmaButton.vue'
import PaymentOption from '@/components/checkout/PaymentOption.vue'
import PrescriptionStep from '@/components/checkout/steps/PrescriptionStep.vue'
import ProcessingStep from '@/components/checkout/steps/ProcessingStep.vue'

const router = useRouter()
const cartStore = useCartStore()

// Estados
const currentStep = ref('loading') // Começa carregando para verificar a lógica
const paymentMethod = ref('')
const cpf = ref('') // Armazena o número do CPF

onMounted(() => {
  // VERIFICAÇÃO CRÍTICA:
  // Se tiver receita -> Vai para 'prescrição'
  // Se não tiver -> Vai para 'cpf'
  if (cartStore.needsPrescription) {
    currentStep.value = 'prescription'
  } else {
    currentStep.value = 'cpf'
  }
})

// --- Lógica do Teclado Numérico (CPF) ---
const addDigit = (num) => {
  if (cpf.value.length < 12) {
    // Limita a 12 números
    cpf.value += num
  }
}
const backspace = () => {
  cpf.value = cpf.value.slice(0, -1) // Apaga o último
}

// Formata visualmente o CPF (000.000.000-00)
const displayCpf = computed(() => {
  const v = cpf.value
  if (!v) return '___.___.___-__'
  // Lógica simples de máscara apenas para exibir
  let mask = v
  if (v.length > 3) mask = v.slice(0, 3) + '.' + v.slice(3)
  if (v.length > 7) mask = mask.slice(0, 7) + '.' + v.slice(7)
  if (v.length > 12) mask = mask.slice(0, 11) + '-' + v.slice(12)
  return mask
})

// --- Navegação ---
const onPrescriptionValidated = () => (currentStep.value = 'cpf')

const onCpfConfirmed = () => {
  // Aqui você salvaria o CPF no backend se fosse real
  currentStep.value = 'payment-select'
}

const selectPayment = (method) => {
  paymentMethod.value = method
  currentStep.value = 'processing'
}

const onPaymentApproved = () => {
  currentStep.value = 'success'
  setTimeout(() => {
    cartStore.clearCart()
    router.push('/')
  }, 4000)
}

const totalFormatted = computed(() =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartStore.total),
)
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col p-6 font-sans">
    <header class="flex justify-between items-center mb-6">
      <button
        @click="router.back()"
        class="text-xl font-bold text-slate-400 flex items-center gap-2"
        v-if="currentStep !== 'processing' && currentStep !== 'success'"
      >
        ⬅ Voltar
      </button>
      <div v-else></div>
      <h1 class="text-3xl font-bold text-slate-800">Checkout Vfarma</h1>
      <div class="w-20"></div>
    </header>

    <div class="flex gap-6 flex-1 overflow-hidden">
      <aside
        class="hidden md:flex w-1/3 bg-white rounded-3xl shadow-sm p-6 flex-col border border-slate-100"
      >
        <h2 class="text-xl font-bold text-slate-700 mb-4 border-b pb-2">Resumo</h2>
        <div class="flex-1 overflow-y-auto space-y-3">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex justify-between text-slate-600 text-sm"
          >
            <span>{{ item.quantity }}x {{ item.name }}</span>
            <span class="font-mono font-bold"
              >R$ {{ (item.price * item.quantity).toFixed(2) }}</span
            >
          </div>
        </div>
        <div class="mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-end">
          <span class="text-slate-500">Total</span>
          <span class="text-4xl font-bold text-emerald-700">{{ totalFormatted }}</span>
        </div>
      </aside>

      <main
        class="flex-1 bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden flex flex-col justify-center items-center"
      >
        <PrescriptionStep v-if="currentStep === 'prescription'" @next="onPrescriptionValidated" />

        <div
          v-if="currentStep === 'cpf'"
          class="flex flex-col items-center w-full animate-fade-in max-w-lg"
        >
          <h2 class="text-3xl font-bold mb-4 text-slate-800">CPF na Nota?</h2>

          <div
            class="w-full bg-slate-100 p-4 rounded-xl text-center text-3xl tracking-widest text-slate-700 mb-6 border-2 border-slate-200 font-mono h-20 flex items-center justify-center"
          >
            {{ displayCpf }}
          </div>

          <div class="grid grid-cols-3 gap-3 w-full mb-6">
            <button
              v-for="n in 9"
              :key="n"
              @click="addDigit(n)"
              class="h-16 bg-white border-2 border-slate-200 rounded-lg text-2xl font-bold text-slate-600 active:bg-slate-100 active:scale-95 shadow-sm"
            >
              {{ n }}
            </button>
            <button @click="cpf = ''" class="h-16 text-red-500 font-bold uppercase text-sm">
              Limpar
            </button>
            <button
              @click="addDigit(0)"
              class="h-16 bg-white border-2 border-slate-200 rounded-lg text-2xl font-bold text-slate-600 active:bg-slate-100 shadow-sm"
            >
              0
            </button>
            <button
              @click="backspace"
              class="h-16 bg-slate-200 rounded-lg text-xl font-bold text-slate-600"
            >
              ⌫
            </button>
          </div>

          <div class="flex gap-4 w-full">
            <VfarmaButton label="Pular" variant="secondary" @click="onCpfConfirmed" />
            <VfarmaButton label="Confirmar" @click="onCpfConfirmed" />
          </div>
        </div>

        <div v-if="currentStep === 'payment-select'" class="w-full animate-fade-in">
          <h2 class="text-3xl font-bold mb-8 text-center text-slate-800">Pagamento</h2>
          <div class="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PaymentOption label="Crédito" icon="💳" @click="selectPayment('CREDITO')" />
            <PaymentOption label="Débito" icon="🏧" @click="selectPayment('DEBITO')" />
            <PaymentOption label="PIX" icon="💠" @click="selectPayment('PIX')" />
          </div>
        </div>

        <ProcessingStep
          v-if="currentStep === 'processing'"
          :method="paymentMethod"
          @finish="onPaymentApproved"
        />

        <div v-if="currentStep === 'success'" class="text-center animate-bounce-in">
          <div
            class="inline-flex items-center justify-center w-32 h-32 bg-emerald-100 rounded-full mb-6"
          >
            <span class="text-6xl">✅</span>
          </div>
          <h2 class="text-4xl font-bold text-emerald-600 mb-2">Sucesso!</h2>
        </div>
      </main>
    </div>
  </div>
</template>
