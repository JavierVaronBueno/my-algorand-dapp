<template>
  <div class="container">
    <h1>Mi dApp en Algorand (Vue 3 + Pinia)</h1>
    
    <p v-if="peraStore.isLoading">Procesando...</p>
    
    <div v-else-if="peraStore.isConnected">
      <p>Conectado: <strong>{{ formatAddress(peraStore.account) }}</strong></p>
      
      <div class="transfer-card">
        <h3>Enviar Activos (TestNet)</h3>
        
        <select v-model="selectedAsset" class="asset-select">
          <option value="ALGO">ALGO (Nativo)</option>
          <option value="USDC">USDC (Token)</option>
        </select>

        <input v-model="receiver" placeholder="Dirección del receptor" />
        <input v-model.number="amount" type="number" step="0.01" :placeholder="'Cantidad en ' + selectedAsset" />
        
        <button @click="handleTransfer" class="sign" :disabled="!receiver || amount <= 0">
          Confirmar Envío de {{ selectedAsset }}
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
const selectedAsset = ref('ALGO') // Estado para el selector

onMounted(() => {
  peraStore.initConnection()
})

const handleTransfer = async () => {
  try {
    let txId;
    if (selectedAsset.value === 'ALGO') {
      txId = await peraStore.sendTransaction(receiver.value, amount.value)
    } else {
      // Enviar USDC (Asset ID 10458941)
      txId = await peraStore.sendAssetTransaction(receiver.value, amount.value, 10458941)
    }
    
    alert(`¡Transacción confirmada!\nID: ${txId}`)
    receiver.value = ''
    amount.value = 0
  } catch (err) {
    // El error ya se guarda en peraStore.error
    console.error("Fallo en la UI:", err)
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

.asset-select {
  width: 95%;
  padding: 10px;
  margin-bottom: 15px;
  background: #333;
  color: white;
  border-radius: 4px;
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