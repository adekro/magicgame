const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

// POST /api/schools (Per creare una nuova scuola - admin/dev)
router.post('/', schoolController.createSchool);

// GET /api/schools (Per ottenere tutte le scuole)
router.get('/', schoolController.getAllSchools);

// GET /api/schools/:schoolId (Per ottenere una scuola specifica)
router.get('/:schoolId', schoolController.getSchoolById);

// TODO: Aggiungere middleware di autenticazione/autorizzazione se necessario

module.exports = router;
