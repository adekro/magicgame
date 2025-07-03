const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// const bcrypt = require('bcrypt'); // Da aggiungere per hashing password
// const jwt = require('jsonwebtoken'); // Da aggiungere per token JWT

// Registrazione nuovo utente
exports.registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password sono obbligatori.' });
  }

  try {
    // TODO: Controllare se l'utente esiste già
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Utente già registrato con questa email.' });
    }

    // TODO: Hash password prima di salvarla
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        // password: hashedPassword,
        password: password, // Password in chiaro per ora (NON PER PRODUZIONE)
        name,
        mana: 100, // Mana iniziale
        level: 1,  // Livello iniziale
      },
    });

    // TODO: Rimuovere la password dalla risposta
    // TODO: Generare un token JWT per il client
    res.status(201).json({ message: 'Utente registrato con successo!', userId: user.id, email: user.email, mana: user.mana });
  } catch (error) {
    console.error("Errore registrazione utente:", error);
    res.status(500).json({ message: 'Errore durante la registrazione dell_utente.', error: error.message });
  }
};

// Login utente
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password sono obbligatori.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }

    // TODO: Comparare la password hashata
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Credenziali non valide.' });
    // }

    // Password in chiaro per ora (NON PER PRODUZIONE)
    if (user.password !== password) {
        return res.status(401).json({ message: 'Credenziali non valide (password errata).' });
    }

    // TODO: Generare un token JWT per il client
    res.status(200).json({
      message: 'Login effettuato con successo!',
      userId: user.id,
      email: user.email,
      name: user.name,
      level: user.level,
      mana: user.mana
      // token: "IL_TUO_TOKEN_JWT" // Da implementare
    });
  } catch (error) {
    console.error("Errore login utente:", error);
    res.status(500).json({ message: 'Errore durante il login.', error: error.message });
  }
};

// Ottenere dati utente (esempio, protetto in futuro)
exports.getUserProfile = async (req, res) => {
  // TODO: Ottenere userId dal token JWT o da un parametro sicuro
  const { userId } = req.params; // Assumendo che l'ID sia passato come parametro per ora

  if (!userId) {
      return res.status(400).json({ message: 'ID utente mancante.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { // Seleziona i campi da ritornare, escludendo la password
        id: true,
        email: true,
        name: true,
        level: true,
        mana: true,
        createdAt: true,
        updatedAt: true,
        school: true, // Include la scuola se necessario
        // spells: true // TODO: decidere come gestire la lista di magie (potrebbe essere grande)
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Errore recupero profilo utente:", error);
    res.status(500).json({ message: 'Errore durante il recupero del profilo utente.', error: error.message });
  }
};

// Aggiornare mana utente (esempio per il lancio di incantesimi)
exports.updateUserMana = async (req, res) => {
    const { userId } = req.params;
    const { manaChange } = req.body; // può essere positivo o negativo

    if (!userId || manaChange === undefined) {
        return res.status(400).json({ message: 'ID utente e manaChange sono obbligatori.'});
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato.' });
        }

        const newMana = user.mana + parseInt(manaChange); // Assicurati che manaChange sia un numero

        if (newMana < 0) {
            return res.status(400).json({ message: 'Mana non sufficiente.' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { mana: newMana },
            select: { id: true, email: true, mana: true, level: true } // Ritorna solo i dati necessari
        });

        res.status(200).json({ message: 'Mana aggiornato con successo.', user: updatedUser });

    } catch (error) {
        console.error("Errore aggiornamento mana:", error);
        if (error.code === 'P2025') { // Codice errore Prisma per record non trovato durante l'update
             return res.status(404).json({ message: 'Utente non trovato durante l_aggiornamento.' });
        }
        res.status(500).json({ message: 'Errore durante l_aggiornamento del mana.', error: error.message });
    }
};


// TODO: Aggiungere altre funzioni (es: updateUserProfile, deleteUser, Google OAuth handlers)
// TODO: Implementare la logica per associare un utente a una scuola
// TODO: Implementare la logica per aggiungere/rimuovere magie dal SpellBook dell'utente
