var express = require('express');
var router = express.Router();

const usuarioC = require('../app/controllers/UsuarioController');
let usuarioControl = new usuarioC();

const rolC = require('../app/controllers/RolController');
let rolControl = new rolC();


// Endpoints de usuarios
router.get('/usuarios', usuarioControl.listar);
router.get('/usuarios/:external_id', usuarioControl.obtener);
router.post('/usuarios/crear', usuarioControl.crear);
router.put('/usuarios/:external_id', usuarioControl.actualizar);
router.patch('/usuarios/:external_id', usuarioControl.actualizar);
router.delete('/usuarios/:external_id', usuarioControl.eliminar);


// Endpoints de roles
router.get('/roles', rolControl.listar);
router.get('/roles/:external_id', rolControl.obtener);
router.post('/roles/crear', rolControl.crear);
router.put('/roles/:external_id', rolControl.actualizar);
router.patch('/roles/:external_id', rolControl.actualizar);

module.exports = router;
