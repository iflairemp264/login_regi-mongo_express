const express = require('express')
const router = express.Router();
var users = require('../controllers/user.controller')

router.get('/', users.findAll);
router.post('/register', users.create);
router.post('/login', users.login);
router.get('/:id', users.findOne);
router.put('/:id', users.update);
router.delete('/:id', users.delete);

module.exports = router;