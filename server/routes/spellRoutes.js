const express = require('express');
const router = express.Router();
const spellController = require('../controllers/spellController');

// POST /api/spells (Per creare una nuova magia - admin/dev)
router.post('/', spellController.createSpell);

// GET /api/spells (Per ottenere tutte le magie)
router.get('/', spellController.getAllSpells);

// GET /api/spells/:spellId (Per ottenere una magia specifica)
router.get('/:spellId', spellController.getSpellById);

// POST /api/spells/learn (Esempio per far imparare una magia a un utente)
// router.post('/learn', spellController.learnSpell); // Commentato perché la funzione nel controller è commentata

// TODO: Aggiungere middleware di autenticazione/autorizzazione se necessario

module.exports = router;
