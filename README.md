
# Algorand dApp: Full-Stack Project 🚀

Este proyecto es una aplicación descentralizada (dApp) para el ecosistema de **Algorand**. Combina un backend robusto en **FastAPI (Python)** y una interfaz moderna en **Vue 3 (Vite)**, integrada con **Pera Wallet**.

## 📂 Estructura del Proyecto

```text
my-algorand-dapp/
├── backend/            # API REST en Python (FastAPI)
│   ├── main.py         # Punto de entrada del servidor
│   └── requirements.txt# Dependencias de Python
└── frontend/           # Interfaz de usuario (Vue 3 + Vite)
    ├── src/            # Código fuente Vue
    └── package.json    # Dependencias de Node.js

```

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* **Python 3.10+**
* **Node.js 20+** y npm
* **Git**

---

## 🐍 Configuración del Backend (FastAPI)

El backend gestiona la lógica de conexión y configuración con la red de Algorand.

### 1. Preparar el entorno virtual

Desde la carpeta `/backend`:

**En Windows:**

```bash
python -m venv venv
.\venv\Scripts\activate

```

**Desactivar**
```
deactivate
```

**En Linux (Ubuntu):**

```bash
python3 -m venv venv
source venv/bin/activate

```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt

```

### 3. Ejecutar el servidor de desarrollo

```bash
uvicorn main:app --reload --port 8000

```

El API estará disponible en `http://127.0.0.1:8000`.

---

## ⚛️ Configuración del Frontend (Vue 3)

La interfaz permite la interacción con la Pera Wallet y la blockchain.

### 1. Instalar dependencias

Desde la carpeta `/frontend`:

```bash
npm install

```

### 2. Ejecutar en modo desarrollo

```bash
npm run dev

```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🚢 Despliegue en Producción (Linux / DigitalOcean)

Para desplegar en un entorno Linux (Ubuntu), se recomienda la siguiente arquitectura:

1. **Servidor Web:** Nginx actuando como Reverse Proxy.
2. **Process Manager:** Gunicorn con el worker de Uvicorn para el Backend.
3. **Frontend:** Compilar con `npm run build` y servir los archivos estáticos a través de Nginx.

### Comando de Build para Frontend:

```bash
cd frontend
npm run build

```

---

## 🛡️ Notas de Seguridad

* No olvides crear un archivo `.env` basado en los parámetros de configuración.
* **Nunca** subas tus claves privadas o mnemónicos al repositorio.
* El archivo `.gitignore` ya está configurado para proteger tus carpetas `node_modules`, `venv` y archivos `.env`.

---

## ✨ Tecnologías Utilizadas

* **Backend:** FastAPI, Algorand Python SDK (Py-Algorand-SDK).
* **Frontend:** Vue 3, Pinia (Estado), Vite.
* **Blockchain:** Algorand, Pera Wallet Connect.

