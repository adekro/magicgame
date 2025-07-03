# Server Node.js (Express + Prisma)

Questa directory contiene l'applicazione backend del Gioco Mobile di Magia AR.

Per istruzioni dettagliate su setup, avvio, variabili d'ambiente, migrazioni e struttura, per favore consulta il [README principale del progetto](../README.md).

## Avvio Rapido

1.  Configura il file `.env` (copia da `.env.example`).
2.  Installa le dipendenze del server:
    ```bash
    npm install
    ```
3.  Esegui le migrazioni del database (se è la prima volta o ci sono modifiche allo schema):
    ```bash
    npx prisma migrate dev
    ```
4.  Avvia il server in modalità sviluppo:
    ```bash
    npm run dev
    ```
Il server sarà in ascolto sulla porta specificata in `.env` (default: 3000).
