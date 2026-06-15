const express = require('express');
const router  = express.Router();
const { register, login, getProfile, updateProfile, getAllUsers, deleteUser } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/profile',   protect, getProfile);
router.put('/profile',   protect, updateProfile);

// Admin routes
router.get('/',          protect, adminOnly, getAllUsers);
router.delete('/:id',    protect, adminOnly, deleteUser);

module.exports = router;
