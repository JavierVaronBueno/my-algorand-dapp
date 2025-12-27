from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# --- Configuración ---
# 1. En desarrollo, permitimos el origen de Vite (Frontend)
# 2. En producción, debemos usar el dominio real de la dApp.
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173") 
ALLOWED_ORIGINS = [FRONTEND_URL]

# --- Inicialización ---
app = FastAPI(title="Algorand dApp Backend")

# --- Middleware CORS ---
# CRÍTICO: Permite que el frontend (en un puerto diferente) acceda al backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoints ---
@app.get("/api/health")
async def health_check():
    """Endpoint simple para verificar que el backend esté vivo."""
    return {"status": "OK", "message": "Backend listo para Algorand."}

@app.get("/api/algorand/config")
async def get_algorand_config():
    """Endpoint que podría servir la configuración de red al frontend."""
    return {
        "network": "TestNet",
        "chain_id": 416002, # Algorand MainNet/TestNet id (usaremos 416002 como ejemplo)
        "algod_url": "https://testnet-api.algonode.cloud",
    }
    
# En un proyecto real, se montarían aquí los endpoints para interactuar
# con la blockchain desde el lado del servidor o para proteger recursos.