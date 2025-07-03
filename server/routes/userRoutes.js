const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users/register
router.post('/register', userController.registerUser);

// POST /api/users/login
router.post('/login', userController.loginUser);

// GET /api/users/:userId/profile  (Esempio, da proteggere con auth)
router.get('/:userId/profile', userController.getUserProfile);

// PUT /api/users/:userId/mana (Per aggiornare il mana, es. dopo un incantesimo)
router.put('/:userId/mana', userController.updateUserMana);


// TODO: Aggiungere middleware di autenticazione per rotte protette
// Esempio: router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
