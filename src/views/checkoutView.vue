<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart.js';

// Import Componentes dos Passos
import VfarmaButton from '@/components/ui/VfarmaButton.vue';
import PaymentOption from '@/components/checkout/PaymentOption.vue';
import PrescriptionStep from '@/components/checkout/steps/PrescriptionStep.vue';
import ProcessingStep from '@/components/checkout/steps/ProcessingStep.vue';

const router = useRouter();
const cartStore = useCartStore();

// --- MÁQUINA DE ESTADOS ---
const currentStep = ref('loading');
const paymentMethod = ref('');
const cpf = ref('');

// --- CICLO DE VIDA ---
// Decide se pede receita ou não ao abrir a tela
onMounted(() => {
  if (cartStore.needsPrescription) {
    currentStep.value = 'prescription'; // Tem controlado? -> Receita
  } else {
    currentStep.value = 'cpf'; // Não tem? -> CPF
  }
});

// Navegação
const onPrescriptionValidated = () => currentStep.value = 'cpf';
const onCpfConfirmed = () => currentStep.value = 'payment-select';

// Seleção de pagamento
const selectPayment = (method) => {
  paymentMethod.value = method;
  currentStep.value = 'processing';
};

// Finalização
const onPaymentApproved = () => {
  currentStep.value = 'success';
  setTimeout(() => {
    cartStore.clearCart();
    router.push('/');
  }, 4000);
};

// Teclado CPF
const addDigit = (n) => { if (cpf.value.length < 12) cpf.value += n; };
const backspace = () => { cpf.value = cpf.value.slice(0, -1); };
const displayCpf = computed(() => cpf.value || '___.___.___-__');
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col p-6 font-sans">
    <header class="flex justify-between items-center mb-6">
      <button @click="router.back()" v-if="currentStep !== 'processing' && currentStep !== 'success'" class="text-xl font-bold text-slate-400 hover:text-slate-600 flex items-center gap-2">⬅ Voltar</button>
      <h1 class="text-3xl font-bold text-slate-800 mx-auto">Checkout Vfarma</h1>
    </header>

    <div class="flex gap-6 flex-1">
      <aside class="hidden md:flex w-1/3 bg-white rounded-3xl shadow-sm p-6 flex-col border border-slate-100">
        <h2 class="text-xl font-bold text-slate-700 mb-4">Resumo</h2>
        <div class="flex-1 overflow-y-auto">
          <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-slate-600 mb-2 text-sm">
            <span>{{ item.quantity }}x {{ item.name }}</span>
            <span class="font-mono font-bold">R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="text-4xl font-bold text-emerald-700 text-right mt-4">R$ {{ cartStore.total.toFixed(2) }}</div>
      </aside>

      <main class="flex-1 bg-white rounded-3xl shadow-xl p-8 flex flex-col justify-center items-center">
        
        <PrescriptionStep v-if="currentStep === 'prescription'" @next="onPrescriptionValidated" />

        <div v-if="currentStep === 'cpf'" class="w-full max-w-md flex flex-col items-center">
          <h2 class="text-3xl font-bold mb-4">CPF na Nota?</h2>
          <div class="w-full bg-slate-100 p-4 rounded-xl text-center text-3xl tracking-widest font-mono mb-6 border-2">{{ displayCpf }}</div>
          <div class="grid grid-cols-3 gap-3 w-full mb-6">
            <button v-for="n in 9" :key="n" @click="addDigit(n)" class="h-16 bg-white border-2 rounded-lg text-2xl font-bold">{{ n }}</button>
            <button @click="cpf = ''" class="text-red-500 font-bold uppercase">Limpar</button>
            <button @click="addDigit(0)" class="h-16 bg-white border-2 rounded-lg text-2xl font-bold">0</button>
            <button @click="backspace" class="bg-slate-200 rounded-lg text-xl font-bold">⌫</button>
          </div>
          <div class="flex gap-4 w-full">
            <VfarmaButton label="Pular" variant="secondary" @click="onCpfConfirmed" />
            <VfarmaButton label="Confirmar" @click="onCpfConfirmed" />
          </div>
        </div>

        <div v-if="currentStep === 'payment-select'" class="w-full">
          <h2 class="text-3xl font-bold mb-8 text-center">Pagamento</h2>
          <div class="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
            <PaymentOption label="Crédito" icon="💳" @click="selectPayment('CREDITO')" />
            <PaymentOption label="Débito" icon="🏧" @click="selectPayment('DEBITO')" />
            <PaymentOption label="PIX" icon="💠" @click="selectPayment('PIX')" />
          </div>
        </div>

        <ProcessingStep v-if="currentStep === 'processing'" :method="paymentMethod" @finish="onPaymentApproved" />

        <div v-if="currentStep === 'success'" class="text-center animate-bounce">
          <div class="text-6xl mb-4">✅</div>
          <h2 class="text-4xl font-bold text-emerald-600">Compra Realizada!</h2>
        </div>
      </main>
    </div>
  </div>
</template>