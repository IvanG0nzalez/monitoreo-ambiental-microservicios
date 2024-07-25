var express = require('express');
var router = express.Router();

const CuentaC = require('../app/controllers/CuentaController');
let cuentaControl = new CuentaC();

const auth = require('../middlewares/authMiddleware');

router.post('/cuentas/inicio_sesion', cuentaControl.inicio_sesion);
router.get('/cuentas', cuentaControl.listar);
router.get('/cuentas/:id_usuario', auth, cuentaControl.obtener);

module.exports = router;
