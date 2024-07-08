var express = require('express');
var router = express.Router();

const CuentaC = require('../app/controllers/CuentaController');
let cuentaControl = new CuentaC();

const auth = require('../middlewares/authMiddleware');

router.post('/cuentas/inicio_sesion', cuentaControl.inicio_sesion);
router.get('/cuentas', auth, cuentaControl.listar);
router.post('/cuentas/crear', cuentaControl.crear);
router.get('/cuentas/:id_usuario', auth, cuentaControl.obtener);
router.patch('/cuentas/:id_usuario', auth, cuentaControl.actualizar);
router.delete('/cuentas/:id_usuario', auth, cuentaControl.eliminar);

module.exports = router;
