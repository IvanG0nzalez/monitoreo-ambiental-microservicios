var express = require('express');
var router = express.Router();

const usuarioC = require('../app/controllers/UsuarioController');
let usuarioControl = new usuarioC();

const rolC = require('../app/controllers/RolController');
let rolControl = new rolC();

const auth = require('../middlewares/authMiddleware');

// Endpoints de usuarios
router.get('/usuarios',auth, usuarioControl.listar);
router.get('/usuarios/validar', auth, usuarioControl.es_admin);

//router.get('/usuarios_cuentas', auth, usuarioControl.listar_con_cuenta);
router.get('/usuarios/usuario', auth, usuarioControl.obtener);
router.post('/usuarios/crear', usuarioControl.crear);
router.patch('/usuarios/actualizar/:external_id', auth, usuarioControl.actualizar);
router.delete('/usuarios/eliminar/:external_id', auth, usuarioControl.eliminar);


// Endpoints de roles
router.get('/roles', auth, rolControl.listar);
router.post('/roles/crear', auth, rolControl.crear);
router.get('/roles/:external_id', rolControl.obtener);
router.patch('/roles/actualizar/:external_id', auth, rolControl.actualizar);

module.exports = router;
