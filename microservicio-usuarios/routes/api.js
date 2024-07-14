var express = require('express');
var router = express.Router();

const usuarioC = require('../app/controllers/UsuarioController');
let usuarioControl = new usuarioC();

const rolC = require('../app/controllers/RolController');
let rolControl = new rolC();

const auth = require('../middlewares/authMiddleware');

// Endpoints de usuarios
router.get('/usuarios', auth, usuarioControl.listar);
router.get('/usuarios/:external_id', auth, usuarioControl.obtener);
router.post('/usuarios/crear', usuarioControl.crear);
router.patch('/usuarios/:external_id', auth, usuarioControl.actualizar);
router.delete('/usuarios/:external_id', auth, usuarioControl.eliminar);


// Endpoints de roles
router.get('/roles', rolControl.listar);
router.get('/roles/:external_id', auth, rolControl.obtener);
router.post('/roles/crear', rolControl.crear);
router.patch('/roles/:external_id', auth, rolControl.actualizar);

module.exports = router;
