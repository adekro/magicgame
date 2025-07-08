const prisma = require('../prisma/client');

// Creare una nuova magia (potrebbe essere una rotta per admin/dev)
exports.createSpell = async (req, res) => {
  const { name, description, manaCost, damage, schoolId } = req.body;

  if (!name || manaCost === undefined) {
    return res.status(400).json({ message: 'Nome e manaCost sono obbligatori per la magia.' });
  }

  try {
    const newSpell = await prisma.spell.create({
      data: {
        name,
        description,
        manaCost: parseInt(manaCost),
        damage: damage ? parseInt(damage) : 0,
        schoolId: schoolId || null, // Opzionale
      },
    });
    res.status(201).json({ message: 'Magia creata con successo!', spell: newSpell });
  } catch (error) {
    console.error("Errore creazione magia:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(409).json({ message: 'Una magia con questo nome esiste già.' });
    }
    res.status(500).json({ message: 'Errore durante la creazione della magia.', error: error.message });
  }
};

// Ottenere tutte le magie
exports.getAllSpells = async (req, res) => {
  try {
    const spells = await prisma.spell.findMany({
      include: { school: true } // Include la scuola associata se presente
    });
    res.status(200).json(spells);
  } catch (error) {
    console.error("Errore recupero magie:", error);
    res.status(500).json({ message: 'Errore durante il recupero delle magie.', error: error.message });
  }
};

// Ottenere una magia specifica per ID
exports.getSpellById = async (req, res) => {
  const { spellId } = req.params;
  try {
    const spell = await prisma.spell.findUnique({
      where: { id: spellId },
      include: { school: true }
    });
    if (!spell) {
      return res.status(404).json({ message: 'Magia non trovata.' });
    }
    res.status(200).json(spell);
  } catch (error) {
    console.error("Errore recupero magia:", error);
    res.status(500).json({ message: 'Errore durante il recupero della magia.', error: error.message });
  }
};

// TODO: Aggiungere funzioni per aggiornare/eliminare magie (per admin)
// TODO: Funzione per un utente per "imparare" una magia (aggiungerla a SpellBook)
/*
exports.learnSpell = async (req, res) => {
    const { userId, spellId } = req.body;
    if (!userId || !spellId) {
        return res.status(400).json({ message: "userId e spellId sono obbligatori." });
    }

    try {
        // Verifica che utente e magia esistano
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) return res.status(404).json({ message: "Utente non trovato." });

        const spellExists = await prisma.spell.findUnique({ where: { id: spellId } });
        if (!spellExists) return res.status(404).json({ message: "Magia non trovata." });

        // Controlla se l'utente ha già questa magia
        const existingSpellBookEntry = await prisma.spellBook.findUnique({
            where: { userId_spellId: { userId, spellId } }
        });

        if (existingSpellBookEntry) {
            return res.status(409).json({ message: "L'utente conosce già questa magia." });
        }

        // Aggiungi la magia allo SpellBook dell'utente
        const spellBookEntry = await prisma.spellBook.create({
            data: {
                userId,
                spellId
            }
        });
        res.status(201).json({ message: "Magia imparata con successo!", entry: spellBookEntry });

    } catch (error) {
        console.error("Errore apprendimento magia:", error);
        // Gestisci errori specifici di Prisma, ad es. violazioni di foreign key se l'utente o la magia non esistono
        if (error.code === 'P2003') { // Foreign key constraint failed
             if (error.meta?.field_name?.includes('userId')) {
                return res.status(404).json({ message: "Utente specificato non valido." });
             }
             if (error.meta?.field_name?.includes('spellId')) {
                return res.status(404).json({ message: "Magia specificata non valida." });
             }
        }
        res.status(500).json({ message: "Errore durante l'apprendimento della magia.", error: error.message });
    }
};
*/
