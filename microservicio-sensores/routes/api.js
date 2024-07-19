var express = require('express');
var router = express.Router();
const sensorC = require('../app/controls/SensorControl');
let sensorControl = new sensorC();
const registrosC = require('../app/controls/RegistroControl');
let registrosControl = new registrosC();
const auth = require('../middlewares/authMiddleware');

//TODO agregar auth y jsonwebtoken
//API sensores
router.get('/sensores',auth, sensorControl.listar);
router.get('/sensores/buscar/:external', auth, sensorControl.obtener_sensor);
router.post('/sensores/guardar', auth, sensorControl.guardar);
router.get('/sensores/registros/buscar/:external', auth, sensorControl.obtener_registros_climaticos);
router.patch('/sensores/modificar/:external',auth,sensorControl.modificar);
router.get('/sensores/ultimo_registro',auth, sensorControl.ultimo_registro);
router.post('/iniciar-monitoreo', sensorControl.iniciarMonitoreoTodosSensores.bind(sensorControl));
router.post('/detener-monitoreo', (req, res) => sensorControl.detenerMonitoreo(req, res));

//API registros
router.get('/registros/listar/hoy', registrosControl.listar_hoy);
router.get('/registros', registrosControl.listar);
router.get('/registros/listar/fecha/:fecha',registrosControl.listar_por_fecha);
router.post('/registros/guardar/manual', registrosControl.guardar_manual);

module.exports = router;
