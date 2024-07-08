var express = require('express');
var router = express.Router();

const CuentaC = require('../app/controllers/CuentaController');
let cuentaControl = new CuentaC();

router.post('/cuentas/crear', cuentaControl.crear);
router.put('/cuentas/:id_usuario', cuentaControl.actualizar);
router.patch('/cuentas/:id_usuario', cuentaControl.actualizar);
router.delete('/cuentas/:id_usuario', cuentaControl.eliminar);

module.exports = router;
