// frontend/src/stores/pera.js
import { defineStore } from "pinia";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";

// Usar el client de Algod para obtener parámetros de transacciones
const ALGOD_NODE = "https://testnet-api.algonode.cloud"; // Mantener TestNet por defecto
const algodClient = new algosdk.Algodv2("", ALGOD_NODE, "");

// Creamos una instancia global de PeraWalletConnect.
// Recomendación Senior: El chainId debe venir de una variable de entorno (.env)
const peraWallet = new PeraWalletConnect({
  // Configurado para TestNet (416001) por defecto, pero MainNet (416002) es común
  // Usaremos el ID estándar de Pera para Testnet
  // Nota: Si usas WalletConnect V2, Pera usa 416001 como chain ID
  chainId: 416002, // Algorand MainNet, más realista para un producto final
});

export const usePeraStore = defineStore("pera", {
  state: () => ({
    // Estado de la cuenta conectada
    account: null,
    // Estado de carga o error
    isLoading: false,
    error: null,
  }),

  getters: {
    // Getter simple para verificar si la wallet está conectada
    isConnected: (state) => !!state.account,
    // Getter para obtener la instancia de Pera (útil para listeners)
    pera: () => peraWallet,
  },

  actions: {
    /**
     * @description Inicializa la conexión: reconecta y configura el listener de desconexión.
     */
    async initConnection() {
      this.isLoading = true;
      this.error = null;

      try {
        // 1. Intentar reconectar una sesión existente
        const accounts = await peraWallet.reconnectSession();
        if (accounts.length > 0) {
          this.account = accounts[0];
          console.log("✅ Sesión reconectada:", this.account);
        }

        // 2. Configurar el listener de desconexión (solo si el conector existe)
        peraWallet.connector?.on("disconnect", () => {
          this.account = null;
          console.log("❌ Wallet desconectada por el usuario o timeout.");
        });
      } catch (e) {
        // Ignorar si es un error al no haber sesión previa
        console.warn(
          "No se encontró sesión previa o error al iniciar conexión:",
          e.message
        );
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * @description Conecta la Pera Wallet e inicializa el estado.
     */
    async connectWallet() {
      this.isLoading = true;
      this.error = null;
      try {
        const accounts = await peraWallet.connect();
        // Pera siempre devuelve un array, tomamos la primera cuenta
        this.account = accounts[0];
        console.log("✅ Conectado:", this.account);
      } catch (e) {
        // Capturar y clasificar el error si el usuario cierra el modal
        if (e?.data?.type !== "CONNECT_MODAL_CLOSED") {
          this.error = "Error de conexión: " + e.message;
          console.error("Error al conectar:", e);
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * @description Desconecta la Pera Wallet y limpia el estado.
     */
    async disconnectWallet() {
      this.isLoading = true;
      try {
        await peraWallet.disconnect();
        this.account = null;
      } catch (e) {
        this.error = "Error al desconectar: " + e.message;
        console.error("Error al desconectar:", e);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * @description Firma una transacción de prueba de 0 ALGO a sí mismo.
     */
    async signTestTx() {
      if (!this.account) return alert("¡Conecta tu wallet primero!");

      this.isLoading = true;
      this.error = null;
      try {
        // Obtener parámetros sugeridos (gas, fee, lastRound, etc.)
        const suggestedParams = await algodClient.getTransactionParams().do();

        // Crear la transacción de pago (Payment Transaction)
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.account,
          to: this.account, // A sí mismo, coste 0
          amount: 0,
          suggestedParams,
        });

        // Solicitud de firma a Pera Wallet
        const signedTxn = await peraWallet.signTransaction([txn]);

        console.log("Transacción firmada:", signedTxn);
        alert("✅ Transacción de prueba firmada exitosamente!");

        // Opcional: Para una prueba FULL, podrías enviarla a la red
        // await algodClient.sendRawTransaction(signedTxn.blob).do();
      } catch (e) {
        this.error = "Error al firmar: " + e.message;
        console.error("Error al firmar:", e);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
