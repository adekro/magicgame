require('dotenv').config();
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { PrismaClient } = require('@prisma/client');
const allRoutes = require('./routes/index'); // Importa il router principale

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const prisma = new PrismaClient(); // Istanza di Prisma Client

const PORT = process.env.PORT || 3001;

app.use(express.json()); // Middleware per parse JSON

// Middleware per loggare le richieste (opzionale, utile per debug)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Usa il router principale per tutte le routes definite in /routes
app.use('/api', allRoutes); // Prefisso /api per tutte le routes

// Endpoint di test radice
app.get('/', (req, res) => {
  res.send('Benvenuto nel server del gioco di magia AR!');
});

// Configurazione WebSocket di base
wss.on('connection', (ws) => {
  console.log('Nuovo client connesso via WebSocket');

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message); // Assumendo che i messaggi siano JSON
      console.log('Messaggio ricevuto:', parsedMessage);
      // TODO: Gestire i messaggi WebSocket per il PvP in tempo reale
      // Esempio: broadcast a tutti i client connessi, eccetto il mittente
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'broadcast', data: parsedMessage }));
        }
      });
    } catch (e) {
        console.log('Messaggio non JSON ricevuto: %s', message);
        // Invia un messaggio di errore o gestisci diversamente
        ws.send('Formato messaggio non valido. Inviare JSON.');
    }
  });

  ws.on('close', () => {
    console.log('Client disconnesso');
  });

  ws.on('error', (error) => {
    console.error('Errore WebSocket:', error);
  });

  ws.send(JSON.stringify({ type: 'connection_ack', message: 'Connesso al server WebSocket!' }));
});

// Gestione errori globale (esempio base)
app.use((err, req, res, next) => {
    console.error("Errore globale:", err.stack);
    res.status(500).send('Qualcosa è andato storto sul server!');
});


// Avvio del server
async function main() {
  try {
    await prisma.$connect();
    console.log('Connesso al database.');
    server.listen(PORT, () => {
      console.log(`Server in ascolto sulla porta ${PORT}`);
      console.log(`Server WebSocket in ascolto sulla stessa porta.`);
    });
  } catch (e) {
    console.error('Impossibile connettersi al database', e);
    process.exit(1);
  }
}

main();

// Gestione chiusura Prisma
async function gracefulShutdown() {
  console.log('Chiusura del server...');
  await prisma.$disconnect();
  console.log('Disconnesso dal database.');
  server.close(() => {
    console.log('Server HTTP chiuso.');
    wss.close(() => {
        console.log('Server WebSocket chiuso.');
        process.exit(0);
    });
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
