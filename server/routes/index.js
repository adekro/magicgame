const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const spellRoutes = require('./spellRoutes');
const schoolRoutes = require('./schoolRoutes');

router.use('/users', userRoutes);
router.use('/spells', spellRoutes);
router.use('/schools', schoolRoutes);

// TODO: Aggiungere altre routes principali se necessario

module.exports = router;
