<template>
  <div class="container">
    <h1>Mi dApp en Algorand (Vue 3 + Pinia)</h1>
    
    <p v-if="peraStore.isLoading">Procesando...</p>
    
    <div v-else-if="peraStore.isConnected">
      <p>Wallet conectada: <strong>{{ formatAddress(peraStore.account) }}</strong></p>
      
      <div class="transfer-card">
        <h3>Enviar ALGOs (TestNet)</h3>
        <input v-model="receiver" placeholder="Dirección del receptor (Base32)" />
        <input v-model.number="amount" type="number" step="0.1" placeholder="Monto en ALGO" />
        <button @click="handleTransfer" class="sign" :disabled="!receiver || amount <= 0">
          Enviar Pago Real
        </button>
      </div>
    </div>

    <p v-else>
      No hay wallet conectada. ¡Conéctate a la TestNet!
    </p>
    
    <div class="buttons">
      <button @click="peraStore.connectWallet" v-if="!peraStore.isConnected" :disabled="peraStore.isLoading">
        Conectar Pera Wallet
      </button>
      
      <button @click="peraStore.disconnectWallet" v-else class="disconnect" :disabled="peraStore.isLoading">
        Desconectar
      </button>
    </div>
    
    <p v-if="peraStore.error" class="error-message">
        🚨 Error: {{ peraStore.error }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePeraStore } from './stores/pera'

const peraStore = usePeraStore()
const receiver = ref('')
const amount = ref(0)

onMounted(() => {
  peraStore.initConnection()
})

const handleTransfer = async () => {
  try {
    const txId = await peraStore.sendTransaction(receiver.value, amount.value)
    alert(`¡Transacción enviada!\nID: ${txId}`)
    receiver.value = ''
    amount.value = 0
  } catch (err) {
    console.error(err)
  }
}

const formatAddress = (address) => {
  if (!address) return 'N/A'
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
}
</script>

<style>
/* ... tus estilos anteriores ... */
.transfer-card {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  max-width: 400px;
  margin: 20px auto;
  border: 1px solid #333;
}
input {
  display: block;
  width: 90%;
  margin: 10px auto;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #000;
  color: #fff;
}
</style>