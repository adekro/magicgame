# Progetto: Gioco Mobile di Magia AR (MVP)

Questo è il monorepo per il gioco mobile di magia in Realtà Aumentata.

## Struttura del Progetto

-   `/client`: Contiene l'applicazione mobile React Native (Expo).
-   `/server`: Contiene il backend Node.js (Express + Prisma).

## Prerequisiti

-   Node.js (v18.x o superiore consigliata)
-   npm (o yarn)
-   Expo CLI (per il client): `npm install -g expo-cli` (se non usi `npx expo`)
-   Git

## Setup e Avvio

Segui i passaggi qui sotto per avviare sia il server che il client.

### 1. Server

Il server gestisce la logica di backend, gli utenti, le magie, le scuole e le interazioni WebSocket.

**Variabili d'ambiente:**

1.  Naviga nella directory `server`: `cd server`
2.  Copia il file `.env.example` in `.env`: `cp .env.example .env`
3.  Modifica il file `.env` se necessario. Per l'MVP, usa SQLite, quindi la configurazione di default `DATABASE_URL="file:./dev.db"` dovrebbe funzionare. Per Supabase o PostgreSQL, dovrai aggiornare `DATABASE_URL`.

**Installazione dipendenze:**

```bash
cd server
npm install
```

**Migrazioni Database (Prisma):**

La prima volta, o ogni volta che modifichi `prisma/schema.prisma`, esegui le migrazioni:

```bash
# Assicurati di essere in server/
npx prisma migrate dev --name nome_migrazione_descrittiva
```
Per l'MVP, la migrazione iniziale `init` dovrebbe essere già stata creata. Se il database `dev.db` non esiste, questo comando lo creerà.

**Avvio Server (Sviluppo):**

```bash
# Assicurati di essere in server/
npm run dev
```
Il server sarà in ascolto sulla porta specificata in `.env` (default: 3000).

**Avvio Server (Produzione):**
```bash
# Assicurati di essere in server/
npm start
```

### 2. Client

L'applicazione client è costruita con React Native ed Expo.

**Installazione dipendenze:**

```bash
cd client
npm install
```

**Avvio Client (Sviluppo):**

```bash
# Assicurati di essere in client/
npm start
# Oppure usa npx expo start
```

Questo avvierà Metro Bundler. Segui le istruzioni nel terminale per:
-   Aprire l'app su un dispositivo Android (scansionando il QR code con l'app Expo Go).
-   Aprire l'app su un dispositivo iOS (scansionando il QR code con l'app Fotocamera o Expo Go).
-   Eseguire in un emulatore Android/iOS.
-   Eseguire nel browser (supporto web limitato per alcune funzionalità native).

**URL del Backend nel Client:**
Ricorda di configurare l'URL del backend nel client (attualmente segnato come `TODO` nei file di servizio/schermata). Quando esegui su un emulatore o dispositivo fisico, `localhost` potrebbe non puntare al tuo server locale. Usa l'IP della tua macchina sulla rete locale (es. `http://192.168.1.XX:3000/api`). Expo solitamente mostra questo IP quando avvii il server di sviluppo.

## Stack Tecnologico (Riepilogo MVP)

-   **Frontend (Client):** React Native (Expo)
    -   Navigazione: React Navigation
    -   Geolocalizzazione: Expo Location (con mock per ora)
-   **Backend (Server):** Node.js, Express
    -   ORM: Prisma (con SQLite per MVP)
    -   Realtime: WebSocket (ws library, setup base)
-   **Database:** SQLite (per MVP, configurabile per Supabase/PostgreSQL)

## Funzionalità MVP Implementate (o Struttura Base)

1.  **Registrazione & Login Utente:**
    -   Server: Endpoint `/api/users/register` e `/api/users/login` (password in chiaro per MVP).
    -   Client: Schermata di Login base (con login fittizio per ora, TODO per API reali).
    -   DB: Tabella `User` con `level`, `mana`.
2.  **Movimento Mappa Base:**
    -   Client: Schermata Mappa che richiede permessi di geolocalizzazione e mostra coordinate (o mock).
    -   Client: Mostra "punti magici" da JSON mock.
3.  **Incantesimo Base:**
    -   Client: Schermata `SpellCastScreen` con un incantesimo fisso ("Igniculus").
    -   Client: Pulsante per "lanciare" l'incantesimo (simulazione gesture).
    -   Logica: Consumo di mana (client-side per MVP, TODO per sync server). Aggiornamento mana utente sul server tramite endpoint `/api/users/:userId/mana`.
4.  **Backend:**
    -   Endpoint REST per utenti, magie, scuole (creazione base e recupero).
    -   Setup base WebSocket.
5.  **Database:**
    -   Tabelle `User`, `Spell`, `School`, `SpellBook` con relazioni definite in `prisma/schema.prisma`.
6.  **UI (Client):**
    -   Schermata Login.
    -   Schermata Mappa.
    -   Schermata Incantesimo Base.
7.  **Struttura Modulare:**
    -   Commenti `TODO` inseriti dove verranno aggiunte gesture recognition, AR overlay, etc.
    -   Separazione in componenti, schermate, servizi (client) e controllers, routes (server).

## TODO Principali per Evoluzione MVP

-   **Client:**
    -   Implementare chiamate API reali a tutti gli endpoint del server (login, registrazione, aggiornamento mana, fetch dati).
    -   Implementare `AuthContext` per gestire stato utente e token.
    -   Creare schermata di Registrazione e collegarla.
    -   Migliorare la gestione degli errori e feedback utente.
    -   Sostituire la mappa placeholder con `react-native-maps`.
    -   Integrare il riconoscimento gesture (Tensorflow.js).
    -   Integrare l'AR overlay (ARCore/ARKit via Expo).
-   **Server:**
    -   Implementare hashing password (es. con `bcrypt`).
    -   Implementare autenticazione JWT.
    -   Completare la logica WebSocket per PvP.
    -   Aggiungere validazione più robusta agli input.
    -   Implementare endpoint per "imparare" magie, iscriversi a scuole.
-   **Generale:**
    -   Creare seed per il database più completi.
    -   Scrivere test.
    -   Configurare per Supabase.

## Contribuire

(Istruzioni per futuri contributori)
