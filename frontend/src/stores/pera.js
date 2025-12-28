// frontend/src/stores/pera.js
import { defineStore } from "pinia";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";

// Usar el client de Algod para obtener parámetros de transacciones
// TO DO: Mover estas constantes a un archivo de configuración o .env
const ALGOD_NODE = "https://testnet-api.algonode.cloud"; // Mantener TestNet por defecto
const ALGOD_PORT = "";
const ALGOD_TOKEN = "";
const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_NODE, ALGOD_PORT);

// Creamos una instancia global de PeraWalletConnect.
// Recomendación Senior: El chainId debe venir de una variable de entorno (.env)
const peraWallet = new PeraWalletConnect({
  // Configurado para TestNet (416002) por defecto, pero MainNet (416001) es común
  // Usaremos el ID estándar de Pera para Testnet
  // Nota: Si usas WalletConnect V2, Pera usa 416001 como chain ID
  chainId: 416002, // Algorand TestNet
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
     * @description Envía ALGOs reales a otra dirección
     */
    async sendTransaction(receiverAddress, amountInAlgos) {
      // 1. FORZAR RECUPERACIÓN DE CUENTA: 
      // Si this.account es nulo, intentamos sacarlo de la sesión activa de Pera
      // DEBUG: Vamos a ver qué tiene el estado antes de fallar
      console.log("Estado actual de account:", this.account);
      console.log("Receptor:", receiverAddress);
      if (!this.account) {
        const sessionAccounts = await peraWallet.reconnectSession();
        if (sessionAccounts.length > 0) {
          this.account = sessionAccounts[0];
        } else {
          this.error = "Error: No se encontró una cuenta activa. Reconecta tu wallet.";
          throw new Error("Address must not be null or undefined");
        }
      }

      this.isLoading = true;
      this.error = null;

      try {
        const suggestedParams = await algodClient.getTransactionParams().do();
        const amount = Math.round(Number(amountInAlgos) * 1000000);

        // 2. CONSTRUCCIÓN ROBUSTA
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender: this.account, // Ahora estamos 100% seguros de que no es nulo
          receiver: receiverAddress,
          amount: amount,
          suggestedParams,
        });

        const signerPayload = [{ txn: txn, signers: [this.account] }];
        const signedTxn = await peraWallet.signTransaction([signerPayload]);

        // 3. ENVÍO Y ESPERA
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
        
        return txId;
      } catch (e) {
        console.error("Error en sendTransaction:", e);
        this.error = e.message || "Error en la firma";
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
