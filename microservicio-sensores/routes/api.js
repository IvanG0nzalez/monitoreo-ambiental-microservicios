var express = require('express');
var router = express.Router();
const sensorC = require('../app/controllers/SensorControl');
let sensorControl = new sensorC();
const registrosC = require('../app/controllers/RegistroControl');
let registrosControl = new registrosC();
const auth = require('../middlewares/authMiddleware');

//TODO agregar auth y jsonwebtoken
//API sensores
router.get('/sensores/ultimo_registro', sensorControl.ultimo_registro);
router.get('/sensores', auth, sensorControl.listar);
router.get('/sensores/:external', auth, sensorControl.obtener_sensor);
router.post('/sensores/crear', auth, sensorControl.crear);
router.get('/sensores/registros/:external', auth, sensorControl.obtener_registros_climaticos);
router.patch('/sensores/actualizar/:external', sensorControl.actualizar);
router.get('/sensores/ultimo_registro', sensorControl.ultimo_registro);
router.delete('/sensores/eliminar/:external', auth, sensorControl.eliminar);

//API monitoreo
router.post('/sensores/iniciar-monitoreo', auth, sensorControl.iniciarMonitoreoTodosSensores.bind(sensorControl));
router.post('/sensores/detener-monitoreo', auth, (req, res) => sensorControl.detenerMonitoreo(req, res));

//API registros
router.get('/registros/listar/hoy', registrosControl.listar_hoy);
router.get('/registros/listar', registrosControl.listar);   
router.get('/registros/listar/fecha/:fecha', registrosControl.listar_por_fecha);

module.exports = router;
