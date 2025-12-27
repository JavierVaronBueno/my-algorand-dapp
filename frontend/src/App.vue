<template>
  <div class="container">
    <h1>Mi dApp en Algorand (Vue 3 + Pinia)</h1>
    
    <p v-if="peraStore.isLoading">Cargando...</p>
    
    <p v-else-if="peraStore.isConnected">
      Wallet conectada: <strong>{{ formatAddress(peraStore.account) }}</strong>
    </p>
    <p v-else>
      No hay wallet conectada. ¡Conéctate a la {{ peraStore.pera.chainId === 416002 ? 'MainNet' : 'otra red' }}!
    </p>
    
    <div class="buttons">
      <button @click="peraStore.connectWallet" v-if="!peraStore.isConnected" :disabled="peraStore.isLoading">
        Conectar Pera Wallet
      </button>
      
      <button @click="peraStore.disconnectWallet" v-else class="disconnect" :disabled="peraStore.isLoading">
        Desconectar
      </button>
      
      <button @click="peraStore.signTestTx" v-if="peraStore.isConnected" class="sign" :disabled="peraStore.isLoading">
        Firmar transacción de prueba
      </button>
    </div>
    
    <p v-if="peraStore.error" class="error-message">
        🚨 Error: {{ peraStore.error }}
    </p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePeraStore } from './stores/pera'

// Inicializar el store
const peraStore = usePeraStore()

// Hook para iniciar la conexión (reconexión)
onMounted(() => {
  peraStore.initConnection()
})

// Función de utilidad para acortar la dirección (mejor UX)
const formatAddress = (address) => {
  if (!address) return 'N/A'
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`
}
</script>

<style>
.container { text-align: center; margin-top: 50px; }
.buttons { margin-top: 20px; }
button { padding: 10px 20px; margin: 10px; font-size: 16px; cursor: pointer; }
.disconnect { background: #d32f2f; color: white; }
.sign { background: #388e3c; color: white; }
.error-message { color: #f44336; font-weight: bold; padding: 10px; border: 1px solid; margin-top: 15px; }
</style>