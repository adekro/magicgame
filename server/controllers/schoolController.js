const prisma = require('../prisma/client');

// Creare una nuova scuola (potrebbe essere una rotta per admin/dev)
exports.createSchool = async (req, res) => {
  const { name, description, element } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Il nome è obbligatorio per la scuola.' });
  }

  try {
    const newSchool = await prisma.school.create({
      data: {
        name,
        description,
        element,
      },
    });
    res.status(201).json({ message: 'Scuola creata con successo!', school: newSchool });
  } catch (error) {
    console.error("Errore creazione scuola:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
        return res.status(409).json({ message: 'Una scuola con questo nome esiste già.' });
    }
    res.status(500).json({ message: 'Errore durante la creazione della scuola.', error: error.message });
  }
};

// Ottenere tutte le scuole
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany({
        include: {
            // students: { select: { id: true, name: true, email: true}}, // Esempio per includere studenti
            // spells: { select: { id: true, name: true }} // Esempio per includere magie della scuola
        }
    });
    res.status(200).json(schools);
  } catch (error) {
    console.error("Errore recupero scuole:", error);
    res.status(500).json({ message: 'Errore durante il recupero delle scuole.', error: error.message });
  }
};

// Ottenere una scuola specifica per ID
exports.getSchoolById = async (req, res) => {
  const { schoolId } = req.params;
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        students: { select: { id: true, name: true, email: true, level: true }}, // Mostra alcuni dettagli degli studenti
        spells: { select: { id: true, name: true, manaCost: true, description: true }} // Mostra dettagli delle magie insegnate
      }
    });
    if (!school) {
      return res.status(404).json({ message: 'Scuola non trovata.' });
    }
    res.status(200).json(school);
  } catch (error) {
    console.error("Errore recupero scuola:", error);
    res.status(500).json({ message: 'Errore durante il recupero della scuola.', error: error.message });
  }
};

// TODO: Aggiungere funzioni per aggiornare/eliminare scuole (per admin)
// TODO: Funzione per un utente per iscriversi a una scuola
// TODO: Funzione per una scuola per aggiungere/rimuovere magie insegnate
